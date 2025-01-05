COPY (
    SELECT *
    FROM repository
) TO './webapp/public/assets/repository.parquet' WITH (FORMAT 'parquet');
