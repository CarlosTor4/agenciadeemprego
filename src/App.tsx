import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TwoActionCards } from './components/TwoActionCards';
import { MiniCardsSection } from './components/MiniCardsSection';
import { JobsListSection } from './components/JobsListSection';
import { CompanyDashboard } from './components/CompanyDashboard';
import { CandidateApplicationsView } from './components/CandidateApplicationsView';
import { AuthModal } from './components/AuthModal';
import { ContactSection } from './components/ContactSection';
import { 
  loadCompanies, 
  saveCompanies, 
  loadCandidates, 
  saveCandidates, 
  loadJobs, 
  saveJobs, 
  loadApplications, 
  saveApplications, 
  loadSession, 
  saveSession, 
  ActiveSession 
} from './services/storage';
import { CompanyProfile, CandidateProfile, JobFunction, JobApplication } from './types';
import { Bell, MessageSquare } from 'lucide-react';

export default function App() {
  // Persistence state
  const [session, setSession] = useState<ActiveSession>(() => loadSession());
  const [companies, setCompanies] = useState<CompanyProfile[]>(() => loadCompanies());
  const [candidates, setCandidates] = useState<CandidateProfile[]>(() => loadCandidates());
  const [jobs, setJobs] = useState<JobFunction[]>(() => loadJobs());
  const [applications, setApplications] = useState<JobApplication[]>(() => loadApplications());

  // Views: 'home' | 'empresa_dashboard' | 'minhas_candidaturas' | 'vagas'
  const [currentView, setCurrentView] = useState<'home' | 'empresa_dashboard' | 'minhas_candidaturas' | 'vagas'>('home');

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'candidato' | 'empresa'>('candidato');

  // Real-time resume alert for company: "Você recebeu um novo currículo!"
  const [resumeAlert, setResumeAlert] = useState<{
    id: string;
    empresaId: string;
    empresaNome: string;
    candidatoNome: string;
    vagaTitulo: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('agencia_pending_resume_alert');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Real-time message alert for candidate: "Você tem uma nova mensagem da empresa [Nome da Empresa]..."
  const [candidateMessageAlert, setCandidateMessageAlert] = useState<{
    id: string;
    candidatoId: string;
    candidatoNome: string;
    empresaId?: string;
    empresaNome: string;
    vagaTitulo: string;
    mensagem: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('agencia_pending_candidate_message');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Filter state passed from Hero to JobsList
  const [searchFilter, setSearchFilter] = useState('');
  const [bairroFilter, setBairroFilter] = useState('todos');

  // Listen for fullscreen change events (e.g. user pressed Esc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Sync state changes with localStorage
  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    saveCompanies(companies);
  }, [companies]);

  useEffect(() => {
    saveCandidates(candidates);
  }, [candidates]);

  useEffect(() => {
    saveJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    saveApplications(applications);
  }, [applications]);

  // Fullscreen toggle function
  const handleToggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          console.warn('Could not enter fullscreen:', err);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => {
            setIsFullscreen(false);
          });
        }
      }
    } catch (e) {
      console.warn('Fullscreen API error:', e);
    }
  };

  // Auth & Registration Handlers
  const handleOpenAuth = (role: 'candidato' | 'empresa' = 'candidato') => {
    setAuthDefaultRole(role);
    setIsAuthModalOpen(true);
  };

  const handleRegisterCandidate = (newCand: Omit<CandidateProfile, 'id' | 'dataCadastro'>) => {
    const candidate: CandidateProfile = {
      ...newCand,
      id: `cand-${Date.now()}`,
      dataCadastro: new Date().toISOString().split('T')[0],
    };

    const updated = [candidate, ...candidates];
    setCandidates(updated);

    const newSession: ActiveSession = {
      role: 'candidato',
      candidate,
    };
    setSession(newSession);
    setCurrentView('home');

    // Scroll to jobs section
    setTimeout(() => {
      document.getElementById('vagas-bairro')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleRegisterCompany = (newComp: Omit<CompanyProfile, 'id' | 'dataCadastro'>) => {
    const company: CompanyProfile = {
      ...newComp,
      id: `emp-${Date.now()}`,
      dataCadastro: new Date().toISOString().split('T')[0],
    };

    const updated = [company, ...companies];
    setCompanies(updated);

    const newSession: ActiveSession = {
      role: 'empresa',
      company,
    };
    setSession(newSession);

    // CRITICAL USER REQUIREMENT:
    // "essa aba deve aparecer logo após as empresas fazerem o cadastro e não na tela inicial, pois os candidatos não devem ter acesso a essa tela"
    // Immediately open the company management tables view!
    setCurrentView('empresa_dashboard');
  };

  const handleQuickLogin = (role: 'candidato' | 'empresa', id: string) => {
    if (role === 'empresa') {
      const found = companies.find(c => c.id === id);
      if (found) {
        setSession({ role: 'empresa', company: found });
        // Jump directly to company dashboard with the 3 tables!
        setCurrentView('empresa_dashboard');

        // Check if there are pending applications for this company to alert
        const pendingApp = applications.find(a => a.empresaId === found.id && a.status === 'pendente');
        if (pendingApp) {
          const alert = {
            id: pendingApp.id,
            empresaId: found.id,
            empresaNome: found.nomeFantasia,
            candidatoNome: pendingApp.candidatoNome,
            vagaTitulo: pendingApp.vagaTitulo,
          };
          setResumeAlert(alert);
          try {
            localStorage.setItem('agencia_pending_resume_alert', JSON.stringify(alert));
          } catch (e) {
            console.warn(e);
          }
        }
      }
    } else {
      const found = candidates.find(c => c.id === id);
      if (found) {
        setSession({ role: 'candidato', candidate: found });
        setCurrentView('home');
        setTimeout(() => {
          document.getElementById('vagas-bairro')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);

        // Check if there is a company response for this candidate
        const repliedApp = applications.find(a => a.candidatoId === found.id && Boolean(a.respostaEmpresa));
        if (repliedApp && repliedApp.respostaEmpresa) {
          const msgAlert = {
            id: `msg-${repliedApp.id}`,
            candidatoId: found.id,
            candidatoNome: found.nome,
            empresaId: repliedApp.empresaId,
            empresaNome: repliedApp.empresaNome,
            vagaTitulo: repliedApp.vagaTitulo,
            mensagem: repliedApp.respostaEmpresa,
          };
          setCandidateMessageAlert(msgAlert);
          try {
            localStorage.setItem('agencia_pending_candidate_message', JSON.stringify(msgAlert));
          } catch (e) {
            console.warn(e);
          }
        }
      }
    }
  };

  const handleLogout = () => {
    setSession({ role: 'visitante' });
    setCurrentView('home');
  };

  // Company management actions
  const handleUpdateCompany = (updated: CompanyProfile) => {
    setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (session.company?.id === updated.id) {
      setSession(prev => ({ ...prev, company: updated }));
    }
  };

  const handleAddJob = (jobData: Omit<JobFunction, 'id' | 'dataPublicacao'>) => {
    const newJob: JobFunction = {
      ...jobData,
      id: `vaga-${Date.now()}`,
      dataPublicacao: new Date().toISOString().split('T')[0],
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const handleUpdateJobStatus = (jobId: string, status: 'ativa' | 'pausada' | 'preenchida') => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    setApplications(prev => prev.filter(a => a.vagaId !== jobId));
  };

  const handleUpdateApplicationStatus = (appId: string, status: JobApplication['status'], resposta?: string) => {
    let updatedCandidateId = '';
    let updatedEmpresaNome = '';
    let updatedVagaTitulo = '';
    let updatedCandidatoNome = '';

    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        updatedCandidateId = a.candidatoId;
        updatedEmpresaNome = a.empresaNome;
        updatedVagaTitulo = a.vagaTitulo;
        updatedCandidatoNome = a.candidatoNome;
        return {
          ...a,
          status,
          respostaEmpresa: resposta !== undefined ? resposta : a.respostaEmpresa,
          dataResposta: resposta ? new Date().toLocaleDateString('pt-BR') : a.dataResposta,
        };
      }
      return a;
    }));

    const finalMessage = resposta || (
      status === 'entrevista' 
        ? 'A empresa selecionou você para a etapa de entrevista! Fique atento às orientações.'
        : status === 'aprovado'
        ? 'Parabéns! Sua candidatura foi aprovada pela empresa para a vaga.'
        : status === 'em_analise'
        ? 'A empresa iniciou a análise detalhada do seu currículo.'
        : status === 'rejeitado'
        ? 'A empresa arquivou seu currículo em seu banco de reservas para oportunidades futuras.'
        : 'A empresa atualizou o status da sua candidatura.'
    );

    const newCandidateAlert = {
      id: `msg-${Date.now()}`,
      candidatoId: updatedCandidateId,
      candidatoNome: updatedCandidatoNome,
      empresaId: session.company?.id || '',
      empresaNome: updatedEmpresaNome || session.company?.nomeFantasia || 'Empresa Local',
      vagaTitulo: updatedVagaTitulo,
      mensagem: finalMessage,
    };

    setCandidateMessageAlert(newCandidateAlert);
    try {
      localStorage.setItem('agencia_pending_candidate_message', JSON.stringify(newCandidateAlert));
    } catch (e) {
      console.warn(e);
    }
  };

  // Candidate Actions
  const handleApplyJob = (job: JobFunction, message?: string) => {
    if (!session.candidate) {
      handleOpenAuth('candidato');
      return;
    }

    const application: JobApplication = {
      id: `app-${Date.now()}`,
      vagaId: job.id,
      vagaTitulo: job.titulo,
      empresaId: job.empresaId,
      empresaNome: job.empresaNome,
      candidatoId: session.candidate.id,
      candidatoNome: session.candidate.nome,
      candidatoCpf: session.candidate.cpf,
      candidatoTelefone: session.candidate.telefone,
      candidatoBairro: session.candidate.bairro,
      candidatoEscolaridade: session.candidate.escolaridade,
      candidatoExperiencia: session.candidate.experiencia,
      curriculoArquivo: session.candidate.curriculoArquivo,
      status: 'pendente',
      mensagem: message,
      dataCandidatura: new Date().toISOString().split('T')[0],
    };

    setApplications(prev => [application, ...prev]);

    // Store "Você recebeu um novo currículo!" message for the company
    const newResumeAlert = {
      id: application.id,
      empresaId: job.empresaId,
      empresaNome: job.empresaNome,
      candidatoNome: session.candidate.nome,
      vagaTitulo: job.titulo,
    };
    setResumeAlert(newResumeAlert);
    try {
      localStorage.setItem('agencia_pending_resume_alert', JSON.stringify(newResumeAlert));
    } catch (e) {
      console.warn(e);
    }
  };

  // Applications applied by active candidate
  const candidateAppliedJobIds = session.candidate
    ? applications.filter(a => a.candidatoId === session.candidate?.id).map(a => a.vagaId)
    : [];

  // Count pending resumes for the logged in company
  const companyPendingCount = (session.role === 'empresa' && session.company)
    ? applications.filter(a => a.empresaId === session.company?.id && a.status === 'pendente').length
    : 0;

  // Count unread responses from companies for candidate
  const candidateUnreadMessagesCount = (session.role === 'candidato' && session.candidate)
    ? applications.filter(a => a.candidatoId === session.candidate?.id && Boolean(a.respostaEmpresa)).length
    : 0;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#00b2fe] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        session={session}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        currentView={currentView}
        onNavigate={setCurrentView}
        pendingApplicationsCount={companyPendingCount}
        candidateUnreadMessagesCount={candidateUnreadMessagesCount}
      />

      {/* Main Content Router */}
      {currentView === 'empresa_dashboard' && session.role === 'empresa' && session.company ? (
        // RESTRICTED COMPANY MANAGEMENT DASHBOARD (WITH THE 3 REQUIRED TABLES)
        <CompanyDashboard
          company={session.company}
          jobs={jobs}
          applications={applications}
          onUpdateCompany={handleUpdateCompany}
          onAddJob={handleAddJob}
          onUpdateJobStatus={handleUpdateJobStatus}
          onDeleteJob={handleDeleteJob}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onBackToHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'minhas_candidaturas' && session.role === 'candidato' && session.candidate ? (
        // CANDIDATE APPLICATION TRACKER VIEW
        <CandidateApplicationsView
          candidate={session.candidate}
          applications={applications}
          onBackToHome={() => setCurrentView('home')}
        />
      ) : (
        // DEFAULT PUBLIC / HOME VIEW
        <main>
          {/* 1. Header Core (Full Screen) */}
          <HeroSection
            onSearch={(query, bairro) => {
              setSearchFilter(query);
              setBairroFilter(bairro);
            }}
            onOpenAuth={handleOpenAuth}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            totalJobs={jobs.filter(j => j.status === 'ativa').length}
            totalCandidates={candidates.length}
            totalCompanies={companies.length}
          />

          {/* 2. Dois Cards Abaixo do Heard Core (Cadastro Individual vs Cadastro Empresa) */}
          <TwoActionCards
            onOpenAuth={handleOpenAuth}
            isCompanyLoggedIn={session.role === 'empresa'}
            onGoToCompanyDashboard={() => setCurrentView('empresa_dashboard')}
          />

          {/* 3. Mini Cards (O que é a Agência & Como Funciona & Pesquisa) */}
          <MiniCardsSection />

          {/* 4. Mural de Vagas Disponíveis nos Bairros */}
          <JobsListSection
            jobs={jobs}
            appliedJobIds={candidateAppliedJobIds}
            activeCandidate={session.candidate}
            onApply={handleApplyJob}
            onOpenAuthForCandidate={() => handleOpenAuth('candidato')}
            initialSearch={searchFilter}
            initialBairro={bairroFilter}
          />

          {/* 5. Seção de Contato e Rodapé */}
          <ContactSection />
        </main>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultRole={authDefaultRole}
        onRegisterCandidate={handleRegisterCandidate}
        onRegisterCompany={handleRegisterCompany}
        onQuickLogin={handleQuickLogin}
        existingCompanies={companies}
        existingCandidates={candidates}
      />

      {/* 1. Floating Toast: "Você recebeu um novo currículo!" - ONLY FOR COMPANY! */}
      {resumeAlert && session.role === 'empresa' && (!resumeAlert.empresaId || resumeAlert.empresaId === session.company?.id) && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md w-full bg-[#091b34] text-white rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-[#00b2fe] flex items-start gap-3.5 animate-slide-up">
          <div className="w-10 h-10 rounded-xl bg-[#00b2fe] text-[#091b34] flex items-center justify-center shrink-0 shadow-md">
            <Bell className="w-5 h-5 text-[#091b34] animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00e5ff] bg-[#00b2fe]/20 px-2 py-0.5 rounded-full">
                Notificação da Empresa
              </span>
              <button
                onClick={() => {
                  setResumeAlert(null);
                  localStorage.removeItem('agencia_pending_resume_alert');
                }}
                className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
                title="Fechar aviso"
              >
                ✕
              </button>
            </div>
            <p className="text-sm font-extrabold text-white mt-1.5 flex items-center gap-1.5">
              <span>Você recebeu um novo currículo!</span>
              <span className="text-base">📄</span>
            </p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              <strong>{resumeAlert.candidatoNome}</strong> enviou currículo para a vaga <strong>"{resumeAlert.vagaTitulo}"</strong> no estabelecimento <em>{resumeAlert.empresaNome}</em>.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentView('empresa_dashboard');
                  setResumeAlert(null);
                  localStorage.removeItem('agencia_pending_resume_alert');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#00b2fe] hover:bg-[#00e5ff] text-[#091b34] text-xs font-extrabold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Ver no Painel da Empresa
              </button>
              <button
                onClick={() => {
                  setResumeAlert(null);
                  localStorage.removeItem('agencia_pending_resume_alert');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Dispensar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Toast: "Você tem uma nova mensagem da empresa..." - FOR CANDIDATE */}
      {candidateMessageAlert && session.role === 'candidato' && (!candidateMessageAlert.candidatoId || candidateMessageAlert.candidatoId === session.candidate?.id) && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md w-full bg-[#0055b8] text-white rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-[#00e5ff] flex items-start gap-3.5 animate-slide-up">
          <div className="w-10 h-10 rounded-xl bg-[#00e5ff] text-[#091b34] flex items-center justify-center shrink-0 shadow-md">
            <MessageSquare className="w-5 h-5 text-[#091b34] animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#091b34] bg-[#00e5ff] px-2 py-0.5 rounded-full font-bold">
                Notificação do Candidato
              </span>
              <button
                onClick={() => {
                  setCandidateMessageAlert(null);
                  localStorage.removeItem('agencia_pending_candidate_message');
                }}
                className="text-white/70 hover:text-white text-xs p-1 cursor-pointer"
                title="Fechar aviso"
              >
                ✕
              </button>
            </div>
            <p className="text-sm font-extrabold text-white mt-1.5 flex items-center gap-1.5">
              <span>Você tem uma nova mensagem da empresa {candidateMessageAlert.empresaNome}!</span>
              <span className="text-base">💬</span>
            </p>
            <div className="text-xs text-blue-100 mt-1 leading-relaxed">
              <p><strong>Vaga:</strong> {candidateMessageAlert.vagaTitulo}</p>
              <p className="italic mt-1.5 bg-black/25 p-2.5 rounded-xl border border-white/15 text-white font-medium">
                "{candidateMessageAlert.mensagem}"
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentView('minhas_candidaturas');
                  setCandidateMessageAlert(null);
                  localStorage.removeItem('agencia_pending_candidate_message');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#00e5ff] hover:bg-white text-[#091b34] text-xs font-extrabold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Ver Minhas Candidaturas
              </button>
              <button
                onClick={() => {
                  setCandidateMessageAlert(null);
                  localStorage.removeItem('agencia_pending_candidate_message');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium cursor-pointer"
              >
                Dispensar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
