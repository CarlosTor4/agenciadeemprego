import { CandidateProfile, CompanyProfile, JobFunction, JobApplication } from '../types';

const STORAGE_KEYS = {
  COMPANIES: 'aep_companies_v1',
  CANDIDATES: 'aep_candidates_v1',
  JOBS: 'aep_jobs_v1',
  APPLICATIONS: 'aep_applications_v1',
  ACTIVE_USER: 'aep_active_user_v1',
};

export const INITIAL_COMPANIES: CompanyProfile[] = [
  {
    id: 'emp-1',
    nomeFantasia: 'Mercadinho & Hortifrúti São Jorge',
    razaoSocial: 'S. J. Alimentos & Varejo Popular ME',
    cnpjOuMei: '34.567.890/0001-12',
    segmento: 'Comércio e Varejo Alimentício',
    bairro: 'Jardim Esperança',
    cidade: 'Comunidade Periférica',
    endereco: 'Rua Principal dos Moradores, 142',
    responsavel: 'Seu Jorge de Souza',
    telefone: '(11) 98765-4321',
    email: 'mercadinhosaojorge@gmail.com',
    descricao: 'Mercadinho de bairro com 15 anos de história atendendo as famílias locais com preços justos e carinho.',
    dataCadastro: '2026-02-10',
  },
  {
    id: 'emp-2',
    nomeFantasia: 'Panificadora Estrela da Manhã',
    razaoSocial: 'Padaria e Confeitaria Estrela Ltda',
    cnpjOuMei: '45.123.987/0001-55',
    segmento: 'Alimentação e Padaria',
    bairro: 'Vila Nova',
    cidade: 'Comunidade Periférica',
    endereco: 'Av. da Estação Comunitária, 88',
    responsavel: 'Dona Carmem Ribeiro',
    telefone: '(11) 97654-3210',
    email: 'panificadoraestrelamanha@gmail.com',
    descricao: 'Pães quentinhos, bolos caseiros e lanches para começar o dia da nossa comunidade.',
    dataCadastro: '2026-02-18',
  },
  {
    id: 'emp-3',
    nomeFantasia: 'Oficina & Borracharia Irmãos Silva',
    razaoSocial: 'Carlos Silva & Irmão Serviços Automotivos',
    cnpjOuMei: '56.789.012/0001-33',
    segmento: 'Serviços Mecânicos e Manutenção',
    bairro: 'Morro Alto',
    cidade: 'Comunidade Periférica',
    endereco: 'Travessa da Esperança, 45',
    responsavel: 'Carlos Silva',
    telefone: '(11) 96543-2109',
    email: 'oficinasilvaperiferia@gmail.com',
    descricao: 'Manutenção rápida de motos, carros e borracharia para quem trabalha e precisa do veículo no dia a dia.',
    dataCadastro: '2026-03-01',
  },
  {
    id: 'emp-4',
    nomeFantasia: 'Espaço Bella Estética Popular',
    razaoSocial: 'Isabela Santos Beleza & Cuidado MEI',
    cnpjOuMei: '48.901.234/0001-78',
    segmento: 'Beleza e Cuidados Pessoais',
    bairro: 'Jardim Esperança',
    cidade: 'Comunidade Periférica',
    endereco: 'Rua do Comércio Local, 19',
    responsavel: 'Isabela Santos',
    telefone: '(11) 95432-1098',
    email: 'espacobellabairro@gmail.com',
    descricao: 'Salão de beleza acessível e acolhedor para homens e mulheres do bairro.',
    dataCadastro: '2026-03-12',
  },
];

