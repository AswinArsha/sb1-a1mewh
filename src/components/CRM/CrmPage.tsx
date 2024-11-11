// src/components/CRM/CrmPage.tsx

import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { AddClientDialog } from '@/components/AddClientDialog';
import { ClientCard } from '@/components/ClientCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input"

import { v4 as uuidv4 } from 'uuid';
import { Eye } from 'lucide-react';

import { Client, Stage, SubStage } from '@/types';

const initialStages: Stage[] = [
  {
    id: 'lead',
    name: 'Lead',
    subStages: [],
  },
  {
    id: 'client-engagement',
    name: 'Client Engagement',
    subStages: [
      { id: 'client-proposal', name: 'Client Proposal', completed: false },
      { id: 'site-visit', name: 'Site Visit', completed: false },
      { id: 'client-meeting', name: 'Client Meeting', completed: false },
    ],
  },
  {
    id: 'design-planning',
    name: 'Design & Planning',
    subStages: [
      { id: 'concept-designing', name: 'Concept Designing', completed: false },
      { id: '3d-designing', name: '3D Designing/Project Presentation', completed: false },
      { id: 'boq-estimation', name: 'BOQ/Detailed Estimation', completed: false },
    ],
  },
  {
    id: 'work-preparation',
    name: 'Work Preparation',
    subStages: [
      { id: 'work-prep-start', name: 'Work Preparation Start', completed: false },
      { id: 'site-measurement', name: 'Site Measurement Rechecking', completed: false },
      { id: '2d-drawing', name: '2D Drawing with Cutting List', completed: false },
    ],
  },
  {
    id: 'material-site-work',
    name: 'Material and Site Work',
    subStages: [
      { id: 'gypsum-work-start', name: 'Gypsum Work Start', completed: false },
      { id: 'gypsum-work-end', name: 'Gypsum Work End', completed: false },
      { id: 'material-purchase', name: 'Material Purchase/Selection', completed: false },
      { id: 'work-prep-end', name: 'Work Preparation End', completed: false },
      { id: 'scheduled-work-start', name: 'Scheduled Work Start', completed: false },
      { id: 'scheduled-work-end', name: 'Scheduled Work End', completed: false },
    ],
  },
  {
    id: 'execution-phase',
    name: 'Execution Phase',
    subStages: [
      { id: 'onsite-work-start', name: 'On-Site Work Start', completed: false },
      { id: 'onsite-work-end', name: 'On-Site Work End', completed: false },
      { id: 'factory-work-start', name: 'Factory Work Start', completed: false },
      { id: 'factory-work-end', name: 'Factory Work End', completed: false },
      { id: 'site-execution-start', name: 'Site Execution Start', completed: false },
      { id: 'site-execution-end', name: 'Site Execution End', completed: false },
    ],
  },
  {
    id: 'completion',
    name: 'Completion',
    subStages: [],
  },
];

const initialClients: Client[] = [
  {
    id: 'client-1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '123-456-7890',
    address: '123 Main St, City, Country',
    stage: 'design-planning',
    subStages: [
      { id: 'concept-designing', name: 'Concept Designing', completed: true },
      { id: '3d-designing', name: '3D Designing/Project Presentation', completed: true },
      { id: 'boq-estimation', name: 'BOQ/Detailed Estimation', completed: true },
    ],
    approved: false,
    remark: '',
  },
  {
    id: 'client-2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '987-654-3210',
    address: '456 Elm St, City, Country',
    stage: 'client-engagement',
    subStages: [
      { id: 'client-proposal', name: 'Client Proposal', completed: true },
      { id: 'site-visit', name: 'Site Visit', completed: false },
      { id: 'client-meeting', name: 'Client Meeting', completed: false },
    ],
    approved: false,
    remark: '',
  },
  {
    id: 'client-3',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    phone: '555-555-5555',
    address: '789 Oak St, City, Country',
    stage: 'work-preparation',
    subStages: [
      { id: 'work-prep-start', name: 'Work Preparation Start', completed: true },
      { id: 'site-measurement', name: 'Site Measurement Rechecking', completed: true },
      { id: '2d-drawing', name: '2D Drawing with Cutting List', completed: false },
    ],
    approved: false,
    remark: '',
  },
];

