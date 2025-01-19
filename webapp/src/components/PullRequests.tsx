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
import { blue, red } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import useDuckDB from '@/DuckDB';
import '@/components/PullRequests.css'
import DataQuery from '@/components/data/DataQuery';
import { PullRequest } from '@/types';

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
  const [query, setQuery] = useState('');
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

  const onQuerySubmit = (submittedQuery: string) => {
    setQuery(submittedQuery);
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
      <div>
        <DataQuery onQuerySubmit={onQuerySubmit} />
      </div>
      <div style={{ height: '100vh', width: '100%', minHeight: '90vh' }}>
        <DataGrid
            rowHeight={25}
            columnHeaderHeight={30}
            rows={data}
            columns={columns}
            initialState={{
              sorting: {
                sortModel: [{ field: 'createdAt', sort: 'desc' }],
              },
            }}
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
