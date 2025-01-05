CREATE TABLE IF NOT EXISTS pull_request (
    id TEXT PRIMARY KEY,
    title TEXT,
    url TEXT,
    createdAt TEXT,
    state TEXT,
    totalCommentsCount INTEGER,
    additions INTEGER,
    deletions INTEGER,
    changedFiles INTEGER,
    repositoryId TEXT,
    author TEXT
);

INSERT INTO pull_request
    SELECT * FROM read_parquet('./webapp/public/assets/pull_request.parquet');
