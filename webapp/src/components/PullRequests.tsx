import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  AddCircleOutline,
  Comment,
  Difference,
  GitHub,
  RemoveCircleOutline,
} from '@mui/icons-material';
import { blue, red } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import useDuckDB from '../DuckDB';
import './PullRequests.css'

type PullRequest = {
    id: string;
    title: string;
    url: string;
    createdAt: string;
    state: string;
    totalCommentsCount: number;
    additions: number;
    deletions: number;
    changedFiles: number;
    repositoryId: string;
}

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

  useEffect(() => {
    const load = async () => {
      if (!db) return;

      try {
        const conn = await db.connect();
        const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`.replace(/\/$/, '');
        console.log(`fetch pull_request.parquet from baseUrl: ${baseUrl}`);
        const result = (await conn.query(`SELECT * FROM '${baseUrl}/assets/pull_request.parquet'`)).toArray();
        setData(result);
        console.log('success to load remote parquet file');
      } catch (error) {
        console.error('Failed to load remote Parquet file:', error);
      }
    };
    load();
  }, [db]);

  if (error) {
    return <div>Error initializing DuckDB: {error.message}</div>;
  }

  if (!db) {
    return <div>Initializing DuckDB...</div>;
  }

  return (
    <>
      <h1>Pull Requests</h1>
      <div style={{ height: '85%', width: '100%' }}>
        <DataGrid
            rowHeight={25}
            columnHeaderHeight={30}
            rows={data}
            columns={columns}
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
