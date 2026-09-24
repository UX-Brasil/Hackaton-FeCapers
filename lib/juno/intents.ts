import {JUNO_AREAS, type JunoArea} from '@/content/juno-knowledge';
import {hasTerm, normalize, removeTerm} from './text';

/**
 * Reconhecimento de intenção por palavras-chave com peso.
 * Recebe o texto já normalizado (minúsculas, sem acentos).
 */

export type IntentId =
  | 'identity'
  | 'contact'
  | 'personal'
  | 'about'
  | 'free'
  | 'audience'
  | 'participate'
  | 'squads'
  | 'areaChoice'
  | 'areasList'
  | 'mentorship'
  | 'beMentor'
  | 'head'
  | 'company'
  | 'apoiaSe'
  | 'support'
  | 'talk'
  | 'labs'
  | 'initiatives'
  | 'social'
  | 'metrics'
  | 'testimonials'
  | 'pillars'
  | 'employability'
  | 'projects'
  | 'routine'
  | 'networking';

type Pattern = [RegExp, number];

/** Em caso de empate, vence a intenção que aparece primeiro. */
const INTENTS: Array<[IntentId, Pattern[]]> = [
  [
    'identity',
    [
      [/\bquem (e|eh) (voce|vc|o juno)\b/, 5],
      [/\b(voce|vc) e (humano|humana|uma pessoa|gente|real|um robo|um bot|uma ia|ia|inteligencia artificial)\b/, 5],
      [/\bo que (e|eh) (o )?juno\b/, 5],
      [/\b(seu nome|como (voce|vc) se chama)\b/, 5],
    ],
  ],
  [
    'contact',
    [
      [/\bfalar com (alguem|uma pessoa|a equipe|a soujunior|voces|um humano|humano|atendente|uma atendente|o suporte|suporte|a organizacao)\b/, 5],
      [/\b(contato|contatar|contactar|atendimento|atendente|suporte|ouvidoria|fale conosco|pessoa real)\b/, 4],
      [/\b(email|e-mail|telefone|whatsapp)\b.*\b(voces|soujunior|equipe|contato)\b/, 4],
      [/\bcomo falo com\b/, 4],
    ],
  ],
  [
    'personal',
    [
      [/\b(minha inscricao|meu cadastro|me inscrevi|me cadastrei|fiz (a|minha) inscricao|meu formulario|minha squad|meu mentor|minha mentora|minha conta)\b/, 3.5],
      [/\bnao (recebi|consigo acessar|consegui acessar|consigo me inscrever|consegui me inscrever|consigo enviar|consegui enviar|tive retorno)\b/, 3.5],
      [/\b(reclamacao|reclamar|denuncia|denunciar|assedio|desrespeito|problema com)\b/, 3.5],
    ],
  ],
  [
    'company',
    [
      [/\b(empresa|empresas|companhia|parceria|parcerias|parceiro|parceira|parceiros|patrocinador|patrocinadores|patrocinar|patrocinio)\b/, 3],
      [/\b(contratar|recrutar)\b.*\b(junior|juniores|profissionais|talentos|pessoas|voces)\b/, 2],
    ],
  ],
  [
    'apoiaSe',
    [
      [/\bapoia[\s.-]?se\b/, 5],
      [/\b(financeiramente|financeiro|dinheiro|doar|doacao|doacoes|contribuicao mensal)\b/, 2],
    ],
  ],
  [
    'support',
    [
      [/\b(apoiar|apoio|apoiador|apoiadora|apoiadores|contribuir|contribuicao|divulgar|divulgacao|divulgador|palestra|palestras|palestrante|voluntario|voluntaria|voluntariado)\b/, 3],
      [/\bcomo (posso|eu posso|da pra|da para) ajudar\b/, 1.5],
      [/\bajudar a (soujunior|comunidade)\b/, 3],
    ],
  ],
  [
    'beMentor',
    [
      [/\b(ser|virar|tornar|me tornar|seja|atuar como|participar como)\b.*\bmentor(a|es|as)?\b/, 4],
      [/\bmentor(a|es|as)?\b/, 2],
      [/\b(senior|seniores|pleno|experiente|anos de experiencia)\b/, 2],
      [/\b(ja trabalho|ja atuo|ja sou)\b/, 1],
      [/\b(ensinar|retribuir|compartilhar (o que sei|conhecimento|experiencia))\b/, 1.5],
    ],
  ],
  [
    'mentorship',
    [
      [/\b(como funciona|como e|como sao|o que e|como sera|tem)\b.*\bmentoria(s)?\b/, 4],
      [/\bmentoria(s)?\b/, 2],
    ],
  ],
  [
    'head',
    [
      [/\bheads?\b/, 3],
      [/\b(liderar|lideranca|lider|coordenar)\b/, 2],
    ],
  ],
  [
    'audience',
    [
      [/\bquem pode (participar|entrar|se inscrever|fazer parte|ser)\b/, 4],
      [/\b(para|pra) quem (e|eh|serve)\b/, 3],
      [/\bposso (participar|entrar|fazer parte)\b/, 2],
      [/\b(iniciante|iniciantes|comecando|sem experiencia|transicao|mudar de carreira|mudanca de carreira|mudar de area)\b/, 1.5],
    ],
  ],
  [
    'participate',
    [
      [/\b(como|quero|onde|posso|gostaria de)\b.*\b(participar|entrar|inscrever|inscricao|fazer parte|cadastrar|cadastro|ingressar)\b/, 3],
      [/\b(participar|participo|participacao|inscricao|inscricoes|inscrever|cadastro|fazer parte|ingressar|formulario)\b/, 2],
    ],
  ],
  [
    'squads',
    [
      [/\bsquads?\b/, 3],
      [/\b(times|equipes) multidisciplinares\b/, 2],
    ],
  ],
  [
    'areaChoice',
    [
      [/\b(qual|que) area\b.*\b(escolher|escolho|combina|seguir|sigo|ideal|melhor|indicada|recomenda|recomendada|comecar)\b/, 4],
      [/\b(nao sei|duvida|indeciso|indecisa|perdido|perdida|nao consigo escolher)\b.*\b(area|escolher|seguir|caminho)\b/, 4],
      [/\b(combina comigo|pra mim|para mim)\b/, 1.5],
      [/\b(aprendendo|estudando|comecando|aprender) (programacao|a programar|tecnologia|ti|codigo)\b/, 2],
      [/\b(qual|que) area\b/, 2],
    ],
  ],
  [
    'areasList',
    [
      [/\b(quais|que|lista|todas|conhecer|ver|mostra|mostrar|mostre|existem|tem)\b.*\bareas\b/, 3],
      [/\bareas?\b/, 1.5],
      [/\b(especialidades|trilhas)\b/, 2],
    ],
  ],
  [
    'talk',
    [
      [/\btalk\b/, 4],
      [/\b(ingles|idioma|idiomas|conversacao)\b/, 3],
    ],
  ],
  [
    'labs',
    [
      [/\blabs?\b/, 4],
      [/\b(laboratorio|inovacao)\b/, 3],
    ],
  ],
  [
    'initiatives',
    [
      [/\biniciativas?\b/, 3],
      [/\b(programas complementares|ecossistema)\b/, 2],
    ],
  ],
  [
    'social',
    [
      [/\b(onde|quais|link|links|perfil|perfis|seguir|sigo|encontr\w*|acompanh\w*)\b.*\bredes? socia(l|is)\b/, 4],
      [/\bredes? socia(l|is)\b.*\b(da soujunior|de voces|oficia(l|is))\b/, 4],
      [/\bredes? socia(l|is)\b/, 1.5],
      [/\b(instagram|linkedin|discord|youtube|github|twitter|tiktok|telegram|facebook)\b/, 3],
    ],
  ],
  [
    'free',
    [
      [/\b(gratis|gratuito|gratuita|gratuitos|de graca|free|sem custo|sem custos)\b/, 3],
      [/\b(pago|paga|pagar|pagamento|preco|custa|custo|mensalidade|cobra|cobrado|cobram|taxa)\b/, 2.5],
    ],
  ],
  [
    'metrics',
    [
      [/\bquant(os|as) (membros|pessoas|participantes|areas|inscritos)\b/, 4],
      [/\b(numeros|tamanho da comunidade|membros)\b/, 2],
    ],
  ],
  [
    'testimonials',
    [[/\b(depoimento|depoimentos|historias|relatos|quem ja participou)\b/, 3]],
  ],
  [
    'pillars',
    [[/\b(pilares|o que (voces )?oferec\w*|o que (eu )?(vou )?encontr\w*|beneficios|vantagens|o que ganho)\b/, 3]],
  ],
  [
    'employability',
    [
      [/\b(emprego|empregabilidade|vaga|vagas|contratado|contratada|contratacao|estagio|mercado de trabalho|primeiro emprego|curriculo|recrutadores)\b/, 2.5],
    ],
  ],
  [
    'projects',
    [
      [/\b(projetos? reais?|produtos digitais|codigo real|code reviews?|repositorios?|experiencia pratica|experiencia real)\b/, 2.5],
      [/\b(projeto|projetos|portfolio|pratica)\b/, 1.5],
    ],
  ],
  [
    'routine',
    [[/\b(rotina|cerimonias|dia a dia|retrospectiva|retrospectivas|como e trabalhar)\b/, 2.5]],
  ],
  [
    'networking',
    [[/\b(networking|network|conexoes|comunidade ativa|fazer amigos|conhecer pessoas)\b/, 2.5]],
  ],
  [
    'about',
    [
      [/\b(o que|oque|que)( e| eh)?\b.*\b(soujunior|sou junior|comunidade)\b/, 3],
      [/\bsobre (a )?(soujunior|sou junior|comunidade)\b/, 3],
      [/\bcomo funciona (a )?(soujunior|sou junior|comunidade)\b/, 3],
      [/^(a |o que e a )?(soujunior|sou junior)$/, 3],
      [/\bo que (voces|vcs) fazem\b/, 3],
      [/\bcomo funciona\b/, 1.5],
      [/\bquem (sao|e) (voces|a soujunior)\b/, 3],
      [/\b(proposta|missao|objetivo|proposito)\b/, 2],
    ],
  ],
];

