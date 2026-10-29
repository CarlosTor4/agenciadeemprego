import React from 'react';
import { UserCheck, Store, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

interface TwoActionCardsProps {
  onOpenAuth: (role: 'candidato' | 'empresa') => void;
  isCompanyLoggedIn: boolean;
  onGoToCompanyDashboard: () => void;
}

export const TwoActionCards: React.FC<TwoActionCardsProps> = ({
  onOpenAuth,
  isCompanyLoggedIn,
  onGoToCompanyDashboard,
}) => {
  return (
    <section id="cadastro-cards" className="py-10 sm:py-16 md:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header matching the reference structure from image 3 */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0f2fe] border border-[#73bbf8]/50 text-[11px] sm:text-xs font-bold text-[#0055b8] mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#00b2fe]" />
            <span>Passo Inicial para Começar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#091b34] tracking-tight">
            Participe da <span className="text-[#0055b8]">AGÊNCIA DE EMPREGO POPULAR</span>
          </h2>
          <p className="mt-2 sm:mt-3 text-slate-600 text-xs sm:text-base md:text-lg">
            Escolha abaixo a opção que melhor se adapta a você ou à sua organização no bairro:
          </p>
        </div>

        {/* 2 Main Action Cards directly inspired by uploaded Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-5xl mx-auto">
          
          {/* CARD 1: CADASTRO INDIVIDUAL (CANDIDATO) */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border-2 border-[#00b2fe]/30 card-shadow-custom card-hover-effect flex flex-col justify-between relative overflow-hidden group">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00b2fe]"></div>
            
            <div>
              {/* Badge Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#00b2fe]/10 border border-[#00b2fe]/30 flex items-center justify-center text-[#00b2fe] mb-4 sm:mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#00b2fe]" />
              </div>

              {/* Card Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-[#091b34] mb-2 sm:mb-3">
                Cadastro Individual
              </h3>

              {/* Card Description */}
              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
                Mora no bairro periférico e precisa de uma colocação profissional? Cadastre seu currículo simples e gratuito em menos de 2 minutos. Encontre oportunidades a poucos passos da sua casa, economize com transporte e conecte-se com pequenos comerciantes locais.
              </p>

              {/* Benefits list */}
              <ul className="space-y-2 sm:space-y-2.5 mb-6 sm:mb-8 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00b2fe] shrink-0" />
                  <span>100% gratuito para moradores da comunidade</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00b2fe] shrink-0" />
                  <span>Vagas a pé ou com transporte mínimo no bairro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00b2fe] shrink-0" />
                  <span>Contato direto pelo WhatsApp com o empregador</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons for Candidate */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full">
              <button
                onClick={() => {
                  document.getElementById('vagas-bairro')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-3 sm:py-3.5 px-4 rounded-2xl bg-[#00b2fe] hover:bg-[#009ee0] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Ver Vagas & Candidatar-se</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => onOpenAuth('candidato')}
                className="py-3 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#0055b8] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Cadastrar Perfil</span>
              </button>
            </div>
          </div>

          {/* CARD 2: CADASTRO PARA EMPRESAS E COMERCIANTES */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border-2 border-[#091b34]/20 card-shadow-custom card-hover-effect flex flex-col justify-between relative overflow-hidden group">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#091b34]"></div>
            
            <div>
              {/* Badge Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#091b34]/10 border border-[#091b34]/20 flex items-center justify-center text-[#091b34] mb-4 sm:mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <Store className="w-6 h-6 sm:w-7 sm:h-7 text-[#091b34]" />
              </div>

              {/* Card Title */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-xl sm:text-2xl font-bold text-[#091b34]">
                  Cadastro para Empresas e Comerciantes
                </h3>
              </div>

              {/* Card Description */}
              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
                Sua empresa ou comércio de bairro precisa contratar novos colaboradores? Cadastre sua organização, divulgue vagas abertas e acesse o <strong className="text-[#091b34]">Painel Exclusivo com Tabelas de Empresa, Funções e Candidatos</strong> para gerenciar suas contratações locais.
              </p>

              {/* Benefits list */}
              <ul className="space-y-2 sm:space-y-2.5 mb-6 sm:mb-8 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#091b34] shrink-0" />
                  <span>Painel restrito com 3 tabelas de gestão interna</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#091b34] shrink-0" />
                  <span>Contrate pessoas que moram na mesma rua ou bairro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#091b34] shrink-0" />
                  <span>Redução radical do turnover e atrasos de condução</span>
                </li>
              </ul>
            </div>

            {/* Action Button - Solid Dark Blue, No Gradient */}
            {isCompanyLoggedIn ? (
              <button
                onClick={onGoToCompanyDashboard}
                className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-[#091b34] hover:bg-[#122b4d] text-white font-extrabold text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border border-[#00b2fe]/40"
              >
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#00b2fe]" />
                <span>Abrir Meu Painel com Tabelas</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('empresa')}
                className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-[#091b34] hover:bg-[#122b4d] text-white font-extrabold text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border border-[#00b2fe]/40"
              >
                <span>Acessar Área da Empresa / Cadastrar</span>
                <ArrowRight className="w-4 h-4 text-[#00b2fe]" />
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
