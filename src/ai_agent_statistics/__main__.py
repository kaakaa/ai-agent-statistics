import logging
import os

from ai_agent_statistics.github_gql import GitHubGQLClient
from ai_agent_statistics.model import PullRequest
from ai_agent_statistics.store import Store

logger = logging.getLogger(__name__)
logging.basicConfig(stream=os.sys.stdout, level=logging.INFO)

def run(token: str):
    store = Store("store.db")
    client = GitHubGQLClient(token)

    registered_repos = []
    for author in ["devin-ai-integration[bot]", "openhands-agent"]:
        for pr in client.query_pr(author):
            try:
                logger.debug(f"Updating PR {pr.id}")
                store.update_pull_request(pr)
                if pr.repository.id in registered_repos:
                    logger.debug("  done(repo skipped).")
                    continue
                store.update_repository(pr.repository)
                registered_repos.append(pr.repository.id)
                logger.debug("  done.")
            except Exception as e:
                logger.error(f"Failed to update PR {pr.id}: {e}\n{pr}")

if __name__ == "__main__":
    token = os.getenv("GITHUB_TOKEN")
    run(token)
