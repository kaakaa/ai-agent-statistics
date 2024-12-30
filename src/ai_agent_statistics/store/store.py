import os

import duckdb

from .schema import (
    SCHEMA_TABLE_METADATA,
    SCHEMA_TABLE_GITHUB_PULL_REQUEST,
    SCHEMA_TABLE_GITHUB_REPOSITORY
)

db_version = "1"

class Store:
    def __init__(self, path: str):
        if os.path.exists(path):
            self.connection = duckdb.connect(path)
        else:
            self.connection = duckdb.connect(path)
        
        self.connection.sql(SCHEMA_TABLE_METADATA)
        self.connection.sql(SCHEMA_TABLE_GITHUB_PULL_REQUEST)
        self.connection.sql(SCHEMA_TABLE_GITHUB_REPOSITORY)

        version = self.get_version()
        if version is None:
            self.set_version(db_version)
        # if version != db_version:
        #    migrate(from=version, to=db_version)

    def update_pull_request(self, pr):
        self.connection.execute(
            f"""INSERT INTO pull_request VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                url = EXCLUDED.url,
                createdAt = EXCLUDED.createdAt,
                state = EXCLUDED.state,
                totalCommentsCount = EXCLUDED.totalCommentsCount,
                additions = EXCLUDED.additions,
                deletions = EXCLUDED.deletions,
                changedFiles = EXCLUDED.changedFiles,
                repositoryId = EXCLUDED.repositoryId
            """,(
                pr.id,
                pr.title,
                pr.url,
                pr.createdAt,
                pr.state,
                pr.totalCommentsCount,
                pr.additions,
                pr.deletions,
                pr.changedFiles,
                pr.repository.id
            )
        )
    
    def update_repository(self, repository):
        self.connection.execute(
            f"""INSERT INTO repository VALUES (?, ?, ?, ?)
            ON CONFLICT (id) DO UPDATE SET
                nameWithOwner = EXCLUDED.nameWithOwner,
                stargazerCount = EXCLUDED.stargazerCount,
                forkCount = EXCLUDED.forkCount
            """, (
                repository.id,
                repository.nameWithOwner,
                repository.stargazerCount,
                repository.forkCount
            )
        )

    def get_version(self) -> str | None:
        ret = self.connection.execute("SELECT * FROM metadata WHERE key = 'version'").fetchone()
        if ret is None:
            return None
        return ret[0]
    
    def set_version(self, version: str):
        self.connection.execute(f"INSERT INTO metadata VALUES ('version', '{version}')")

    def close(self):
        self.connection.close()