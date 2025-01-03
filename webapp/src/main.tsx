import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css'
import PullRequestsTable from './components/PullRequests.tsx'
import ChartPage from './components/ChartPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={PullRequestsTable} />
        <Route path="/chart" component={ChartPage} />
      </Switch>
    </Router>
  </StrictMode>,
)