export interface IntentMatch {
  id: IntentId;
  score: number;
}

export function scoreIntents(text: string): IntentMatch[] {
  return INTENTS.map(([id, patterns]) => ({
    id,
    score: patterns.reduce((total, [pattern, weight]) => total + (pattern.test(text) ? weight : 0), 0),
  }))
    .filter(({score}) => score > 0)
    .sort((a, b) => b.score - a.score);
}

/* ---------- Áreas ---------- */

export interface AreaMatch {
  area: JunoArea;
  /** true quando o termo é o nome, um apelido ou um item citado pela própria área. */
  direct: boolean;
}

interface Keyword {
  area: JunoArea;
  term: string;
  direct: boolean;
}

const AREA_KEYWORDS: Keyword[] = JUNO_AREAS.flatMap((area) => [
  ...[...area.aliases, ...area.listed].map((term) => ({area, term: normalize(term), direct: true})),
  ...area.related.map((term) => ({area, term: normalize(term), direct: false})),
]).sort((a, b) => b.term.length - a.term.length || a.term.localeCompare(b.term));

/** Expressões que contêm nomes de área mas falam de outra coisa. */
const AREA_NOISE = /\b(produtos? digita(l|is)|dados pessoais|meus dados|seus dados|soujunior|sou junior|redes? socia(l|is) (da soujunior|de voces|oficia(l|is)))\b/g;

