import { Client, Stage, Material, Distributor } from '@/types';

export const STAGES: Stage[] = [
  'Lead',
  'Client Engagement',
  'Design & Planning',
  'Work Preparation',
  'Material and Site Work',
  'Execution Phase',
  'Completion',
];

export const SUB_STAGES = {
  'Client Engagement': [
    { id: 'ce1', name: 'Client Proposal', completed: false },
    { id: 'ce2', name: 'Site Visit', completed: false },
    { id: 'ce3', name: 'Client Meeting', completed: false },
  ],
  'Design & Planning': [
    { id: 'dp1', name: 'Concept Designing', completed: false },
    { id: 'dp2', name: '3D Designing/Project Presentation', completed: false },
    { id: 'dp3', name: 'BOQ/Detailed Estimation', completed: false },
  ],
  'Work Preparation': [
    { id: 'wp1', name: 'Work Preparation Start', completed: false },
    { id: 'wp2', name: 'Site Measurement Rechecking', completed: false },
    { id: 'wp3', name: '2D Drawing with Cutting List', completed: false },
  ],
  'Material and Site Work': [
    { id: 'ms1', name: 'Gypsum Work Start', completed: false },
    { id: 'ms2', name: 'Gypsum Work End', completed: false },
    { id: 'ms3', name: 'Material Purchase/Selection', completed: false },
    { id: 'ms4', name: 'Work Preparation End', completed: false },
    { id: 'ms5', name: 'Scheduled Work Start', completed: false },
    { id: 'ms6', name: 'Scheduled Work End', completed: false },
  ],
  'Execution Phase': [
    { id: 'ep1', name: 'On-Site Work Start', completed: false },
    { id: 'ep2', name: 'On-Site Work End', completed: false },
    { id: 'ep3', name: 'Factory Work Start', completed: false },
    { id: 'ep4', name: 'Factory Work End', completed: false },
    { id: 'ep5', name: 'Site Execution Start', completed: false },
    { id: 'ep6', name: 'Site Execution End', completed: false },
  ],
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    stage: 'Lead',
    subStages: [],
    address: '789 Residential Lane',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    phone: '(555) 234-5678',
    stage: 'Client Engagement',
    subStages: SUB_STAGES['Client Engagement'],
    address: '123 Design Street',
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    phone: '(555) 345-6789',
    stage: 'Design & Planning',
    subStages: SUB_STAGES['Design & Planning'],
    budget: 75000,
    approvalDate: '2024-03-15',
    address: '456 Interior Avenue',
  },
];

export const MOCK_MATERIALS: Material[] = [
  { id: 'm1', name: 'Premium Hardwood Flooring', category: 'Flooring' },
  { id: 'm2', name: 'Marble Countertop', category: 'Countertops' },
  { id: 'm3', name: 'LED Recessed Lighting', category: 'Lighting' },
  { id: 'm4', name: 'Designer Wallpaper', category: 'Wall Coverings' },
  { id: 'm5', name: 'Custom Cabinetry', category: 'Storage' },
];

export const MOCK_DISTRIBUTORS: Distributor[] = [
  {
    id: 'd1',
    name: 'ABC Supplies',
    contact: 'John Smith',
    phone: '(555) 111-2222',
    email: 'john@abcsupplies.com',
  },
  {
    id: 'd2',
    name: 'Design Materials Co.',
    contact: 'Lisa Wong',
    phone: '(555) 222-3333',
    email: 'lisa@designmaterials.com',
  },
  {
    id: 'd3',
    name: 'Interior Essentials',
    contact: 'Mark Johnson',
    phone: '(555) 333-4444',
    email: 'mark@interioressentials.com',
  },
  {
    id: 'd4',
    name: 'Premium Furnishings',
    contact: 'Sarah Miller',
    phone: '(555) 444-5555',
    email: 'sarah@premiumfurnishings.com',
  },
];