import * as duckdb from 'duckdb-wasm';

async function fetchData() {
    const db = new duckdb.Database();
    const conn = await db.connect();

    const pullRequestQuery = "SELECT * FROM pull_request";
    const repositoryQuery = "SELECT * FROM repository";

    const pullRequests = await conn.query(pullRequestQuery);
    const repositories = await conn.query(repositoryQuery);

    renderData(pullRequests, repositories);
}

function renderData(pullRequests, repositories) {
    const container = document.getElementById('data-container');

    const prTable = document.createElement('table');
    prTable.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>URL</th>
            <th>Created At</th>
            <th>State</th>
            <th>Total Comments</th>
            <th>Additions</th>
            <th>Deletions</th>
            <th>Changed Files</th>
            <th>Repository ID</th>
            <th>Author</th>
        </tr>
    `;
    pullRequests.forEach(pr => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pr.id}</td>
            <td>${pr.title}</td>
            <td><a href="${pr.url}">${pr.url}</a></td>
            <td>${pr.createdAt}</td>
            <td>${pr.state}</td>
            <td>${pr.totalCommentsCount}</td>
            <td>${pr.additions}</td>
            <td>${pr.deletions}</td>
            <td>${pr.changedFiles}</td>
            <td>${pr.repositoryId}</td>
            <td>${pr.author}</td>
        `;
        prTable.appendChild(row);
    });

    const repoTable = document.createElement('table');
    repoTable.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Stargazers</th>
            <th>Forks</th>
        </tr>
    `;
    repositories.forEach(repo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${repo.id}</td>
            <td>${repo.nameWithOwner}</td>
            <td>${repo.stargazerCount}</td>
            <td>${repo.forkCount}</td>
        `;
        repoTable.appendChild(row);
    });

    container.appendChild(prTable);
    container.appendChild(repoTable);
}

document.addEventListener('DOMContentLoaded', fetchData);
