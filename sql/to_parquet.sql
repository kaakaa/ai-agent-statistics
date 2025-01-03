COPY (
    SELECT *
    FROM pull_request AS p
    JOIN repository AS r
    ON p.repositoryId = r.id
) TO './webapp/public/assets/pull_request.parquet' WITH (FORMAT 'parquet');