import ScatterPlot from './ScatterPlot';
import { PullRequest } from '../../types';

type PlotProps = {
  pullRequests: PullRequest[];
}

const LineAdditionsPlot = ({ pullRequests }: PlotProps) => {
  const uniqueData = new Set<string>();
  const data = pullRequests.reduce((acc, pr) => {
    const key = `${pr.additions}-${pr.changedFiles}`;
    if (!uniqueData.has(key)) {
      uniqueData.add(key);
      acc.push({ x: pr.additions, y: pr.changedFiles });
    }
    return acc;
  }, [] as { x: number, y: number }[]);

  return (
    <ScatterPlot
      label="Additions vs Changed Files"
      data={data}
      pullRequests={pullRequests}
      xKey="additions"
      yKey="changedFiles"
      backgroundColor="rgba(75, 192, 192, 1)"
    />
  );
}

export default LineAdditionsPlot;
