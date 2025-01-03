COPY (
    SELECT
        strftime(strptime(createdAt, '%Y-%m-%dT%H:%M:%SZ'), '%Y-%m-%d') AS date,
        author,
        COUNT(*) AS count,
        COUNT(DISTINCT repositoryId) AS repos
    FROM pull_request
    GROUP BY date, author
    ORDER BY date
) TO './webapp/public/assets/pr_counts_by_date.csv' WITH CSV HEADER;
