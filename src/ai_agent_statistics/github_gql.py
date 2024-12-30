import logging
import time

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
search_pr_query = query = """
query ($search_query: String!, $after: String) {
    search(query: $search_query, type: ISSUE, first: 5, after:$after) {
        edges {
            node {
                ... on PullRequest {
                    id
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
    
    def query_pr(self, author_name: str) -> list[PullRequest]:
        has_next_page = True
        after_cursor = None
        results = []
        count = 0

        while has_next_page:
            logger.info(f"Querying PRs for '{author_name}' after '{after_cursor}'")
            variables = {
                "search_query": f"author:{author_name} type:pr",
                "after": after_cursor
            }

            response = requests.post(
                "https://api.github.com/graphql",
                json={"query": search_pr_query, "variables": variables},
                headers=self.headers
            )

            count += 1

            if response.status_code == 200:
                ret = response.json()
                if ret.get("errors"):
                    logger.error(ret["errors"])
                    raise Exception("Query failed")
                
                list = [PullRequest.model_validate(pr["node"]) for pr in ret["data"]["search"]["edges"]]
                results.extend(list)

                page_info = ret["data"]["search"]["pageInfo"]
                has_next_page = page_info["hasNextPage"]
                after_cursor = page_info["endCursor"]
            else:
                raise Exception(f"Query failed: {response.status_code}: {response.text}")
            
            time.sleep(1)

        return results