/**
 * Áreas citadas no texto. Termos longos são consumidos primeiro, para que
 * "react native" leve a Mobile e não também a Front-end.
 */
export function findAreas(text: string): AreaMatch[] {
  let remaining = ` ${text.replace(AREA_NOISE, ' ')} `;
  const found = new Map<string, AreaMatch>();
  // O termo só é consumido depois de todas as áreas que o usam ("interfaces").
  let matched: string | null = null;
  for (const {area, term, direct} of AREA_KEYWORDS) {
    if (matched && matched !== term) {
      remaining = removeTerm(remaining, matched);
      matched = null;
    }
    if (!term || (term !== matched && !hasTerm(remaining, term))) continue;
    matched = term;
    const previous = found.get(area.name);
    if (!previous || (direct && !previous.direct)) found.set(area.name, {area, direct});
  }
  const matches = [...found.values()];
  // Um termo direto é mais forte do que um termo apenas relacionado.
  return matches.some(({direct}) => direct) ? matches.filter(({direct}) => direct) : matches;
}

/* ---------- Informação específica fora da base ---------- */

/**
 * Detalhes que a SouJunior não publicou. Quando aparecem, o Juno avisa que
 * não tem a informação em vez de responder algo parecido.
 */
const UNKNOWN_TOPICS: Array<[RegExp, string]> = [
  [/\b(proxima|nova|qual a|qual e a|que) data\b|\bdata (de|do|da) (inicio|inscricao|inscricoes|processo|selecao|abertura|entrada)\b/, 'date'],
  [/\b(quando|que dia|datas|prazo|prazos|ate quando|calendario|cronograma|proxim[ao] (turma|selecao|processo|edicao|ciclo|entrada|inscricao|inscricoes))\b/, 'date'],
  [/\b(quanto tempo|quantas horas|carga horaria|horas por semana|dedicacao|horario|horarios|duracao|quanto dura|dura quanto)\b/, 'carga horária e duração'],
  [/\b(idade|menor de idade|maior de idade|tenho \d+ anos|com \d+ anos)\b/, 'idade para participar'],
  [/\b(outro pais|exterior|fora do brasil|estrangeiro|estrangeira|presencial|remoto|remota|online|cidade|endereco|sede|onde fica)\b/, 'local e formato de participação'],
  [/\b(certificado|certificados|certificacao|diploma|declaracao)\b/, 'certificados'],
  [/\b(remunerado|remunerada|remuneracao|bolsa|salario|ajuda de custo|ganhar dinheiro|sou pago|recebo algum)\b/, 'remuneração'],
  [/\b(requisito|requisitos|pre-requisito|pre-requisitos|prerequisito|prerequisitos|exige|exigem|exigencia|exigencias|obrigatorio|obrigatoria|preciso ter|precisa ter|preciso saber|precisa saber|experiencia minima|nivel minimo|documento|documentos|cpf)\b/, 'requisitos de participação'],
  [/\b(processo seletivo|selecao|seletivo|entrevista|entrevistas|prova|edital|turma|turmas|vagas abertas|vagas disponiveis|lista de espera|aprovado|aprovada|resultado)\b/, 'o processo de seleção'],
  [/\b(quem fundou|quem criou|fundador|fundadores|fundadora|fundacao|historia da soujunior|ceo|cnpj|diretoria|ong|sem fins lucrativos)\b/, 'a organização da SouJunior'],
  [/\b(quais (sao as )?empresas|empresas parceiras|quem sao os parceiros|quais (sao os )?parceiros|parceiros atuais)\b/, 'empresas parceiras'],
  [/\bquant(os|as) (squads|mentores|mentoras|projetos|heads|vagas|empresas|contratados|contratadas|pessoas (foram )?contratadas)\b/, 'esses números'],
];

