import { useState } from 'react';
import { Database, Trash2, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

interface FooterStatusProps {
  recordCount: number;
  onClearAll: () => Promise<void>;
}

export function FooterStatus({ recordCount, onClearAll }: FooterStatusProps) {
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

  return (
    <>
      <footer className="bg-white border-t border-blue-200 mt-auto py-4 px-4 sm:px-6 lg:px-8 text-xs text-blue-900 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Status do IndexedDB */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
              <Database className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span className="font-semibold text-blue-950">Status do Banco de Dados:</span>
              <strong className="text-black font-mono font-bold">{recordCount}</strong>
              <span className="text-blue-700">{recordCount === 1 ? 'registro salvo' : 'registros salvos'} no IndexedDB</span>
            </div>

            <span className="hidden md:inline text-blue-300">•</span>

            <div className="flex items-center gap-1 text-blue-700">
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>SSDX Franca/SP • Igor Zelnik</span>
            </div>
          </div>

          {/* Botão Limpar todos os dados */}
          <div className="flex items-center gap-3">
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
    </>
  );
}
