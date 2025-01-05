import { useState, useEffect } from 'react';
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import {
  AddCircleOutline,
  Comment,
  Difference,
  GitHub,
  RemoveCircleOutline,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import { blue, red } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import useDuckDB from '../DuckDB';
import './PullRequests.css'
import { PullRequest } from '../types';

const basepath = import.meta.env.BASE_URL
const baseUrl = `${window.location.protocol}//${window.location.host}${basepath}`.replace(/\/$/, '');
const DEFAULT_QUERY = `SELECT * FROM '${baseUrl}/assets/pull_request.parquet'`;


const columns: GridColDef[] = [
  { field: 'author', headerName: 'Author', width: 150 },
  { field: 'createdAt', headerName: 'Created At', width: 100, renderCell: (params) => (
    <>
      <Tooltip title={params.value} arrow>
        {params.value.slice(0, 10)}
      </Tooltip>
    </>
  )},
  { field: 'state', headerName: 'State', width: 85 },
  {
    field: 'title',
    headerName: 'Title',
    width: 400,
    renderCell: (params) => (
        <a href={params.row.url}>{params.value}</a>
    )
  },
  { field: 'totalCommentsCount', renderHeader: () => <Tooltip title={'Comments'}><Comment fontSize='small' /></Tooltip>, width: 85},
  { field: 'changedFiles', renderHeader: () => <Tooltip title={'Changed Files'}><Difference fontSize='small' /></Tooltip>, width: 85},
  { field: 'additions', renderHeader: () => <Tooltip title={'Line Additions'}><AddCircleOutline fontSize='small' sx={{color: red[400]}}/></Tooltip>, width: 85},
  { field: 'deletions', renderHeader: () => <Tooltip title={'Line Deletions'}><RemoveCircleOutline fontSize='small' sx={{color: blue[400]}}/></Tooltip>, width: 85},
  { field: 'repository', headerName: 'Repository', width: 250, renderCell: (params) => (
    <>
      <span style={{marginRight: '3px'}}><a href={`https://github.com/${params.row.nameWithOwner}`}> <GitHub fontSize='small' />{params.row.nameWithOwner}</a></span>
    </>
  )},
  { field: 'stargazerCount', headerName: 'Stars', width: 85 },
  { field: 'forkCount', headerName: 'Forks', width: 85 },
];

function PullRequestsTable() {
  const { db, error } = useDuckDB();
  const [data, setData] = useState<PullRequest[]>([]);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [inputQuery, setInputQuery] = useState(DEFAULT_QUERY);

  useEffect(() => {
    const load = async () => {
      if (!db) return;

      let conn;
      try {
        conn = await db.connect();
        const result = (await conn.query(query)).toArray();
        setData(result);
        console.log('success to load remote parquet file');
      } catch (error) {
        console.error('Failed to load remote Parquet file:', error);
      } finally {
        if (conn) await conn.close();
        console.log('connection closed');
      }
    };
    load();
  }, [db, query]);

  /*
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let q = '';
    if (params.get('additions')) q += ` additions=${params.get('additions')}`;
    setQuery(q);
  }, [window.location.search]);
  */

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(e.target.value);
  }

  const handleQuerySubmit = () => {
    setQuery(inputQuery);
  };

  if (error) {
    return <div>Error initializing DuckDB: {error.message}</div>;
  }

  if (!db) {
    return <div>Initializing DuckDB...</div>;
  }


  return (
    <>
      <h1>Pull Requests</h1>
      <div style={{ marginBottom: '1em' }}>
        <label
          htmlFor="query-input"
          style={{ marginRight: '1em' }}
        >
          {'SQL Query: '}
        </label>
        <input
          id='query-input'
          type="text"
          value={inputQuery}
          onChange={handleQueryChange}
          style={{ width: '80%', height: '2em', marginRight: '1em' }}
        />
        <Button
          variant="contained"
          onClick={handleQuerySubmit}
        >
          {'Execute'}
        </Button>
      </div>
      <div style={{ height: '85%', width: '100%' }}>
        <DataGrid
            rowHeight={25}
            columnHeaderHeight={30}
            rows={data}
            columns={columns}
            slots={{
              toolbar: () => {
                return (
                  <GridToolbarContainer style={{ backgroundColor: '#d0d0d0' }}>
                    <div style={{ margin: '0px 3px'}}>{`count: ${data?.length}`}</div>
                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton />
                    <GridToolbarExport
                      slotProps={{
                        tooltip: { title: 'Export data' },
                        button: { variant: 'outlined' },
                      }}
                    />
                  </GridToolbarContainer>
                )
              }
            }}
            sx={{
              '& .MuiDataGrid-cell': {
                backgroundColor: '#f5f5f5',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#e0e0e0',
                fontSize: '14px',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#d0d0d0',
                fontSize: '14px',
              },
            }}
        />
      </div>
    </>
  );
}

export default PullRequestsTable;
