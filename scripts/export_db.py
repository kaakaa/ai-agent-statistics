from pathlib import Path
import duckdb

conn = duckdb.connect('store.db')

print('Export pull_request parquet file')
conn.execute(Path('sql/pr_parquet.sql').read_text())
print('Export repository parquet file')
conn.execute(Path('sql/repo_parquet.sql').read_text())
print('Export pr_counts csv file')
conn.execute(Path('sql/pr_counts_by_date.sql').read_text())
