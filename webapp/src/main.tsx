import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import './index.css'
import PullRequestsTable from './components/PullRequests.tsx'
import ChartPage from './components/ChartPage.tsx';

const base = import.meta.env.BASE_URL

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router basename={base}>
      <Routes>
        <Route path="/" element={<PullRequestsTable />} />
        <Route path="/chart" element={<ChartPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
