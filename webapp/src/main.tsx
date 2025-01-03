import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import './index.css'
import PullRequestsTable from './components/PullRequests.tsx'
import ChartPage from './components/ChartPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<PullRequestsTable />} />
        <Route path="/chart" element={<ChartPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