export const INITIAL_JOBS: JobFunction[] = [
  {
    id: 'vaga-1',
    empresaId: 'emp-1',
    empresaNome: 'Mercadinho & Hortifrúti São Jorge',
    titulo: 'Auxiliar de Reposição e Estoque',
    bairro: 'Jardim Esperança',
    cidade: 'Comunidade Periférica',
    salario: 'R$ 1.620,00',
    tipoContrato: 'CLT',
    requisitos: 'Mora preferencialmente no Jardim Esperança ou Morro Alto. Disposição física, pontualidade e boa comunicação.',
    cargaHoraria: 'Segunda a Sábado - 07:30 às 16:30 (1h de almoço)',
    descricao: 'Responsável pelo recebimento de mercadorias locais, reposição das gôndolas e organização do depósito do mercadinho.',
    beneficios: 'Cesta de legumes/frutas do hortifrúti + Vale Transporte local',
    status: 'ativa',
    vagasDisponiveis: 2,
    dataPublicacao: '2026-10-01',
  },
  {
    id: 'vaga-2',
    empresaId: 'emp-2',
    empresaNome: 'Panificadora Estrela da Manhã',
    titulo: 'Atendente de Balcão e Caixa',
    bairro: 'Vila Nova',
    cidade: 'Comunidade Periférica',
    salario: 'R$ 1.580,00 + Quebra de caixa',
    tipoContrato: 'CLT',
    requisitos: 'Gostar de lidar com público, saber mexer em máquina de cartão básica e simpatia com os vizinhos.',
    cargaHoraria: 'Escala 6x1 - Turno Manhã (06h às 14h20)',
    descricao: 'Atendimento aos clientes no balcão de pães e frios, pesagem, fatiamento e registro no caixa eletrônico simples.',
    beneficios: 'Café da manhã na padaria + Lanche da tarde',
    status: 'ativa',
    vagasDisponiveis: 1,
    dataPublicacao: '2026-10-05',
  },
  {
    id: 'vaga-3',
    empresaId: 'emp-3',
    empresaNome: 'Oficina & Borracharia Irmãos Silva',
    titulo: 'Ajudante Geral de Oficina e Borracharia',
    bairro: 'Morro Alto',
    cidade: 'Comunidade Periférica',
    salario: 'R$ 1.750,00',
    tipoContrato: 'CLT',
    requisitos: 'Não precisa ter curso prévio, ensinamos no local! Vontade de aprender mecânica básica de motos e conserto de pneus.',
    cargaHoraria: 'Segunda a Sexta das 08h às 17h, Sábado meio período',
    descricao: 'Apoio na desmontagem e montagem de rodas, vulcanização simples, organização das ferramentas e lavagem de peças.',
    beneficios: 'Treinamento prático profissional no ofício + Almoço no local',
    status: 'ativa',
    vagasDisponiveis: 1,
    dataPublicacao: '2026-10-08',
  },
  {
    id: 'vaga-4',
    empresaId: 'emp-4',
    empresaNome: 'Espaço Bella Estética Popular',
    titulo: 'Assistente de Cabelereira e Manicure',
    bairro: 'Jardim Esperança',
    cidade: 'Comunidade Periférica',
    salario: 'R$ 1.500,00 + Comissão em procedimentos',
    tipoContrato: 'MEI',
    requisitos: 'Experiência com cutilagem e esmaltação básica, ou curso prático concluído/em andamento.',
    cargaHoraria: 'Terça a Sábado das 09h às 18h',
    descricao: 'Realizar atendimento de manicure, lavagem e escovação simples de cabelos, higienização dos materiais no salão.',
    beneficios: 'Comissões sobre serviços + Desconto em cosméticos',
    status: 'ativa',
    vagasDisponiveis: 2,
    dataPublicacao: '2026-10-10',
  },
  {
    id: 'vaga-5',
    empresaId: 'emp-1',
    empresaNome: 'Mercadinho & Hortifrúti São Jorge',
    titulo: 'Entregador Local (Bicicleta ou Moto)',
    bairro: 'Jardim Esperança',
    cidade: 'Comunidade Periférica',
    salario: 'R$ 1.680,00 + Taxa por entrega realizada',
    tipoContrato: 'MEI',
    requisitos: 'Conhecer bem as ruas e becos do Jardim Esperança e Vila Nova. Ter bicicleta própria ou moto regularizada.',
    cargaHoraria: 'Segunda a Sábado das 10h às 19h',
    descricao: 'Realizar entregas de compras feitas pelo WhatsApp do mercadinho nas casas dos moradores da comunidade.',
    beneficios: 'Taxa fixa por entrega + Vale refeição',
    status: 'ativa',
    vagasDisponiveis: 1,
    dataPublicacao: '2026-10-12',
  },
];

