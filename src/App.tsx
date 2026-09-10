import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  SummaryCards 
} from './components/SummaryCards';
import { 
  EntryTab 
} from './components/EntryTab';
import { 
  ExitTab 
} from './components/ExitTab';
import { 
  HistoryTab 
} from './components/HistoryTab';
import { 
  ReceiptModal 
} from './components/ReceiptModal';
import { 
  FooterStatus 
} from './components/FooterStatus';
import { 
  ServiceOrder 
} from './types';
import { 
  getAllServices, 
  calculateStats, 
  clearAllData, 
  getNextOSNumber,
  formatCurrencyBRL,
  formatDateBR
} from './services/db';
import { 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  Laptop, 
  Monitor, 
  Cpu, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Database,
  FileText
} from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resumo' | 'entrada' | 'saida' | 'historico'>('resumo');
  const [nextOSPreview, setNextOSPreview] = useState<number>(1001);
  const [selectedReceipt, setSelectedReceipt] = useState<ServiceOrder | null>(null);
  const [initialHistoryFilter, setInitialHistoryFilter] = useState<string>('todos');

  // Load all records from IndexedDB
  const loadDatabase = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllServices();
      setOrders(data);
      const nextOS = await getNextOSNumber();
      setNextOSPreview(nextOS);
    } catch (err) {
      console.error('Falha ao carregar registros do IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatabase();
  }, [loadDatabase]);

  // Derived statistics (Zerado when orders is empty)
  const stats = useMemo(() => {
    return calculateStats(orders);
  }, [orders]);

  // In-progress orders
  const inProgressOrders = useMemo(() => {
    return orders.filter(o => o.status === 'em_andamento');
  }, [orders]);

  // Handle entry creation
  const handleEntrySuccess = (newOrder: ServiceOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setNextOSPreview(prev => Math.max(prev, newOrder.osNumber + 1));
    setActiveTab('resumo');
  };

  // Handle exit update
  const handleExitSuccess = (updatedOrder: ServiceOrder) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  // Handle individual order deletion
  const handleOrderDeleted = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // Handle clear entire database
  const handleClearAllData = async () => {
    await clearAllData();
    setOrders([]);
    setNextOSPreview(1001);
    setActiveTab('resumo');
  };

  const handleFilterClick = (status: 'todos' | 'em_andamento' | 'finalizado') => {
    setInitialHistoryFilter(status);
    setActiveTab('historico');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black antialiased font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        inProgressCount={stats.inProgress} 
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-blue-950">Carregando Banco de Dados IndexedDB...</p>
            <p className="text-xs text-blue-700 mt-1">Recuperando histórico da SSDX em Franca/SP</p>
          </div>
        ) : (
          <>
            {/* View: Painel Resumo */}
            {activeTab === 'resumo' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Hero / Identidade SSDX e Igor Zelnik - Painel Superior com Fundo Cinza Claro e Ícone de Computador Moderno */}
                <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6 shadow-xs relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-3">
                      {/* Modern Computer Badge Bar at the Top */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white text-blue-900 border border-gray-300 shadow-2xs">
                          <Monitor className="w-4 h-4 text-blue-600 stroke-[2.2]" />
                          <span>Computadores & Notebooks</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white flex items-center gap-1 shadow-2xs">
                          <Cpu className="w-3.5 h-3.5" />
                          SSDX
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-white text-blue-900 border border-gray-300 flex items-center gap-1 shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          Operador desde 1997
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-blue-800 border border-gray-300 flex items-center gap-1 shadow-2xs">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          Franca - SP
                        </span>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <div className="p-3 bg-white border border-gray-300 rounded-xl text-blue-600 shadow-xs hidden sm:flex items-center justify-center shrink-0">
                          <Monitor className="w-8 h-8 text-blue-600 stroke-[2.2]" />
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
                            Controle de Serviços para PC e Notebook
                          </h2>
                          <p className="text-sm text-blue-900 max-w-2xl leading-relaxed mt-1">
                            Atendimento técnico com <strong className="text-black font-semibold">Igor Zelnik</strong>: 
                            Técnico, Operador, Vendedor e Formado em TI. Sistema minimalista e veloz com armazenamento persistente em IndexedDB para a cidade de Franca/SP.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                      <button
                        type="button"
                        id="btn-quick-new-entry"
                        onClick={() => setActiveTab('entrada')}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Nova Entrada (OS #{nextOSPreview})
                      </button>

                      <button
                        type="button"
                        id="btn-quick-exit"
                        onClick={() => setActiveTab('saida')}
                        className="px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-blue-950 text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Concluir Saída
                      </button>
                    </div>
                  </div>
                </div>

                {/* Painel Resumo Zerado / Métricas */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      Painel Resumo (Valores e Contadores em Tempo Real)
                    </h3>
                    <span className="text-[11px] text-blue-700 font-medium">
                      Dados persistentes no IndexedDB
                    </span>
                  </div>

                  <SummaryCards stats={stats} onFilterClick={handleFilterClick} />
                </div>

                {/* Bancada Atual: Equipamentos em Andamento */}
                <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-blue-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-blue-950">
                        Equipamentos em Bancada SSDX ({inProgressOrders.length})
                      </h3>
                    </div>
                    {inProgressOrders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('saida')}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                      >
                        Ir para Saída e Concluir <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {inProgressOrders.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-blue-50/30 rounded-lg border border-dashed border-blue-200">
                      <p className="text-xs font-bold text-blue-950">Nenhum equipamento aguardando reparo no momento.</p>
                      <p className="text-[11px] text-blue-700 mt-0.5">
                        Todos os equipamentos recebidos foram finalizados ou o banco está zerado.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('entrada')}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Registrar Entrada de Equipamento
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {inProgressOrders.slice(0, 6).map((order) => (
                        <div 
                          key={order.id} 
                          className="p-3.5 rounded-lg border border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50/20 transition-all flex flex-col justify-between space-y-2"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                                OS #{order.osNumber}
                              </span>
                              <span className="text-xs font-bold text-black font-mono">
                                {formatCurrencyBRL(order.budgetedValue)}
                              </span>
                            </div>

                            <div className="mt-2 text-xs font-bold text-blue-950 truncate">
                              {order.clientName}
                            </div>

                            <div className="text-xs text-blue-800 flex items-center gap-1 mt-0.5 truncate">
                              {order.equipmentType === 'pc_desktop' ? (
                                <Monitor className="w-3 h-3 text-blue-600 shrink-0" />
                              ) : (
                                <Laptop className="w-3 h-3 text-blue-600 shrink-0" />
                              )}
                              <span className="truncate">{order.brandModel}</span>
                            </div>

                            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                              {order.defectDescription}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-[11px]">
                            <span className="text-blue-600">Entrada: {formatDateBR(order.entryDate).split(' ')[0]}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReceipt(order);
                              }}
                              className="text-blue-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3 h-3" /> Ficha
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* View: Aba Entrada */}
            {activeTab === 'entrada' && (
              <div className="animate-fade-in">
                <EntryTab 
                  onSuccess={handleEntrySuccess} 
                  nextOSPreview={nextOSPreview} 
                />
              </div>
            )}

            {/* View: Aba Saída */}
            {activeTab === 'saida' && (
              <div className="animate-fade-in">
                <ExitTab 
                  orders={orders} 
                  onSuccess={handleExitSuccess} 
                  onOpenReceipt={(order) => setSelectedReceipt(order)} 
                />
              </div>
            )}

            {/* View: Histórico Completo */}
            {activeTab === 'historico' && (
              <div className="animate-fade-in">
                <HistoryTab 
                  orders={orders} 
                  onOrderDeleted={handleOrderDeleted} 
                  onOpenReceipt={(order) => setSelectedReceipt(order)} 
                  initialFilter={initialHistoryFilter}
                />
              </div>
            )}
          </>
        )}

      </main>

      {/* Comprovante / Recibo Modal */}
      <ReceiptModal 
        order={selectedReceipt} 
        onClose={() => setSelectedReceipt(null)} 
      />

      {/* Rodapé com status do banco e botão de limpar */}
      <FooterStatus 
        recordCount={orders.length} 
        onClearAll={handleClearAllData} 
      />
    </div>
  );
}
