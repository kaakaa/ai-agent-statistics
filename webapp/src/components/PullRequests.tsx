import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useDuckDB from '../DuckDB';
import '../App.css';

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
  { 
    field: 'title',
    headerName: 'Title',
    width: 300,
    renderCell: (params) => (
        <a href={params.row.url}>{params.value}</a>
    )
  },
  { field: 'createdAt', headerName: 'Created At', width: 100 },
  { field: 'state', headerName: 'State', width: 75 },
  { field: 'totalCommentsCount', headerName: 'Comments', width: 75 },
  { field: 'additions', headerName: 'Additions', width: 75 },
  { field: 'deletions', headerName: 'Deletions', width: 75 },
  { field: 'changedFiles', headerName: 'Changed Files', width: 75 },
  { field: 'author', headerName: 'Author', width: 100 },
];

function PullRequestsTable() {
  const { db, error } = useDuckDB();
  const [data, setData] = useState<PullRequest[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!db) return;

      try {
        const conn = await db.connect();
        const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        const result = (await conn.query(`SELECT * FROM '${baseUrl}/pull_request.parquet'`)).toArray();
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
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
            rowHeight={25}
            columnHeaderHeight={30}
            rows={data}
            columns={columns}
            sx={{
              '& .MuiDataGrid-cell': {
                backgroundColor: '#f5f5f5',
                fontSize: '9px',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#e0e0e0',
                fontSize: '10px',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#d0d0d0',
                fontSize: '10px',
              },
            }}
        />
      </div>
    </>
  );
}

export default PullRequestsTable;