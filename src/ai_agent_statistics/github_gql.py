import requests

search_pr_query = query = """
{{
    search(query: "author:{author_name} type:pr", type: ISSUE, first: 3) {{
        edges {{
            node {{
                ... on PullRequest {{
                    title
                    url
                    createdAt
                    state
                    totalCommentsCount

                    additions  # lines added
                    deletions # lines removed
                    changedFiles

                    repository {{
                        nameWithOwner
                        stargazerCount
                        forkCount
                    }}
                }}
            }}
        }}
    }}
}}"""


class GitHubGQLClient:
    def __init__(self, token):
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
    
    def query_pr(self, author_name: str):
        query = search_pr_query.format(author_name=author_name)

        print(f'query: {query}')
        response = requests.post(
            "https://api.github.com/graphql",
            json={"query": query},
            headers=self.headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Query failed: {response.status_code}")
