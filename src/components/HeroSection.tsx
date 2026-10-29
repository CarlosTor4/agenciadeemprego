import React from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  Users, 
  ArrowDown, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string, bairro: string) => void;
  onOpenAuth: (role: 'candidato' | 'empresa') => void;
  onOpenPromptModal?: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  totalJobs: number;
  totalCandidates: number;
  totalCompanies: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenAuth,
  onOpenPromptModal,
  isFullscreen,
  onToggleFullscreen,
  totalJobs,
  totalCandidates,
  totalCompanies,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [bairroFilter, setBairroFilter] = React.useState('todos');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, bairroFilter);
    const vagasSection = document.getElementById('vagas-bairro');
    vagasSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCards = () => {
    const el = document.getElementById('cadastro-cards');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVagas = () => {
    const el = document.getElementById('vagas-bairro');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header 
      id="heard-core" 
      className="relative min-h-[100dvh] w-full flex flex-col justify-between pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-10 overflow-hidden bg-[#091b34] bg-wave-pattern text-white"
    >
      {/* Decorative Wave & Light Beams in subtle accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg 
          className="w-full h-full object-cover" 
          viewBox="0 0 1440 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M-100,300 C300,100 600,600 1100,200 C1300,50 1500,400 1600,250" 
            stroke="url(#blueGrad1)" 
            strokeWidth="3.5" 
            strokeDasharray="4 8"
          />
          <path 
            d="M-50,450 C250,200 700,750 1200,300 C1400,120 1550,550 1650,400" 
            stroke="url(#blueGrad2)" 
            strokeWidth="2.5" 
            opacity="0.8"
          />
          <path 
            d="M-80,600 C350,350 800,850 1350,450 C1500,320 1600,650 1700,550" 
            stroke="url(#blueGrad1)" 
            strokeWidth="1.5" 
            opacity="0.5"
          />
          <defs>
            <linearGradient id="blueGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#00b2fe" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#386ee9" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="blueGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c2f8ff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0055b8" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Fullscreen Quick Access pill on top right */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full flex justify-end gap-2 z-20 mb-1 sm:mb-2">
        <button
          onClick={onToggleFullscreen}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#155da8]/50 hover:bg-[#0055b8] border border-[#00b2fe]/40 text-[11px] sm:text-xs font-semibold text-[#c2f8ff] shadow-sm backdrop-blur transition-all cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-[#00e5ff]" /> : <Maximize2 className="w-3.5 h-3.5 text-[#00e5ff]" />}
          <span className="hidden xs:inline">{isFullscreen ? 'Sair Tela Cheia' : 'Tela Cheia'}</span>
        </button>
      </div>

      {/* Main Content inside Heard Core */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full my-auto z-10 flex flex-col items-center text-center">
        
        {/* Academic / Research Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#0055b8]/40 border border-[#00b2fe]/50 text-[11px] sm:text-xs md:text-sm font-medium text-[#c2f8ff] mb-3 sm:mb-5 shadow-inner backdrop-blur-md max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-[#00e5ff] shrink-0 animate-pulse" />
          <span className="truncate">Pesquisa • Curso Técnico em Administração</span>
          <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-[#00e5ff]"></span>
          <span className="hidden sm:inline text-[#96d6f8]">Inclusão na Periferia</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.18] sm:leading-[1.15]">
          Oportunidades de Trabalho{' '}
          <span className="text-[#00b2fe] block sm:inline">
            Dentro do Seu Bairro
          </span>
        </h1>

        {/* Hero Subtitle based on the user's project research brief */}
        <p className="mt-3 sm:mt-5 text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed px-1">
          Plataforma web simples e gratuita. Conectamos moradores de bairros periféricos 
          com pequenos comerciantes, padarias e oficinas da própria comunidade, sem gastar com passagens caras.
        </p>

        {/* Quick Search Bar directly in Hero */}
        <form 
          onSubmit={handleSearchSubmit}
          className="mt-4 sm:mt-6 w-full max-w-2xl bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl border-2 border-[#00b2fe] flex flex-col sm:flex-row gap-2 text-slate-800"
        >
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-[#091b34] shrink-0" />
            <input 
              type="text"
              placeholder="Qual função procura? (ex: Caixa, Repositor...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="sm:w-48 flex items-center gap-1.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-[#00b2fe] shrink-0" />
            <select
              value={bairroFilter}
              onChange={(e) => setBairroFilter(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos os Bairros</option>
              <option value="Jardim Esperança">Jardim Esperança</option>
              <option value="Vila Nova">Vila Nova</option>
              <option value="Morro Alto">Morro Alto</option>
              <option value="Recanto das Flores">Recanto das Flores</option>
              <option value="Comunidade Periférica">Outros Bairros Locais</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#00b2fe] hover:bg-[#009ee0] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Buscar Vagas</span>
          </button>
        </form>

        {/* Action Buttons: Candidato & Empresa (Clean Solid Buttons, no gradients) */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto px-1">
          <button
            onClick={scrollToVagas}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00b2fe] hover:bg-[#009ee0] text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Quero Me Candidatar (Ver Vagas)</span>
          </button>

          <button
            onClick={() => onOpenAuth('empresa')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#091b34] hover:bg-[#122b4d] border-2 border-[#00b2fe] text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-[#00b2fe]" />
            <span>Sou Comerciante (Divulgar Vagas)</span>
          </button>
        </div>

        {/* Real-time Community Stats Counter */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3.5 max-w-3xl w-full">
          <div className="bg-[#091b34]/80 backdrop-blur border border-[#155da8]/60 rounded-xl p-2 sm:p-3 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#00e5ff]">+{totalJobs}</div>
            <div className="text-[10px] sm:text-xs text-[#9ab8d6] font-medium mt-0.5">Vagas no Bairro</div>
          </div>
          <div className="bg-[#091b34]/80 backdrop-blur border border-[#155da8]/60 rounded-xl p-2 sm:p-3 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#bbf6fc]">+{totalCandidates}</div>
            <div className="text-[10px] sm:text-xs text-[#9ab8d6] font-medium mt-0.5">Moradores Cadastrados</div>
          </div>
          <div className="bg-[#091b34]/80 backdrop-blur border border-[#155da8]/60 rounded-xl p-2 sm:p-3 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#00b2fe]">+{totalCompanies}</div>
            <div className="text-[10px] sm:text-xs text-[#9ab8d6] font-medium mt-0.5">Comércios Locais</div>
          </div>
          <div className="bg-[#091b34]/80 backdrop-blur border border-[#155da8]/60 rounded-xl p-2 sm:p-3 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#c2f8ff]">100%</div>
            <div className="text-[10px] sm:text-xs text-[#9ab8d6] font-medium mt-0.5">Gratuito & Sem Taxas</div>
          </div>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="w-full flex flex-col items-center justify-center pt-2 sm:pt-4 z-10">
        <button 
          onClick={scrollToCards}
          className="group flex flex-col items-center text-[11px] sm:text-xs font-semibold text-[#9ab8d6] hover:text-[#00e5ff] transition-colors cursor-pointer"
        >
          <span>Conheça as opções de cadastro abaixo</span>
          <ArrowDown className="w-4 h-4 mt-1 text-[#00b2fe] group-hover:translate-y-1 transition-transform animate-bounce" />
        </button>
      </div>

    </header>
  );
};
