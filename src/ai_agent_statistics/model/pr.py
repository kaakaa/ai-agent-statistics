from pydantic import BaseModel

class PRRepository(BaseModel):
    nameWithOwner: str
    stargazerCount: int
    forkCount: int

class PullRequest(BaseModel):
    title: str
    url: str
    createdAt: str
    state: str
    totalCommentsCount: int
    additions: int
    deletions: int
    changedFiles: int
    repository: PRRepository | None = None