export const INITIAL_CANDIDATES: CandidateProfile[] = [
  {
    id: 'cand-1',
    nome: 'Maria Eduarda dos Santos',
    email: 'maria.eduarda.bairro@gmail.com',
    telefone: '(11) 99112-3344',
    bairro: 'Jardim Esperança',
    cidade: 'Comunidade Periférica',
    cargoDesejado: 'Atendente de Caixa / Balcão',
    escolaridade: 'Ensino Médio Completo',
    experiencia: '1 ano de experiência em mercearia de família e atendimento a clientes no bairro.',
    habilidades: ['Atendimento com simpatia', 'Fechamento de caixa', 'Organização de prateleiras', 'Pontualidade'],
    resumo: 'Moradora do Jardim Esperança desde que nasci, procuro emprego no bairro para conciliar com os estudos noturnos.',
    disponibilidade: 'imediata',
    curriculoArquivo: {
      nome: 'Curriculo_Maria_Eduarda_Santos.pdf',
      tamanho: '245 KB',
      tipo: 'application/pdf',
    },
    dataCadastro: '2026-10-02',
  },
  {
    id: 'cand-2',
    nome: 'Carlos Eduardo Ferreira',
    email: 'carlos.ferreira.morro@gmail.com',
    telefone: '(11) 98223-4455',
    bairro: 'Morro Alto',
    cidade: 'Comunidade Periférica',
    cargoDesejado: 'Ajudante Geral / Repositor',
    escolaridade: 'Ensino Médio Completo',
    experiencia: 'Já trabalhei em depósito de bebidas e ajudando em pequenas reformas na comunidade.',
    habilidades: ['Disposição física', 'Carga e descarga', 'Trabalho em equipe', 'Boa vontade para aprender'],
    resumo: 'Procuro vaga próxima da minha residência no Morro Alto ou bairros vizinhos para não gastar com condução cara.',
    disponibilidade: 'integral',
    dataCadastro: '2026-10-04',
  },
  {
    id: 'cand-3',
    nome: 'Ana Clara Ribeiro',
    email: 'anaclara.vilanova@gmail.com',
    telefone: '(11) 97334-5566',
    bairro: 'Vila Nova',
    cidade: 'Comunidade Periférica',
    cargoDesejado: 'Recepcionista / Atendente / Auxiliar',
    escolaridade: 'Ensino Médio e curso de Informática Básica',
    experiencia: 'Atendimento telefônico, agendamento de horários em salão e emissão de notas simples.',
    habilidades: ['WhatsApp Comercial', 'Digitação', 'Planilhas simples', 'Educação no trato com pessoas'],
    resumo: 'Tenho facilidade com celular e computador, sou organizada e busco oportunidade de crescimento na comunidade.',
    disponibilidade: 'manha',
    dataCadastro: '2026-10-06',
  },
  {
    id: 'cand-4',
    nome: 'Lucas Gabriel de Oliveira',
    email: 'lucas.gabriel.bike@gmail.com',
    telefone: '(11) 96445-6677',
    bairro: 'Jardim Esperança',
    cidade: 'Comunidade Periférica',
    cargoDesejado: 'Entregador Local / Ciclista / Motoboy',
    escolaridade: 'Ensino Médio Incompleto',
    experiencia: 'Conheço todos os becos, vilas e travessas do bairro. Ágil, cuidadoso com mercadorias.',
    habilidades: ['Pontualidade', 'Conhecimento topográfico do bairro', 'Bicicleta revisada', 'Comunicação ágil'],
    resumo: 'Disponível para entregas rápidas de mercado, padaria, remédios ou lanches no bairro.',
    disponibilidade: 'integral',
    dataCadastro: '2026-10-09',
  },
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    vagaId: 'vaga-1',
    vagaTitulo: 'Auxiliar de Reposição e Estoque',
    empresaId: 'emp-1',
    empresaNome: 'Mercadinho & Hortifrúti São Jorge',
    candidatoId: 'cand-2',
    candidatoNome: 'Carlos Eduardo Ferreira',
    candidatoTelefone: '(11) 98223-4455',
    candidatoBairro: 'Morro Alto',
    candidatoEscolaridade: 'Ensino Médio Completo',
    candidatoExperiencia: 'Já trabalhei em depósito de bebidas e ajudando em reformas locais.',
    status: 'pendente',
    mensagem: 'Olá Seu Jorge, moro aqui no Morro Alto bem pertinho do mercadinho e posso começar já na segunda-feira!',
    dataCandidatura: '2026-10-09',
  },
  {
    id: 'app-2',
    vagaId: 'vaga-2',
    vagaTitulo: 'Atendente de Balcão e Caixa',
    empresaId: 'emp-2',
    empresaNome: 'Panificadora Estrela da Manhã',
    candidatoId: 'cand-1',
    candidatoNome: 'Maria Eduarda dos Santos',
    candidatoTelefone: '(11) 99112-3344',
    candidatoBairro: 'Jardim Esperança',
    candidatoEscolaridade: 'Ensino Médio Completo',
    candidatoExperiencia: '1 ano de experiência em mercearia de família e atendimento.',
    curriculoArquivo: {
      nome: 'Curriculo_Maria_Eduarda_Santos.pdf',
      tamanho: '245 KB',
      tipo: 'application/pdf',
    },
    status: 'entrevista',
    mensagem: 'Tenho facilidade com caixa e adoro o atendimento de padaria. Posso fazer entrevista presencial a qualquer hora.',
    respostaEmpresa: 'Olá Maria! Seu currículo foi selecionado com sucesso. Gostaríamos de convidá-la para uma conversa presencial nesta sexta-feira às 10h aqui na padaria!',
    dataResposta: '2026-10-11',
    dataCandidatura: '2026-10-10',
  },
  {
    id: 'app-3',
    vagaId: 'vaga-5',
    vagaTitulo: 'Entregador Local (Bicicleta ou Moto)',
    empresaId: 'emp-1',
    empresaNome: 'Mercadinho & Hortifrúti São Jorge',
    candidatoId: 'cand-4',
    candidatoNome: 'Lucas Gabriel de Oliveira',
    candidatoTelefone: '(11) 96445-6677',
    candidatoBairro: 'Jardim Esperança',
    candidatoEscolaridade: 'Ensino Médio Incompleto',
    candidatoExperiencia: 'Conheço todos os caminhos do bairro.',
    status: 'em_analise',
    mensagem: 'Moro a duas quadras do mercadinho, tenho bike com bagageiro reforçado e disposição total.',
    dataCandidatura: '2026-10-13',
  },
];

