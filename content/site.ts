import {
  Briefcase,
  ChartNoAxesCombined,
  Cloud,
  Database,
  Handshake,
  Layers,
  Megaphone,
  Monitor,
  PenTool,
  Presentation,
  ShieldCheck,
  Smartphone,
  UserSearch,
  Workflow,
} from 'lucide-react';
import {links} from './links';
import type {
  Area,
  CommunityRole,
  FooterLink,
  Initiative,
  Metric,
  NavItem,
  Pillar,
  ProposalPoint,
  SupportOption,
} from './types';

/** Fatos institucionais reutilizados em mais de um ponto da página. */
export const communityFacts = {
  openAndFree: 'Comunidade aberta e 100% gratuita',
  noBarriers: 'Sem custos, sem barreiras, com muita prática.',
};

export const navigation: NavItem[] = [
  {label: 'Sobre', id: 'sobre'},
  {label: 'Áreas', id: 'areas'},
  {label: 'Comunidade', id: 'participe'},
  {label: 'Iniciativas', id: 'iniciativas'},
  {label: 'Apoie', id: 'apoie'},
];

export const metrics: Metric[] = [
  {value: 10000, suffix: '+', label: 'Membros inscritos'},
  {value: 12, label: 'Áreas profissionais'},
  {value: 100, suffix: '%', label: 'Colaborativo & Aberto'},
];

export const proposalPoints: ProposalPoint[] = [
  {title: 'Squads', text: 'Times multidisciplinares atuando com Scrum e Kanban reais.'},
  {title: 'Mentorias', text: 'Sêniores de grandes empresas guiando o seu progresso diário.'},
  {title: 'Código Real', text: 'Repositórios públicos, code reviews e deploy contínuo.'},
  {title: 'Conexão', text: 'Visibilidade frente aos tech recruiters parceiros.'},
];

export const pillars: Pillar[] = [
  {
    title: 'Projetos reais de produtos digitais',
    text: 'Aplicar na prática o que você estudou, participando de ciclos de release, arquiteturas escaláveis e produtos com usuários ativos.',
    tag: 'Prática Direta',
  },
  {
    title: 'Mentoria em diversas áreas',
    text: 'Evoluir tanto em hard skills quanto em soft skills, com feedback de profissionais atuantes no mercado.',
    tag: 'Crescimento Guiado',
  },
  {
    title: 'Equipes multidisciplinares com ágil',
    text: 'Viver a dinâmica real de uma empresa de tecnologia com cerimônias ágeis, alinhamentos, retrospectivas e entregas iterativas.',
    tag: 'Rotina de Empresa',
  },
  {
    title: 'Apoio à empregabilidade',
    text: 'Se preparar melhor para processos seletivos, construir presença profissional no LinkedIn e GitHub e ampliar sua visibilidade para recrutadores.',
    tag: 'Carreira e Contratação',
  },
  {
    title: 'Comunidade ativa',
    text: 'Fazer networking genuíno, tirar dúvidas, trocar experiências e construir relações que acompanham sua evolução profissional.',
    tag: 'Networking Real',
  },
];

export const areas: Area[] = [
  {number: '01', name: 'Business', description: 'Análise de negócios e viabilidade', icon: Briefcase, accent: 'blue'},
  {number: '02', name: 'Tech Recruiter', description: 'Gestão de talentos e hunting', icon: UserSearch, accent: 'cyan'},
  {number: '03', name: 'Produtos', description: 'Product Management & Discovery', icon: Layers, accent: 'purple'},
  {number: '04', name: 'Ágil', description: 'Scrum Masters e Agilistas', icon: Workflow, accent: 'yellow'},
  {number: '05', name: 'Social Media', description: 'Comunicação e engajamento', icon: Megaphone, accent: 'cyan'},
  {number: '06', name: 'UI & UX Design', description: 'Pesquisas, wireframes e interfaces', icon: PenTool, accent: 'blue'},
  {number: '07', name: 'Front-end', description: 'React, Next.js, Tailwind, Vue', icon: Monitor, accent: 'yellow'},
  {number: '08', name: 'Back-end', description: 'Node, Java, Python, C# e APIs', icon: Database, accent: 'purple'},
  {number: '09', name: 'Data', description: 'Engenharia e Análise de Dados', icon: ChartNoAxesCombined, accent: 'blue'},
  {number: '10', name: 'Mobile', description: 'Flutter, React Native, Swift, Kotlin', icon: Smartphone, accent: 'purple'},
  {number: '11', name: 'QA', description: 'Quality Assurance & Automação', icon: ShieldCheck, accent: 'yellow'},
  {number: '12', name: 'DevOps', description: 'CI/CD, Docker, Kubernetes & Nuvem', icon: Cloud, accent: 'cyan'},
];

