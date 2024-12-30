import pytest
from pydantic_core import from_json
from ai_agent_statistics.model import PullRequest

@pytest.fixture
def pr_json():
    return {
        'title': 'sample_title',
        'url': 'https://example.com',
        'createdAt': '2021-01-01T00:00:00Z',
    }

def test_create_user_from_json(pr_json):
    pr = PullRequest.model_validate(pr_json)

    assert pr.title == 'sample_title'
    assert pr.url == 'https://example.com'
    assert pr.createdAt == '2021-01-01T00:00:00Z'
