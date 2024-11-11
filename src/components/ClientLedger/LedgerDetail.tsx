// src/pages/ClientLedgerPage.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertCircle, Plus, X } from 'lucide-react';

// Define necessary interfaces
interface ClientData {
  name: string;
  email: string;
  contact: string;
  approvedDate: string;
  allocatedBudget: number;
  remainingBudget: number;
}

interface Transaction {
  id: number;
  type: 'payment' | 'material' | 'labor';
  amount?: number; // For payments
  mode?: string; // For payments
  name?: string; // For materials and labor
  quantity?: number; // For materials
  cost?: number; // For materials and labor
  distributor?: string; // For materials
  role?: string; // For labor
  rate?: number; // For labor
  hours?: number; // For labor
  date: string;
}

interface Material {
  id: number;
  name: string;
  unitCost: number;
}

interface Distributor {
  id: number;
  name: string;
}

interface Laborer {
  id: number;
  name: string;
  defaultRole: string;
  defaultRate: number;
}

interface LaborSet {
  id: number;
  name: string;
  laborers: Laborer[];
}

// Mock data
const initialClientData: ClientData = {
  name: "Rahul Sharma",
  email: "rahul@example.com",
  contact: "+91 98765 43210",
  approvedDate: "2023-01-01",
  allocatedBudget: 1000000,
  remainingBudget: 750000,
};

const initialTransactions: Transaction[] = [
  { id: 1, type: 'payment', amount: 250000, mode: 'Check', date: '2023-01-15' },
  { id: 2, type: 'material', name: 'Cement', quantity: 100, cost: 50000, distributor: 'BuildMart', date: '2023-02-01' },
  { id: 3, type: 'labor', name: 'Amit Kumar', role: 'Main', rate: 500, hours: 40, cost: 20000, date: '2023-02-15' },
];

const mockMaterials: Material[] = [
  { id: 1, name: 'Cement', unitCost: 500 },
  { id: 2, name: 'Steel', unitCost: 1000 },
  { id: 3, name: 'Bricks', unitCost: 10 },
];

const mockDistributors: Distributor[] = [
  { id: 1, name: 'BuildMart' },
  { id: 2, name: 'Steel Suppliers Ltd.' },
  { id: 3, name: 'Brick & Mortar Co.' },
];

