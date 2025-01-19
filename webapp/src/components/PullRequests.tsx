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
import useDuckDB from '@/DuckDB';
import '@/components/PullRequests.css'
import { PullRequest } from '@/types';

// construct initial query from URL parameters
const params = new URLSearchParams(window.location.search);
const q = [];
if (params.get('author')) q.push(`author='${params.get('author')}'`);
if (params.get('createdAt')) q.push(`createdAt like '${params.get('createdAt')}%'`);
if (params.get('state')) q.push(`state='${params.get('state')}'`);
if (params.get('totalCommentsCount')) q.push(`totalCommentsCount=${params.get('totalCommentsCount')}`);
if (params.get('changedFiles')) q.push(`changedFiles=${params.get('changedFiles')}`);
if (params.get('additions')) q.push(`additions=${params.get('additions')}`);
if (params.get('deletions')) q.push(`deletions=${params.get('deletions')}`);
if (params.get('repository')) q.push(`repository='${params.get('repository')}'`);
if (params.get('stargazerCount')) q.push(`stargazerCount=${params.get('stargazerCount')}`);
if (params.get('forkCount')) q.push(`forkCount=${params.get('forkCount')}`);
const where_clause = q.length > 0 ? `WHERE ${q.join(' AND ')}` : '';
const basepath = import.meta.env.BASE_URL
const baseUrl = `${window.location.protocol}//${window.location.host}${basepath}`.replace(/\/$/, '');
const DEFAULT_QUERY = `SELECT * FROM '${baseUrl}/assets/pull_request.parquet' AS p JOIN '${baseUrl}/assets/repository.parquet' AS r ON p.repositoryId = r.id ${where_clause}`;


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
  const {db, error} = useDuckDB();
  const [data, setData] = useState<PullRequest[]>([]);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [inputQuery, setInputQuery] = useState(DEFAULT_QUERY);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      console.log(`query: ${query}`);
      if (!db) return;

      let conn;
      try {
        conn = await db.connect();
        const result = (await conn.query(query)).toArray();
        setData(result);
        console.log('success to load remote parquet file');
      } catch (e: any) {
        console.error('Failed to load remote Parquet file:', e);
        setLoadError(e?.message);
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

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  if (loadError) {
    const e = loadError;
    setLoadError(null);
    return <>
      <p>{`Failed to load data: ${e}`}</p>
      <p>{'Please reload.'}</p>
    </>
  }


  return (
    <>
      <h1>Pull Requests</h1>
      <div style={{ marginBottom: '1em' }}>
        <div>
          <label
            htmlFor="query-input"
            style={{
              marginRight: '1em',
            }}
          >
            {'SQL Query: '}
          </label>
        </div>
        <div>
          <textarea
            id='query-input'
            value={inputQuery}
            onChange={handleQueryChange}
            style={{
              width: '80%',
              height: '4em',
              marginRight: '1em',
              padding: '0.5em',
              resize: 'vertical',
              fontFamily: 'monospace',
            }}
          />
          <Button
            variant="contained"
            onClick={handleQuerySubmit}
          >
            {'Execute'}
          </Button>
        </div>
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
