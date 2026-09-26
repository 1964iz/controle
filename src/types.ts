export type EquipmentType = 'notebook' | 'pc_desktop' | 'all_in_one' | 'outro';

export type ServiceStatus = 'em_andamento' | 'finalizado' | 'sem_reparo';

export interface ServiceOrder {
  id: string;
  osNumber: number;
  clientName: string;
  clientCpf?: string;
  clientAddress?: string;
  clientPhone: string;
  clientWhatsapp?: string;
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
  dailyAmount: number;        // Valor total somado do dia (diário)
  monthlyAmount: number;      // Valor acumulado total do mês corrente até o momento (mensal)
  dailyOrdersCount: number;   // Quantidade de OSs concluídas hoje
  monthlyOrdersCount: number; // Quantidade de OSs concluídas no mês
}
