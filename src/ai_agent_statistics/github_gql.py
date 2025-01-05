import logging

import requests

from ai_agent_statistics.model import PullRequest

logger = logging.getLogger(__name__)

# fetch only 5 entries because query with "devin-ai-integration[bot]" and "first: 10" will be timeout error
# Exception: Query failed: 502: {
#   "data": null,
#   "errors":[
#      {
#         "message":"Something went wrong while executing your query. This may be the result of a timeout, or it could be a GitHub bug. Please include `DEC7:92258:1E53525:24838AC:6772BC3F` when reporting this issue."
#      }
#   ]
# }
DEFAULE_PER_PAGE: int = 5

search_pr_query = """
query ($search_query: String!, $per_page: Int!, $after: String) {
    search(query: $search_query, type: ISSUE, first: $per_page, after:$after) {
        issueCount
        edges {
            node {
                ... on PullRequest {
                    id
                    author {
                        login
                    }
                    title
                    url
                    createdAt
                    state
                    totalCommentsCount

                    additions  # lines added
                    deletions # lines removed
                    changedFiles

                    repository {
                        id
                        nameWithOwner
                        stargazerCount
                        forkCount
                    }
                }
            }
        }
        pageInfo {
            endCursor
            hasNextPage
        }
    }
}"""


class GitHubGQLClient:
    def __init__(self, token):
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
    
    def query_pr(self, author_name: str, callback, additional_query: str | None = None) -> None:
        has_next_page: bool = True
        after_cursor: str | None = None
        per_page: int = DEFAULE_PER_PAGE
        num_of_req: int = 0
        total_issue_count: int = -1

        while has_next_page:
            logger.info(f"[{(num_of_req)*per_page}/{total_issue_count}] Querying PRs for '{author_name}' after '{after_cursor}'")
            variables = {
                "search_query": f"author:{author_name} type:pr {additional_query}",
                "per_page": per_page,
                "after": after_cursor
            }

            response = requests.post(
                "https://api.github.com/graphql",
                json={
                    "query": search_pr_query,
                    "variables": variables,
                },
                headers=self.headers
            )

            num_of_req += 1

            if response.status_code == 200:
                ret = response.json()
                if ret.get("errors"):
                    logger.error(ret["errors"])
                    raise Exception("Query failed")
                
                for pr in [PullRequest.model_validate(pr["node"]) for pr in ret["data"]["search"]["edges"]]:
                    callback(pr)

                if total_issue_count == -1:
                    total_issue_count = ret["data"]["search"]["issueCount"]
                page_info = ret["data"]["search"]["pageInfo"]
                has_next_page = page_info["hasNextPage"]
                after_cursor = page_info["endCursor"]
            else:
                raise Exception(f"Query failed: {response.status_code}: {response.text}")