const mockLaborers: Laborer[] = [
  { id: 1, name: 'Amit Kumar', defaultRole: 'Main', defaultRate: 500 },
  { id: 2, name: 'Raj Singh', defaultRole: 'Helper', defaultRate: 300 },
  { id: 3, name: 'Priya Patel', defaultRole: 'Main', defaultRate: 550 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function ClientLedgerPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  // State management
  const [clientData, setClientData] = useState<ClientData>(initialClientData);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [selectedLaborers, setSelectedLaborers] = useState<Laborer[]>([]);
  const [laborSets, setLaborSets] = useState<LaborSet[]>([]);
  const [isLaborSetDialogOpen, setIsLaborSetDialogOpen] = useState(false);
  const [newLaborSet, setNewLaborSet] = useState<{ name: string; laborers: Laborer[] }>({ name: '', laborers: [] });

  // Handle adding a payment
  const addPayment = (amount: number, mode: string) => {
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      type: 'payment',
      amount,
      mode,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([...transactions, newTransaction]);
    setClientData({
      ...clientData,
      remainingBudget: clientData.remainingBudget + amount,
    });
  };

  // Handle adding material purchase
  const addMaterialPurchase = (materials: Material[], distributor: string) => {
    const newTransactions: Transaction[] = materials.map((material, index) => ({
      id: transactions.length + index + 1,
      type: 'material',
      name: material.name,
      quantity: material.quantity,
      cost: material.quantity * material.unitCost,
      distributor,
      date: new Date().toISOString().split('T')[0],
    }));
    const totalCost = newTransactions.reduce((sum, t) => sum + (t.cost || 0), 0);
    setTransactions([...transactions, ...newTransactions]);
    setClientData({
      ...clientData,
      remainingBudget: clientData.remainingBudget - totalCost,
    });
    setSelectedMaterials([]);
  };

  // Handle adding labor
  const addLabor = (laborers: Laborer[]) => {
    const newTransactions: Transaction[] = laborers.map((laborer, index) => {
      const cost = laborer.defaultRate * 40; // Assuming 40 hours per laborer for demo
      return {
        id: transactions.length + index + 1,
        type: 'labor',
        name: laborer.name,
        role: laborer.defaultRole,
        rate: laborer.defaultRate,
        hours: 40, // Assuming 40 hours for demo
        cost,
        date: new Date().toISOString().split('T')[0],
      };
    });
    const totalCost = newTransactions.reduce((sum, t) => sum + (t.cost || 0), 0);
    setTransactions([...transactions, ...newTransactions]);
    setClientData({
      ...clientData,
      remainingBudget: clientData.remainingBudget - totalCost,
    });
    setSelectedLaborers([]);
  };

  // Handle adding a labor set
  const addLaborSet = () => {
    setLaborSets([...laborSets, { id: laborSets.length + 1, name: newLaborSet.name, laborers: newLaborSet.laborers }]);
    setNewLaborSet({ name: '', laborers: [] });
    setIsLaborSetDialogOpen(false);
  };

  // Calculate totals for analytics
  const totalSpent = clientData.allocatedBudget - clientData.remainingBudget;
  const materialCosts = transactions.filter(t => t.type === 'material').reduce((sum, t) => sum + (t.cost || 0), 0);
  const laborCosts = transactions.filter(t => t.type === 'labor').reduce((sum, t) => sum + (t.cost || 0), 0);
  const payments = transactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + (t.amount || 0), 0);

  const pieChartData = [
    { name: 'Materials', value: materialCosts },
    { name: 'Labor', value: laborCosts },
    { name: 'Payments', value: payments },
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Client Information Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{clientData.name}</CardTitle>
          <CardDescription>
            Email: {clientData.email} | Contact: {clientData.contact}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p>Approved Date: {clientData.approvedDate}</p>
              <p>Allocated Budget: ₹{clientData.allocatedBudget.toLocaleString()}</p>
            </div>
            <div className={`text-2xl font-bold ${clientData.remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
              Remaining Budget: ₹{clientData.remainingBudget.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Different Sections */}
      <Tabs defaultValue="budget" className="space-y-4">
        <TabsList>
          <TabsTrigger value="budget">Budget Management</TabsTrigger>
          <TabsTrigger value="materials">Material & Distributor Management</TabsTrigger>
          <TabsTrigger value="labor">Labor Assignment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Budget Management Tab */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Payment Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Payment</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment</DialogTitle>
                    <DialogDescription>Enter payment details below.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const amount = Number(formData.get('amount'));
                    const mode = formData.get('mode') as string;
                    if (amount && mode) {
                      addPayment(amount, mode);
                    }
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" name="amount" type="number" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mode" className="text-right">Mode</Label>
                        <Select name="mode" required>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select payment mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Check">Check</SelectItem>
                            <SelectItem value="Credit">Credit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Add Payment</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Payment History Table */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Payment History</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.filter(t => t.type === 'payment').map(payment => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>₹{payment.amount?.toLocaleString()}</TableCell>
                        <TableCell>{payment.mode}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Material & Distributor Management Tab */}
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Material & Distributor Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Material Purchase Section */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Add Materials</h3>
                <div className="flex gap-2 mb-2">
                  <Select onValueChange={(value) => {
                    const material = mockMaterials.find(m => m.id === Number(value));
                    if (material && !selectedMaterials.some(m => m.id === material.id)) {
                      setSelectedMaterials([...selectedMaterials, { ...material, quantity: 1 }]);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMaterials.map(material => (
                        <SelectItem key={material.id} value={material.id.toString()}>{material.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setSelectedMaterials([])}>Clear</Button>
                </div>
                {selectedMaterials.map((material, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span>{material.name}</span>
                    <Input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => {
                        const newMaterials = [...selectedMaterials];
                        newMaterials[index].quantity = Number(e.target.value);
                        setSelectedMaterials(newMaterials);
                      }}
                      className="w-24"
                      min={1}
                    />
                    <span>₹{(material.quantity * material.unitCost).toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newMaterials = selectedMaterials.filter((_, i) => i !== index);
                        setSelectedMaterials(newMaterials);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {selectedMaterials.length > 0 && (
                  <div className="mt-2">
                    <span className="font-semibold">Total: ₹{selectedMaterials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Select Distributor */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Select Distributor</h3>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => {
                    if (selectedMaterials.length > 0) {
                      addMaterialPurchase(selectedMaterials, value);
                    }
                  }} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select distributor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDistributors.map(distributor => (
                        <SelectItem key={distributor.id} value={distributor.name}>{distributor.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Material Purchases Table */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Material Purchases</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Distributor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.filter(t => t.type === 'material').map(material => (
                      <TableRow key={material.id}>
                        <TableCell>{material.date}</TableCell>
                        <TableCell>{material.name}</TableCell>
                        <TableCell>{material.quantity}</TableCell>
                        <TableCell>₹{material.cost?.toLocaleString()}</TableCell>
                        <TableCell>{material.distributor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Labor Assignment Tab */}
        <TabsContent value="labor">
          <Card>
            <CardHeader>
              <CardTitle>Labor Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Laborers Section */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Add Laborers</h3>
                <div className="flex gap-2 mb-2">
                  <Select onValueChange={(value) => {
                    const laborer = mockLaborers.find(l => l.id === Number(value));
                    if (laborer && !selectedLaborers.some(l => l.id === laborer.id)) {
                      setSelectedLaborers([...selectedLaborers, { ...laborer, hours: 40, role: laborer.defaultRole, rate: laborer.defaultRate }]);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select laborer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLaborers.map(laborer => (
                        <SelectItem key={laborer.id} value={laborer.id.toString()}>{laborer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setSelectedLaborers([])}>Clear</Button>
                </div>
                {selectedLaborers.map((laborer, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span>{laborer.name}</span>
                    <Select
                      value={laborer.role}
                      onValueChange={(value) => {
                        const newLaborers = [...selectedLaborers];
                        newLaborers[index].role = value;
                        setSelectedLaborers(newLaborers);
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Main">Main</SelectItem>
                        <SelectItem value="Helper">Helper</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={laborer.rate}
                      onChange={(e) => {
                        const newLaborers = [...selectedLaborers];
                        newLaborers[index].rate = Number(e.target.value);
                        setSelectedLaborers(newLaborers);
                      }}
                      className="w-24"
                      min={0}
                    />
                    <Input
                      type="number"
                      value={laborer.hours}
                      onChange={(e) => {
                        const newLaborers = [...selectedLaborers];
                        newLaborers[index].hours = Number(e.target.value);
                        setSelectedLaborers(newLaborers);
                      }}
                      className="w-24"
                      min={0}
                    />
                    <span>₹{(laborer.rate * laborer.hours).toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newLaborers = selectedLaborers.filter((_, i) => i !== index);
                        setSelectedLaborers(newLaborers);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {selectedLaborers.length > 0 && (
                  <div className="mt-2">
                    <span className="font-semibold">Total: ₹{selectedLaborers.reduce((sum, l) => sum + l.rate * l.hours, 0).toLocaleString()}</span>
                    <Button className="ml-2" onClick={() => addLabor(selectedLaborers)}>Add Labor</Button>
                  </div>
                )}
              </div>

              {/* Labor Sets Section */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Labor Sets</h3>
                <Dialog open={isLaborSetDialogOpen} onOpenChange={setIsLaborSetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Create Labor Set</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Labor Set</DialogTitle>
                      <DialogDescription>Define a new labor set with multiple laborers.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="setName" className="text-right">Set Name</Label>
                        <Input
                          id="setName"
                          value={newLaborSet.name}
                          onChange={(e) => setNewLaborSet({ ...newLaborSet, name: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      {newLaborSet.laborers.map((laborer, index) => (
                        <div key={index} className="grid grid-cols-4 items-center gap-4">
                          <Select
                            value={laborer.id.toString()}
                            onValueChange={(value) => {
                              const selectedLaborer = mockLaborers.find(l => l.id === Number(value));
                              if (selectedLaborer) {
                                const newLaborers = [...newLaborSet.laborers];
                                newLaborers[index] = { ...selectedLaborer, role: selectedLaborer.defaultRole, rate: selectedLaborer.defaultRate };
                                setNewLaborSet({ ...newLaborSet, laborers: newLaborers });
                              }
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select laborer" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockLaborers.map(l => (
                                <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={laborer.role}
                            onValueChange={(value) => {
                              const newLaborers = [...newLaborSet.laborers];
                              newLaborers[index].role = value;
                              setNewLaborSet({ ...newLaborSet, laborers: newLaborers });
                            }}
                            required
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Main">Main</SelectItem>
                              <SelectItem value="Helper">Helper</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            value={laborer.rate}
                            onChange={(e) => {
                              const newLaborers = [...newLaborSet.laborers];
                              newLaborers[index].rate = Number(e.target.value);
                              setNewLaborSet({ ...newLaborSet, laborers: newLaborers });
                            }}
                            placeholder="Rate"
                            required
                            className="w-24"
                            min={0}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newLaborers = newLaborSet.laborers.filter((_, i) => i !== index);
                              setNewLaborSet({ ...newLaborSet, laborers: newLaborers });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={() => setNewLaborSet({ ...newLaborSet, laborers: [...newLaborSet.laborers, { id: 0, name: '', role: 'Helper', rate: 0 }] })}>
                        Add Laborer
                      </Button>
                    </div>
                    <DialogFooter>
                      <Button onClick={addLaborSet} disabled={!newLaborSet.name || newLaborSet.laborers.length === 0}>
                        Create Labor Set
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {laborSets.map((set, index) => (
                  <div key={index} className="mt-2">
                    <h4 className="font-semibold">{set.name}</h4>
                    <ul className="list-disc list-inside">
                      {set.laborers.map((laborer, laborerIndex) => (
                        <li key={laborerIndex}>
                          {laborer.name} - {laborer.role} - ₹{laborer.rate}/hr
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-2" onClick={() => addLabor(set.laborers)}>
                      Add Labor Set
                    </Button>
                  </div>
                ))}
              </div>

              {/* Labor Assignments Table */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Labor Assignments</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.filter(t => t.type === 'labor').map(labor => (
                      <TableRow key={labor.id}>
                        <TableCell>{labor.date}</TableCell>
                        <TableCell>{labor.name}</TableCell>
                        <TableCell>{labor.role}</TableCell>
                        <TableCell>₹{labor.rate}/hr</TableCell>
                        <TableCell>{labor.hours}</TableCell>
                        <TableCell>₹{labor.cost?.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Pie Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Budget Summary */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Budget Summary</h3>
                <p><strong>Total Spent:</strong> ₹{totalSpent.toLocaleString()}</p>
                <p><strong>Remaining Budget:</strong> ₹{clientData.remainingBudget.toLocaleString()}</p>
                {clientData.remainingBudget < 0 && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Budget overspent by ₹{Math.abs(clientData.remainingBudget).toLocaleString()}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