export function findUnknownTopics(text: string) {
  return UNKNOWN_TOPICS.filter(([pattern]) => pattern.test(text)).map(([, topic]) => topic);
}

/* ---------- Sinais gerais ---------- */

export const signals = {
  greeting: /^(oi+|ola|oie|opa|e ai|eai|hey|hello|hi|bom dia|boa tarde|boa noite|salve|tudo bem|tudo bom)\b/,
  thanks: /\b(obrigad[oa]|obg|valeu|vlw|agradeco|brigad[oa])\b/,
  goodbye: /\b(tchau|ate mais|ate logo|falou|flw|adeus)\b/,
  affirm: /^(sim|s|quero|quero sim|claro|pode|pode ser|pode sim|bora|vamos|ok|okay|beleza|blz|isso|por favor|me leva|leva|manda|show)\b/,
  decline: /^(nao|n|agora nao|nao obrigad[oa]|nao precisa|deixa pra la)\b/,
  deictic: /\b(essa|esta|dessa|desta|nessa|nesta|isso|isto|aqui|dessas|destas|essas|estas|secao|parte)\b/,
  askedIfExists: /\b(tem|existe|existem|ha|possui|possuem)\b/,
  sensitive: /\b(meu|minha) (cpf|rg|senha|cartao|conta bancaria|agencia|numero do cartao)\b/,
  injection:
    /\b(ignore|ignora|esqueca|desconsidere|finja|aja como|atue como|a partir de agora (voce|vc))\b.*\b(instrucoes|instrucao|regras|prompt|anteriores|tudo|programacao|sistema)\b|\b(system prompt|prompt do sistema|suas instrucoes|seu prompt|api key|chave de api|chave da api|variaveis de ambiente|jailbreak|modo dev)\b/,
  /** Palavras que indicam uma pergunta sobre a SouJunior. */
  domain:
    /\b(soujunior|sou junior|comunidade|squad|squads|mentor|mentora|mentoria|area|areas|inscricao|inscricoes|participar|junior|juniores|head|apoia|talk|labs|projeto|projetos|turma|selecao|seletivo|formulario|juno)\b/,
  /** Assuntos claramente fora do escopo. */
  offTopic:
    /\b(clima|previsao do tempo|temperatura|chuva|futebol|jogo|campeonato|receita|cozinhar|filme|filmes|serie|series|musica|politica|eleicao|presidente|bitcoin|cripto|dolar|cotacao|horoscopo|signo|piada|noticia|noticias|namoro|capital d[aeo]|traduz|traduza|calcule|resolva|escreva um|faca um codigo|me ajuda com (meu|o) codigo)\b/,
};

export function wordCount(text: string) {
  return text.split(' ').filter(Boolean).length;
}
