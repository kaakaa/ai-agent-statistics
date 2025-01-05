import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import './index.css'
import PullRequestsTable from './components/PullRequests.tsx'
import StatisticsPage from './components/Statistics.tsx';
import SummaryPage from './components/Summary.tsx';
import Header from './components/Header.tsx';

const base = import.meta.env.BASE_URL

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router basename={base}>
      <Header />
      <Routes>
        <Route path="/" element={<SummaryPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/details" element={<PullRequestsTable />} />
      </Routes>
    </Router>
  </StrictMode>,
)
