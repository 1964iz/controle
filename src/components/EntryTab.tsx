import { useState, FormEvent } from 'react';
import { 
  Monitor, 
  Laptop, 
  PlusCircle, 
  CheckCircle2, 
  Phone, 
  User, 
  Wrench, 
  DollarSign, 
  Package, 
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { EquipmentType, ServiceOrder } from '../types';
import { addService } from '../services/db';

interface EntryTabProps {
  onSuccess: (newOrder: ServiceOrder) => void;
  nextOSPreview: number;
}

const COMMON_ACCESSORIES = [
  'Fonte / Carregador',
  'Cabo de Força',
  'Mochila / Capa',
  'Mouse',
  'Pendrive',
  'Bateria Externa',
  'Sem Acessórios'
];

export function EntryTab({ onSuccess, nextOSPreview }: EntryTabProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('notebook');
  const [brandModel, setBrandModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [accessories, setAccessories] = useState<string[]>(['Fonte / Carregador']);
  const [customAccessory, setCustomAccessory] = useState('');
  const [defectDescription, setDefectDescription] = useState('');
  const [budgetedValue, setBudgetedValue] = useState<string>('0');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [entryDate, setEntryDate] = useState(() => {
    const now = new Date();
    // Format to datetime-local input
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const toggleAccessory = (acc: string) => {
    if (accessories.includes(acc)) {
      setAccessories(accessories.filter(a => a !== acc));
    } else {
      setAccessories([...accessories, acc]);
    }
  };

  const handleAddCustomAccessory = (e: FormEvent) => {
    e.preventDefault();
    if (customAccessory.trim() && !accessories.includes(customAccessory.trim())) {
      setAccessories([...accessories, customAccessory.trim()]);
      setCustomAccessory('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!clientName.trim()) {
      setErrorMsg('Por favor, informe o nome do cliente.');
      return;
    }
    if (!brandModel.trim()) {
      setErrorMsg('Por favor, especifique a marca e o modelo do equipamento.');
      return;
    }
    if (!defectDescription.trim()) {
      setErrorMsg('Por favor, descreva o defeito relatado.');
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedBudget = parseFloat(budgetedValue.replace(',', '.')) || 0;

      const created = await addService({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        equipmentType,
        brandModel: brandModel.trim(),
        serialNumber: serialNumber.trim() || undefined,
        accessories,
        defectDescription: defectDescription.trim(),
        budgetedValue: parsedBudget,
        entryDate: new Date(entryDate).toISOString(),
        status: 'em_andamento',
        technicianNotes: technicianNotes.trim() || undefined
      });

      setSuccessMsg(`Entrada registrada com sucesso no IndexedDB! OS #${created.osNumber}`);
      onSuccess(created);

      // Reset form
      setClientName('');
      setClientPhone('');
      setBrandModel('');
      setSerialNumber('');
      setDefectDescription('');
      setBudgetedValue('0');
      setTechnicianNotes('');
      setAccessories(['Fonte / Carregador']);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao gravar no banco de dados';
      setErrorMsg('Falha ao registrar entrada: ' + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-xs overflow-hidden">
      {/* Header of Form Superior com Fundo Cinza Claro e Ícone de Computador Moderno */}
      <div className="bg-gray-100 border-b border-gray-300 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-white border border-gray-300 text-blue-600 rounded-xl shadow-xs flex items-center justify-center">
            <Monitor className="w-6 h-6 text-blue-600 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-blue-950">Aba Entrada: Registro de PC e Notebook</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-blue-900 border border-gray-300">
                SSDX Franca/SP
              </span>
            </div>
            <p className="text-xs text-blue-800">Atendimento Técnico Especializado por Igor Zelnik</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-300 px-3.5 py-1.5 rounded-lg shadow-2xs">
          <span className="text-xs font-semibold text-blue-800">Previsão de OS:</span>
          <span className="text-sm font-bold text-black font-mono">#{nextOSPreview}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-blue-50 border border-blue-300 text-blue-900 text-sm p-3.5 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Bloco 1: Dados do Cliente */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Dados do Cliente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clientName" className="block text-xs font-semibold text-blue-900 mb-1">
                Nome do Cliente <span className="text-red-500">*</span>
              </label>
              <input
                id="clientName"
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Carlos Alberto da Silva"
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm text-black placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="clientPhone" className="block text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Telefone / WhatsApp (Franca e Região)
              </label>
              <input
                id="clientPhone"
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="(16) 99999-9999"
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm text-black placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Equipamento */}
        <div className="border-t border-blue-100 pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" /> Identificação do Equipamento
          </h3>
          
          {/* Tipo de Equipamento */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-blue-900 mb-1.5">Tipo de Dispositivo</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                id="btn-type-notebook"
                onClick={() => setEquipmentType('notebook')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  equipmentType === 'notebook'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-600'
                    : 'border-blue-200 bg-white text-blue-800 hover:bg-blue-50/40'
                }`}
              >
                <Laptop className="w-4 h-4 text-blue-600" />
                Notebook
              </button>

              <button
                type="button"
                id="btn-type-desktop"
                onClick={() => setEquipmentType('pc_desktop')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  equipmentType === 'pc_desktop'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-600'
                    : 'border-blue-200 bg-white text-blue-800 hover:bg-blue-50/40'
                }`}
              >
                <Monitor className="w-4 h-4 text-blue-600" />
                PC Desktop
              </button>

              <button
                type="button"
                id="btn-type-allinone"
                onClick={() => setEquipmentType('all_in_one')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  equipmentType === 'all_in_one'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-600'
                    : 'border-blue-200 bg-white text-blue-800 hover:bg-blue-50/40'
                }`}
              >
                <Monitor className="w-4 h-4 text-blue-600" />
                All-in-One
              </button>

              <button
                type="button"
                id="btn-type-other"
                onClick={() => setEquipmentType('outro')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  equipmentType === 'outro'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-600'
                    : 'border-blue-200 bg-white text-blue-800 hover:bg-blue-50/40'
                }`}
              >
                <Package className="w-4 h-4 text-blue-600" />
                Outro
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="brandModel" className="block text-xs font-semibold text-blue-900 mb-1">
                Marca e Modelo <span className="text-red-500">*</span>
              </label>
              <input
                id="brandModel"
                type="text"
                required
                value={brandModel}
                onChange={(e) => setBrandModel(e.target.value)}
                placeholder="Ex: Dell Inspiron 15 3520 ou PC Core i5 Gamer"
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm text-black placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="serialNumber" className="block text-xs font-semibold text-blue-900 mb-1">
                Número de Série / Etiqueta / Service Tag
              </label>
              <input
                id="serialNumber"
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Ex: SN-87263481 ou Tag 5FD123"
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm text-black placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Acessórios Inclusos */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-blue-900 mb-1.5">
              Acessórios e Itens Deixados pelo Cliente
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_ACCESSORIES.map((acc) => {
                const isSelected = accessories.includes(acc);
                return (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => toggleAccessory(acc)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white font-medium shadow-xs'
                        : 'bg-white border-blue-200 text-blue-800 hover:bg-blue-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{acc}
                  </button>
                );
              })}
            </div>
            
            {/* Custom accessories input */}
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={customAccessory}
                onChange={(e) => setCustomAccessory(e.target.value)}
                placeholder="Outro acessório (ex: Adaptador HDMI)"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-blue-200 rounded-md text-black focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={handleAddCustomAccessory}
                className="px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold rounded-md transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Bloco 3: Defeito e Orçamento */}
        <div className="border-t border-blue-100 pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" /> Defeito e Orçamento Inicial
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="defectDescription" className="block text-xs font-semibold text-blue-900 mb-1">
                Defeito Relatado pelo Cliente / Sintomas <span className="text-red-500">*</span>
              </label>
              <textarea
                id="defectDescription"
                required
                rows={3}
                value={defectDescription}
                onChange={(e) => setDefectDescription(e.target.value)}
                placeholder="Ex: Não liga após queda de energia em Franca; tela azul intermitente; superaquecendo e desligando sozinho; lentidão no Windows..."
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm text-black placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="budgetedValue" className="block text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Valor Orçado Inicial (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm font-bold text-black">R$</span>
                  <input
                    id="budgetedValue"
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgetedValue}
                    onChange={(e) => setBudgetedValue(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white border border-blue-200 rounded-md text-base font-bold text-black focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <span className="text-[11px] text-blue-600">Pode ser alterado ou complementado no fechamento da saída.</span>
              </div>

              <div>
                <label htmlFor="entryDate" className="block text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" /> Data e Hora da Entrada
                </label>
                <input
                  id="entryDate"
                  type="datetime-local"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm font-medium text-black focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="technicianNotes" className="block text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" /> Observações Técnicas Iniciais (Igor Zelnik - SSDX)
              </label>
              <input
                id="technicianNotes"
                type="text"
                value={technicianNotes}
                onChange={(e) => setTechnicianNotes(e.target.value)}
                placeholder="Ex: Gabinete com marcas de uso na tampa; cabo de fonte com fita; teste preliminar acusa cooler travado..."
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md text-sm text-black placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Rodapé da Ação */}
        <div className="border-t border-blue-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-blue-700">
            Responsável: <strong className="text-blue-950">Igor Zelnik</strong> (Técnico / Operador SSDX Franca)
          </div>
          <button
            type="submit"
            id="btn-submit-entry"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            {isSubmitting ? 'Gravando no IndexedDB...' : 'Registrar Entrada de Equipamento'}
          </button>
        </div>
      </form>
    </div>
  );
}
