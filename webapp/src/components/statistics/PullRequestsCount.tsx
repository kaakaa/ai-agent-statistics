import { Line } from 'react-chartjs-2';

import { PRCount } from '@/types';
import { getBaseUrl } from '@/utils';
import { authorColors } from './ReposCount';

type ChartProps = {
    prCounts: PRCount[];
}

const PullRequestsCountChart = ({prCounts}: ChartProps) => {
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

    const datasets = authorColors.map(author => {
        const countsByAuthor = prCounts.filter((prCount: PRCount) => prCount.author === author.name)
        const counts = labels.map(date => countsByAuthor.find((c: PRCount) => c.date === date)?.count || 0);
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
                datasets: datasets,
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

export default PullRequestsCountChart;
