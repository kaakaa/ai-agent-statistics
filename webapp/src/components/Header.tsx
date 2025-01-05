import React from 'react';
import { Link } from 'react-router';
import GitHubIcon from '@mui/icons-material/GitHub';

const Header: React.FC = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'flex-end', position: 'fixed', 'top': 0, 'width': '90%', padding: '10px', backgroundColor: '#343a40'}}>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
      <li style={{ margin: '0 10px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#ffffff' }}>Summary</Link>
      </li>
      <li style={{ margin: '0 10px' }}>
        <Link to="/statistics" style={{ textDecoration: 'none', color: '#ffffff' }}>Statistics</Link>
      </li>
      <li style={{ margin: '0 10px' }}>
        <Link to="/details" style={{ textDecoration: 'none', color: '#ffffff' }}>Details</Link>
      </li>
      <li style={{ margin: '0 10px' }}>
        <a href="https://github.com/kaakaa/ai-agent-statistics" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff' }}>
        <GitHubIcon />
        </a>
      </li>
      </ul>
    </nav>
  );
};

export default Header;
