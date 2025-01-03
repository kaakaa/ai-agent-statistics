# AI Agent Statistics

Collect PullRequest create by AI Agents, and view statistics for that.

## Summary

* required GitHub Fine-grained access token without any permissions

```
# Collect data by GitHub GraphQL API
$ poetry install
$ poetry run python src/ai_agent_statistics/__main__.py --token=github_pat_... --start-date=2024-12-245 --end-date=2024-12-31
=> store and update data to ./store.db

# Transform data to web readable format
$ duckdb store.db < sql/to_parquet.sql
$ duckdb store.db < sql/pr_counts_by_date.sql

# Build and start webapp
$ cd webapp
$ npm run build
$ npm run preview
=> access to http://localhost:4173/ai-agent-statistics
```