export default function CrmPage() {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [remark, setRemark] = useState<string>('');

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const client = clients.find((c) => c.id === draggableId);
    if (!client) return;

    const sourceStage = stages.find((s) => s.id === source.droppableId);
    const destStage = stages.find((s) => s.id === destination.droppableId);

    if (!sourceStage || !destStage) return;

    // Check if all sub-stages are completed for stages other than 'lead'
    if (sourceStage.id !== 'lead') {
      const allSubStagesCompleted = sourceStage.subStages.every((subStage) =>
        client.subStages.find((s) => s.id === subStage.id)?.completed
      );

      if (!allSubStagesCompleted) {
        alert('Cannot move client. Not all sub-stages are completed.');
        return;
      }
    }

    // Reset subStages to the new stage's subStages
    const newSubStages = destStage.subStages.map((subStage) => ({
      ...subStage,
      completed: false,
    }));

    const updatedClients = clients.map((c) => {
      if (c.id === draggableId) {
        return { ...c, stage: destStage.id, subStages: newSubStages, approved: false };
      }
      return c;
    });

    setClients(updatedClients);
  };

  const handleAddClient = (clientData: Omit<Client, 'id' | 'stage' | 'subStages' | 'approved'>) => {
    const newClient: Client = {
      id: `client-${uuidv4()}`,
      ...clientData,
      stage: 'lead',
      subStages: [],
      approved: false,
      remark: '',
    };
    setClients([...clients, newClient]);
  };

  const handleApproveClient = (clientId: string) => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        return { ...client, approved: true };
      }
      return client;
    });
    setClients(updatedClients);
  };

  const openClientDialog = (client: Client) => {
    setSelectedClient(client);
    setRemark(client.remark || '');
  };

  const closeClientDialog = () => {
    if (selectedClient) {
      setClients(
        clients.map((client) =>
          client.id === selectedClient.id ? { ...client, remark } : client
        )
      );
    }
    setSelectedClient(null);
    setRemark('');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">CRM Pipeline</h1>
          <p className="text-muted-foreground">
            Manage and track client projects through stages
          </p>
        </div>
        <AddClientDialog onAddClient={handleAddClient} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <h2 className="font-semibold mb-2 text-center">{stage.name}</h2>
              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-gray-100 p-4 rounded-md min-h-[200px] ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    }`}
                  >
                    {clients
                      .filter((client) => client.stage === stage.id)
                      .map((client, index) => (
                        <Draggable key={client.id} draggableId={client.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-4 ${snapshot.isDragging ? 'bg-blue-100' : 'bg-white'} rounded-md shadow`}
                              onClick={() => openClientDialog(client)}
                            >
                              <ClientCard
                                client={client}
                                onApprove={handleApproveClient}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Dialog for Client Details */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={closeClientDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedClient.name} - Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedClient.email}
                  onChange={(e) =>
                    setClients(
                      clients.map((client) =>
                        client.id === selectedClient.id
                          ? { ...client, email: e.target.value }
                          : client
                      )
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={selectedClient.phone}
                  onChange={(e) =>
                    setClients(
                      clients.map((client) =>
                        client.id === selectedClient.id
                          ? { ...client, phone: e.target.value }
                          : client
                      )
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={selectedClient.address}
                  onChange={(e) =>
                    setClients(
                      clients.map((client) =>
                        client.id === selectedClient.id
                          ? { ...client, address: e.target.value }
                          : client
                      )
                    )
                  }
                  className="col-span-3"
                />
              </div>
              {stages.find((s) => s.id === selectedClient.stage)?.subStages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sub-Stages</h3>
                  {stages
                    .find((s) => s.id === selectedClient.stage)
                    ?.subStages.map((subStage) => (
                      <div key={subStage.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={selectedClient.subStages.find((s) => s.id === subStage.id)?.completed || false}
                          onChange={() =>
                            setClients(
                              clients.map((client) =>
                                client.id === selectedClient.id
                                  ? {
                                      ...client,
                                      subStages: client.subStages.map((s) =>
                                        s.id === subStage.id
                                          ? { ...s, completed: !s.completed }
                                          : s
                                      ),
                                    }
                                  : client
                              )
                            )
                          }
                          className="mr-2"
                        />
                        <span>{subStage.name}</span>
                      </div>
                    ))}
                </div>
              )}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="remark" className="text-right">
                  Remark
                </Label>
                <Textarea
                  id="remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="col-span-3"
                  placeholder="Add remarks here..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeClientDialog}>
                Cancel
              </Button>
              <Button onClick={closeClientDialog}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
