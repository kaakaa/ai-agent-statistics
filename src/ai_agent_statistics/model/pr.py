from pydantic import BaseModel

class PRRepository(BaseModel):
    id: str
    nameWithOwner: str
    stargazerCount: int
    forkCount: int

class PullRequest(BaseModel):
    id: str
    title: str
    url: str
    createdAt: str
    state: str
    totalCommentsCount: int
    additions: int
    deletions: int
    changedFiles: int
    repository: PRRepository | None = None
