import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartPage = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/assets/pr_counts_by_date.csv');
      const text = await response.text();
      const data = text.split('\n').slice(1).map(row => {
        const [date, , count] = row.split(',');
        return { date, count: parseInt(count, 10) };
      });
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
