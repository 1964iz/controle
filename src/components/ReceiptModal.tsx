import { useRef, useEffect, useState } from 'react';
import { 
  Printer, 
  X, 
  Cpu, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Phone, 
  User, 
  Wrench, 
  Laptop, 
  Monitor, 
  Package,
  FileDown,
  MessageCircle,
  CreditCard
} from 'lucide-react';
import { ServiceOrder } from '../types';
import { formatCurrencyBRL, formatDateBR } from '../services/db';

interface ReceiptModalProps {
  order: ServiceOrder | null;
  onClose: () => void;
  initialAction?: 'print' | 'pdf' | null;
}

export function ReceiptModal({ order, onClose, initialAction }: ReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [pdfHintVisible, setPdfHintVisible] = useState(false);

  useEffect(() => {
    if (!order) return;
    if (initialAction === 'print') {
      const timer = setTimeout(() => {
        handlePrint();
      }, 300);
      return () => clearTimeout(timer);
    } else if (initialAction === 'pdf') {
      const timer = setTimeout(() => {
        handleSavePDF();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [order, initialAction]);

  if (!order) return null;

  const prepareDocumentTitle = () => {
    const cleanClient = order.clientName.replace(/[^a-zA-Z0-9]/g, '_');
    document.title = `OS_${order.osNumber}_${cleanClient}_SSDX`;
  };

  const handlePrint = () => {
    prepareDocumentTitle();
    window.print();
  };

  const handleSavePDF = () => {
    prepareDocumentTitle();
    setPdfHintVisible(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const isFinished = order.status === 'finalizado';
  const displayValue = isFinished && order.finalValue !== undefined 
    ? order.finalValue 
    : order.budgetedValue;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-blue-200 shadow-2xl overflow-hidden my-6 print-receipt-wrapper">
        
        {/* Modal Controls (Not printed) - Top bar with light gray background */}
        <div className="bg-gray-100 border-b border-gray-300 px-5 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-600 stroke-[2.2]" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-950">
              Comprovante / OS #{order.osNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-print-receipt"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>

            <button
              type="button"
              id="btn-pdf-receipt"
              onClick={handleSavePDF}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              Salvar em PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-blue-900 hover:text-black hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {pdfHintVisible && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs px-5 py-2 flex items-center justify-between print:hidden">
            <span>
              💡 <strong>Dica para PDF:</strong> Na janela de impressão do navegador, selecione <strong>"Salvar como PDF"</strong> no campo Destino.
            </span>
            <button 
              type="button" 
              onClick={() => setPdfHintVisible(false)}
              className="text-emerald-700 hover:text-emerald-950 font-bold ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Printable Content Body */}
        <div ref={printRef} id="printable-receipt-content" className="p-8 space-y-6 text-black bg-white">
          {/* Header of Receipt */}
          <div className="border-b-2 border-blue-600 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 border border-gray-300 text-blue-600 rounded-lg shadow-2xs">
                <Monitor className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-blue-950 font-mono">
                  SSDX
                </h1>
                <p className="text-xs font-bold text-blue-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Operador desde 1997 • Franca / SP
                </p>
                <p className="text-[11px] text-slate-600">
                  Assistência Técnica Especializada em PC e Notebook
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right border-l sm:border-l-0 pl-3 sm:pl-0 border-blue-200">
              <span className="text-xs font-bold text-blue-800 uppercase block">Ordem de Serviço</span>
              <span className="text-2xl font-black text-black font-mono">
                OS #{order.osNumber}
              </span>
              <span className="text-[11px] text-blue-600 block mt-0.5 font-medium">
                {order.status === 'finalizado' ? '✓ Atendimento Concluído' : '⏳ Equipamento em Bancada'}
              </span>
            </div>
          </div>

          {/* Igor Zelnik Technician Badge */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-blue-950">Responsável Técnico: </span>
              <strong className="text-black">Igor Zelnik</strong>
              <span className="text-blue-800 block sm:inline sm:ml-1">
                (Técnico, Operador, Vendedor e Formado em TI)
              </span>
            </div>
            <div className="flex items-center gap-1 text-blue-700 font-semibold shrink-0">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Franca - SP
            </div>
          </div>

          {/* Dados do Cliente e Equipamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Bloco Cliente */}
            <div className="bg-white border border-blue-200 rounded-lg p-3 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" /> Dados do Cliente
              </span>
              <div className="text-sm font-bold text-black">{order.clientName}</div>
              
              {order.clientCpf && (
                <div className="text-slate-700 flex items-center gap-1 font-mono">
                  <CreditCard className="w-3 h-3 text-blue-600" />
                  CPF: {order.clientCpf}
                </div>
              )}

              <div className="text-slate-700 flex items-center gap-1">
                <Phone className="w-3 h-3 text-blue-600" />
                Telefone: <span className="font-semibold text-black">{order.clientPhone || 'Não informado'}</span>
              </div>

              {order.clientWhatsapp && (
                <div className="text-emerald-800 flex items-center gap-1 font-medium">
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  WhatsApp: <span className="font-semibold text-black">{order.clientWhatsapp}</span>
                </div>
              )}

              {order.clientAddress && (
                <div className="text-slate-700 flex items-start gap-1 pt-0.5">
                  <MapPin className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                  <span>{order.clientAddress}</span>
                </div>
              )}

              <div className="text-[11px] text-blue-700 flex items-center gap-1 pt-1 border-t border-blue-100 mt-1">
                <Clock className="w-3 h-3 text-blue-600" />
                Data de Entrada: <strong className="text-black">{formatDateBR(order.entryDate)}</strong>
              </div>
            </div>

            {/* Bloco Equipamento */}
            <div className="bg-white border border-blue-200 rounded-lg p-3 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block flex items-center gap-1">
                {order.equipmentType === 'pc_desktop' ? (
                  <Monitor className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <Laptop className="w-3.5 h-3.5 text-blue-600" />
                )}
                Equipamento
              </span>
              <div className="text-sm font-bold text-black">{order.brandModel}</div>
              <div className="text-slate-700">
                Tipo: <span className="font-medium capitalize text-blue-900">{order.equipmentType.replace('_', ' ')}</span>
                {order.serialNumber && ` • Série: ${order.serialNumber}`}
              </div>
              {order.exitDate && (
                <div className="text-[11px] text-blue-700 flex items-center gap-1 pt-1 border-t border-blue-100 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  Data de Saída: <strong className="text-black">{formatDateBR(order.exitDate)}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Acessórios */}
          {order.accessories && order.accessories.length > 0 && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-xs">
              <span className="font-bold text-blue-900 flex items-center gap-1 mb-1">
                <Package className="w-3.5 h-3.5 text-blue-600" />
                Itens e Acessórios Deixados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {order.accessories.map((acc, idx) => (
                  <span key={idx} className="bg-white border border-gray-300 px-2 py-0.5 rounded text-[11px] text-blue-900 font-medium">
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Defeito Relatado e Solução */}
          <div className="space-y-3 text-xs">
            <div className="border border-blue-200 rounded-lg p-3">
              <span className="font-bold text-blue-900 flex items-center gap-1 mb-1">
                <Wrench className="w-3.5 h-3.5 text-blue-600" />
                Defeito Relatado / Diagnóstico Preliminar:
              </span>
              <p className="text-slate-800 leading-relaxed font-normal">{order.defectDescription}</p>
            </div>

            {order.solutionDescription && (
              <div className="border border-gray-300 bg-gray-100 rounded-lg p-3">
                <span className="font-bold text-blue-950 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Serviço Realizado / Solução Técnica Aplicada:
                </span>
                <p className="text-black font-medium leading-relaxed">{order.solutionDescription}</p>
              </div>
            )}
          </div>

          {/* Valores & Condições Financeiras */}
          <div className="bg-white border-2 border-blue-600 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase block">
                {isFinished ? 'Valor Final do Atendimento:' : 'Valor Orçado:'}
              </span>
              <div className="text-3xl font-black text-black font-mono">
                {formatCurrencyBRL(displayValue)}
              </div>
              {order.paymentMethod && isFinished && (
                <span className="text-xs text-blue-700 font-medium block">
                  Forma de Pagamento: <strong>{order.paymentMethod}</strong>
                </span>
              )}
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="text-blue-800 font-bold block">Garantia do Serviço:</span>
              <span className="text-sm font-bold text-black font-mono">
                {order.warrantyPeriod || '7 Dias (Garantia Padrão SSDX)'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Conforme Termos da Ordem de Serviço SSDX
              </span>
            </div>
          </div>

          {/* Assinaturas */}
          <div className="pt-8 border-t border-blue-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
              <span className="font-bold text-black block">Igor Zelnik</span>
              <span className="text-[11px] text-blue-800">SSDX - Operador desde 1997</span>
            </div>

            <div>
              <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
              <span className="font-bold text-black block">{order.clientName}</span>
              <span className="text-[11px] text-slate-600">Cliente / Responsável</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-blue-600 pt-2">
            SSDX Informática • Franca - SP • Sistema de Controle de Serviços com Persistência Local
          </div>
        </div>

      </div>
    </div>
  );
}

