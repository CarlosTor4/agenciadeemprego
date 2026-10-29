import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ExternalLink,
  ShieldAlert,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Eye,
  Paperclip,
  Bell,
  Home,
  MessageSquare,
  Send,
  X
} from 'lucide-react';
import { CompanyProfile, JobFunction, JobApplication } from '../types';
import { formatCpfCnpj, formatPhone } from '../utils/masks';

interface CompanyDashboardProps {
  company: CompanyProfile;
  jobs: JobFunction[];
  applications: JobApplication[];
  onUpdateCompany: (company: CompanyProfile) => void;
  onAddJob: (job: Omit<JobFunction, 'id' | 'dataPublicacao'>) => void;
  onUpdateJobStatus: (jobId: string, status: 'ativa' | 'pausada' | 'preenchida') => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateApplicationStatus: (appId: string, status: JobApplication['status'], resposta?: string) => void;
  onBackToHome: () => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  company,
  jobs,
  applications,
  onUpdateCompany,
  onAddJob,
  onUpdateJobStatus,
  onDeleteJob,
  onUpdateApplicationStatus,
  onBackToHome,
}) => {
  // Tabs: 'empresa' | 'funcoes' | 'candidatos'
  const [activeTab, setActiveTab] = useState<'empresa' | 'funcoes' | 'candidatos'>('funcoes');
  
  // Filter states
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateFilterStatus, setCandidateFilterStatus] = useState<string>('todos');
  const [selectedJobIdForFilter, setSelectedJobIdForFilter] = useState<string>('todos');

  // Modal to view candidate resume file
  const [selectedResumeApp, setSelectedResumeApp] = useState<JobApplication | null>(null);

  // Modal to add new job function
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobSalario, setNewJobSalario] = useState('R$ 1.600,00');
  const [newJobBairro, setNewJobBairro] = useState(company.bairro);
  const [newJobTipo, setNewJobTipo] = useState<JobFunction['tipoContrato']>('CLT');
  const [newJobCargaHoraria, setNewJobCargaHoraria] = useState('44h semanais - Segunda a Sábado');
  const [newJobRequisitos, setNewJobRequisitos] = useState('Morar preferencialmente na região, boa vontade e pontualidade.');
  const [newJobDescricao, setNewJobDescricao] = useState('');
  const [newJobBeneficios, setNewJobBeneficios] = useState('Vale transporte local e lanche.');
  const [newJobVagas, setNewJobVagas] = useState(1);

  // Modal to confirm job deletion safely in UI (avoids blocked window.confirm in iframe)
  const [jobToDelete, setJobToDelete] = useState<JobFunction | null>(null);

  // Modal to respond / send message to candidate
  const [respondingApp, setRespondingApp] = useState<JobApplication | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<JobApplication['status']>('entrevista');
  const [responseSuccessToast, setResponseSuccessToast] = useState<string | null>(null);

  // Helper to format currency automatically (R$ X.XXX,XX)
  const formatCurrencyBRL = (value: string): string => {
    const cleanDigits = value.replace(/\D/g, '');
    if (!cleanDigits) return '';
    const numberValue = parseInt(cleanDigits, 10) / 100;
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw.trim()) {
      setNewJobSalario('');
      return;
    }
    const formatted = formatCurrencyBRL(raw);
    setNewJobSalario(formatted);
  };

  // Edit company details state
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyFormData, setCompanyFormData] = useState<CompanyProfile>(company);

  // Filter company specific jobs
  const companyJobs = jobs.filter(j => j.empresaId === company.id);

  // Filter company specific applications
  const companyApplications = applications.filter(a => a.empresaId === company.id);

  // Filtered candidate applications list
  const filteredApplications = companyApplications.filter(app => {
    const matchesSearch = 
      app.candidatoNome.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      app.vagaTitulo.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      app.candidatoBairro.toLowerCase().includes(candidateSearch.toLowerCase());

    const matchesStatus = candidateFilterStatus === 'todos' || app.status === candidateFilterStatus;
    const matchesJob = selectedJobIdForFilter === 'todos' || app.vagaId === selectedJobIdForFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(companyFormData);
    setIsEditingCompany(false);
  };

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    onAddJob({
      empresaId: company.id,
      empresaNome: company.nomeFantasia,
      titulo: newJobTitle,
      bairro: newJobBairro || company.bairro,
      cidade: company.cidade,
      salario: newJobSalario,
      tipoContrato: newJobTipo,
      requisitos: newJobRequisitos,
      cargaHoraria: newJobCargaHoraria,
      descricao: newJobDescricao || `Oportunidade para a função de ${newJobTitle} no ${company.nomeFantasia}.`,
      beneficios: newJobBeneficios,
      status: 'ativa',
      vagasDisponiveis: Number(newJobVagas) || 1,
    });

    // Reset and close
    setNewJobTitle('');
    setNewJobSalario('R$ 1.600,00');
    setNewJobDescricao('');
    setIsAddJobModalOpen(false);
  };

  const getWhatsAppLink = (phone: string, candidateName: string, jobTitle: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(
      `Olá ${candidateName}! Aqui é da ${company.nomeFantasia}. Vimos o seu cadastro na Agência de Emprego Popular para a vaga de "${jobTitle}". Gostaríamos de conversar sobre a oportunidade!`
    );
    return `https://api.whatsapp.com/send?phone=${fullPhone}&text=${text}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-20 text-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Header Banner for Company */}
        <div className="bg-[#091b34] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border-2 border-[#00b2fe]/30 mb-5 sm:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#00b2fe]/20 border border-[#00b2fe]/40 flex items-center justify-center text-[#00b2fe] shadow-inner shrink-0">
              <Building2 className="w-7 h-7 sm:w-9 sm:h-9" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                  {company.nomeFantasia}
                </h1>
                <span className="bg-[#00e5ff] text-[#091b34] text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Área da Empresa
                </span>
              </div>
              <p className="text-[#9ab8d6] text-xs sm:text-sm mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#00b2fe] shrink-0" />
                <span>{company.bairro} • {company.segmento}</span>
                <span className="text-white/40">•</span>
                <span>Resp: {company.responsavel}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsAddJobModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#00b2fe] hover:bg-[#00e5ff] text-[#091b34] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Nova Função</span>
            </button>
            <button
              onClick={onBackToHome}
              title="Sair da aba da empresa e voltar à página inicial do site"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Home className="w-4 h-4 text-[#00e5ff]" />
              <span>Sair da Aba / Início</span>
            </button>
          </div>
        </div>

        {/* ALERTA DE NOVO CURRÍCULO RECEBIDO */}
        {companyApplications.some(a => a.status === 'pendente') && (
          <div className="mb-5 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-2 border-[#00b2fe] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-pulse-subtle">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0055b8] text-white flex items-center justify-center shrink-0 shadow-md">
                <Bell className="w-5 h-5 text-[#00e5ff] animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#091b34]">
                    Você recebeu um novo currículo!
                  </h4>
                  <span className="bg-[#00e5ff] text-[#091b34] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Novo
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Há <strong>{companyApplications.filter(a => a.status === 'pendente').length}</strong> novo(s) currículo(s) enviado(s) por moradores da comunidade aguardando sua avaliação.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('candidatos')}
              className="px-4 py-2 rounded-xl bg-[#0055b8] hover:bg-[#091b34] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#00e5ff]" />
              <span>Ver Currículos Recebidos</span>
            </button>
          </div>
        )}

        {/* Tab Navigation for the 3 Requested Tables */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm mb-5 sm:mb-8">
          
          <button
            onClick={() => setActiveTab('empresa')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'empresa'
                ? 'bg-[#0055b8] text-white shadow-md'
                : 'text-slate-600 hover:text-[#0055b8] hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">1. Cadastro da Empresa</span>
          </button>

          <button
            onClick={() => setActiveTab('funcoes')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'funcoes'
                ? 'bg-[#0055b8] text-white shadow-md'
                : 'text-slate-600 hover:text-[#0055b8] hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span className="truncate">2. Cadastro de Funções ({companyJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('candidatos')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
              activeTab === 'candidatos'
                ? 'bg-[#0055b8] text-white shadow-md'
                : 'text-slate-600 hover:text-[#0055b8] hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">3. Currículos Recebidos ({companyApplications.length})</span>
            {companyApplications.filter(a => a.status === 'pendente').length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-[#00e5ff] text-[#091b34] font-black text-[10px] rounded-full animate-pulse shrink-0">
                Novo!
              </span>
            )}
          </button>

        </div>

        {/* TAB 1: CADASTRO DE EMPRESA */}
        {activeTab === 'empresa' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#091b34]">
                  Ficha Cadastral da Empresa no Bairro
                </h2>
                <p className="text-slate-500 text-sm">
                  Dados formais e operacionais do seu estabelecimento para os moradores e candidatos locais.
                </p>
              </div>
              <button
                onClick={() => setIsEditingCompany(!isEditingCompany)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:border-[#0055b8] text-[#0055b8] text-sm font-bold transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditingCompany ? 'Cancelar Edição' : 'Editar Dados'}</span>
              </button>
            </div>

            {isEditingCompany ? (
              <form onSubmit={handleSaveCompany} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Nome Fantasia (Como a comunidade conhece)
                    </label>
                    <input
                      type="text"
                      value={companyFormData.nomeFantasia}
                      onChange={e => setCompanyFormData({ ...companyFormData, nomeFantasia: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0055b8] text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Razão Social
                    </label>
                    <input
                      type="text"
                      value={companyFormData.razaoSocial}
                      onChange={e => setCompanyFormData({ ...companyFormData, razaoSocial: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0055b8] text-sm font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        CNPJ ou MEI (Opcional)
                      </label>
                      <span className="text-[10px] text-[#0055b8] font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                        Pontos Automáticos
                      </span>
                    </div>
                    <input
                      type="text"
                      value={companyFormData.cnpjOuMei}
                      onChange={e => setCompanyFormData({ ...companyFormData, cnpjOuMei: formatCpfCnpj(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0055b8] text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Ramo / Segmento Comercial
                    </label>
                    <input
                      type="text"
                      value={companyFormData.segmento}
                      onChange={e => setCompanyFormData({ ...companyFormData, segmento: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0055b8] text-sm font-medium"
                      placeholder="ex: Mercadinho, Padaria, Oficina, Salão, Restaurante..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Bairro Periférico
                    </label>
                    <input
                      type="text"
                      value={companyFormData.bairro}
                      onChange={e => setCompanyFormData({ ...companyFormData, bairro: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0055b8] text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Endereço Completo no Bairro
                    </label>
                    <input
                      type="text"
                      value={companyFormData.endereco}
                      onChange={e => setCompanyFormData({ ...companyFormData, endereco: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0055b8] text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Nome do Responsável / Proprietário
                    </label>
                    <input
                      type="text"
                      value={companyFormData.responsavel}
                      onChange={e => setCompanyFormData({ ...companyFormData, responsavel: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0055b8] text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Telefone / WhatsApp Comercial
                    </label>
                    <input
                      type="text"
                      value={companyFormData.telefone}
                      onChange={e => setCompanyFormData({ ...companyFormData, telefone: formatPhone(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0055b8] text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Descrição do Comércio e Ambiente de Trabalho
                  </label>
                  <textarea
                    rows={3}
                    value={companyFormData.descricao}
                    onChange={e => setCompanyFormData({ ...companyFormData, descricao: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0055b8] text-sm font-medium"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingCompany(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0055b8] hover:bg-[#000d6b] text-white text-sm font-bold flex items-center gap-2 shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Nome Comercial</span>
                  <p className="text-base font-extrabold text-[#091b34] mt-1">{company.nomeFantasia}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Razão Social / CNPJ</span>
                  <p className="text-base font-bold text-slate-700 mt-1">{company.razaoSocial || 'Não informado'}</p>
                  <span className="text-xs text-slate-500 font-mono">{company.cnpjOuMei || 'MEI / Comércio Familiar'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Bairro e Localização</span>
                  <p className="text-base font-bold text-[#0055b8] mt-1">{company.bairro}</p>
                  <span className="text-xs text-slate-500">{company.endereco || 'Endereço Local'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Segmento</span>
                  <p className="text-base font-bold text-slate-700 mt-1">{company.segmento}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Responsável Local</span>
                  <p className="text-base font-bold text-slate-700 mt-1">{company.responsavel}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">WhatsApp de Contato</span>
                  <p className="text-base font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{company.telefone}</span>
                  </p>
                </div>

                <div className="md:col-span-2 lg:col-span-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Sobre a Empresa</span>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{company.descricao}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CADASTRO DE FUNÇÕES / VAGAS */}
        {activeTab === 'funcoes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-[#091b34]">
                  Tabela de Cadastro de Funções e Vagas
                </h2>
                <p className="text-slate-500 text-sm">
                  Gerencie as funções disponíveis na sua empresa para os moradores do bairro se candidatarem.
                </p>
              </div>
              <button
                onClick={() => setIsAddJobModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-[#0055b8] hover:bg-[#000d6b] text-white font-bold text-sm shadow-md flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Nova Função</span>
              </button>
            </div>

            {/* Funções Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                      <th className="py-4 px-6">Função / Cargo</th>
                      <th className="py-4 px-6">Bairro</th>
                      <th className="py-4 px-6">Salário / Remuneração</th>
                      <th className="py-4 px-6">Contrato</th>
                      <th className="py-4 px-6 text-center">Vagas</th>
                      <th className="py-4 px-6 text-center">Candidatos</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {companyJobs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                          Nenhuma função cadastrada ainda. Clique no botão acima para adicionar a primeira vaga do seu comércio!
                        </td>
                      </tr>
                    ) : (
                      companyJobs.map(job => {
                        const countCandidates = applications.filter(a => a.vagaId === job.id).length;
                        return (
                          <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-6">
                              <div className="font-bold text-[#091b34]">{job.titulo}</div>
                              <div className="text-xs text-slate-400">{job.cargaHoraria}</div>
                            </td>
                            <td className="py-4 px-6 font-medium text-slate-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#00b2fe]" />
                                {job.bairro}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-extrabold text-[#0055b8]">
                              {job.salario}
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                {job.tipoContrato}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center font-bold text-slate-700">
                              {job.vagasDisponiveis}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => {
                                  setSelectedJobIdForFilter(job.id);
                                  setActiveTab('candidatos');
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f9ff] hover:bg-[#e0f2fe] text-[#0055b8] font-bold text-xs border border-[#bbf6fc] transition-colors cursor-pointer"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>{countCandidates} inscritos</span>
                              </button>
                            </td>
                            <td className="py-4 px-6 text-center">
                              {job.status === 'ativa' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                  Ativa
                                </span>
                              ) : job.status === 'pausada' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  Pausada
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                  Preenchida
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => onUpdateJobStatus(job.id, job.status === 'ativa' ? 'pausada' : 'ativa')}
                                  title={job.status === 'ativa' ? 'Pausar recebimento de currículos' : 'Reativar vaga'}
                                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer"
                                >
                                  {job.status === 'ativa' ? 'Pausar' : 'Ativar'}
                                </button>
                                <button
                                  onClick={() => setJobToDelete(job)}
                                  title="Excluir função"
                                  className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CADASTRO DE CANDIDATOS */}
        {activeTab === 'candidatos' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#091b34]">
                  Tabela de Cadastro de Candidatos Inscritos
                </h2>
                <p className="text-slate-500 text-sm">
                  Moradores que se candidataram para trabalhar na sua empresa. Entre em contato rápido pelo WhatsApp!
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-sm">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, função ou bairro..."
                    value={candidateSearch}
                    onChange={e => setCandidateSearch(e.target.value)}
                    className="bg-transparent focus:outline-none text-xs sm:text-sm text-slate-700 w-48"
                  />
                </div>

                <select
                  value={candidateFilterStatus}
                  onChange={e => setCandidateFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="em_analise">Em Análise</option>
                  <option value="entrevista">Entrevista</option>
                  <option value="aprovado">Aprovado</option>
                </select>

                <select
                  value={selectedJobIdForFilter}
                  onChange={e => setSelectedJobIdForFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="todos">Todas as Funções</option>
                  {companyJobs.map(j => (
                    <option key={j.id} value={j.id}>{j.titulo}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                      <th className="py-4 px-6">Candidato(a)</th>
                      <th className="py-4 px-6">Bairro de Residência</th>
                      <th className="py-4 px-6">Função Solicitada</th>
                      <th className="py-4 px-6">Escolaridade & Experiência</th>
                      <th className="py-4 px-6">Status da Seleção</th>
                      <th className="py-4 px-6 text-right">Contato & Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                          Nenhum candidato encontrado com os filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map(app => {
                        const isSameNeighborhood = app.candidatoBairro.toLowerCase() === company.bairro.toLowerCase();

                        return (
                          <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Candidate Name & Date */}
                            <td className="py-4 px-6">
                              <div className="font-bold text-[#091b34]">{app.candidatoNome}</div>
                              <div className="text-xs text-slate-400">Inscrito em: {app.dataCandidatura}</div>
                              {app.mensagem && (
                                <div className="mt-1 text-xs text-slate-600 bg-slate-100 p-2 rounded-lg italic max-w-xs">
                                  "{app.mensagem}"
                                </div>
                              )}
                            </td>

                            {/* Neighborhood with Proximity Badge */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                <MapPin className="w-4 h-4 text-[#00b2fe]" />
                                <span>{app.candidatoBairro}</span>
                              </div>
                              {isSameNeighborhood ? (
                                <span className="inline-block mt-1 text-[10px] font-extrabold bg-[#c2f8ff] text-[#0055b8] px-2 py-0.5 rounded-full">
                                  ★ Vizinho do mesmo bairro!
                                </span>
                              ) : (
                                <span className="inline-block mt-1 text-[10px] font-medium text-slate-400">
                                  Bairro próximo
                                </span>
                              )}
                            </td>

                            {/* Job Function */}
                            <td className="py-4 px-6">
                              <span className="font-bold text-[#0055b8]">{app.vagaTitulo}</span>
                            </td>

                            {/* Qualifications & Resume File */}
                            <td className="py-4 px-6 max-w-xs">
                              <div className="text-xs font-semibold text-slate-800">{app.candidatoEscolaridade}</div>
                              <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{app.candidatoExperiencia}</div>
                              
                              {app.curriculoArquivo ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedResumeApp(app)}
                                  className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#091b34] text-[11px] font-bold border border-[#00b2fe]/40 transition-all cursor-pointer shadow-xs group"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#00b2fe] group-hover:scale-110 transition-transform" />
                                  <span className="truncate max-w-[170px]">{app.curriculoArquivo.nome}</span>
                                  <span className="text-[9px] bg-white px-1.5 py-0.5 rounded text-slate-500 font-semibold">{app.curriculoArquivo.tamanho}</span>
                                </button>
                              ) : (
                                <span className="mt-1.5 inline-block text-[10px] text-slate-400 font-medium">
                                  Currículo preenchido online
                                </span>
                              )}
                            </td>

                            {/* Status selector */}
                            <td className="py-4 px-6">
                              <select
                                value={app.status}
                                onChange={e => onUpdateApplicationStatus(app.id, e.target.value as JobApplication['status'])}
                                className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                                  app.status === 'aprovado'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                    : app.status === 'entrevista'
                                    ? 'bg-blue-50 text-[#0055b8] border-blue-300'
                                    : app.status === 'em_analise'
                                    ? 'bg-purple-50 text-purple-700 border-purple-300'
                                    : 'bg-amber-50 text-amber-700 border-amber-300'
                                }`}
                              >
                                <option value="pendente">Pendente</option>
                                <option value="em_analise">Em Análise</option>
                                <option value="entrevista">Chamar p/ Entrevista</option>
                                <option value="aprovado">Aprovado / Contratado</option>
                                <option value="rejeitado">Banco de Reserva</option>
                              </select>

                              {app.respostaEmpresa && (
                                <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
                                  <div className="flex items-center gap-1 font-bold text-emerald-800">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span>Mensagem enviada:</span>
                                  </div>
                                  <p className="italic mt-0.5 line-clamp-2 font-medium">"{app.respostaEmpresa}"</p>
                                </div>
                              )}
                            </td>

                            {/* Actions: Responder Candidato & WhatsApp */}
                            <td className="py-4 px-6 text-right">
                              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRespondingApp(app);
                                    setResponseMessage(app.respostaEmpresa || '');
                                    setResponseStatus(app.status === 'pendente' ? 'entrevista' : app.status);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0055b8] hover:bg-[#004494] text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer whitespace-nowrap active:scale-95"
                                  title="Enviar resposta ou mensagem para o candidato"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-[#00e5ff]" />
                                  <span>{app.respostaEmpresa ? 'Alterar Resposta' : 'Responder'}</span>
                                </button>

                                <a
                                  href={getWhatsAppLink(app.candidatoTelefone, app.candidatoNome, app.vagaTitulo)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all whitespace-nowrap"
                                  title="Chamar candidato no WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Cadastrar Nova Função */}
      {isAddJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-[#091b34]">Cadastrar Nova Função / Vaga</h3>
                <p className="text-xs text-slate-500">Publicação imediata para os moradores da região</p>
              </div>
              <button
                onClick={() => setIsAddJobModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Título da Função / Cargo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Atendente de Padaria, Repositor, Ajudante Geral..."
                  value={newJobTitle}
                  onChange={e => setNewJobTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8] font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Salário / Remuneração Prevista *
                    </label>
                    <span className="text-[10px] text-[#0055b8] font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      R$ Automático
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="R$ 0,00"
                    value={newJobSalario}
                    onChange={handleSalarioChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#00b2fe] focus:ring-1 focus:ring-[#00b2fe] font-bold text-[#091b34]"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Digite apenas os números do valor. O <strong>R$</strong> e as vírgulas são automáticos.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tipo de Contratação
                  </label>
                  <select
                    value={newJobTipo}
                    onChange={e => setNewJobTipo(e.target.value as JobFunction['tipoContrato'])}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                  >
                    <option value="CLT">CLT (Carteira Assinada)</option>
                    <option value="MEI">MEI / Prestador de Serviço</option>
                    <option value="Diária">Diária / Cachê</option>
                    <option value="Meio Período">Meio Período</option>
                    <option value="Estágio / Jovem Aprendiz">Jovem Aprendiz</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Bairro da Vaga
                  </label>
                  <input
                    type="text"
                    value={newJobBairro}
                    onChange={e => setNewJobBairro(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Quantidade de Vagas
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newJobVagas}
                    onChange={e => setNewJobVagas(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Carga Horária / Escala de Trabalho
                </label>
                <input
                  type="text"
                  placeholder="Ex: Segunda a Sexta das 08h às 17h, Sábado das 08h às 12h"
                  value={newJobCargaHoraria}
                  onChange={e => setNewJobCargaHoraria(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Requisitos Principais
                </label>
                <input
                  type="text"
                  placeholder="Ex: Residir no bairro, boa comunicação, não exige experiência prévia..."
                  value={newJobRequisitos}
                  onChange={e => setNewJobRequisitos(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Benefícios Oferecidos
                </label>
                <input
                  type="text"
                  placeholder="Ex: Vale transporte, lanche no local, desconto em produtos..."
                  value={newJobBeneficios}
                  onChange={e => setNewJobBeneficios(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Descrição das Atividades Diárias
                </label>
                <textarea
                  rows={2}
                  placeholder="Explique o que a pessoa fará no dia a dia do comércio..."
                  value={newJobDescricao}
                  onChange={e => setNewJobDescricao(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddJobModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0055b8] hover:bg-[#000d6b] text-white font-bold text-sm shadow-md"
                >
                  Publicar Função no Bairro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Visualizar Arquivo de Currículo do Candidato */}
      {selectedResumeApp && selectedResumeApp.curriculoArquivo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0055b8]/10 text-[#0055b8] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0055b8]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#091b34]">Arquivo de Currículo Anexado</h3>
                  <p className="text-xs text-slate-500">{selectedResumeApp.candidatoNome} • {selectedResumeApp.candidatoBairro}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedResumeApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* File info card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#00b2fe]" />
                  <span className="text-sm font-bold text-[#091b34] truncate max-w-xs">
                    {selectedResumeApp.curriculoArquivo.nome}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                  {selectedResumeApp.curriculoArquivo.tamanho}
                </span>
              </div>

              {selectedResumeApp.curriculoArquivo.dadosBase64 ? (
                <a
                  href={selectedResumeApp.curriculoArquivo.dadosBase64}
                  download={selectedResumeApp.curriculoArquivo.nome}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0055b8] hover:bg-[#000d6b] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo Completo ({selectedResumeApp.curriculoArquivo.nome})</span>
                </a>
              ) : (
                <div className="text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Currículo verificado e registrado no banco de dados da Agência de Emprego Popular.</span>
                </div>
              )}
            </div>

            {/* Candidate quick profile summary */}
            <div className="space-y-3 mb-6 text-xs text-slate-700">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                <p><strong>Função de Interesse:</strong> {selectedResumeApp.vagaTitulo}</p>
                <p><strong>Escolaridade:</strong> {selectedResumeApp.candidatoEscolaridade}</p>
                <p><strong>Telefone / WhatsApp:</strong> {selectedResumeApp.candidatoTelefone}</p>
                {selectedResumeApp.mensagem && (
                  <p className="pt-1 italic text-slate-600">"{selectedResumeApp.mensagem}"</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedResumeApp(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Fechar
              </button>
              <a
                href={getWhatsAppLink(selectedResumeApp.candidatoTelefone, selectedResumeApp.candidatoNome, selectedResumeApp.vagaTitulo)}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Conversar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Delete Job (Works reliably without window.confirm) */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#091b34] mb-2">
              Excluir Vaga / Função?
            </h3>

            <p className="text-sm text-slate-600 mb-4">
              Tem certeza que deseja remover a vaga <strong>"{jobToDelete.titulo}"</strong> ({jobToDelete.bairro})?
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 mb-6">
              Esta ação removerá a oportunidade da lista de vagas no bairro. Moradores não poderão mais se candidatar a ela.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = jobToDelete.id;
                  onDeleteJob(id);
                  setJobToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir Vaga</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Respond to Candidate / Send Message */}
      {respondingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] text-[#0055b8] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#0055b8]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#091b34]">
                    Responder Candidato
                  </h3>
                  <p className="text-xs text-slate-500">
                    {respondingApp.candidatoNome} • Vaga: <strong>{respondingApp.vagaTitulo}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRespondingApp(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateApplicationStatus(
                  respondingApp.id,
                  responseStatus,
                  responseMessage.trim() || undefined
                );
                setResponseSuccessToast(`Mensagem enviada com sucesso para ${respondingApp.candidatoNome}!`);
                setTimeout(() => setResponseSuccessToast(null), 4000);
                setRespondingApp(null);
              }}
              className="mt-4 space-y-4"
            >
              {/* Status selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Atualizar Status da Candidatura
                </label>
                <select
                  value={responseStatus}
                  onChange={(e) => setResponseStatus(e.target.value as JobApplication['status'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-[#0055b8]"
                >
                  <option value="entrevista">📅 Chamar para Entrevista</option>
                  <option value="aprovado">✅ Aprovado / Contratado</option>
                  <option value="em_analise">⏳ Em Análise</option>
                  <option value="rejeitado">💼 Banco de Reserva</option>
                </select>
              </div>

              {/* Quick message templates */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Mensagens Rápidas Sugeridas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      label: '📅 Convidar Entrevista',
                      status: 'entrevista' as const,
                      text: `Olá ${respondingApp.candidatoNome}! Seu currículo foi avaliado e queremos agendar uma entrevista presencial aqui no nosso estabelecimento. Por favor, confirme seu horário.`,
                    },
                    {
                      label: '✅ Perfil Aprovado',
                      status: 'aprovado' as const,
                      text: `Parabéns ${respondingApp.candidatoNome}! Seu perfil foi selecionado para a vaga de ${respondingApp.vagaTitulo}. Entraremos em contato com os próximos passos.`,
                    },
                    {
                      label: '⏳ Currículo em Análise',
                      status: 'em_analise' as const,
                      text: `Olá ${respondingApp.candidatoNome}, recebemos seu currículo para ${respondingApp.vagaTitulo} e estamos analisando as candidaturas. Em breve daremos retorno!`,
                    },
                    {
                      label: '💼 Banco de Reserva',
                      status: 'rejeitado' as const,
                      text: `Olá ${respondingApp.candidatoNome}, agradecemos muito sua candidatura. Guardamos seu currículo em nosso banco de talentos para futuras vagas!`,
                    },
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setResponseMessage(tpl.text);
                        setResponseStatus(tpl.status);
                      }}
                      className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-[#00b2fe] hover:bg-sky-50 text-[11px] font-semibold text-slate-700 transition-all cursor-pointer"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Mensagem para o Candidato *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva a mensagem ou resposta para o candidato..."
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8] focus:ring-1 focus:ring-[#0055b8]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  O candidato receberá a notificação: <em>"Você tem uma nova mensagem da empresa..."</em> no painel dele.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRespondingApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0055b8] hover:bg-[#004494] text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Resposta ao Candidato</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success notification toast for enterprise */}
      {responseSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#091b34] text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-400 flex items-center gap-2.5 text-xs font-bold animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{responseSuccessToast}</span>
        </div>
      )}

    </div>
  );
};
