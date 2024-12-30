import logging
import os

from ai_agent_statistics.github_gql import GitHubGQLClient
from ai_agent_statistics.model import PullRequest
from ai_agent_statistics.store import Store

logger = logging.getLogger(__name__)
logging.basicConfig(stream=os.sys.stdout, level=logging.INFO)

def run(token):
    store = Store("store.db")

    client = GitHubGQLClient(token)
    result = client.query_pr("openhands-agent")

    if result.get("errors"):
        logger.error(result["errors"])
        raise Exception("Query failed")

    pr_list = [PullRequest.model_validate(pr["node"]) for pr in result["data"]["search"]["edges"]]
    registered = []
    for pr in pr_list:
        try:
            logger.info(f"Updating PR {pr.id}")
            store.update_pull_request(pr)
            if pr.repository.id in registered:
                logger.info("  done(repo skipped).")
                continue
            store.update_repository(pr.repository)
            registered.append(pr.repository.id)
            logger.info("  done.")
        except Exception as e:
            logger.error(f"Failed to update PR {pr.id}: {e}")

if __name__ == "__main__":
    token = os.getenv("GITHUB_TOKEN")
    run(token)
