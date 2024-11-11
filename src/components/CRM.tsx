import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Client {
  id: string;
  name: string;
  stage: string;
}

const initialClients: Client[] = [{ id: '1', name: 'Client A', stage: 'Lead' }];

const CRM: React.FC = () => {
  const [clients, setClients] = useState(initialClients);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updatedClients = [...clients];
    const [movedClient] = updatedClients.splice(result.source.index, 1);
    movedClient.stage = result.destination.droppableId;
    updatedClients.splice(result.destination.index, 0, movedClient);
    setClients(updatedClients);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="stages">
        {['Lead', 'Client Engagement', 'Design & Planning', 'Work Preparation', 'Execution Phase', 'Completion'].map((stage) => (
          <Droppable droppableId={stage} key={stage}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="stage">
                <h3>{stage}</h3>
                {clients.filter(client => client.stage === stage).map((client, index) => (
                  <Draggable key={client.id} draggableId={client.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="client-card">
                        {client.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default CRM;
