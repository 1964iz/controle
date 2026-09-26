import { 
  LogIn, 
  LogOut, 
  Clock, 
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Receipt
} from 'lucide-react';
import { ServiceStats } from '../types';
import { formatCurrencyBRL } from '../services/db';

interface SummaryCardsProps {
  stats: ServiceStats;
  onFilterClick?: (status: 'todos' | 'em_andamento' | 'finalizado') => void;
}

export function SummaryCards({ stats, onFilterClick }: SummaryCardsProps) {
  const now = new Date();
  const todayFormatted = now.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  const currentMonthName = now.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });
  const capitalizedMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

  return (
    <div className="space-y-4">
      {/* Bloco de Destaque: Controle e Relatório Obrigatório de Valores (Diário e Mensal) - Painel Prata Claro */}
      <div className="bg-gradient-to-r from-slate-100 via-gray-100 to-slate-200 border border-slate-300 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-800 text-white rounded-lg">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Relatório de Controle de Valores (SSDX Informática)
              </h4>
              <p className="text-[11px] text-slate-600">
                Apuração financeira diária e acumulada mensal em tempo real
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 px-3 py-1 rounded-full shadow-2xs self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Atualizado hoje, {todayFormatted}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. O VALOR TOTAL SOMADO DO DIA (DIÁRIO) */}
          <div className="bg-white border-2 border-emerald-500 rounded-xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-black rounded uppercase tracking-wider">
                    Item 1 • Diário
                  </span>
                  <span className="text-xs font-bold text-slate-700">Total Somado do Dia</span>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Data de Hoje: <strong className="text-black">{todayFormatted}</strong>
                </span>
                <div className="text-3xl sm:text-4xl font-black text-black tracking-tight font-mono mt-1">
                  {formatCurrencyBRL(stats.dailyAmount)}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{stats.dailyOrdersCount} {stats.dailyOrdersCount === 1 ? 'OS finalizada hoje' : 'OSs finalizadas hoje'}</span>
              </span>
              <span className="font-semibold text-emerald-700">Receita do Dia</span>
            </div>
          </div>

          {/* 2. O VALOR ACUMULADO TOTAL DE TODOS OS DIAS DO MÊS CORRENTE ATÉ O MOMENTO (MENSAL) */}
          <div className="bg-white border-2 border-slate-700 rounded-xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-800 text-white text-[10px] font-black rounded uppercase tracking-wider">
                    Item 2 • Mensal
                  </span>
                  <span className="text-xs font-bold text-slate-700">Acumulado do Mês Corrente</span>
                </div>
                <div className="p-2 bg-slate-100 text-slate-800 rounded-lg border border-slate-300">
                  <CalendarDays className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Período Vigente: <strong className="text-black">{capitalizedMonth}</strong>
                </span>
                <div className="text-3xl sm:text-4xl font-black text-black tracking-tight font-mono mt-1">
                  {formatCurrencyBRL(stats.monthlyAmount)}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
                <span>{stats.monthlyOrdersCount} {stats.monthlyOrdersCount === 1 ? 'OS no mês até agora' : 'OSs no mês até agora'}</span>
              </span>
              <span className="font-semibold text-slate-800">Total Mensal Acumulado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Secundário: Contadores e Histórico Geral */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Entradas */}
        <div 
          onClick={() => onFilterClick && onFilterClick('todos')}
          className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs transition-all hover:border-slate-500 hover:shadow-md cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Total de Entradas
            </span>
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <LogIn className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-black tracking-tight font-mono">
              {stats.totalEntries}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <Activity className="w-3 h-3 text-slate-500" />
              Equipamentos recebidos na SSDX
            </p>
          </div>
        </div>

        {/* Card 2: Equipamentos em Andamento */}
        <div 
          onClick={() => onFilterClick && onFilterClick('em_andamento')}
          className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs transition-all hover:border-slate-500 hover:shadow-md cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Em Andamento
            </span>
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-black tracking-tight font-mono">
              {stats.inProgress}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Em bancada / Diagnóstico Igor Zelnik
            </p>
          </div>
        </div>

        {/* Card 3: Saídas Concluídas */}
        <div 
          onClick={() => onFilterClick && onFilterClick('finalizado')}
          className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs transition-all hover:border-slate-500 hover:shadow-md cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Total de Saídas
            </span>
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-black tracking-tight font-mono">
              {stats.totalExits}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Equipamentos liberados / entregues
            </p>
          </div>
        </div>

        {/* Card 4: Valor Total Geral Acumulado */}
        <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs transition-all hover:border-slate-500 hover:shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Total Geral Acumulado
            </span>
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-black tracking-tight font-mono">
              {formatCurrencyBRL(stats.totalAmount)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3 text-slate-500" />
              Histórico geral faturado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
