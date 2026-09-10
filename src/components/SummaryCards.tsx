import { 
  LogIn, 
  LogOut, 
  Clock, 
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react';
import { ServiceStats } from '../types';
import { formatCurrencyBRL } from '../services/db';

interface SummaryCardsProps {
  stats: ServiceStats;
  onFilterClick?: (status: 'todos' | 'em_andamento' | 'finalizado') => void;
}

export function SummaryCards({ stats, onFilterClick }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Entradas */}
      <div 
        onClick={() => onFilterClick && onFilterClick('todos')}
        className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs transition-all hover:border-blue-400 hover:shadow-sm cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Total de Entradas
          </span>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <LogIn className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-black tracking-tight font-mono">
            {stats.totalEntries}
          </div>
          <p className="text-[11px] text-blue-600 mt-1 flex items-center gap-1 font-medium">
            <Activity className="w-3 h-3 text-blue-500" />
            Equipamentos recebidos na SSDX
          </p>
        </div>
      </div>

      {/* Card 2: Equipamentos em Andamento */}
      <div 
        onClick={() => onFilterClick && onFilterClick('em_andamento')}
        className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs transition-all hover:border-blue-400 hover:shadow-sm cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Em Andamento
          </span>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-black tracking-tight font-mono">
            {stats.inProgress}
          </div>
          <p className="text-[11px] text-blue-600 mt-1 font-medium">
            Em bancada / Diagnóstico Igor Zelnik
          </p>
        </div>
      </div>

      {/* Card 3: Saídas Concluídas */}
      <div 
        onClick={() => onFilterClick && onFilterClick('finalizado')}
        className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs transition-all hover:border-blue-400 hover:shadow-sm cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Total de Saídas
          </span>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-black tracking-tight font-mono">
            {stats.totalExits}
          </div>
          <p className="text-[11px] text-blue-600 mt-1 font-medium">
            Equipamentos liberados / entregues
          </p>
        </div>
      </div>

      {/* Card 4: Valor Total */}
      <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs transition-all hover:border-blue-400 hover:shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Valor Total Faturado
          </span>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-black tracking-tight font-mono">
            {formatCurrencyBRL(stats.totalAmount)}
          </div>
          <p className="text-[11px] text-blue-600 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3 text-blue-500" />
            Serviços concluídos em Franca/SP
          </p>
        </div>
      </div>
    </div>
  );
}