// Helper functions for LocalStorage management
export function loadCompanies(): CompanyProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
      return INITIAL_COMPANIES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading companies', e);
    return INITIAL_COMPANIES;
  }
}

export function saveCompanies(companies: CompanyProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  } catch (e) {
    console.error('Error saving companies', e);
  }
}

export function loadCandidates(): CandidateProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(INITIAL_CANDIDATES));
      return INITIAL_CANDIDATES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading candidates', e);
    return INITIAL_CANDIDATES;
  }
}

export function saveCandidates(candidates: CandidateProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
  } catch (e) {
    console.error('Error saving candidates', e);
  }
}

export function loadJobs(): JobFunction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading jobs', e);
    return INITIAL_JOBS;
  }
}

export function saveJobs(jobs: JobFunction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  } catch (e) {
    console.error('Error saving jobs', e);
  }
}

export function loadApplications(): JobApplication[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading applications', e);
    return INITIAL_APPLICATIONS;
  }
}

export function saveApplications(apps: JobApplication[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  } catch (e) {
    console.error('Error saving applications', e);
  }
}

export interface ActiveSession {
  role: 'visitante' | 'candidato' | 'empresa';
  candidate?: CandidateProfile;
  company?: CompanyProfile;
}

export function loadSession(): ActiveSession {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (!data) {
      return { role: 'visitante' };
    }
    return JSON.parse(data);
  } catch (e) {
    return { role: 'visitante' };
  }
}

export function saveSession(session: ActiveSession): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(session));
  } catch (e) {
    console.error('Error saving session', e);
  }
}
