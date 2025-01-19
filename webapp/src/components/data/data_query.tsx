import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';

type DataQueryProps = {
  query?: string;
  onQuerySubmit: (query: string) => void;
}

const constructDefaultQuery = (): string => {
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

  return `SELECT *
    FROM '${baseUrl}/assets/pull_request.parquet' AS p
    JOIN '${baseUrl}/assets/repository.parquet' AS r
    ON p.repositoryId = r.id
    ${where_clause};
  `;
}

export default function DataQuery({ query, onQuerySubmit }: DataQueryProps) {
  const [inputQuery, setInputQuery] = useState(query || constructDefaultQuery());

  // Run default query at opening
  useEffect(() => {
    onQuerySubmit(inputQuery);
  }, [])

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputQuery(e.target.value);
  }

  const handleQuerySubmit = () => {
    onQuerySubmit(inputQuery);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%'
    }}>
      <div>
        <label
          htmlFor="query-input"
          style={{
            display: 'block',
            marginBottom: '0.5em',
          }}
        >
          {'SQL Query: '}
        </label>
      </div>
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1em',
        marginBottom: '15px',
      }}>
        <textarea
          id='query-input'
          value={inputQuery}
          onChange={handleQueryChange}
          style={{
            width: '100%',
            height: '7em',
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
  )
}
