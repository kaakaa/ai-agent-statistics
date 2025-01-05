import { Scatter } from 'react-chartjs-2';
import { Chart, LogarithmicScale } from 'chart.js';

Chart.register(LogarithmicScale);

type PlotPoint = {
  x: number;
  y: number;
}

type ScatterPlotProps = {
  label: string;
  data: PlotPoint[];
  pullRequests: any[];
  xKey: string;
  yKey: string;
  backgroundColor: string;
}

const basepath = import.meta.env.BASE_URL
const baseUrl = `${window.location.protocol}//${window.location.host}${basepath}`.replace(/\/$/, '');

const ScatterPlot = ({ label, data, pullRequests, xKey, yKey, backgroundColor }: ScatterPlotProps) => {
  const chartData = {
    datasets: [{
      label,
      data,
      backgroundColor,
    }]
  };

  return (
    <Scatter
      data={chartData}
      options={{
        scales: {
          x: {
            type: 'logarithmic',
            position: 'bottom',
            ticks: {
              callback: (v) => Number(v.toString()),
              maxTicksLimit: 10,
            }
          },
          y: {
            type: 'logarithmic',
            position: 'left',
            ticks: {
              callback: (v) => Number(v.toString()),
              maxTicksLimit: 10,
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const xValue = context.parsed.x || 0;
                const yValue = context.parsed.y || 0;
                const count = pullRequests.filter((pr) => pr[xKey] === xValue && pr[yKey] === yValue).length;
                return `${label}: (${xValue}, ${yValue}) - ${count} PRs`;
              }
            }
          }
        },
        onClick: (_, elements) => {
          if (elements.length > 0) {
            const element = elements[0];
            const plot: PlotPoint = data[element.index];

            const searchParams = new URLSearchParams();
            searchParams.set(xKey, plot.x.toString());
            searchParams.set(yKey, plot.y.toString());
            const href = `${baseUrl}/details?${searchParams.toString()}`;

            window.location.href = href;
          }
        }
      }}
    />
  );
}

export default ScatterPlot;
