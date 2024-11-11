import React from 'react';
import { useHistory } from 'react-router-dom';

const ClientLedger: React.FC = () => {
  const history = useHistory();
  const clients = [
    { id: '1', name: 'Client A', approvedDate: '2023-10-01', allocatedAmount: 10000 },
    // Add mock data here
  ];

  const handleRowClick = (id: string) => {
    history.push(`/client-ledger/${id}`);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Approved Date</th>
          <th>Allocated Amount</th>
        </tr>
      </thead>
      <tbody>
        {clients.map(client => (
          <tr key={client.id} onClick={() => handleRowClick(client.id)}>
            <td>{client.name}</td>
            <td>{client.approvedDate}</td>
            <td>{client.allocatedAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientLedger;
