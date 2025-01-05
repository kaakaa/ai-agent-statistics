COPY (
    SELECT *
    FROM pull_request
) TO './webapp/public/assets/pull_request.parquet' WITH (FORMAT 'parquet');
