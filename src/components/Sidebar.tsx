import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => (
  <div className="sidebar">
    <nav>
      <ul>
        <li><Link to="/crm">CRM</Link></li>
        <li><Link to="/client-ledger">Client Ledger</Link></li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