export const communityRoles: CommunityRole[] = [
  {
    title: 'Sou Júnior',
    audience: 'Para quem está começando ou em transição',
    text: 'Entre em uma squad real, receba mentoria e entregue valor em produtos digitais.',
    cta: 'Quero ser júnior',
    href: links.formJunior,
    pendingMessage: 'O formulário de inscrição para juniores será divulgado em breve.',
    accent: 'indigo',
  },
  {
    title: 'Sou Mentor',
    audience: 'Para quem já tem experiência de mercado',
    text: 'Compartilhe sua experiência técnica e comportamental guiando pessoas talentosas em ascensão.',
    cta: 'Quero ser mentor',
    href: links.formMentor,
    pendingMessage: 'O formulário de inscrição para mentores será divulgado em breve.',
    accent: 'purple',
  },
  {
    title: 'Sou Apoiador',
    audience: 'Para quem quer contribuir de fora das squads',
    text: 'Divulgue em seus canais, apoie a estrutura tecnológica ou conecte profissionais a oportunidades.',
    cta: 'Ver formas de apoiar',
    href: '#apoie',
    pendingMessage: '',
    accent: 'yellow',
  },
  {
    title: 'Sou Head',
    audience: 'Para quem quer liderar uma área',
    text: 'Lidere estrategicamente uma área da organização com autonomia, colaboração e propósito.',
    cta: 'Quero ser head',
    href: links.formHead,
    pendingMessage: 'O formulário de inscrição para heads será divulgado em breve.',
    accent: 'cyan',
  },
];

export const initiatives: Initiative[] = [
  {
    name: 'SouJunior Talk',
    highlight: 'Talk',
    category: 'Idiomas & Conversação',
    text: 'Quer melhorar seu inglês? Pratique com pessoas reais em uma plataforma interativa, sem medo de errar e com foco no vocabulário técnico de tecnologia.',
    href: links.talk,
    pendingMessage: 'O link da SouJunior Talk será divulgado em breve.',
    accent: 'cyan',
  },
  {
    name: 'SouJunior Labs',
    highlight: 'Labs',
    category: 'Laboratório de Inovação',
    text: 'Coloque suas habilidades em prática em projetos reais e ganhe experiência para o mercado de trabalho, utilizando stack moderna e boas práticas de engenharia de software.',
    href: links.labs,
    pendingMessage: 'O link da SouJunior Labs será divulgado em breve.',
    accent: 'purple',
  },
];

export const supportOptions: SupportOption[] = [
  {
    title: 'Divulgador',
    text: 'Espalhe nossa missão no YouTube, LinkedIn, podcasts e redes profissionais para atrair mais juniores e mentores.',
    icon: Megaphone,
  },
  {
    title: 'Especialista / Palestrante',
    text: 'Ministre workshops técnicos, talks sobre carreira e compartilhe tendências de mercado com a comunidade.',
    icon: Presentation,
  },
  {
    title: 'Recrutador / Consultor',
    text: 'Ofereça simulações de entrevistas, revisão de currículo e conexão com oportunidades.',
    icon: UserSearch,
  },
  {
    title: 'Empresa Parceira',
    text: 'Contrate profissionais preparados em nossas squads ou apoie a infraestrutura operacional da organização.',
    icon: Handshake,
  },
];

/** Itens custeados pelo apoio financeiro, conforme o texto institucional. */
export const fundedItems = ['Servidores', 'Ferramentas', 'Licenças', 'Expansão dos projetos'];

export const footerNavigation: FooterLink[] = [
  {label: 'Nossa proposta', href: '#sobre'},
  {label: 'O que você encontra', href: '#pilares'},
  {label: 'Áreas de atuação', href: '#areas'},
  {label: 'Depoimentos', href: '#depoimentos'},
];

export const footerCommunity: FooterLink[] = [
  {label: 'Faça parte', href: '#participe'},
  {label: 'Seja mentor', href: '#mentores'},
  {label: 'Iniciativas', href: '#iniciativas'},
  {label: 'Apoie a SouJunior', href: '#apoie'},
];
