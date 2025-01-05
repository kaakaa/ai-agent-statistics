from pathlib import Path
import duckdb

conn = duckdb.connect('store.db')

conn.execute(Path('sql/pr_parquet.sql').read_text())
conn.execute(Path('sql/repo_parquet.sql').read_text())
conn.execute(Path('sql/pr_counts_by_date.sql').read_text())
