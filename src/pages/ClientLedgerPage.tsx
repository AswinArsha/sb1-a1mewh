// src/pages/ClientLedgerPage.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockData from '../mockData';
import { Client, Ledger } from '../types';
import ClientTable from '../components/ClientLedger/ClientTable';
import LedgerDetail from '../components/ClientLedger/LedgerDetail';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const ClientLedgerPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  // If clientId is present, show LedgerDetail, else show ClientTable
  if (clientId) {
    const client = mockData.clients.find((c) => c.id === clientId);
    const ledger = mockData.ledgers.find((l) => l.clientId === clientId);

    if (!client) {
      return (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold">Client Not Found</h2>
          <Button onClick={() => navigate('/ledger')} className="mt-4">
            <X className="h-4 w-4 mr-2" />
            Back to Client Ledger
          </Button>
        </div>
      );
    }

    return <LedgerDetail client={client} ledger={ledger} onBack={() => navigate('/ledger')} />;
  }

  return <ClientTable clients={mockData.clients} onSelectClient={(id) => navigate(`/ledger/${id}`)} />;
};

export default ClientLedgerPage;
