[![Update data](https://github.com/kaakaa/ai-agent-statistics/actions/workflows/update.yml/badge.svg)](https://github.com/kaakaa/ai-agent-statistics/actions/workflows/update.yml) [![Deploy to GitHub Pages](https://github.com/kaakaa/ai-agent-statistics/actions/workflows/deploy.yml/badge.svg)](https://github.com/kaakaa/ai-agent-statistics/actions/workflows/deploy.yml)

# AI Agent Statistics

[AI\-Agent Statistics](https://kaakaa.github.io/ai-agent-statistics/)

Collect PullRequest create by AI Agents, and view statistics for that.

| Summary | Statistics | Details |
|:-:|:-:|:-:|
| [![](./assets/view_summary.png)](./assets/view_summary.png) | [![](./assets/view_statistics.png)](./assets/view_statistics.png) |[![](./assets/view_details.png)](./assets/view_details.png) |

## Summary

* requires a GitHub Fine-grained access token without any permissions

```
# Collect data by GitHub GraphQL API
$ poetry install
$ poetry run python src/ai_agent_statistics/__main__.py --token=github_pat_... --start-date=2024-12-25 --end-date=2024-12-31
=> store and update data to ./store.db

# Transform data to web readable format
$ duckdb store.db < sql/pr_parquet.sql
$ duckdb store.db < sql/repo_parquet.sql
$ duckdb store.db < sql/pr_counts_by_date.sql

# Build and start webapp
$ cd webapp
$ npm run build
$ npm run preview
=> access to http://localhost:4173/ai-agent-statistics
```

## Accessing the Chart Page

To view the chart of PR counts by date, follow these steps:

1. Open your web browser.
2. Navigate to the following URL: `http://localhost:4173/ai-agent-statistics/chart`
3. You will see a line chart displaying the PR counts by date.
