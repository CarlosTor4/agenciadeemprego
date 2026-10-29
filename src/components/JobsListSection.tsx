import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Search, 
  Filter, 
  Send,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { JobFunction, JobApplication, CandidateProfile } from '../types';

interface JobsListSectionProps {
  jobs: JobFunction[];
  appliedJobIds: string[];
  activeCandidate?: CandidateProfile;
  onApply: (job: JobFunction, message?: string) => void;
  onOpenAuthForCandidate: () => void;
  initialSearch?: string;
  initialBairro?: string;
}

export const JobsListSection: React.FC<JobsListSectionProps> = ({
  jobs,
  appliedJobIds,
  activeCandidate,
  onApply,
  onOpenAuthForCandidate,
  initialSearch = '',
  initialBairro = 'todos',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [bairroFilter, setBairroFilter] = useState(initialBairro);
  const [contratoFilter, setContratoFilter] = useState('todos');

  // Selected job for apply modal
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobFunction | null>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [applySuccessModal, setApplySuccessModal] = useState<string | null>(null);

  // Distinct neighborhood list
  const neighborhoods = Array.from(new Set(jobs.map(j => j.bairro)));

  const filteredJobs = jobs.filter(job => {
    if (job.status !== 'ativa') return false;

    const matchesSearch = 
      job.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.empresaNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requisitos.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBairro = bairroFilter === 'todos' || job.bairro === bairroFilter;
    const matchesContrato = contratoFilter === 'todos' || job.tipoContrato === contratoFilter;

    return matchesSearch && matchesBairro && matchesContrato;
  });

  const handleStartApply = (job: JobFunction) => {
    if (!activeCandidate) {
      onOpenAuthForCandidate();
      return;
    }
    setSelectedJobToApply(job);
    setApplyMessage(`Olá, tenho muito interesse na vaga de ${job.titulo} no ${job.empresaNome}. Resido no bairro ${activeCandidate.bairro} e estou disponível.`);
  };

  const handleConfirmApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobToApply) return;

    onApply(selectedJobToApply, applyMessage);
    const jobTitle = selectedJobToApply.titulo;
    setSelectedJobToApply(null);
    setApplySuccessModal(jobTitle);
  };

  return (
    <section id="vagas-bairro" className="py-10 sm:py-16 md:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f9ff] border border-[#00b2fe]/30 text-[11px] sm:text-xs font-bold text-[#0055b8] mb-2 sm:mb-3">
            <Briefcase className="w-3.5 h-3.5 text-[#00b2fe]" />
            <span>Mural Comunitário de Oportunidades</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#091b34] tracking-tight">
            Vagas Abertas nos Bairros Periféricos
          </h2>
          <p className="mt-2 sm:mt-3 text-slate-600 text-xs sm:text-base md:text-lg">
            Trabalhe perto de casa, sem gastar com passagens longas e valorizando os comércios da vizinhança.
          </p>
        </div>

        {/* Filter controls */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 border border-slate-200 shadow-sm mb-6 sm:mb-10 flex flex-col md:flex-row items-center gap-2.5 sm:gap-3">
          <div className="flex-1 w-full flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50">
            <Search className="w-4 h-4 text-[#0055b8] shrink-0" />
            <input
              type="text"
              placeholder="Buscar por função ou comércio..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="w-full md:w-56 flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50">
            <MapPin className="w-4 h-4 text-[#00b2fe] shrink-0" />
            <select
              value={bairroFilter}
              onChange={e => setBairroFilter(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos os Bairros</option>
              {neighborhoods.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48 flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50">
            <Filter className="w-4 h-4 text-[#00b2fe] shrink-0" />
            <select
              value={contratoFilter}
              onChange={e => setContratoFilter(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos Contratos</option>
              <option value="CLT">CLT</option>
              <option value="MEI">MEI</option>
              <option value="Diária">Diária</option>
              <option value="Meio Período">Meio Período</option>
            </select>
          </div>

          {(searchTerm || bairroFilter !== 'todos' || contratoFilter !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setBairroFilter('todos');
                setContratoFilter('todos');
              }}
              className="text-xs font-bold text-[#0055b8] hover:underline px-2 py-1 shrink-0 self-end md:self-center"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Jobs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">Nenhuma vaga encontrada com estes filtros</h3>
              <p className="text-sm text-slate-500 mt-1">Tente buscar por outro bairro ou termo geral.</p>
            </div>
          ) : (
            filteredJobs.map(job => {
              const isApplied = appliedJobIds.includes(job.id);
              const isCandidateLocal = activeCandidate && activeCandidate.bairro.toLowerCase() === job.bairro.toLowerCase();

              return (
                <div 
                  key={job.id} 
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 card-shadow-custom card-hover-effect flex flex-col justify-between relative group"
                >
                  <div>
                    {/* Header: Company & Neighborhood */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs font-bold text-[#0055b8] uppercase tracking-wide flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {job.empresaNome}
                        </span>
                        <h3 className="text-xl font-bold text-[#091b34] mt-1 group-hover:text-[#0055b8] transition-colors">
                          {job.titulo}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-[#0055b8] border border-blue-200 shrink-0">
                        {job.tipoContrato}
                      </span>
                    </div>

                    {/* Location Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-[#00b2fe]" />
                        {job.bairro}
                      </span>
                      {isCandidateLocal && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ★ No seu bairro!
                        </span>
                      )}
                    </div>

                    {/* Salary & Schedule */}
                    <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Remuneração:</span>
                        <span className="font-extrabold text-sm text-[#0055b8]">{job.salario}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Horário:</span>
                        <span className="font-medium text-slate-700">{job.cargaHoraria}</span>
                      </div>
                    </div>

                    {/* Description & Requirements */}
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 mb-3 leading-relaxed">
                      {job.descricao}
                    </p>

                    <div className="text-[11px] text-slate-500 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 mb-6">
                      <strong className="text-[#0055b8]">Requisitos:</strong> {job.requisitos}
                    </div>
                  </div>

                  {/* Footer & Apply Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      {job.vagasDisponiveis} {job.vagasDisponiveis === 1 ? 'vaga aberta' : 'vagas abertas'}
                    </span>

                    {isApplied ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Candidatura Enviada!
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStartApply(job)}
                        className="px-5 py-2.5 rounded-xl bg-[#00b2fe] hover:bg-[#009ee0] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Candidatar-se</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Modal: Confirm Application */}
      {selectedJobToApply && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-[#091b34] mb-1">
              Confirmar Candidatura para a Vaga
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedJobToApply.titulo} • {selectedJobToApply.empresaNome} ({selectedJobToApply.bairro})
            </p>

            <form onSubmit={handleConfirmApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Seus dados como candidato
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p><strong>Nome:</strong> {activeCandidate?.nome}</p>
                  <p><strong>Bairro:</strong> {activeCandidate?.bairro}</p>
                  <p><strong>WhatsApp:</strong> {activeCandidate?.telefone}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mensagem de apresentação para o comerciante (opcional)
                </label>
                <textarea
                  rows={3}
                  value={applyMessage}
                  onChange={e => setApplyMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#0055b8]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedJobToApply(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0055b8] hover:bg-[#000d6b] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Minha Candidatura</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification Modal */}
      {applySuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#091b34]">
              Candidatura Realizada com Sucesso!
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Sua ficha foi enviada para o comerciante da vaga de <strong>"{applySuccessModal}"</strong>. O comerciante entrará em contato com você pelo WhatsApp em breve.
            </p>
            <button
              onClick={() => setApplySuccessModal(null)}
              className="mt-6 w-full py-3 rounded-xl bg-[#0055b8] text-white font-bold text-sm shadow-md"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
