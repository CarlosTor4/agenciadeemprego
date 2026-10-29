export type UserRole = 'visitante' | 'candidato' | 'empresa';

export interface ResumeFile {
  nome: string;
  tamanho: string;
  tipo: string;
  dadosBase64?: string;
}

export interface CandidateProfile {
  id: string;
  nome: string;
  cpf?: string;
  email: string;
  telefone: string;
  bairro: string;
  cidade: string;
  cargoDesejado: string;
  escolaridade: string;
  experiencia: string;
  habilidades: string[];
  resumo: string;
  disponibilidade: 'imediata' | 'manha' | 'tarde' | 'noite' | 'integral';
  curriculoArquivo?: ResumeFile;
  senha?: string;
  dataCadastro: string;
}

export interface CompanyProfile {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpjOuMei: string;
  segmento: string;
  bairro: string;
  cidade: string;
  endereco: string;
  responsavel: string;
  telefone: string;
  email: string;
  descricao: string;
  senha?: string;
  dataCadastro: string;
}

export interface JobFunction {
  id: string;
  empresaId: string;
  empresaNome: string;
  titulo: string;
  bairro: string;
  cidade: string;
  salario: string;
  tipoContrato: 'CLT' | 'MEI' | 'Diária' | 'Meio Período' | 'Estágio / Jovem Aprendiz' | 'Freelancer';
  requisitos: string;
  cargaHoraria: string;
  descricao: string;
  beneficios?: string;
  status: 'ativa' | 'pausada' | 'preenchida';
  vagasDisponiveis: number;
  dataPublicacao: string;
}

export interface JobApplication {
  id: string;
  vagaId: string;
  vagaTitulo: string;
  empresaId: string;
  empresaNome: string;
  candidatoId: string;
  candidatoNome: string;
  candidatoCpf?: string;
  candidatoTelefone: string;
  candidatoBairro: string;
  candidatoEscolaridade: string;
  candidatoExperiencia: string;
  curriculoArquivo?: ResumeFile;
  status: 'pendente' | 'em_analise' | 'entrevista' | 'aprovado' | 'rejeitado';
  mensagem?: string;
  respostaEmpresa?: string;
  dataResposta?: string;
  dataCandidatura: string;
}
