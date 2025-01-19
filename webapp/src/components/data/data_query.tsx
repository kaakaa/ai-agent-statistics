import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Help } from '@mui/icons-material';
import { Tooltip, IconButton } from '@mui/material';

import { DataSchemaDescription, getWhereClauseBySearchParams } from '@/components/data/DataSchema';


type DataQueryProps = {
  query?: string;
  onQuerySubmit: (query: string) => void;
}

const constructDefaultQuery = (): string => {
  const params = new URLSearchParams(window.location.search);
  const whereClause = getWhereClauseBySearchParams(params);
  const basepath = import.meta.env.BASE_URL
  const baseUrl = `${window.location.protocol}//${window.location.host}${basepath}`.replace(/\/$/, '');

  return `SELECT *
    FROM '${baseUrl}/assets/pull_request.parquet' AS p
    JOIN '${baseUrl}/assets/repository.parquet' AS r
    ON p.repositoryId = r.id
    ${whereClause};
  `;
}

const StyledLabel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5em',
  fontWeight: 600,
  fontSize: '1.1em',
  color: '#1976d2',  // Material-UI primary blue
  padding: '0.5em 0',
});

export default function DataQuery({ query, onQuerySubmit }: DataQueryProps) {
  const [inputQuery, setInputQuery] = useState(query || constructDefaultQuery());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onQuerySubmit(inputQuery);
  }, []);

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
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          marginBottom: '0.5em'
        }}
      >
        <StyledLabel>
          <Typography variant="h6" component="span">
            SQL Query
          </Typography>
          <Tooltip
            title={<pre style={{ whiteSpace: 'pre-wrap' }}>{DataSchemaDescription}</pre>}
            placement="right"
            arrow
          >
            <IconButton size="small">
              <Help sx={{
                fontSize: '1.2rem',
                color: '#1976d2'
              }} />
            </IconButton>
          </Tooltip>
          {isExpanded ?
            <ExpandLess sx={{ color: '#1976d2' }} /> :
            <ExpandMore sx={{ color: '#1976d2' }} />
          }
        </StyledLabel>
      </div>
      {isExpanded && (
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
            Execute
          </Button>
        </div>
      )}
    </div>
  );
}
