import logging
import os

from ai_agent_statistics.github_gql import GitHubGQLClient
from ai_agent_statistics.model import PullRequest

logger = logging.getLogger(__name__)

def run(token):
    client = GitHubGQLClient(token)
    result = client.query_pr("openhands-agent")

    if result.get("errors"):
        logger.error(result["errors"])
        raise Exception("Query failed")

    pr_list = [PullRequest.model_validate(pr["node"]) for pr in result["data"]["search"]["edges"]]
    print(pr_list)


if __name__ == "__main__":
    token = os.getenv("GITHUB_TOKEN")
    run(token)
