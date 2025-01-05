from pathlib import Path
import duckdb

conn = duckdb.connect('store.db')

print('Initialize metadata table')
conn.execute(Path('sql/initialize_metadata.sql').read_text())
print('Initialize pull_request table')
conn.execute(Path('sql/initialize_pull_request.sql').read_text())
print('Initialize repository table')
conn.execute(Path('sql/initialize_repository.sql').read_text())
