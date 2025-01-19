import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

import { PRCount } from '@/types';
import PullRequestsCountChart from '@/components/statistics/PullRequestsCount';
import ReposCountChart from '@/components/statistics/ReposCount';

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

const SummaryPage = () => {
  const [prCounts, setPrCounts] = useState<PRCount[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const basepath = import.meta.env.BASE_URL
      const baseUrl = `${window.location.protocol}//${window.location.host}${basepath}`.replace(/\/$/, '');
      console.log(`fetch pr_counts_by_date.csv from baseUrl: ${baseUrl}`);
      const resp = await fetch(`${baseUrl}/assets/pr_counts_by_date.csv`);

      const csv = await resp.text();
      const prCounts: PRCount[]= csv.split('\n').slice(1).map(row => {
        const values = row.split(',');
        return {
            date: values[0],
            author: values[1],
            count: parseInt(values[2], 10),
            repos: parseInt(values[3], 10),
        }
      });
      setPrCounts(prCounts);
    };
    fetchData().catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Pull Requests by AI-Agent</h1>
      <PullRequestsCountChart prCounts={prCounts} />
      <h1>Repository using AI-Agent</h1>
      <ReposCountChart prCounts={prCounts} />
    </div>
  );
};

export default SummaryPage;
