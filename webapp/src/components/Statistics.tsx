import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

import LineAdditionsPlot from '@/components/scatter/LineAdditions';
import LineDeletionsPlot from '@/components/scatter/LineDeletions';

import useDuckDB from '@/DuckDB';
import { PullRequest } from '@/types';
import LineChangesPlot from '@/components/scatter/LineChanges';
import { getBaseUrl } from '@/utils';
import DataQuery from './data/data_query';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string
  }[];
}

const StatisticsPage = () => {
  const { db, error } = useDuckDB();
  const [data, setData] = useState<PullRequest[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!db) return;

      try {
        const conn = await db.connect();
        const baseUrl = getBaseUrl();
        console.log(`fetch pull_request.parquet from baseUrl: ${baseUrl}`);

        const result = (await conn.query(query)).toArray();
        setData(result);

        console.log('success to load remote parquet file');
      } catch (error) {
        console.error('Failed to load remote Parquet file:', error);
      }
    };
    load();
  }, [db, query]);

  const onQuerySubmit = (submittedQuery: string) => {
    setQuery(submittedQuery);
  }

  if (error) {
    return <div>Error initializing DuckDB: {error.message}</div>;
  }

  if (!db) {
    return <div>Initializing DuckDB...</div>;
  }

  return (
    <>
      <h1>Statistics</h1>
      <div>
        <DataQuery onQuerySubmit={onQuerySubmit} />
      </div>
      <h2>Line Changes</h2>
      <LineChangesPlot
        pullRequests={data}
      />
      <h2>Line Additions</h2>
      <LineAdditionsPlot
        pullRequests={data}
      />
      <h2>Line Deletions</h2>
      <LineDeletionsPlot
        pullRequests={data}
      />
    </>
  );
};

export default StatisticsPage;
