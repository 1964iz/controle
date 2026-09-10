import { useState, useMemo, FormEvent } from 'react';
import { 
  CheckCircle, 
  Search, 
  Laptop, 
  Monitor, 
  Package, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ServiceOrder } from '../types';
import { updateService, formatCurrencyBRL, formatDateBR } from '../services/db';

interface ExitTabProps {
  orders: ServiceOrder[];
  onSuccess: (updatedOrder: ServiceOrder) => void;
  onOpenReceipt: (order: ServiceOrder) => void;
}

export function ExitTab({ orders, onSuccess, onOpenReceipt }: ExitTabProps) {
  // Filter active equipment in progress
  const inProgressOrders = useMemo(() => {
    return orders.filter(o => o.status === 'em_andamento');
  }, [orders]);

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states for selected order
  const [solutionDescription, setSolutionDescription] = useState('');
  const [finalValue, setFinalValue] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [warrantyPeriod, setWarrantyPeriod] = useState('90 Dias (Garantia Padrão SSDX)');
  const [exitStatus, setExitStatus] = useState<'finalizado' | 'sem_reparo'>('finalizado');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [exitDate, setExitDate] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtered by search
  const filteredInProgress = useMemo(() => {
    if (!searchTerm.trim()) return inProgressOrders;
    const term = searchTerm.toLowerCase();
    return inProgressOrders.filter(o => 
      o.clientName.toLowerCase().includes(term) ||
      o.brandModel.toLowerCase().includes(term) ||
      o.osNumber.toString().includes(term) ||
      (o.clientPhone && o.clientPhone.includes(term))
    );
  }, [inProgressOrders, searchTerm]);

  // Selected Order object
  const selectedOrder = useMemo(() => {
    return inProgressOrders.find(o => o.id === selectedOrderId);
  }, [inProgressOrders, selectedOrderId]);

  const handleSelectOrder = (order: ServiceOrder) => {
    setSelectedOrderId(order.id);
    setFinalValue(order.budgetedValue ? order.budgetedValue.toString() : '0');
    setSolutionDescription('');
    setTechnicianNotes(order.technicianNotes || '');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleFinalizeService = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setErrorMsg('');
    setSuccessMsg('');

    if (exitStatus === 'finalizado' && !solutionDescription.trim()) {
      setErrorMsg('Por favor, informe a descrição do serviço/solução realizado.');
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedFinalVal = parseFloat(finalValue.replace(',', '.')) || 0;

      const updated = await updateService({
        ...selectedOrder,
        status: exitStatus,
        exitDate: new Date(exitDate).toISOString(),
        solutionDescription: solutionDescription.trim(),
        finalValue: parsedFinalVal,
        paymentMethod: exitStatus === 'finalizado' ? paymentMethod : 'Nenhum',
        warrantyPeriod: exitStatus === 'finalizado' ? warrantyPeriod : 'Sem garantia',
        technicianNotes: technicianNotes.trim() || undefined,
      });

      setSuccessMsg(`Saída da OS #${updated.osNumber} registrada com sucesso no IndexedDB!`);
      onSuccess(updated);
      setSelectedOrderId('');
      setSolutionDescription('');
      setFinalValue('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao atualizar saída';
      setErrorMsg('Erro ao salvar saída: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Bar Superior com Fundo Cinza Claro e Ícone de Computador Moderno */}
      <div className="bg-gray-100 border border-gray-300 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-white border border-gray-300 text-blue-600 rounded-xl shadow-xs flex items-center justify-center">
            <Monitor className="w-6 h-6 text-blue-600 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-blue-950">Aba Saída: Finalização de Equipamentos</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-blue-900 border border-gray-300">
                SSDX Franca/SP
              </span>
            </div>
            <p className="text-xs text-blue-800">Selecione o PC ou Notebook em serviço na SSDX e registre a conclusão com Igor Zelnik</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 bg-white px-3.5 py-2 rounded-lg border border-gray-300 shadow-2xs">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Equipamentos em andamento:</span>
          <span className="text-sm font-bold text-black font-mono">{inProgressOrders.length}</span>
        </div>
      </div>

      {successMsg && (
        <div className="bg-blue-50 border border-blue-300 text-blue-900 p-4 rounded-xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="font-semibold text-sm">{successMsg}</span>
          </div>
        </div>
      )}

      {/* Grid: Lista de equipamentos em andamento + Formulário de Saída */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Seletor de equipamentos em andamento */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-blue-600" />
                Equipamentos em Serviço ({inProgressOrders.length})
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cliente, modelo ou nº da OS..."
                className="w-full pl-9 pr-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-md text-xs text-black placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* List */}
            {inProgressOrders.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-blue-200 rounded-lg bg-blue-50/20">
                <Package className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-blue-950">Nenhum equipamento em andamento</p>
                <p className="text-xs text-blue-700 mt-1">
                  Todos os atendimentos foram concluídos ou ainda não foram cadastradas ordens. Utilize a aba "Entrada" para registrar.
                </p>
              </div>
            ) : filteredInProgress.length === 0 ? (
              <div className="text-center py-6 text-xs text-blue-700">
                Nenhum equipamento encontrado com os termos de busca.
              </div>
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredInProgress.map((order) => {
                  const isSelected = order.id === selectedOrderId;
                  return (
                    <div
                      key={order.id}
                      onClick={() => handleSelectOrder(order)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                          : 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white bg-blue-600 px-2 py-0.5 rounded">
                            OS #{order.osNumber}
                          </span>
                          <span className="text-xs font-semibold text-blue-950 truncate max-w-[150px]">
                            {order.clientName}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-black">
                          {formatCurrencyBRL(order.budgetedValue)}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-800">
                        {order.equipmentType === 'pc_desktop' ? (
                          <Monitor className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        ) : (
                          <Laptop className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                        <span className="font-medium truncate">{order.brandModel}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-1">
                        <strong className="text-blue-900">Defeito:</strong> {order.defectDescription}
                      </p>

                      <div className="mt-2 pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] text-blue-600">
                        <span>Entrada: {formatDateBR(order.entryDate).split(' ')[0]}</span>
                        <span className="flex items-center gap-1 font-semibold text-blue-700">
                          Selecionar <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Detalhes & Formulário de Finalização */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="bg-white border border-blue-200 rounded-xl shadow-xs overflow-hidden">
              {/* Card Resumo do Equipamento Selecionado */}
              <div className="bg-blue-50/70 border-b border-blue-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md font-mono">
                      OS #{selectedOrder.osNumber}
                    </span>
                    <h3 className="text-sm font-bold text-blue-950">
                      Finalização: {selectedOrder.brandModel}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenReceipt(selectedOrder)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Ver Ficha de Entrada
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-blue-200/80 text-xs">
                  <div>
                    <span className="text-blue-600 block">Cliente:</span>
                    <strong className="text-blue-950">{selectedOrder.clientName}</strong>
                  </div>
                  <div>
                    <span className="text-blue-600 block">Contato:</span>
                    <strong className="text-blue-950">{selectedOrder.clientPhone || 'Não informado'}</strong>
                  </div>
                  <div>
                    <span className="text-blue-600 block">Orçamento Inicial:</span>
                    <strong className="text-black font-bold font-mono">
                      {formatCurrencyBRL(selectedOrder.budgetedValue)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-blue-600 block">Data Entrada:</span>
                    <span className="text-blue-950">{formatDateBR(selectedOrder.entryDate)}</span>
                  </div>
                </div>

                <div className="mt-2 text-xs bg-white p-2 rounded-md border border-blue-200/60">
                  <span className="text-blue-800 font-semibold">Defeito Registrado:</span>{' '}
                  <span className="text-black">{selectedOrder.defectDescription}</span>
                </div>
              </div>

              {/* Form de Conclusão */}
              <form onSubmit={handleFinalizeService} className="p-5 space-y-4">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Status da Conclusão */}
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1.5">
                    Resultado do Atendimento
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      id="btn-exit-status-finalizado"
                      onClick={() => setExitStatus('finalizado')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        exitStatus === 'finalizado'
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-blue-200 bg-white text-blue-800 hover:bg-blue-50'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Finalizado com Sucesso
                    </button>

                    <button
                      type="button"
                      id="btn-exit-status-sem-reparo"
                      onClick={() => setExitStatus('sem_reparo')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        exitStatus === 'sem_reparo'
                          ? 'border-slate-600 bg-slate-700 text-white shadow-xs'
                          : 'border-blue-200 bg-white text-blue-800 hover:bg-blue-50'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4" />
                      Sem Reparo / Devolvido
                    </button>
                  </div>
                </div>

                {/* Serviço Realizado / Solução */}
                <div>
                  <label htmlFor="solutionDescription" className="block text-xs font-semibold text-blue-900 mb-1">
                    Serviço Realizado / Solução Técnica Aplicada <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="solutionDescription"
                    rows={3}
                    required={exitStatus === 'finalizado'}
                    value={solutionDescription}
                    onChange={(e) => setSolutionDescription(e.target.value)}
                    placeholder={
                      exitStatus === 'finalizado'
                        ? 'Ex: Substituição de pasta térmica e limpeza completa do cooler; Instalação de SSD 480GB e formatação limpa Windows 11...'
                        : 'Ex: Placa-mãe danificada em curto severo no chipset; cliente optou por não realizar a substituição da placa...'
                    }
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm text-black placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Valores e Pagamento (somente se finalizado ou com custo de taxa técnica) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label htmlFor="finalValue" className="block text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Valor Final Cobrado (R$) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm font-bold text-black">R$</span>
                      <input
                        id="finalValue"
                        type="number"
                        step="0.01"
                        min="0"
                        value={finalValue}
                        onChange={(e) => setFinalValue(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white border border-blue-200 rounded-md text-base font-bold text-black focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="paymentMethod" className="block text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" /> Forma de Pagamento
                    </label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm font-medium text-black focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="PIX">PIX (Chave SSDX)</option>
                      <option value="Cartão de Débito">Cartão de Débito</option>
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Dinheiro">Dinheiro em Espécie</option>
                      <option value="Faturado / Boleto">Faturado / Boleto</option>
                      <option value="Isento">Isento / Cortesia</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="warrantyPeriod" className="block text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Garantia do Serviço
                    </label>
                    <select
                      id="warrantyPeriod"
                      value={warrantyPeriod}
                      onChange={(e) => setWarrantyPeriod(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm font-medium text-black focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="90 Dias (Garantia Padrão SSDX)">90 Dias (Garantia Padrão SSDX)</option>
                      <option value="30 Dias">30 Dias</option>
                      <option value="6 Meses">6 Meses</option>
                      <option value="1 Ano (Hardware Novo)">1 Ano (Hardware Novo)</option>
                      <option value="Sem Garantia">Sem Garantia (Serviço de Limpeza/Software)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="exitDate" className="block text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" /> Data e Hora da Saída
                    </label>
                    <input
                      id="exitDate"
                      type="datetime-local"
                      value={exitDate}
                      onChange={(e) => setExitDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm font-medium text-black focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="exitTechnicianNotes" className="block text-xs font-semibold text-blue-900 mb-1">
                    Recomendações ao Cliente / Notas de Saída
                  </label>
                  <input
                    id="exitTechnicianNotes"
                    type="text"
                    value={technicianNotes}
                    onChange={(e) => setTechnicianNotes(e.target.value)}
                    placeholder="Ex: Recomendado uso de filtro de linha; não obstruir saídas de ar inferiores..."
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-xs text-black placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="border-t border-blue-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-blue-700">
                    Técnico Responsável: <strong className="text-blue-950">Igor Zelnik</strong> (SSDX Franca)
                  </div>
                  <button
                    type="submit"
                    id="btn-submit-exit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isSubmitting ? 'Gravando no IndexedDB...' : 'Registrar Saída e Finalizar OS'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-blue-200 rounded-xl p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-blue-950">Selecione uma Ordem de Serviço</h3>
              <p className="text-xs text-blue-700 max-w-sm mt-1">
                Clique em um dos equipamentos em serviço na coluna ao lado para abrir o formulário de finalização e registrar a entrega.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
