import React, { useState, useRef } from 'react';
import { 
  Building2, 
  UserCheck, 
  X, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Store,
  FileText,
  UploadCloud,
  Paperclip,
  Trash2,
  Lock,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { CandidateProfile, CompanyProfile, ResumeFile } from '../types';
import { formatCpf, formatCnpj, formatCpfCnpj, formatPhone } from '../utils/masks';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'candidato' | 'empresa';
  onRegisterCandidate: (candidate: Omit<CandidateProfile, 'id' | 'dataCadastro'>) => void;
  onRegisterCompany: (company: Omit<CompanyProfile, 'id' | 'dataCadastro'>) => void;
  onQuickLogin: (role: 'candidato' | 'empresa', id: string) => void;
  existingCompanies: CompanyProfile[];
  existingCandidates: CandidateProfile[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'candidato',
  onRegisterCandidate,
  onRegisterCompany,
  onQuickLogin,
  existingCompanies,
  existingCandidates,
}) => {
  const [activeTab, setActiveTab] = useState<'candidato' | 'empresa'>(defaultRole);
  const [authMode, setAuthMode] = useState<'cadastro' | 'login'>('cadastro');

  // Candidate form fields
  const [candNome, setCandNome] = useState('');
  const [candCpf, setCandCpf] = useState('');
  const [candTelefone, setCandTelefone] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candBairro, setCandBairro] = useState('Jardim Esperança');
  const [candCargo, setCandCargo] = useState('');
  const [candEscolaridade, setCandEscolaridade] = useState('Ensino Médio Completo');
  const [candExperiencia, setCandExperiencia] = useState('');
  const [candResumo, setCandResumo] = useState('');
  const [candSenha, setCandSenha] = useState('');
  const [curriculoArquivo, setCurriculoArquivo] = useState<ResumeFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const sizeInKb = (file.size / 1024).toFixed(1);
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${sizeInKb} KB`;

      setCurriculoArquivo({
        nome: file.name,
        tamanho: sizeStr,
        tipo: file.type || 'application/pdf',
        dadosBase64: base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setCurriculoArquivo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Company form fields
  const [compNomeFantasia, setCompNomeFantasia] = useState('');
  const [compRazaoSocial, setCompRazaoSocial] = useState('');
  const [compCnpjMei, setCompCnpjMei] = useState('');
  const [compSegmento, setCompSegmento] = useState('');
  const [compBairro, setCompBairro] = useState('Jardim Esperança');
  const [compEndereco, setCompEndereco] = useState('');
  const [compResponsavel, setCompResponsavel] = useState('');
  const [compTelefone, setCompTelefone] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [compDescricao, setCompDescricao] = useState('');
  const [compSenha, setCompSenha] = useState('');

  // Login form fields
  const [loginEmpresaIdentificador, setLoginEmpresaIdentificador] = useState('');
  const [loginEmpresaSenha, setLoginEmpresaSenha] = useState('');
  const [loginEmpresaError, setLoginEmpresaError] = useState<string | null>(null);

  const [loginCandidatoIdentificador, setLoginCandidatoIdentificador] = useState('');
  const [loginCandidatoSenha, setLoginCandidatoSenha] = useState('');
  const [loginCandidatoError, setLoginCandidatoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCompanyLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginEmpresaError(null);
    const query = loginEmpresaIdentificador.trim().toLowerCase();
    const queryDigits = loginEmpresaIdentificador.replace(/\D/g, '');

    if (!query) {
      setLoginEmpresaError('Por favor, informe o CNPJ/MEI ou o E-mail cadastrado da empresa.');
      return;
    }

    const matched = existingCompanies.find(c => {
      const cnpjDigits = c.cnpjOuMei.replace(/\D/g, '');
      const email = c.email.trim().toLowerCase();
      const nome = c.nomeFantasia.trim().toLowerCase();
      const phoneDigits = c.telefone.replace(/\D/g, '');

      return (
        (queryDigits.length >= 4 && cnpjDigits && cnpjDigits.includes(queryDigits)) ||
        (queryDigits.length >= 8 && phoneDigits && phoneDigits.includes(queryDigits)) ||
        (email && email === query) ||
        (nome && nome === query)
      );
    });

    if (matched) {
      if (matched.senha && loginEmpresaSenha && matched.senha !== loginEmpresaSenha) {
        setLoginEmpresaError('Senha incorreta para esta empresa.');
        return;
      }
      onQuickLogin('empresa', matched.id);
      onClose();
    } else {
      setLoginEmpresaError('Nenhuma empresa encontrada com estes dados no banco de dados. Verifique os dados digitados ou realize um Novo Cadastro.');
    }
  };

  const handleCandidateLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginCandidatoError(null);
    const query = loginCandidatoIdentificador.trim().toLowerCase();
    const queryDigits = loginCandidatoIdentificador.replace(/\D/g, '');

    if (!query) {
      setLoginCandidatoError('Por favor, informe seu CPF, WhatsApp ou e-mail cadastrado.');
      return;
    }

    const matched = existingCandidates.find(c => {
      const email = c.email.trim().toLowerCase();
      const phoneDigits = c.telefone.replace(/\D/g, '');
      const cpfDigits = c.cpf ? c.cpf.replace(/\D/g, '') : '';
      const nome = c.nome.trim().toLowerCase();

      return (
        (queryDigits.length >= 8 && phoneDigits && phoneDigits.includes(queryDigits)) ||
        (queryDigits.length >= 8 && cpfDigits && cpfDigits.includes(queryDigits)) ||
        (email && email === query) ||
        (nome && nome === query)
      );
    });

    if (matched) {
      if (matched.senha && loginCandidatoSenha && matched.senha !== loginCandidatoSenha) {
        setLoginCandidatoError('Senha incorreta para este candidato.');
        return;
      }
      onQuickLogin('candidato', matched.id);
      onClose();
    } else {
      setLoginCandidatoError('Candidato não encontrado no banco de dados. Verifique os dados digitados ou realize um Novo Cadastro.');
    }
  };

  const handleCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candNome || !candTelefone) return;

    onRegisterCandidate({
      nome: candNome,
      cpf: candCpf ? formatCpf(candCpf) : undefined,
      email: candEmail || `${candNome.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      telefone: candTelefone,
      bairro: candBairro,
      cidade: 'Comunidade Periférica',
      cargoDesejado: candCargo || 'Atendente / Ajudante Geral',
      escolaridade: candEscolaridade,
      experiencia: candExperiencia || 'Experiência em comércios locais e trabalhos na vizinhança.',
      habilidades: ['Pontualidade', 'Bom relacionamento com o público'],
      resumo: candResumo || `Morador(a) do bairro ${candBairro} com disposição para trabalhar.`,
      disponibilidade: 'imediata',
      curriculoArquivo: curriculoArquivo || undefined,
      senha: candSenha || undefined,
    });
    onClose();
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compNomeFantasia || !compTelefone) return;

    onRegisterCompany({
      nomeFantasia: compNomeFantasia,
      razaoSocial: compRazaoSocial || `${compNomeFantasia} Serviços`,
      cnpjOuMei: compCnpjMei || 'MEI / Comércio Familiar',
      segmento: compSegmento,
      bairro: compBairro,
      cidade: 'Comunidade Periférica',
      endereco: compEndereco || 'Rua Principal do Bairro',
      responsavel: compResponsavel || 'Proprietário Local',
      telefone: compTelefone,
      email: compEmail || `${compNomeFantasia.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      descricao: compDescricao || `Estabelecimento comercial localizado no bairro ${compBairro}.`,
      senha: compSenha || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center max-w-md mx-auto mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-[#f0f9ff] text-[11px] sm:text-xs font-bold text-[#0055b8] mb-1.5 sm:mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00b2fe]" />
            <span>Acesso Simplificado e Gratuito</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#091b34]">
            {authMode === 'cadastro' ? 'Criar Cadastro na Agência' : 'Entrar no Sistema'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
            Selecione seu perfil abaixo para continuar
          </p>
        </div>

        {/* Role Selector Tabs (Candidato vs Empresa) */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-slate-100 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('candidato')}
            className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              activeTab === 'candidato'
                ? 'bg-white text-[#0055b8] shadow-sm'
                : 'text-slate-600 hover:text-[#0055b8]'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#00b2fe] shrink-0" />
            <span className="truncate">Candidato</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('empresa')}
            className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              activeTab === 'empresa'
                ? 'bg-[#091b34] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#091b34]'
            }`}
          >
            <Store className="w-4 h-4 text-[#00e5ff] shrink-0" />
            <span className="truncate">Comerciante</span>
          </button>
        </div>

        {/* Mode Switch: Cadastro vs Login */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold mb-6 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setAuthMode('cadastro')}
            className={`pb-1 transition-all ${authMode === 'cadastro' ? 'text-[#0055b8] border-b-2 border-[#0055b8] font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Novo Cadastro
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`pb-1 transition-all ${authMode === 'login' ? 'text-[#0055b8] border-b-2 border-[#0055b8] font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Acessar Minha Conta / Login
          </button>
        </div>

        {/* SECURE LOGIN SECTION (Does NOT expose registered companies or candidates publicly) */}
        {authMode === 'login' && (
          <div className="py-1">
            {activeTab === 'empresa' ? (
              <form onSubmit={handleCompanyLoginSubmit} className="space-y-4">
                <div className="bg-[#091b34] text-white p-4 rounded-2xl border border-[#00b2fe]/30">
                  <div className="flex items-center gap-2.5 text-[#00b2fe] font-bold text-sm mb-1">
                    <Building2 className="w-5 h-5 shrink-0" />
                    <span>Acesso da Empresa & Comércio</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Digite o CNPJ/MEI ou o E-mail cadastrado da sua empresa para entrar no Painel Exclusivo.
                  </p>
                </div>

                {loginEmpresaError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">{loginEmpresaError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmpresaError(null);
                          setAuthMode('cadastro');
                        }}
                        className="text-[#0055b8] font-bold underline mt-1 block"
                      >
                        Clique aqui para Cadastrar sua Empresa agora
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      CNPJ / MEI ou E-mail da Empresa *
                    </label>
                    <span className="text-[10px] text-[#0055b8] font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      Pontos e Barra Automáticos no CNPJ
                    </span>
                  </div>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: 00.000.000/0001-00 ou contato@empresa.com"
                      value={loginEmpresaIdentificador}
                      onChange={e => {
                        const val = e.target.value;
                        setLoginEmpresaIdentificador(formatCpfCnpj(val));
                        setLoginEmpresaError(null);
                      }}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#00b2fe] focus:ring-1 focus:ring-[#00b2fe] font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Digite apenas os números. Os pontos e barras são inseridos automaticamente.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Senha de Acesso da Empresa
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="Digite sua senha de acesso"
                      value={loginEmpresaSenha}
                      onChange={e => setLoginEmpresaSenha(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#00b2fe] focus:ring-1 focus:ring-[#00b2fe]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#00b2fe] hover:bg-[#009ee0] text-white font-bold text-sm shadow-md shadow-[#00b2fe]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar no Painel da Empresa</span>
                </button>

                <div className="pt-2 text-center text-xs text-slate-500">
                  Ainda não cadastrou sua empresa?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmpresaError(null);
                      setAuthMode('cadastro');
                    }}
                    className="text-[#0055b8] font-bold hover:underline"
                  >
                    Cadastrar Empresa no Bairro
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCandidateLoginSubmit} className="space-y-4">
                <div className="bg-[#091b34] text-white p-4 rounded-2xl border border-[#00b2fe]/30">
                  <div className="flex items-center gap-2.5 text-[#00b2fe] font-bold text-sm mb-1">
                    <User className="w-5 h-5 shrink-0" />
                    <span>Acesso do Morador / Candidato</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Informe seu telefone/WhatsApp ou e-mail cadastrado para entrar na sua conta.
                  </p>
                </div>

                {loginCandidatoError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">{loginCandidatoError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginCandidatoError(null);
                          setAuthMode('cadastro');
                        }}
                        className="text-[#0055b8] font-bold underline mt-1 block"
                      >
                        Fazer Cadastro Individual Gratuito
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      CPF, WhatsApp ou E-mail *
                    </label>
                    <span className="text-[10px] text-[#0055b8] font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      Pontos Automáticos no CPF
                    </span>
                  </div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: 000.000.000-00, (11) 98765-4321 ou e-mail"
                      value={loginCandidatoIdentificador}
                      onChange={e => {
                        const val = e.target.value;
                        setLoginCandidatoIdentificador(formatCpfCnpj(val));
                        setLoginCandidatoError(null);
                      }}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#00b2fe] focus:ring-1 focus:ring-[#00b2fe] font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ao digitar seu CPF, os pontos e traço são inseridos automaticamente.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Senha de Acesso
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="Digite sua senha"
                      value={loginCandidatoSenha}
                      onChange={e => setLoginCandidatoSenha(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#00b2fe] focus:ring-1 focus:ring-[#00b2fe]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#00b2fe] hover:bg-[#009ee0] text-white font-bold text-sm shadow-md shadow-[#00b2fe]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar na Minha Conta</span>
                </button>

                <div className="pt-2 text-center text-xs text-slate-500">
                  Ainda não tem cadastro individual?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setLoginCandidatoError(null);
                      setAuthMode('cadastro');
                    }}
                    className="text-[#0055b8] font-bold hover:underline"
                  >
                    Fazer Cadastro Gratuito
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* CADASTRO FORM: CANDIDATO */}
        {authMode === 'cadastro' && activeTab === 'candidato' && (
          <form onSubmit={handleCandidateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Maria Eduarda dos Santos"
                  value={candNome}
                  onChange={e => setCandNome(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    CPF (Opcional)
                  </label>
                  <span className="text-[10px] text-[#0055b8] font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    Pontos Automáticos
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={candCpf}
                  onChange={e => setCandCpf(formatCpf(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8] font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={candTelefone}
                  onChange={e => setCandTelefone(formatPhone(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  E-mail (opcional)
                </label>
                <input
                  type="email"
                  placeholder="seuemail@gmail.com"
                  value={candEmail}
                  onChange={e => setCandEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Seu Bairro Periférico *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jardim Esperança, Vila Nova..."
                  value={candBairro}
                  onChange={e => setCandBairro(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Função ou Cargo de Interesse
                </label>
                <input
                  type="text"
                  placeholder="Ex: Balcão, Caixa, Repositor, Ajudante..."
                  value={candCargo}
                  onChange={e => setCandCargo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Escolaridade
              </label>
              <select
                value={candEscolaridade}
                onChange={e => setCandEscolaridade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
              >
                <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
                <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
                <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                <option value="Técnico em Andamento / Concluído">Curso Técnico</option>
                <option value="Ensino Superior">Ensino Superior</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Resumo de Experiências / Habilidades
              </label>
              <textarea
                rows={2}
                placeholder="Conte brevemente onde já trabalhou ou o que sabe fazer..."
                value={candExperiencia}
                onChange={e => setCandExperiencia(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
              ></textarea>
            </div>

            {/* OPÇÃO DE ANEXAR ARQUIVO DO CURRÍCULO */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Arquivo do Currículo (Opcional)
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  PDF, DOCX ou Foto
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
                id="curriculo-upload-input"
              />

              {!curriculoArquivo ? (
                <label
                  htmlFor="curriculo-upload-input"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-[#00b2fe]/40 hover:border-[#0055b8] bg-[#f0f9ff]/60 hover:bg-[#e0f2fe]/70 cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#bbf6fc] flex items-center justify-center text-[#00b2fe] group-hover:scale-105 group-hover:text-[#0055b8] transition-all shadow-xs mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#091b34] group-hover:text-[#0055b8] transition-colors">
                    Clique para anexar seu currículo (PDF, Word ou Imagem)
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Se já tiver um currículo pronto no celular ou computador, envie aqui
                  </span>
                </label>
              ) : (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#e0f2fe]/70 border border-[#00b2fe]/40">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-[#0055b8] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-[#091b34] truncate max-w-[220px] sm:max-w-xs">
                        {curriculoArquivo.nome}
                      </div>
                      <div className="text-[10px] text-[#0055b8] flex items-center gap-1.5 mt-0.5 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Arquivo anexado ({curriculoArquivo.tamanho})</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    title="Remover arquivo"
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Criar Senha de Acesso *
                </label>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Para acessar suas candidaturas depois
                </span>
              </div>
              <input
                type="password"
                placeholder="Crie uma senha de acesso (mínimo 4 dígitos)"
                value={candSenha}
                onChange={e => setCandSenha(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#00b2fe] hover:bg-[#009ee0] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Cadastro e Buscar Vagas</span>
            </button>
          </form>
        )}

        {/* CADASTRO FORM: EMPRESA */}
        {authMode === 'cadastro' && activeTab === 'empresa' && (
          <form onSubmit={handleCompanySubmit} className="space-y-4">
            <div className="p-3 bg-[#e0f2fe]/60 border border-[#73bbf8]/50 rounded-xl text-xs text-[#0055b8] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#00b2fe]" />
              <span>
                Ao cadastrar sua empresa, você terá acesso imediato à aba exclusiva com as <strong>3 tabelas de gestão (Empresa, Funções e Candidatos)</strong>!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nome Fantasia do Comércio *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mercadinho Popular, Padaria do Povo..."
                  value={compNomeFantasia}
                  onChange={e => setCompNomeFantasia(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Telefone / WhatsApp Comercial *
                </label>
                <input
                  type="text"
                  placeholder="(11) 98888-8888"
                  value={compTelefone}
                  onChange={e => setCompTelefone(formatPhone(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Bairro do Estabelecimento *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jardim Esperança, Morro Alto..."
                  value={compBairro}
                  onChange={e => setCompBairro(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Ramo ou Segmento Comercial
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mercadinho, Padaria, Oficina, Salão, Restaurante..."
                  value={compSegmento}
                  onChange={e => setCompSegmento(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  placeholder="Ex: Seu Jorge, Dona Maria..."
                  value={compResponsavel}
                  onChange={e => setCompResponsavel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    CNPJ ou MEI (Opcional)
                  </label>
                  <span className="text-[10px] text-[#0055b8] font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    Pontos Automáticos
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="00.000.000/0001-00 ou MEI"
                  value={compCnpjMei}
                  onChange={e => setCompCnpjMei(formatCpfCnpj(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Endereço / Ponto de Referência no Bairro
              </label>
              <input
                type="text"
                placeholder="Ex: Rua Central, próx. à praça comunitária"
                value={compEndereco}
                onChange={e => setCompEndereco(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Criar Senha de Acesso da Empresa *
                </label>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Para entrar no painel da empresa
                </span>
              </div>
              <input
                type="password"
                placeholder="Crie uma senha de acesso para sua empresa"
                value={compSenha}
                onChange={e => setCompSenha(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0055b8]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#091b34] hover:bg-[#122b4d] border-2 border-[#00b2fe]/60 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#00b2fe]" />
              <span>Cadastrar Empresa e Acessar Painel Exclusivo</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
