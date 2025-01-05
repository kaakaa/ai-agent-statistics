export type PullRequest = {
    id: string;
    title: string;
    url: string;
    createdAt: string;
    state: string;
    totalCommentsCount: number;
    additions: number;
    deletions: number;
    changedFiles: number;
    repositoryId: string;
}

export type PRCount = {
  date: string;
  author: string;
  count: number;
  repos: number;
}
