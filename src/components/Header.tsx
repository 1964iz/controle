import { 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  Wrench, 
  UserCheck, 
  ShoppingBag,
  LayoutDashboard,
  LogIn,
  LogOut,
  History,
  Monitor,
  Laptop
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'resumo' | 'entrada' | 'saida' | 'historico';
  setActiveTab: (tab: 'resumo' | 'entrada' | 'saida' | 'historico') => void;
  inProgressCount: number;
}

export function Header({ activeTab, setActiveTab, inProgressCount }: HeaderProps) {
  return (
    <header className="bg-gray-100 border-b border-gray-300 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main top header with light gray background */}
        <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo SSDX & Highlights with Modern Computer Icon */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-white border border-gray-300 text-blue-600 rounded-xl shadow-xs flex items-center justify-center relative group">
              {/* Modern Computer Icon */}
              <Monitor className="w-7 h-7 text-blue-600 stroke-[2.2]" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight text-blue-950 font-mono flex items-center gap-1.5">
                  SSDX
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white text-blue-900 border border-gray-300 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Operador desde 1997
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-blue-700 border border-gray-300 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Atendimento Franca - SP
                </span>
              </div>
              <p className="text-xs text-blue-800 font-medium mt-0.5 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-blue-600 inline" />
                Assistência Técnica Especializada em PC e Notebook
              </p>
            </div>
          </div>

          {/* Igor Zelnik - Credentials Card */}
          <div className="bg-white border border-gray-300 rounded-xl p-3 sm:px-4 sm:py-2.5 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              IZ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-black">Igor Zelnik</span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-semibold text-blue-800">
                <span className="flex items-center gap-0.5">
                  <Wrench className="w-3 h-3 text-blue-600" /> Técnico
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <UserCheck className="w-3 h-3 text-blue-600" /> Operador
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <ShoppingBag className="w-3 h-3 text-blue-600" /> Vendedor
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-blue-900 font-bold">
                  <GraduationCap className="w-3 h-3 text-blue-600" /> Formado em TI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-gray-300/80 py-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('resumo')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'resumo'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-900 hover:bg-white hover:text-blue-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Painel Resumo
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('entrada')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'entrada'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-900 hover:bg-white hover:text-blue-700'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Aba Entrada (Registrar PC/Notebook)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saida')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer relative ${
              activeTab === 'saida'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-900 hover:bg-white hover:text-blue-700'
            }`}
          >
            <LogOut className="w-4 h-4" />
            Aba Saída (Finalização)
            {inProgressCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'saida' ? 'bg-white text-blue-800' : 'bg-blue-600 text-white'
              }`}>
                {inProgressCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('historico')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'historico'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-900 hover:bg-white hover:text-blue-700'
            }`}
          >
            <History className="w-4 h-4" />
            Histórico Completo
          </button>
        </nav>
      </div>
    </header>
  );
}
