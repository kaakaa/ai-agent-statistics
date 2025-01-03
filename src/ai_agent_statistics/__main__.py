import logging
import os
import argparse
from functools import partial

from ai_agent_statistics.github_gql import GitHubGQLClient
from ai_agent_statistics.model import PullRequest
from ai_agent_statistics.store import Store

logger = logging.getLogger(__name__)
logging.basicConfig(stream=os.sys.stdout, level=logging.INFO)

def save(store: Store, registered_repos: list, pr: PullRequest):
    try:
        logger.debug(f"Updating PR {pr.id}")
        store.update_pull_request(pr)
        if pr.repository.id in registered_repos:
            logger.debug("  done(repo skipped).")
            return
        store.update_repository(pr.repository)
        registered_repos.append(pr.repository.id)
        logger.debug("  done.")
    except Exception as e:
        logger.error(f"Failed to update PR {pr.id}: {e}\n{pr}")

def run(token: str, start_date: str = None, end_date: str = None):
    store = Store("store.db")
    client = GitHubGQLClient(token)

    date_query = ''
    if start_date and end_date:
        date_query = f"created:{start_date}..{end_date}"
    elif start_date:
        date_query = f"created:>={start_date}"
    elif end_date:
        date_query = f"created:<={end_date}"

    callback = partial(save, store, [])
    for author in ["devin-ai-integration[bot]", "openhands-agent", "devloai"]:
         client.query_pr(author, callback, additional_query=date_query)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="GitHub PR Statistics")
    parser.add_argument("--token", help="GitHub token")
    parser.add_argument("--start-date", help="Start date for the query (YYYY-MM-DD)")
    parser.add_argument("--end-date", help="End date for the query (YYYY-MM-DD)")
    args = parser.parse_args()

    token = args.token or os.getenv("GITHUB_TOKEN")

    run(token, args.start_date, args.end_date)
