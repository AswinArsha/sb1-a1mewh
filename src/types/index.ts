// src/types/index.ts

export type Client = {
    id: string;
    name: string;
    stage: MainStage;
    approved: boolean;
  };
  
  export type MainStage =
    | "Lead"
    | "Client Engagement"
    | "Design & Planning"
    | "Work Preparation"
    | "Material and Site Work"
    | "Execution Phase"
    | "Completion";
  
  export type SubStageMap = {
    [key in MainStage]?: string[];
  };
  
  export type Payment = {
    id: string;
    amount: number;
    mode: "Cash" | "Check" | "Credit";
    date: string;
  };
  
  export type Material = {
    id: string;
    name: string;
    quantity: number;
    distributor: string;
    amount: number;
    date: string;
  };
  
  export type Labor = {
    id: string;
    name: string;
    role: "Main" | "Helper";
    rate: number;
  };
  
  export type LaborSet = {
    id: string;
    setName: string;
    laborers: Labor[];
  };
  
  export type Ledger = {
    clientId: string;
    payments: Payment[];
    materials: Material[];
    labors: Labor[];
    laborSets: LaborSet[];
  };
  