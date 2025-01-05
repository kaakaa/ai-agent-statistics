import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

import LineAdditionsPlot from './statistics/LineAdditions';

import useDuckDB from '../DuckDB';
import { PullRequest } from '../types';

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

  useEffect(() => {
    const load = async () => {
      if (!db) return;

      try {
        const conn = await db.connect();
        const basepath = import.meta.env.BASE_URL
        const baseUrl = `${window.location.protocol}//${window.location.host}${basepath}`.replace(/\/$/, '');
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
    <div>
      <h1>Line Additions</h1>
      <LineAdditionsPlot
        pullRequests={data}
      />
    </div>
  );
};

export default StatisticsPage;
