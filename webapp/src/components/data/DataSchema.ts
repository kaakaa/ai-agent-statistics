type DataElement = {
  name: string,
  type: string,
  displayName: string,
  description: string,
}

export const DataSchema: DataElement[] = [
  // Pull Request
  { name: 'author', type: 'TEXT', displayName: 'Author', description: 'PR creator' },
  { name: 'title', type: 'TEXT', displayName: 'Title', description: 'PR title' },
  { name: 'url', type: 'TEXT', displayName: 'URL', description: 'URL of PR' },
  { name: 'createdAt', type: 'TEXT', displayName: 'Created At', description: 'PR created at (YYYY-MM-DD)' },
  { name: 'state', type: 'TEXT', displayName: 'State', description: 'PR state' },
  { name: 'totalCommentsCount', type: 'INTEGER', displayName: 'Total Comments Count', description: 'num of comments in PR' },
  { name: 'changedFiles', type: 'INTEGER', displayName: 'Changed Files', description: 'num of changed files by PR' },
  { name: 'additions', type: 'INTEGER', displayName: 'Additions', description: 'num of line added by PR' },
  { name: 'deletions', type: 'INTEGER', displayName: 'Deletions', description: 'num of line deleted by PR' },
  // Repository
  { name: 'nameWithOwner', type: 'TEXT', displayName: 'Repository', description: 'repo name ("owner/repo")' },
  { name: 'stargazerCount', type: 'INTEGER', displayName: 'Stargazer Count', description: 'num of stars for repo' },
  { name: 'forkCount', type: 'INTEGER', displayName: 'Fork Count', description: 'num of forks for repo' },
]

export const DataSchemaDescription = `Available Columns:
` + DataSchema.map((e) => `- ${e.name}[${e.type}]:  ${e.description}`).join('\n')

export const getWhereClauseBySearchParams = (params: URLSearchParams): string => {
  const p = DataSchema.reduce((acc, e) => {
    if (params.get(e.name)) {
      if (e.type === 'TEXT') {
        acc.push(`${e.name}='${params.get(e.name)}'`);
      } else {
        acc.push(`${e.name}=${params.get(e.name)}`);
      }
    }
    return acc;
  }, [] as string[]);
  return p.length > 0 ? `WHERE ${p.join(' AND ')}` : '';
}
