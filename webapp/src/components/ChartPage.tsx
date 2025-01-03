import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { csv } from 'd3-fetch';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartPage = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      const data = await csv('/assets/pr_counts_by_date.csv');
      const labels = data.map(d => d.date);
      const counts = data.map(d => d.count);

      setChartData({
        labels,
        datasets: [
          {
            label: 'PR Count by Date',
            data: counts,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>PR Count by Date</h1>
      <Line data={chartData} />
    </div>
  );
};

export default ChartPage;
