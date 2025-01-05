CREATE TABLE IF NOT EXISTS repository (
    id TEXT PRIMARY KEY,
    nameWithOwner TEXT,
    stargazerCount INTEGER,
    forkCount INTEGER
);

INSERT INTO repository
    SELECT * FROM read_parquet('./webapp/public/assets/repository.parquet');
