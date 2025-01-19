import { Line } from 'react-chartjs-2';

import { PRCount } from '@/types';
import { getBaseUrl } from '@/utils';

type ChartProps = {
    prCounts: PRCount[];
}

const ReposCountChart = ({prCounts}: ChartProps) => {
    const authors = [
        {name: "devin-ai-integration", color: 'rgba(0, 180, 170, 1)'},
        {name: "devloai", color: 'rgba(0, 122, 255, 1)'},
        {name: "openhands-agent", color: 'rgba(255, 204, 0, 1)'},
        {name: "gru-agent", color: 'rgba(255, 99, 132, 1)'},
        {name: "code-rover-bot", color: 'rgba(54, 162, 235, 1)'},
        {name: "sweep-ai", color: 'rgba(153, 102, 255, 1)'},
    ];

    const dates = Array.from(new Set(prCounts.map((prCount: PRCount) => prCount.date).filter(date => date)));
    if (!dates || dates.length === 0) {
        return <div>No data</div>
    }
    let begin = new Date(dates.sort((a, b) => a.localeCompare(b))[0]);
    const end = new Date(dates.sort((a, b) => b.localeCompare(a))[0]);

    const labels = [begin.toISOString().split('T')[0]];
    while (begin < end) {
        begin.setDate(begin.getDate() + 1);
        labels.push(begin.toISOString().split('T')[0]);
    }

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
            <Line
              data={{
                labels,
                datasets: datasets
              }}
              options={{
                onClick: (_, elements) => {
                  if (elements.length > 0) {
                    const element = elements[0];
                    const date = labels[element.index];

                    const searchParams = new URLSearchParams();
                    searchParams.set('createdAt', date);
                    const href = `${getBaseUrl()}/details?${searchParams.toString()}`;

                    window.location.href = href;
                  }
                }
              }}
            />
        </>
    )
}

export default ReposCountChart;
