// src/components/CRM/CrmPage.tsx

import React, { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd'
import {
  Button
} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { v4 as uuidv4 } from 'uuid'
import { Check, Eye, PlusCircle } from 'lucide-react'

// Define types for our data structure
type SubStage = {
  id: string
  name: string
}

type Stage = {
  id: string
  name: string
  subStages: SubStage[]
}

type Client = {
  id: string
  name: string
  stage: string
  completedSubStages: string[]
  approved: boolean
  remark?: string
}

// Initial stages data
const initialStages: Stage[] = [
  {
    id: 'lead',
    name: 'Lead',
    subStages: []
  },
  {
    id: 'client-engagement',
    name: 'Client Engagement',
    subStages: [
      { id: 'client-proposal', name: 'Client Proposal' },
      { id: 'site-visit', name: 'Site Visit' },
      { id: 'client-meeting', name: 'Client Meeting' }
    ]
  },
  {
    id: 'design-planning',
    name: 'Design & Planning',
    subStages: [
      { id: 'concept-designing', name: 'Concept Designing' },
      { id: '3d-designing', name: '3D Designing/Project Presentation' },
      { id: 'boq-estimation', name: 'BOQ/Detailed Estimation' }
    ]
  },
  {
    id: 'work-preparation',
    name: 'Work Preparation',
    subStages: [
      { id: 'work-prep-start', name: 'Work Preparation Start' },
      { id: 'site-measurement', name: 'Site Measurement Rechecking' },
      { id: '2d-drawing', name: '2D Drawing with Cutting List' }
    ]
  },
  {
    id: 'material-site-work',
    name: 'Material and Site Work',
    subStages: [
      { id: 'gypsum-work-start', name: 'Gypsum Work Start' },
      { id: 'gypsum-work-end', name: 'Gypsum Work End' },
      { id: 'material-purchase', name: 'Material Purchase/Selection' },
      { id: 'work-prep-end', name: 'Work Preparation End' },
      { id: 'scheduled-work-start', name: 'Scheduled Work Start' },
      { id: 'scheduled-work-end', name: 'Scheduled Work End' }
    ]
  },
  {
    id: 'execution-phase',
    name: 'Execution Phase',
    subStages: [
      { id: 'onsite-work-start', name: 'On-Site Work Start' },
      { id: 'onsite-work-end', name: 'On-Site Work End' },
      { id: 'factory-work-start', name: 'Factory Work Start' },
      { id: 'factory-work-end', name: 'Factory Work End' },
      { id: 'site-execution-start', name: 'Site Execution Start' },
      { id: 'site-execution-end', name: 'Site Execution End' }
    ]
  },
  {
    id: 'completion',
    name: 'Completion',
    subStages: []
  }
]

// Dummy clients data
const initialClients: Client[] = [
  {
    id: 'client-1',
    name: 'Alice Smith',
    stage: 'design-planning',
    completedSubStages: ['concept-designing', '3d-designing', 'boq-estimation'],
    approved: false
  },
  {
    id: 'client-2',
    name: 'Bob Johnson',
    stage: 'client-engagement',
    completedSubStages: ['client-proposal'],
    approved: false
  },
  {
    id: 'client-3',
    name: 'Charlie Davis',
    stage: 'work-preparation',
    completedSubStages: ['work-prep-start', 'site-measurement'],
    approved: false
  }
]

export default function CrmPage() {
  const [stages, setStages] = useState<Stage[]>(initialStages)
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [newClientName, setNewClientName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [remark, setRemark] = useState('')

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const client = clients.find(c => c.id === draggableId)
    if (!client) return

    const sourceStage = stages.find(s => s.id === source.droppableId)
    const destStage = stages.find(s => s.id === destination.droppableId)

    if (!sourceStage || !destStage) return

    // Check if all sub-stages are completed for stages other than 'lead'
    if (sourceStage.id !== 'lead') {
      const allSubStagesCompleted = sourceStage.subStages.every(subStage =>
        client.completedSubStages.includes(subStage.id)
      )

      if (!allSubStagesCompleted) {
        alert('Cannot move client. Not all sub-stages are completed.')
        return
      }
    }

    // Update client's stage
    const newClients = clients.map(c => {
      if (c.id === draggableId) {
        // If moving to 'design-planning', reset approval status
        if (destStage.id === 'design-planning') {
          return { ...c, stage: destStage.id, approved: false }
        }
        return { ...c, stage: destStage.id }
      }
      return c
    })

    setClients(newClients)
  }

  const addClient = () => {
    if (newClientName.trim() !== '') {
      const newClient: Client = {
        id: `client-${uuidv4()}`,
        name: newClientName,
        stage: 'lead',
        completedSubStages: [],
        approved: false
      }
      setClients([...clients, newClient])
      setNewClientName('')
      setIsDialogOpen(false)
    }
  }

  const toggleSubStage = (clientId: string, subStageId: string) => {
    setClients(clients.map(client => {
      if (client.id === clientId) {
        const updatedCompletedSubStages = client.completedSubStages.includes(subStageId)
          ? client.completedSubStages.filter(id => id !== subStageId)
          : [...client.completedSubStages, subStageId]
        return { ...client, completedSubStages: updatedCompletedSubStages }
      }
      return client
    }))
  }

  const approveClient = (clientId: string) => {
    setClients(clients.map(client => {
      if (client.id === clientId) {
        return { ...client, approved: true }
      }
      return client
    }))
  }

  const viewLedger = (clientId: string) => {
    alert(`Viewing ledger for client ${clientId}`)
    // Implement ledger view logic here, e.g., navigate to the ledger page
  }

  const openClientDialog = (client: Client) => {
    setSelectedClient(client)
    setRemark(client.remark || '')
  }

  const closeClientDialog = () => {
    setSelectedClient(null)
    setRemark('')
  }

  const saveClientRemark = () => {
    if (selectedClient) {
      setClients(clients.map(client => {
        if (client.id === selectedClient.id) {
          return { ...client, remark }
        }
        return client
      }))
      closeClientDialog()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">CRM Pipeline</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter client name"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addClient} disabled={newClientName.trim() === ''}>
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <h2 className="font-semibold mb-2 text-center">{stage.name}</h2>
              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <ScrollArea className="h-[70vh]">
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 rounded-md min-h-[200px] ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-100'
                      } transition-colors duration-200`}
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
                                className={`bg-white p-4 mb-4 rounded-md shadow cursor-pointer transition-transform duration-200 ${
                                  snapshot.isDragging ? 'transform scale-105 bg-blue-100' : ''
                                }`}
                                onClick={() => openClientDialog(client)}
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="font-semibold">{client.name}</h3>
                                  {client.approved && <Check className="text-green-500" />}
                                </div>
                                {stage.id === 'design-planning' && client.approved && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      viewLedger(client.id)
                                    }}
                                    className="mt-2 w-full flex items-center justify-center"
                                    size="sm"
                                    variant="secondary"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Ledger
                                  </Button>
                                )}
                                {stage.id === 'design-planning' && !client.approved && (
                                  stage.subStages.every(subStage =>
                                    client.completedSubStages.includes(subStage.id)
                                  ) && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        approveClient(client.id)
                                      }}
                                      className="mt-2 w-full"
                                      size="sm"
                                      variant="primary"
                                    >
                                      Approve
                                    </Button>
                                  )
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </ScrollArea>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Dialog for Client Details */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => closeClientDialog()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedClient.name} - Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-semibold mb-2">Sub-Stages</h3>
                {stages.find(s => s.id === selectedClient.stage)?.subStages.map((subStage) => (
                  <div key={subStage.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedClient.completedSubStages.includes(subStage.id)}
                      onChange={() => toggleSubStage(selectedClient.id, subStage.id)}
                      className="mr-2"
                    />
                    <span>{subStage.name}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="remark" className="text-right">
                  Remark
                </Label>
                <Textarea
                  id="remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter remarks here..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeClientDialog}>
                Cancel
              </Button>
              <Button onClick={saveClientRemark} disabled={!selectedClient}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
