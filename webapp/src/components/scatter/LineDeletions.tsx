import ScatterPlot from './ScatterPlot';
import { PullRequest } from '../../types';

type PlotProps = {
  pullRequests: PullRequest[];
}

const LineDeletionsPlot = ({ pullRequests }: PlotProps) => {
  const uniqueData = new Set<string>();
  const data = pullRequests.reduce((acc, pr) => {
    const key = `${pr.deletions}-${pr.changedFiles}`;
    if (!uniqueData.has(key)) {
      uniqueData.add(key);
      acc.push({ x: pr.deletions, y: pr.changedFiles });
    }
    return acc;
  }, [] as { x: number, y: number }[]);

  return (
    <ScatterPlot
      label="Deletions vs Changed Files"
      data={data}
      pullRequests={pullRequests}
      xKey="deletions"
      yKey="changedFiles"
      backgroundColor="rgba(255, 99, 132, 1)"
    />
  );
}

export default LineDeletionsPlot;
