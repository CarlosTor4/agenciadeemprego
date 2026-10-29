import React from 'react';
import { Briefcase, Building2, MapPin, CheckCircle2, Clock, Calendar, ArrowLeft, FileText, Paperclip, MessageSquare } from 'lucide-react';
import { JobApplication, CandidateProfile } from '../types';

interface CandidateApplicationsViewProps {
  candidate: CandidateProfile;
  applications: JobApplication[];
  onBackToHome: () => void;
}

export const CandidateApplicationsView: React.FC<CandidateApplicationsViewProps> = ({
  candidate,
  applications,
  onBackToHome,
}) => {
  const myApplications = applications.filter(a => a.candidatoId === candidate.id);

  return (
    <div className="min-h-screen bg-slate-100 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-20 text-slate-800">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-sm mb-5 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-bold text-[#0055b8] uppercase tracking-wider">
                Painel do Candidato
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#091b34]">
              Minhas Candidaturas
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              {candidate.nome} • Morador do bairro <strong>{candidate.bairro}</strong>
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 hover:border-[#0055b8] text-slate-700 hover:text-[#0055b8] text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {myApplications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">Você ainda não se candidatou a nenhuma vaga</h3>
              <p className="text-sm text-slate-500 mt-1 mb-6">Explore o mural de vagas abertas no seu bairro e participe!</p>
              <button
                onClick={onBackToHome}
                className="px-6 py-2.5 rounded-xl bg-[#0055b8] text-white text-xs font-bold shadow-md"
              >
                Ver Vagas no Meu Bairro
              </button>
            </div>
          ) : (
            myApplications.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="text-xs font-extrabold text-[#0055b8] uppercase tracking-wide flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {app.empresaNome}
                  </span>
                  <h3 className="text-lg font-bold text-[#091b34]">
                    {app.vagaTitulo}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Inscrito em: {app.dataCandidatura}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#00b2fe]" />
                      Local: {app.candidatoBairro}
                    </span>
                  </div>
                  {app.curriculoArquivo && (
                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#0055b8] font-medium w-fit">
                      <FileText className="w-3.5 h-3.5 text-[#00b2fe]" />
                      <span>Currículo anexado: <strong>{app.curriculoArquivo.nome}</strong> ({app.curriculoArquivo.tamanho})</span>
                    </div>
                  )}
                  {app.mensagem && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic mt-2">
                      Sua mensagem: "{app.mensagem}"
                    </p>
                  )}

                  {/* Resposta enviada pela Empresa */}
                  {app.respostaEmpresa && (
                    <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-slate-800 shadow-xs">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1.5 tracking-wide">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          Mensagem da Empresa {app.empresaNome}:
                        </span>
                        {app.dataResposta && (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                            {app.dataResposta}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-950 font-semibold leading-relaxed">
                        "{app.respostaEmpresa}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-400 uppercase">Status do Processo:</span>
                  {app.status === 'aprovado' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Aprovado / Contratado
                    </span>
                  ) : app.status === 'entrevista' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0055b8] border border-blue-300 text-xs font-extrabold flex items-center gap-1.5 animate-pulse">
                      <Clock className="w-4 h-4" />
                      Chamado para Entrevista!
                    </span>
                  ) : app.status === 'em_analise' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-300 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Currículo em Análise
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-300 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Candidatura Pendente
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
