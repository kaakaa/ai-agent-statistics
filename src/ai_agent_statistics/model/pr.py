from pydantic import BaseModel

class PRRepository(BaseModel):
    id: str
    nameWithOwner: str
    stargazerCount: int
    forkCount: int

class Author(BaseModel):
    login: str

class PullRequest(BaseModel):
    id: str
    author: Author | None = None
    title: str
    url: str
    createdAt: str
    state: str
    totalCommentsCount: int
    additions: int
    deletions: int
    changedFiles: int
    repository: PRRepository | None = None
