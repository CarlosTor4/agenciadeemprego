import React from 'react';
import { 
  HelpCircle, 
  Workflow, 
  GraduationCap, 
  TrendingUp, 
  HeartHandshake, 
  MapPin, 
  ShieldCheck, 
  Smartphone,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export const MiniCardsSection: React.FC = () => {
  return (
    <section id="sobre-projeto" className="py-10 sm:py-16 md:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f9ff] border border-[#00b2fe]/30 text-[11px] sm:text-xs font-bold text-[#0055b8] mb-2 sm:mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-[#00b2fe]" />
            <span>Inclusão Digital & Comunitária</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#091b34] tracking-tight">
            Conheça a Agência de Emprego Popular
          </h2>
          <p className="mt-2 sm:mt-3 text-slate-600 text-xs sm:text-base md:text-lg">
            Entenda o que é o projeto, como a plataforma funciona e o impacto socioeconômico planejado para os bairros.
          </p>
        </div>

        {/* 4 Mini Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* MINI CARD 1: O que é a Agência de Emprego Popular */}
          <div className="bg-[#f8fafc] rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-200 hover:border-[#00b2fe]/60 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0055b8]/10 text-[#0055b8] flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#0055b8] group-hover:text-white transition-all">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#091b34] mb-1.5 sm:mb-2">
                O que é a Agência?
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Um projeto criado para superar as dificuldades de emprego em bairros periféricos. Enquanto muitos moradores procuram trabalho, pequenos comerciantes e autônomos precisam contratar, mas essa informação não circulava de forma acessível. A Agência une esses dois lados gratuitamente.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[10px] sm:text-[11px] font-semibold text-[#0055b8] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#00b2fe]" />
              <span>Iniciativa 100% Popular e Comunitária</span>
            </div>
          </div>

          {/* MINI CARD 2: Como funciona o site */}
          <div className="bg-[#f8fafc] rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-200 hover:border-[#00b2fe]/60 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#00b2fe]/10 text-[#00b2fe] flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#00b2fe] group-hover:text-white transition-all">
                <Workflow className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#091b34] mb-1.5 sm:mb-2">
                Como Funciona o Site?
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Simples e direto: o trabalhador cadastra seu perfil e se candidata às vagas do seu bairro. O comerciante cadastra sua empresa e gerencia tabelas exclusivas de funções e currículos recebidos, entrando em contato rápido via WhatsApp ou presencialmente.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[10px] sm:text-[11px] font-semibold text-[#00b2fe] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#0055b8]" />
              <span>Sem Burocracia ou Processos Complexos</span>
            </div>
          </div>

          {/* MINI CARD 3: Projeto de Pesquisa Técnica */}
          <div className="bg-[#f8fafc] rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-200 hover:border-[#00b2fe]/60 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#001eb8]/10 text-[#001eb8] flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#001eb8] group-hover:text-white transition-all">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#091b34] mb-1.5 sm:mb-2">
                Pesquisa Acadêmica
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Desenvolvido no curso Técnico em Administração, o projeto combina pesquisa teórica sobre mercado de trabalho e inclusão digital com pesquisa de campo via questionários aplicados a moradores e comerciantes periféricos, trazendo aprendizado prático e real.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[10px] sm:text-[11px] font-semibold text-[#001eb8] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#00b2fe]" />
              <span>Estudo Aplicado à Realidade Social</span>
            </div>
          </div>

          {/* MINI CARD 4: Impacto Econômico Local */}
          <div className="bg-[#f8fafc] rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-200 hover:border-[#00b2fe]/60 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#091b34]/10 text-[#091b34] flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#091b34] group-hover:text-white transition-all">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#091b34] mb-1.5 sm:mb-2">
                Economia da Periferia
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Trabalhar perto de casa evita horas perdidas no transporte público e custos altos de passagens. O comerciante conta com funcionários pontuais e a renda gerada circula e fortalece o próprio comércio local, gerando um ciclo virtuoso.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[10px] sm:text-[11px] font-semibold text-[#091b34] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>Valorização da Mão de Obra Local</span>
            </div>
          </div>

        </div>

        {/* Informative Quote Box from the Research Paper */}
        <div className="mt-8 sm:mt-12 bg-[#091b34] text-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border-2 border-[#00b2fe]/40 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold text-[#00b2fe]">
              Propósito Central do Projeto
            </span>
            <p className="text-xs sm:text-base md:text-lg text-slate-100 italic font-medium max-w-3xl leading-relaxed">
              "A tecnologia pode e deve ser uma ferramenta de inclusão social. Ao aproximar quem quer trabalhar de quem precisa contratar dentro do próprio território, resgatamos a dignidade e o desenvolvimento econômico comunitário."
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-[#00b2fe]/15 border border-[#00b2fe]/40 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-[#00b2fe]">
            <Smartphone className="w-4 h-4 text-[#00b2fe]" />
            <span>Fácil de usar no celular</span>
          </div>
        </div>

      </div>
    </section>
  );
};
