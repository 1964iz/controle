import { useState } from 'react';
import { 
  Database, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  Clock, 
  Phone
} from 'lucide-react';

interface FooterStatusProps {
  recordCount: number;
  onClearAll: () => Promise<void>;
  lastDbUpdate?: Date;
  pageLoadedAt?: Date;
  onRefreshDb?: () => void;
}

function formatDateTimeBR(date?: Date | string | number): string {
  if (!date) return '-';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' às ' + d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function FooterStatus({ 
  recordCount, 
  onClearAll, 
  lastDbUpdate, 
  pageLoadedAt,
  onRefreshDb 
}: FooterStatusProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleConfirmClear = async () => {
    try {
      setIsClearing(true);
      await onClearAll();
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Erro ao limpar banco de dados:', err);
    } finally {
      setIsClearing(false);
    }
  };

  const formattedPageTime = formatDateTimeBR(pageLoadedAt || new Date());
  const formattedDbTime = formatDateTimeBR(lastDbUpdate || new Date());

  return (
    <div className="mt-auto print:hidden">
      {/* Barra Acima do Rodapé - Link do Site e Últimas Atualizações */}
      <div className="bg-gray-100 border-t border-gray-300 py-3 px-4 sm:px-6 lg:px-8 text-xs text-blue-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Link do site https://controle-ten-delta.vercel.app/ */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="text-slate-600 font-medium">Acesse o sistema online:</span>
            <a
              href="https://controle-ten-delta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 hover:border-blue-500 rounded-lg text-blue-700 hover:text-blue-900 font-semibold shadow-2xs transition-all cursor-pointer group"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[11px] sm:text-xs">https://controle-ten-delta.vercel.app/</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
            </a>
          </div>

          {/* Última atualização da página e do banco de dados */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end text-[11px]">
            {/* Atualização da Página */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-300 px-2.5 py-1 rounded-md text-slate-700">
              <Clock className="w-3 h-3 text-blue-600 shrink-0" />
              <span>
                Última atualização da página: <strong className="text-black font-mono">{formattedPageTime}</strong>
              </span>
            </div>

            {/* Atualização do Banco de Dados */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-300 px-2.5 py-1 rounded-md text-slate-700">
              <Database className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>
                Última atualização do banco de dados: <strong className="text-black font-mono">{formattedDbTime}</strong>
              </span>
            </div>

            {onRefreshDb && (
              <button
                type="button"
                onClick={onRefreshDb}
                title="Verificar e sincronizar dados agora"
                className="p-1 text-slate-500 hover:text-blue-700 hover:bg-white rounded border border-transparent hover:border-gray-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rodapé Principal com Texto Solicitado */}
      <footer className="bg-white border-t border-gray-300 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-700 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Identificação solicitada: - SSDX Técnica Operacional em Informática - Telefone: (16) 99965-4150 Franca SP. Igor Zelnik 2026. */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-black flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
              <span>- SSDX Técnica Operacional em Informática - Telefone:</span>
              <a 
                href="tel:16999654150" 
                className="text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center gap-1 font-mono font-bold"
              >
                <Phone className="w-3 h-3 text-blue-600 inline" />
                (16) 99965-4150
              </a>
              <span>Franca SP. Igor Zelnik 2026.</span>
            </div>
            
            <div className="text-[11px] text-slate-500 flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span>Bancada Técnica & Manutenção Especializada</span>
              <span>•</span>
              <span className="text-slate-600">
                IndexedDB Local: <strong className="text-black font-mono">{recordCount}</strong> {recordCount === 1 ? 'OS salva' : 'OS salvas'}
              </span>
            </div>
          </div>

          {/* Botão Limpar todos os dados */}
          <div className="flex items-center justify-center md:justify-end gap-3 shrink-0">
            <button
              type="button"
              id="btn-clear-all-data"
              onClick={() => setShowConfirmModal(true)}
              className="text-xs text-slate-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md border border-slate-200 hover:border-red-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar todos os dados</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Confirmação para Limpar Todos os Dados */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-blue-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-blue-950">Limpar todo o banco de dados?</h3>
                <p className="text-xs text-blue-700">Recomeçar o painel da SSDX totalmente do zero</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Esta ação irá apagar permanentemente todos os <strong className="text-black font-mono">{recordCount}</strong> atendimentos e ordens de serviço gravados no <strong>IndexedDB</strong> deste navegador. Todos os resumos de entradas, saídas e valores voltarão ao estado zerado.
            </p>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Esta ação não pode ser desfeita. Tem certeza de que deseja continuar?</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isClearing}
                className="px-4 py-2 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-confirm-clear-db"
                onClick={handleConfirmClear}
                disabled={isClearing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isClearing ? 'Limpando...' : 'Sim, Limpar Tudo e Zerar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
