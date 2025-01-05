import React from 'react';
import { Link } from 'react-router';
import GitHubIcon from '@mui/icons-material/GitHub';

const Header: React.FC = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        <li style={{ margin: '0 10px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>Home</Link>
        </li>
        <li style={{ margin: '0 10px' }}>
          <Link to="/statistics" style={{ textDecoration: 'none', color: '#007bff' }}>Statistics</Link>
        </li>
        <li style={{ margin: '0 10px' }}>
          <Link to="/details" style={{ textDecoration: 'none', color: '#007bff' }}>Details</Link>
        </li>
        <li style={{ margin: '0 10px' }}>
          <a href="https://github.com/kaakaa/ai-agent-statistics" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
            <GitHubIcon />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
