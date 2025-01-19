import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

import LineAdditionsPlot from '@/components/scatter/LineAdditions';
import LineDeletionsPlot from '@/components/scatter/LineDeletions';

import useDuckDB from '@/DuckDB';
import { PullRequest } from '@/types';
import LineChangesPlot from '@/components/scatter/LineChanges';
import { getBaseUrl } from '@/utils';

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
        const baseUrl = getBaseUrl();
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
      <h1>Line Changes</h1>
      <LineChangesPlot
        pullRequests={data}
      />
      <h1>Line Additions</h1>
      <LineAdditionsPlot
        pullRequests={data}
      />
      <h1>Line Deletions</h1>
      <LineDeletionsPlot
        pullRequests={data}
      />
    </div>
  );
};

export default StatisticsPage;
