// src/components/CRM/CRMBoard.tsx

import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { Client, MainStage, SubStageMap } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@shadcn/ui'; // Replace with actual ShadCN Button component import
import { Check, Eye } from 'lucide-react';

interface CRMBoardProps {
  newClient?: Client;
}

const initialSubStages: SubStageMap = {
  'Client Engagement': ['Client Proposal', 'Site Visit', 'Client Meeting'],
  'Design & Planning': [
    'Concept Designing',
    '3D Designing/Project Presentation',
    'BOQ/Detailed Estimation',
  ],
  'Work Preparation': [
    'Work Preparation Start',
    'Site Measurement Rechecking',
    '2D Drawing with Cutting List',
  ],
  'Material and Site Work': [
    'Gypsum Work Start',
    'Gypsum Work End',
    'Material Purchase/Selection',
    'Work Preparation End',
    'Scheduled Work Start',
    'Scheduled Work End',
  ],
  'Execution Phase': [
    'On-Site Work Start',
    'On-Site Work End',
    'Factory Work Start',
    'Factory Work End',
    'Site Execution Start',
    'Site Execution End',
  ],
};

const mainStages: MainStage[] = [
  'Lead',
  'Client Engagement',
  'Design & Planning',
  'Work Preparation',
  'Material and Site Work',
  'Execution Phase',
  'Completion',
];

const CRMBoard: React.FC<CRMBoardProps> = ({ newClient }) => {
  // Define the client structure with subStageCompletion
  interface ClientWithSubStages extends Client {
    subStageCompletion: { [key: string]: boolean };
    approved: boolean;
  }

  // Initialize clients state
  const [clients, setClients] = useState<{
    [key in MainStage]: ClientWithSubStages[];
  }>({
    Lead: [
      {
        id: uuidv4(),
        name: 'Client A',
        stage: 'Lead',
        subStageCompletion: {},
        approved: false,
      },
      {
        id: uuidv4(),
        name: 'Client B',
        stage: 'Lead',
        subStageCompletion: {},
        approved: false,
      },
    ],
    'Client Engagement': [],
    'Design & Planning': [],
    'Work Preparation': [],
    'Material and Site Work': [],
    'Execution Phase': [],
    Completion: [],
  });

  // Handle adding new clients
  useEffect(() => {
    if (newClient) {
      const clientWithSubStages: ClientWithSubStages = {
        ...newClient,
        subStageCompletion: {},
        approved: false,
      };
      setClients((prev) => ({
        ...prev,
        Lead: [...prev.Lead, clientWithSubStages],
      }));
    }
  }, [newClient]);

  // Handle drag end
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) return;

    const sourceStage = source.droppableId as MainStage;
    const destStage = destination.droppableId as MainStage;

    // If dropped in the same place, do nothing
    if (
      sourceStage === destStage &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceClients = Array.from(clients[sourceStage]);
    const destClients = Array.from(clients[destStage]);

    const [movedClient] = sourceClients.splice(source.index, 1);

    // Validate if the client can be moved to the destination stage
    if (canMoveToStage(movedClient, destStage)) {
      movedClient.stage = destStage;

      // If moving to 'Design & Planning', set approved to false
      if (destStage === 'Design & Planning') {
        movedClient.approved = false;
      }

      destClients.splice(destination.index, 0, movedClient);

      setClients({
        ...clients,
        [sourceStage]: sourceClients,
        [destStage]: destClients,
      });
    } else {
      // Invalid move, you can show a notification or ignore
      alert(
        `Cannot move to ${destStage}. Ensure all sub-stages are completed.`
      );
    }
  };

  // Function to check if a client can be moved to a stage
  const canMoveToStage = (
    client: ClientWithSubStages,
    targetStage: MainStage
  ): boolean => {
    const currentStageIndex = mainStages.indexOf(client.stage);
    const targetStageIndex = mainStages.indexOf(targetStage);

    // Prevent moving to a previous stage
    if (targetStageIndex < currentStageIndex) return false;

    // If moving to the same stage, allow
    if (targetStage === client.stage) return true;

    // If moving to the next stage, ensure all sub-stages of current stage are completed
    if (targetStageIndex === currentStageIndex + 1) {
      const subStages = initialSubStages[client.stage];
      if (subStages) {
        // Check if all sub-stages are completed
        return subStages.every(
          (sub) => client.subStageCompletion[sub] === true
        );
      }
      // If no sub-stages, allow
      return true;
    }

    // For moving more than one stage ahead, ensure intermediate stages are completed
    if (targetStageIndex > currentStageIndex + 1) {
      for (let i = currentStageIndex; i < targetStageIndex; i++) {
        const stage = mainStages[i];
        const subStages = initialSubStages[stage];
        if (subStages) {
          const clientsInStage = clients[stage].filter(
            (c) => c.id === client.id
          );
          if (
            clientsInStage.length === 0 ||
            !subStages.every(
              (sub) =>
                clientsInStage[0].subStageCompletion[sub] === true
            )
          ) {
            return false;
          }
        }
      }
      return true;
    }

    return false;
  };

  // Handle Approve Button Click
  const handleApprove = (clientId: string, stage: MainStage) => {
    setClients((prev) => {
      const updatedStageClients = prev[stage].map((client) =>
        client.id === clientId ? { ...client, approved: true } : client
      );
      return {
        ...prev,
        [stage]: updatedStageClients,
      };
    });
  };

  // Handle View Ledger Click
  const handleViewLedger = (client: ClientWithSubStages) => {
    // Implement navigation to ledger page
    // For example, using react-router's useNavigate
    // navigate(`/ledger/${client.id}`);
    console.log('View Ledger for:', client.name);
  };

  // Render Client Card
  const renderClientCard = (
    client: ClientWithSubStages,
    index: number,
    stage: MainStage
  ) => {
    return (
      <Draggable key={client.id} draggableId={client.id} index={index}>
        {(provided, snapshot) => (
          <div
            className={`bg-white p-4 mb-2 rounded shadow ${
              snapshot.isDragging ? 'bg-blue-50' : ''
            }`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold">{client.name}</p>
              {stage === 'Design & Planning' && (
                <>
                  {!client.approved ? (
                    <button
                      onClick={() => handleApprove(client.id, stage)}
                      className="flex items-center px-2 py-1 bg-green-500 text-white rounded text-sm"
                    >
                      <Check className="mr-1" size={16} />
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleViewLedger(client)}
                      className="flex items-center px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      <Eye className="mr-1" size={16} />
                      View Ledger
                    </button>
                  )}
                </>
              )}
            </div>
            {/* Optionally, display sub-stage progress */}
            {initialSubStages[stage] && (
              <div className="mt-2">
                <p className="text-sm font-medium">Sub-Stages:</p>
                <ul className="list-disc list-inside text-xs">
                  {initialSubStages[stage]?.map((subStage) => (
                    <li
                      key={subStage}
                      className={
                        client.subStageCompletion[subStage]
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      {subStage}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 overflow-x-auto">
        {mainStages.map((stage) => (
          <Droppable droppableId={stage} key={stage}>
            {(provided, snapshot) => (
              <div
                className={`w-72 flex-shrink-0 bg-gray-100 p-4 rounded ${
                  snapshot.isDraggingOver ? 'bg-blue-100' : ''
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h3 className="text-xl font-bold mb-4 text-center">
                  {stage}
                </h3>
                {clients[stage].map((client, index) =>
                  renderClientCard(client, index, stage)
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default CRMBoard;
