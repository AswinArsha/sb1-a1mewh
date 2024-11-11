// src/mockData.ts

import { Client, Ledger, Payment, Material, Labor, LaborSet } from './types';

const mockClients: Client[] = [
  { id: '1', name: 'Alice Smith', stage: 'Design & Planning', approved: true },
  { id: '2', name: 'Bob Johnson', stage: 'Work Preparation', approved: true },
  { id: '3', name: 'Charlie Davis', stage: 'Execution Phase', approved: true },
];

const mockLedgers: Ledger[] = [
  {
    clientId: '1',
    payments: [
      { id: 'p1', amount: 5000, mode: 'Cash', date: '2024-01-15' },
      { id: 'p2', amount: 2000, mode: 'Credit', date: '2024-02-20' },
    ],
    materials: [
      { id: 'm1', name: 'Wood Panels', quantity: 10, distributor: 'Distributor A', amount: 3000, date: '2024-03-10' },
      { id: 'm2', name: 'Paint', quantity: 5, distributor: 'Distributor B', amount: 1500, date: '2024-03-15' },
    ],
    labors: [
      { id: 'l1', name: 'John Doe', role: 'Main', rate: 2000 },
      { id: 'l2', name: 'Jane Doe', role: 'Helper', rate: 1000 },
    ],
    laborSets: [
      {
        id: 'ls1',
        setName: 'Installation Team',
        laborers: [
          { id: 'l3', name: 'Mike Ross', role: 'Main', rate: 2500 },
          { id: 'l4', name: 'Rachel Zane', role: 'Helper', rate: 1200 },
        ],
      },
    ],
  },
  // Add more ledger entries as needed
];

const mockData = {
  clients: mockClients,
  ledgers: mockLedgers,
};

export default mockData;
