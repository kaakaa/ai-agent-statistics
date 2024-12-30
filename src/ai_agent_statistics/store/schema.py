SCHEMA_TABLE_METADATA = """
CREATE TABLE IF NOT EXISTS metadata (
    key TEXT PRIMARY KEY,
    value TEXT
)
"""

SCHEMA_TABLE_GITHUB_PULL_REQUEST = """
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
    repositoryId TEXT   
)
"""

SCHEMA_TABLE_GITHUB_REPOSITORY = """
CREATE TABLE IF NOT EXISTS repository (
    id TEXT PRIMARY KEY,
    nameWithOwner TEXT,
    stargazerCount INTEGER,
    forkCount INTEGER
)
"""