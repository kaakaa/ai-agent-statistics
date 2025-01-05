from pathlib import Path
import duckdb

conn = duckdb.connect('store.db')

conn.execute(Path('sql/initialize_metadata.sql').read_text())
conn.execute(Path('sql/initialize_pull_request.sql').read_text())
conn.execute(Path('sql/initialize_repository.sql').read_text())
