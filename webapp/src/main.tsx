import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PullRequestsTable from './components/PullRequests.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PullRequestsTable />
  </StrictMode>,
)
