// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import CrmPage from '@/components/CRM/CrmPage';
import ClientLedgerPage from '@/pages/ClientLedgerPage'; // Ensure this exists and exports properly
import ClientTable from '@/components/ClientLedger/ClientTable'; // New component for displaying all clients

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/crm" />} />
            <Route path="/crm" element={<CrmPage />} />
            <Route path="/ledger" element={<ClientTable />} /> {/* Base route for ledger */}
            <Route path="/ledger/:clientId" element={<ClientLedgerPage />} /> {/* Detailed ledger view */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
