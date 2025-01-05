import logging
import os

import duckdb

from .schema import (
    SCHEMA_TABLE_METADATA,
    SCHEMA_TABLE_GITHUB_PULL_REQUEST,
    SCHEMA_TABLE_GITHUB_REPOSITORY
)

logger = logging.getLogger(__name__)

db_version = "2"

class Store:
    def __init__(self, path: str):
        if os.path.exists(path):
            logger.info(f"Connecting to existing database at {path}")
            self.connection = duckdb.connect(path)
        else:
            logger.info(f"Creating new database at {path}")
            self.connection = duckdb.connect(path)

        self.connection.sql(SCHEMA_TABLE_METADATA)
        self.connection.sql(SCHEMA_TABLE_GITHUB_PULL_REQUEST)
        self.connection.sql(SCHEMA_TABLE_GITHUB_REPOSITORY)


        current_version = self.get_version()
        if current_version is None:
            self.set_version(db_version)
        elif current_version != db_version:
            try:
                self.connection.begin()
                self._migrate(current_version, db_version)
            except Exception as e:
                self.connection.rollback()

    def _migrate(self, version: str, target: str):
        logger.info(f"Migrating database from {version} to {target}")
        cur = int(version)
        dest = int(target)
        # Migrate from 1 to 2
        if cur == 1:
            self.connection.execute("ALTER TABLE pull_request ADD COLUMN author TEXT")
            cur += 1

        self.set_version(target)

    def update_pull_request(self, pr):
        self.connection.execute(
            f"""INSERT INTO pull_request VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                url = EXCLUDED.url,
                createdAt = EXCLUDED.createdAt,
                state = EXCLUDED.state,
                totalCommentsCount = EXCLUDED.totalCommentsCount,
                additions = EXCLUDED.additions,
                deletions = EXCLUDED.deletions,
                changedFiles = EXCLUDED.changedFiles,
                repositoryId = EXCLUDED.repositoryId,
                author = EXCLUDED.author
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
                pr.repository.id,
                pr.author.login
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
        return ret[1]

    def set_version(self, version: str):
        self.connection.execute(f"""
            INSERT INTO metadata VALUES ('version', '{version}')
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
        """)

    def close(self):
        self.connection.close()
