export type EquipmentType = 'notebook' | 'pc_desktop' | 'all_in_one' | 'outro';

export type ServiceStatus = 'em_andamento' | 'finalizado' | 'sem_reparo';

export interface ServiceOrder {
  id: string;
  osNumber: number;
  clientName: string;
  clientPhone: string;
  equipmentType: EquipmentType;
  brandModel: string;
  serialNumber?: string;
  accessories: string[];
  defectDescription: string;
  budgetedValue: number;
  entryDate: string; // ISO string
  status: ServiceStatus;
  
  // Saída / Finalização fields
  exitDate?: string; // ISO string
  solutionDescription?: string;
  finalValue?: number;
  paymentMethod?: string;
  warrantyPeriod?: string;
  technicianNotes?: string;

  // Metadata
  technician: string; // 'Igor Zelnik'
  city: string; // 'Franca - SP'
  createdAt: number;
  updatedAt: number;
}

export interface ServiceStats {
  totalEntries: number;
  totalExits: number;
  inProgress: number;
  totalAmount: number;
}
