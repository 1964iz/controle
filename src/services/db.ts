import { ServiceOrder, ServiceStats } from '../types';

const DB_NAME = 'ssdx_service_control_db';
const DB_VERSION = 1;
const STORE_NAME = 'service_orders';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB não é suportado neste navegador.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('osNumber', 'osNumber', { unique: true });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('clientName', 'clientName', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Erro ao abrir banco de dados IndexedDB.'));
    };
  });
}

export async function getAllServices(): Promise<ServiceOrder[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // Sort in descending order of createdAt
      const results: ServiceOrder[] = request.result || [];
      results.sort((a, b) => b.createdAt - a.createdAt);
      resolve(results);
    };

    request.onerror = () => {
      reject(request.error || new Error('Erro ao carregar registros do IndexedDB.'));
    };
  });
}

export async function getNextOSNumber(): Promise<number> {
  const all = await getAllServices();
  if (all.length === 0) return 1001; // Start at 1001 or 1
  const maxOS = all.reduce((max, item) => (item.osNumber > max ? item.osNumber : max), 1000);
  return maxOS + 1;
}

export async function addService(
  data: Omit<ServiceOrder, 'id' | 'osNumber' | 'createdAt' | 'updatedAt' | 'technician' | 'city'>
): Promise<ServiceOrder> {
  const db = await openDatabase();
  const nextOS = await getNextOSNumber();
  const now = Date.now();

  const newRecord: ServiceOrder = {
    ...data,
    id: 'os_' + now + '_' + Math.random().toString(36).substring(2, 7),
    osNumber: nextOS,
    technician: 'Igor Zelnik',
    city: 'Franca - SP',
    createdAt: now,
    updatedAt: now,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(newRecord);

    request.onsuccess = () => {
      resolve(newRecord);
    };

    request.onerror = () => {
      reject(request.error || new Error('Erro ao salvar registro no IndexedDB.'));
    };
  });
}

export async function updateService(record: ServiceOrder): Promise<ServiceOrder> {
  const db = await openDatabase();
  const updatedRecord: ServiceOrder = {
    ...record,
    updatedAt: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(updatedRecord);

    request.onsuccess = () => {
      resolve(updatedRecord);
    };

    request.onerror = () => {
      reject(request.error || new Error('Erro ao atualizar registro no IndexedDB.'));
    };
  });
}

export async function deleteService(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error || new Error('Erro ao excluir registro do IndexedDB.'));
    };
  });
}

export async function clearAllData(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error || new Error('Erro ao limpar dados do IndexedDB.'));
    };
  });
}

export function calculateStats(services: ServiceOrder[]): ServiceStats {
  let totalEntries = services.length;
  let totalExits = 0;
  let inProgress = 0;
  let totalAmount = 0;

  for (const s of services) {
    if (s.status === 'em_andamento') {
      inProgress++;
    } else if (s.status === 'finalizado' || s.status === 'sem_reparo') {
      totalExits++;
      if (s.status === 'finalizado') {
        const val = s.finalValue !== undefined && s.finalValue !== null ? s.finalValue : s.budgetedValue;
        totalAmount += Number(val) || 0;
      }
    }
  }

  return {
    totalEntries,
    totalExits,
    inProgress,
    totalAmount,
  };
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDateBR(dateString: string): string {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
