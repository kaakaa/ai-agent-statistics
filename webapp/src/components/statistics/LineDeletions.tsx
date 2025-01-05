import { Scatter } from 'react-chartjs-2';
import { Chart, LogarithmicScale } from 'chart.js';

import { PullRequest } from '../../types';

Chart.register(LogarithmicScale);

type PlotProps = {
  pullRequests: PullRequest[];
}

const LineDeletionsPlot = ({ pullRequests }: PlotProps) => {
  type PlotPoint = {
    x: number;
    y: number;
  }
  const uniqueData = new Set<string>();
  const data = {
    datasets: [{
      label: 'Deletions vs Changed Files',
      data: pullRequests.reduce((acc: PlotPoint[], pr: PullRequest) => {
        const key = `${pr.deletions}-${pr.changedFiles}`;
        if (!uniqueData.has(key)) {
          uniqueData.add(key);
          acc.push({ x: pr.deletions, y: pr.changedFiles });
        }
        return acc;
      }, [] as PlotPoint[]),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    }]
  }
  return (
    <>
      <Scatter
        data={data}
        options={
          {
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
                    const count = pullRequests.filter((pr: PullRequest) => pr.deletions === xValue && pr.changedFiles === yValue).length;
                    return `${label}: (${xValue}, ${yValue}) - ${count} PRs`;
                  }
                }
              }
            }
          }
        }
      />
    </>
  )
}

export default LineDeletionsPlot;
