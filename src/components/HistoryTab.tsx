import { useState, useMemo } from 'react';
import { 
  Search, 
  History, 
  Laptop, 
  Monitor, 
  Trash2, 
  Printer, 
  Calendar, 
  User, 
  Phone,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ServiceOrder } from '../types';
import { deleteService, formatCurrencyBRL, formatDateBR } from '../services/db';

interface HistoryTabProps {
  orders: ServiceOrder[];
  onOrderDeleted: (id: string) => void;
  onOpenReceipt: (order: ServiceOrder) => void;
  initialFilter?: string;
}

export function HistoryTab({ orders, onOrderDeleted, onOpenReceipt, initialFilter = 'todos' }: HistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'em_andamento' | 'finalizado' | 'sem_reparo'>(
    initialFilter as 'todos' | 'em_andamento' | 'finalizado' | 'sem_reparo'
  );
  const [orderToDelete, setOrderToDelete] = useState<ServiceOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (statusFilter !== 'todos' && order.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesClient = order.clientName.toLowerCase().includes(term);
        const matchesModel = order.brandModel.toLowerCase().includes(term);
        const matchesOS = order.osNumber.toString().includes(term);
        const matchesPhone = order.clientPhone?.includes(term);
        const matchesDefect = order.defectDescription?.toLowerCase().includes(term);
        const matchesSerial = order.serialNumber?.toLowerCase().includes(term);
        return matchesClient || matchesModel || matchesOS || matchesPhone || matchesDefect || matchesSerial;
      }
      return true;
    });
  }, [orders, statusFilter, searchTerm]);

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      setIsDeleting(true);
      await deleteService(orderToDelete.id);
      onOrderDeleted(orderToDelete.id);
      setOrderToDelete(null);
    } catch (err) {
      console.error('Erro ao deletar registro:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-xs overflow-hidden">
      {/* Header do Histórico Superior com Fundo Cinza Claro e Ícone de Computador Moderno */}
      <div className="bg-gray-100 border-b border-gray-300 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-white border border-gray-300 text-blue-600 rounded-xl shadow-xs flex items-center justify-center">
            <Monitor className="w-6 h-6 text-blue-600 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-blue-950">Histórico de Atendimentos</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-blue-900 border border-gray-300">
                SSDX Franca/SP
              </span>
            </div>
            <p className="text-xs text-blue-800">Controle geral de PC e Notebook da SSDX • Técnico Igor Zelnik</p>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-blue-900">
            <button
              type="button"
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'todos' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-blue-900'
              }`}
            >
              Todos ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('em_andamento')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'em_andamento' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-blue-900'
              }`}
            >
              Em Andamento
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('finalizado')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'finalizado' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-blue-900'
              }`}
            >
              Finalizados
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente, OS, modelo..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-black placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Lista de Registros */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 px-4">
          <FileText className="w-12 h-12 text-blue-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-blue-950">Nenhum atendimento encontrado</h3>
          <p className="text-xs text-blue-700 max-w-sm mx-auto mt-1">
            {orders.length === 0 
              ? 'O banco de dados IndexedDB está atualmente zerado. Registre a primeira entrada na aba "Entrada".'
              : 'Nenhum registro corresponde aos filtros selecionados.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => {
            const isFinished = order.status === 'finalizado';
            const isInProgress = order.status === 'em_andamento';
            const isNoRepair = order.status === 'sem_reparo';

            const displayValue = isFinished && order.finalValue !== undefined
              ? order.finalValue
              : order.budgetedValue;

            return (
              <div 
                key={order.id} 
                className="p-4 sm:p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left side: Identificação, cliente e equipamento */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-600 text-white rounded">
                      OS #{order.osNumber}
                    </span>

                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-blue-900 border border-gray-300">
                        <Clock className="w-3 h-3 text-blue-600" />
                        Em Andamento
                      </span>
                    )}

                    {isFinished && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-blue-900 border border-gray-300">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        Finalizado & Entregue
                      </span>
                    )}

                    {isNoRepair && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                        <AlertCircle className="w-3 h-3 text-slate-500" />
                        Sem Reparo / Devolvido
                      </span>
                    )}

                    <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Entrada: {formatDateBR(order.entryDate)}
                    </span>
                    {order.exitDate && (
                      <span className="text-xs text-blue-800 font-medium">
                        • Saída: {formatDateBR(order.exitDate)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm pt-1">
                    <span className="font-bold text-blue-950 flex items-center gap-1">
                      <User className="w-4 h-4 text-blue-600 shrink-0" />
                      {order.clientName}
                    </span>
                    {order.clientPhone && (
                      <span className="text-xs text-blue-700 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {order.clientPhone}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                    {order.equipmentType === 'pc_desktop' ? (
                      <Monitor className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <Laptop className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    )}
                    <span>{order.brandModel}</span>
                    {order.serialNumber && (
                      <span className="text-blue-600 font-normal">
                        (Série: {order.serialNumber})
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-blue-900">Defeito:</span> {order.defectDescription}
                  </div>

                  {order.solutionDescription && (
                    <div className="text-xs text-slate-800 bg-gray-100 p-2 rounded border border-gray-300 mt-1">
                      <span className="font-bold text-blue-900">Solução Realizada:</span> {order.solutionDescription}
                      {order.warrantyPeriod && (
                        <span className="ml-2 text-blue-700 font-medium">({order.warrantyPeriod})</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right side: Valores em Preto e Botões */}
                <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-200">
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-blue-700 block">
                      {isFinished ? 'Valor Cobrado:' : 'Valor Orçado:'}
                    </span>
                    <span className="text-xl font-black text-black font-mono">
                      {formatCurrencyBRL(displayValue)}
                    </span>
                    {order.paymentMethod && isFinished && (
                      <span className="text-[10px] text-blue-600 block">
                        via {order.paymentMethod}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenReceipt(order)}
                      title="Imprimir / Ver Comprovante da OS"
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-blue-900 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-600" />
                      <span>Comprovante</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderToDelete(order)}
                      title="Excluir Registro"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Exclusão Individual */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-blue-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-lg">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-blue-950">Excluir Ordem de Serviço?</h3>
            </div>
            <p className="text-xs text-slate-600">
              Você tem certeza que deseja remover a <strong className="text-black">OS #{orderToDelete.osNumber}</strong> do cliente <strong className="text-black">{orderToDelete.clientName}</strong>? Esta ação removerá o registro do IndexedDB permanentemente.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 text-blue-900 text-xs font-semibold rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
