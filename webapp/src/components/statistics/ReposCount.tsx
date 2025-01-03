import { Line } from 'react-chartjs-2';

import { PRCount } from '../../types';

type ChartProps = {
    prCounts: PRCount[];
}

const ReposCountChart = ({prCounts}: ChartProps) => {
    const authors = [
        {name: "devin-ai-integration", color: 'rgba(0, 180, 170, 1)'},
        {name: "devloai", color: 'rgba(0, 122, 255, 1)'},
        {name: "openhands-agent", color: 'rgba(255, 204, 0, 1)'},
    ];
    const labels = Array.from(new Set(prCounts.map((prCount: any) => prCount.date)));

    const datasets = authors.map(author => {
        const countsByAuthor = prCounts.filter((prCount: any) => prCount.author === author.name)
        const counts = labels.map(date => countsByAuthor.find((c: PRCount) => c.date === date)?.repos || 0);
        return {
            label: author.name,
            data: counts,
            borderColor: author.color,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }
    });
    return (
        <>
            <Line data={{labels, datasets: datasets}} />
        </>
    )
}

export default ReposCountChart;