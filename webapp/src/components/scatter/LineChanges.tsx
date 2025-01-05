import ScatterPlot from './ScatterPlot';
import { PullRequest } from '../../types';

type PlotProps = {
  pullRequests: PullRequest[];
}

const LineChangesPlot = ({ pullRequests }: PlotProps) => {
  const uniqueData = new Set<string>();
  const data = pullRequests.reduce((acc, pr) => {
    const key = `${pr.additions}-${pr.deletions}`;
    if (!uniqueData.has(key)) {
      uniqueData.add(key);
      acc.push({ x: pr.additions, y: pr.deletions });
    }
    return acc;
  }, [] as { x: number, y: number }[]);

  return (
    <ScatterPlot
      label="Additoins vs Deletions"
      data={data}
      pullRequests={pullRequests}
      xKey="additions"
      yKey="deletions"
      backgroundColor="rgba(132, 99, 255, 1)"
    />
  );
}

export default LineChangesPlot;
