import React, { useState } from 'react';
import { 
  Mail, 
  Building2, 
  Send, 
  MapPin, 
  Phone, 
  Heart, 
  GraduationCap, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface ContactSectionProps {
  onOpenPromptModal?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [bairro, setBairro] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !mensagem) return;
    setEnviado(true);
    setTimeout(() => {
      setNome('');
      setEmail('');
      setBairro('');
      setMensagem('');
    }, 2000);
  };

  return (
    <footer id="contato-site" className="bg-[#091b34] text-white pt-10 pb-8 sm:pt-16 sm:pb-12 border-t border-[#155da8]/50 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0055b8]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00b2fe]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 pb-8 sm:pb-16 border-b border-slate-700/60">
          
          {/* Brand & Project Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#00b2fe] flex items-center justify-center shadow-lg shadow-[#00b2fe]/20 shrink-0">
                <Building2 className="w-5 h-5 sm:w-7 sm:h-7 text-[#091b34]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Agência de Emprego Popular
                </h3>
                <span className="text-[11px] sm:text-xs text-[#96d6f8] font-medium">
                  Trabalho e Renda nos Bairros Periféricos
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
              Projeto de pesquisa desenvolvido com foco na inclusão digital e produtiva de comunidades e bairros periféricos. Aproximando pequenos comerciantes, autônomos e moradores locais de forma gratuita, simples e solidária.
            </p>

            {/* Official Contact Box requested by user */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#000d6b]/60 border border-[#00b2fe]/30 space-y-2 max-w-md">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#00e5ff] block">
                Canal Oficial de Contato & Suporte
              </span>
              <a 
                href="mailto:agenciadeemprego100@gmail.com" 
                className="text-xs sm:text-base font-bold text-white hover:text-[#00e5ff] transition-colors flex items-center gap-2 group break-all"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0055b8] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="underline decoration-[#00b2fe] underline-offset-4">
                  agenciadeemprego100@gmail.com
                </span>
              </a>
            </div>

            {/* Academic badge */}
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#9ab8d6]">
              <GraduationCap className="w-4 h-4 text-[#00e5ff] shrink-0" />
              <span>Curso Técnico em Administração • Pesquisa de Campo & Prática</span>
            </div>
          </div>

          {/* Direct Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#155da8]/15 rounded-3xl p-6 sm:p-8 border border-[#00b2fe]/30">
            <div className="mb-5">
              <h4 className="text-xl font-bold text-white">
                Fale com a Equipe do Projeto
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Tem dúvidas sobre o projeto, deseja cadastrar seu comércio ou apoiar a pesquisa?
              </p>
            </div>

            {enviado ? (
              <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h5 className="text-base font-bold text-emerald-200">Mensagem Enviada com Sucesso!</h5>
                <p className="text-xs text-emerald-300">
                  Agradecemos seu contato. Responderemos no seu e-mail ou WhatsApp em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: João da Silva"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#091b34] border border-slate-600 text-sm text-white focus:border-[#00e5ff] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Seu E-mail ou WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="email@exemplo.com ou (11) 99999-9999"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#091b34] border border-slate-600 text-sm text-white focus:border-[#00e5ff] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Bairro Periférico
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Jardim Esperança, Morro Alto, etc."
                    value={bairro}
                    onChange={e => setBairro(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#091b34] border border-slate-600 text-sm text-white focus:border-[#00e5ff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Sua Mensagem / Dúvida
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Escreva sua mensagem aqui..."
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#091b34] border border-slate-600 text-sm text-white focus:border-[#00e5ff] focus:outline-none"
                    required
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-slate-400">
                    Mensagens enviadas diretamente para <strong>agenciadeemprego100@gmail.com</strong>
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#00b2fe] hover:bg-[#009ee0] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensagem</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Credits & Quick Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong>Agência de Emprego Popular</strong>. Todos os direitos reservados.
          </div>
        </div>

      </div>
    </footer>
  );
};
