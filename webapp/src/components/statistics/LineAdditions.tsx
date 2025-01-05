import { Scatter } from 'react-chartjs-2';

import { PullRequest } from '../../types';

type PlotProps = {
    pullRequests: PullRequest[];
}

const LineAdditionsPlot = ({ pullRequests }: PlotProps) => {
    const datasets: any[] = [];
    console.log(pullRequests.length);
    return (
        <>
            <Scatter
                data={{labels: [], datasets: datasets}}
            />
        </>
    )
}

export default LineAdditionsPlot;