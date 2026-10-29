import React from 'react';
import { 
  Building2, 
  UserCheck, 
  Briefcase, 
  Maximize2, 
  Minimize2, 
  LogIn, 
  LogOut, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { ActiveSession } from '../services/storage';

interface NavbarProps {
  session: ActiveSession;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenAuth: (defaultTab?: 'candidato' | 'empresa') => void;
  onLogout: () => void;
  onOpenPromptModal?: () => void;
  currentView: 'home' | 'empresa_dashboard' | 'minhas_candidaturas' | 'vagas';
  onNavigate: (view: 'home' | 'empresa_dashboard' | 'minhas_candidaturas' | 'vagas') => void;
  pendingApplicationsCount?: number;
  candidateUnreadMessagesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  isFullscreen,
  onToggleFullscreen,
  onOpenAuth,
  onLogout,
  currentView,
  onNavigate,
  pendingApplicationsCount = 0,
  candidateUnreadMessagesCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#091b34]/95 backdrop-blur-md border-b border-[#155da8]/40 text-white shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => { onNavigate('home'); scrollToSection('heard-core'); }}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0 py-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#00b2fe] flex items-center justify-center shadow-md shadow-[#00b2fe]/30 group-hover:scale-105 transition-transform shrink-0 border border-[#00b2fe]/40">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#091b34]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap drop-shadow-xs">
                <span>Agência de Emprego</span>
                <span className="text-[#00b2fe]">Popular</span>
              </span>
              <span className="text-[10px] sm:text-xs text-[#bbf6fc] font-semibold tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00e5ff] animate-pulse shrink-0"></span>
                <span>Trabalho e Renda nos Bairros Periféricos</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links with generous separation from the site name */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-5 ml-10 lg:ml-16 xl:ml-24 pl-8 lg:pl-12 xl:pl-16 border-l-2 border-[#155da8]/60">
            <button
              onClick={() => scrollToSection('heard-core')}
              className={`text-xs xl:text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg ${
                currentView === 'home' 
                  ? 'text-[#00e5ff] bg-[#00b2fe]/15 font-bold shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Início
            </button>

            <button
              onClick={() => scrollToSection('cadastro-cards')}
              className="text-xs xl:text-sm font-semibold text-slate-300 hover:text-[#00b2fe] transition-colors px-2 py-1"
            >
              Cadastro
            </button>

            <button
              onClick={() => scrollToSection('sobre-projeto')}
              className="text-xs xl:text-sm font-semibold text-slate-300 hover:text-[#00b2fe] transition-colors px-2 py-1"
            >
              Sobre a Pesquisa
            </button>

            <button
              onClick={() => scrollToSection('vagas-bairro')}
              className="text-xs xl:text-sm font-semibold text-slate-300 hover:text-[#00b2fe] transition-colors px-2 py-1"
            >
              Vagas no Bairro
            </button>

            <button
              onClick={() => scrollToSection('contato-site')}
              className="text-xs xl:text-sm font-semibold text-slate-300 hover:text-[#00b2fe] transition-colors px-2 py-1"
            >
              Contato
            </button>

            {/* ABA EXCLUSIVA DA EMPRESA: ONLY VISIBLE AFTER COMPANY REGISTRATION / LOGIN */}
            {session.role === 'empresa' && session.company && (
              <button
                onClick={() => onNavigate('empresa_dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                  currentView === 'empresa_dashboard'
                    ? 'bg-[#0055b8] border-[#00b2fe] text-white shadow-md shadow-[#0055b8]/40'
                    : 'bg-[#155da8]/30 border-[#00b2fe]/60 text-[#c2f8ff] hover:bg-[#0055b8]/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
                <span>Painel da Empresa</span>
                {pendingApplicationsCount > 0 ? (
                  <span className="text-[10px] bg-[#00e5ff] text-[#091b34] font-black px-1.5 py-0.5 rounded-full animate-pulse flex items-center gap-1 shadow-xs">
                    <span>Novo Currículo!</span>
                  </span>
                ) : (
                  <span className="text-[10px] bg-[#00e5ff] text-[#091b34] font-black px-1.5 py-0.5 rounded">
                    Exclusivo
                  </span>
                )}
              </button>
            )}

            {/* Candidate area quick tab */}
            {session.role === 'candidato' && session.candidate && (
              <button
                onClick={() => onNavigate('minhas_candidaturas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-400/30 transition-all ${
                  currentView === 'minhas_candidaturas'
                    ? 'bg-blue-600/30 text-white border-blue-400'
                    : 'text-blue-200 hover:bg-blue-900/40'
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#00b2fe]" />
                <span>Minhas Vagas</span>
                {candidateUnreadMessagesCount > 0 && (
                  <span className="text-[10px] bg-emerald-400 text-[#091b34] font-black px-1.5 py-0.5 rounded-full animate-pulse shadow-xs">
                    Nova Mensagem!
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Action buttons (Fullscreen, Prompt, Auth) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Fullscreen Button */}
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Sair da Tela Cheia" : "Expandir site na tela toda"}
              className="p-2.5 rounded-xl bg-[#155da8]/40 hover:bg-[#0055b8] text-[#c2f8ff] hover:text-white border border-[#00b2fe]/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-[#00e5ff]" />
                  <span className="hidden xl:inline">Sair Tela Cheia</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-[#00e5ff]" />
                  <span className="hidden xl:inline">Tela Cheia</span>
                </>
              )}
            </button>
            {/* Auth Profile / Login Button */}
            {session.role === 'visitante' ? (
              <button
                onClick={() => onOpenAuth('candidato')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00b2fe] hover:bg-[#009ee0] text-white font-bold text-sm shadow-md shadow-[#00b2fe]/20 hover:shadow-lg hover:shadow-[#00b2fe]/40 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar / Cadastrar</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-[#155da8]/30 px-3 py-1.5 rounded-xl border border-blue-400/20">
                <div className="text-right">
                  <div className="text-xs font-bold text-white leading-tight">
                    {session.role === 'empresa' ? session.company?.nomeFantasia : session.candidate?.nome.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-[#96d6f8]">
                    {session.role === 'empresa' ? 'Comerciante Local' : 'Candidato'}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Sair da conta"
                  className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile & Tablet hamburger menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onToggleFullscreen}
              className="p-2 rounded-lg bg-[#155da8]/40 text-[#c2f8ff]"
              title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#155da8]/40 text-white"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#091b34] border-b border-[#0055b8]/50 px-4 pt-4 pb-6 space-y-3">
          <div className="pb-4 mb-4 border-b border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00b2fe] flex items-center justify-center shrink-0 border border-[#00b2fe]/40">
              <Building2 className="w-5 h-5 text-[#091b34]" />
            </div>
            <div>
              <div className="text-base font-black text-white">
                Agência de Emprego <span className="text-[#00b2fe]">Popular</span>
              </div>
              <div className="text-xs text-[#96d6f8]">Trabalho e Renda nos Bairros Periféricos</div>
            </div>
          </div>

          <div className="pt-1 space-y-1">
            <button
              onClick={() => scrollToSection('heard-core')}
              className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 font-semibold hover:bg-[#00b2fe]/10 hover:text-[#00e5ff] transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('cadastro-cards')}
              className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 font-semibold hover:bg-[#00b2fe]/10 hover:text-[#00e5ff] transition-colors"
            >
              Cadastro
            </button>
            <button
              onClick={() => scrollToSection('sobre-projeto')}
              className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 font-semibold hover:bg-[#00b2fe]/10 hover:text-[#00e5ff] transition-colors"
            >
              Sobre a Pesquisa
            </button>
            <button
              onClick={() => scrollToSection('vagas-bairro')}
              className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 font-semibold hover:bg-[#00b2fe]/10 hover:text-[#00e5ff] transition-colors"
            >
              Vagas no Bairro
            </button>
            <button
              onClick={() => scrollToSection('contato-site')}
              className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 font-semibold hover:bg-[#00b2fe]/10 hover:text-[#00e5ff] transition-colors"
            >
              Contato
            </button>
          </div>

          {session.role === 'empresa' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('empresa_dashboard');
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0055b8] text-white font-bold"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00e5ff]" />
                Painel da Empresa (Tabelas)
              </span>
              <span className="text-[10px] bg-[#00e5ff] text-[#091b34] font-bold px-2 py-0.5 rounded">
                Exclusivo
              </span>
            </button>
          )}

          {session.role === 'candidato' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('minhas_candidaturas');
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-900/60 text-white font-bold border border-blue-400/30"
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#00b2fe]" />
                Minhas Candidaturas
              </span>
              {candidateUnreadMessagesCount > 0 ? (
                <span className="text-[10px] bg-emerald-400 text-[#091b34] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  Nova Mensagem!
                </span>
              ) : (
                <span className="text-[10px] bg-[#00b2fe] text-[#091b34] font-bold px-2 py-0.5 rounded">
                  Acompanhar
                </span>
              )}
            </button>
          )}

          <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-2">
            {session.role === 'visitante' ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('candidato');
                }}
                className="w-full py-2.5 rounded-xl bg-[#00b2fe] hover:bg-[#009ee0] text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Entrar / Cadastrar
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2 rounded-xl bg-red-950/40 text-red-300 border border-red-800/40 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
