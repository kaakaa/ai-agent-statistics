import React from 'react';
import { Link } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';

const Header: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/statistics">Statistics</Link>
        </li>
        <li>
          <Link to="/details">Details</Link>
        </li>
        <li>
          <a href="https://github.com/kaakaa/ai-agent-statistics" target="_blank" rel="noopener noreferrer">
            <GitHubIcon />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
