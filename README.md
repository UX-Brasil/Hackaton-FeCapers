# SouJunior — Landing da comunidade

> Projeto da equipe **Fecapers** para o **Hackathon SouJunior** (setembro de 2026).
>
> **Site no ar:** https://hackaton-fecapers.vercel.app

Landing page institucional da **SouJunior**, a comunidade gratuita onde
pessoas em início de carreira ganham experiência real em tecnologia trabalhando em produtos
digitais com mentoria e times multidisciplinares.

A página apresenta a proposta da comunidade, as 12 áreas de atuação, os caminhos de participação
(júnior, mentor, apoiador e head), as iniciativas e as formas de apoio. Ela também traz o
**Juno**, um assistente virtual que responde dúvidas sobre a SouJunior por texto ou por voz,
direto no navegador.

É somente frontend: não tem backend, banco de dados nem autenticação, e todas as rotas são
geradas como páginas estáticas.

## Principais recursos

- **Landing completa e responsiva**: hero, nossa proposta, pilares, galeria da experiência na
  prática, áreas de atuação, depoimentos, caminhos de participação, mentoria, iniciativas
  (SouJunior Talk e SouJunior Labs), formas de apoio (incluindo o Apoia.se) e chamada final.
- **Juno, assistente virtual**: chat com sugestões de perguntas, entrada por voz e leitura das
  respostas em voz alta (detalhes abaixo).
- **Animações com propósito**: revelações ao rolar, títulos linha a linha, parallax discreto e
  galeria em perspectiva. Tudo desliga com `prefers-reduced-motion`.
- **Acessível**: navegação por teclado, foco visível, menu mobile com foco preso, landmarks e
  contraste AA.
- **SEO e compartilhamento**: metadados completos com palavras-chave, imagem Open Graph gerada
  no build, Twitter Card, JSON-LD, `sitemap.xml`, `robots.txt` e manifest (detalhes abaixo).
- **Pronto para IA**: `llms.txt` e `llms-full.txt` resumem a página para assistentes de IA e
  buscadores com IA.
- **Conteúdo centralizado**: textos, links e depoimentos ficam em `content/` e alimentam tanto a
  página quanto o Juno.

## Juno, o assistente virtual

O Juno é o guia da SouJunior na página: um botão flutuante que abre um painel de conversa.
No desktop o painel flutua no canto; em telas menores que 640 px ele abre como painel de tela cheia.

- **Responde com a base de conhecimento local**, sem rede e sem chave de API. A intenção da pergunta
  é reconhecida por palavras-chave com peso, e as respostas são montadas a partir do mesmo conteúdo
  da página (`content/`): se um texto muda na landing, muda também no Juno.
- **Não inventa nada**. Quando sabe, responde. Quando sabe só uma parte, deixa isso claro. Quando não
  sabe, indica os canais oficiais da comunidade.
- **Sugere ações seguras**: leva até a seção certa da página ou abre links oficiais já conhecidos.
- **Voz**: entende perguntas faladas em pt-BR (Web Speech API) e lê as respostas em voz alta
  quando a pessoa pede. O microfone só liga por ação explícita, e nenhum áudio é gravado ou guardado.
  Sem suporte do navegador, os botões de voz não aparecem.
- **Privacidade**: a conversa fica só na sessão do navegador (`sessionStorage`).
- **Leve**: o painel é carregado sob demanda, quando o navegador está ocioso ou quando a pessoa
  demonstra interesse no botão.
- **Pronto para IA**: `lib/juno/remote-provider.ts` define o contrato de um endpoint de IA no
  servidor, e `lib/juno/system-prompt.ts` traz o prompt de sistema. Para ativar, basta criar o
  endpoint e informar o caminho em `junoConfig.remoteEndpoint` (`lib/juno/config.ts`). A chave da
  API nunca vai para o navegador.

## SEO, compartilhamento e IA

Todos os textos de SEO saem de `content/seo.ts` (título, descrições, palavras-chave e equipe), e
o endereço do site sai de `SITE_URL` em `content/links.ts`.

| Rota | Arquivo | O que entrega |
| --- | --- | --- |
| `/` | `app/layout.tsx` | título, descrição, palavras-chave, autores, canonical, Open Graph, Twitter Card, diretivas para o Googlebot e JSON-LD (`Organization`, `WebSite` e `WebPage`) |
| `/opengraph-image` | `app/opengraph-image.tsx` | imagem de compartilhamento 1200×630, gerada no build com `next/og` |
| `/twitter-image` | `app/twitter-image.tsx` | a mesma imagem para o X/Twitter |
| `/sitemap.xml` | `app/sitemap.ts` | sitemap com as imagens da página |
| `/robots.txt` | `app/robots.ts` | libera buscadores e robôs de IA (GPTBot, ClaudeBot, PerplexityBot etc.) |
| `/manifest.webmanifest` | `app/manifest.ts` | nome, cores e ícones para instalar a página |
| `/llms.txt` | `app/llms.txt/route.ts` | resumo da página para assistentes de IA, no padrão [llmstxt.org](https://llmstxt.org) |
| `/llms-full.txt` | `app/llms-full.txt/route.ts` | todos os textos da landing em Markdown |
| `/humans.txt` | `app/humans.txt/route.ts` | créditos da equipe |

A imagem Open Graph (`lib/og/share-image.tsx`) usa as mesmas fontes, cores, números e mascote da
página. O `next/og` não lê WOFF2, por isso `assets/og/` guarda cópias em TTF das fontes do site,
só com os caracteres latinos. O `llms.txt` e o `llms-full.txt` (`lib/llms.ts`) são montados a
partir de `content/`: se um texto muda na página, muda também neles.

## Stack

| Tecnologia | Uso |
| --- | --- |
| [Next.js 16](https://nextjs.org) (App Router, Turbopack) | framework, rotas, metadados e build estático |
| [React 19](https://react.dev) | interface |
| [TypeScript 5](https://www.typescriptlang.org) | tipagem de todo o projeto |
| [Tailwind CSS 4](https://tailwindcss.com) + CSS com design tokens | estilos |
| [GSAP](https://gsap.com) + ScrollTrigger | animações ao rolar a página |
| [Motion](https://motion.dev) | galeria animada da comunidade |
| [Radix UI](https://www.radix-ui.com) | diálogos acessíveis (menu mobile e Juno) |
| [Lucide](https://lucide.dev) | ícones |
| Web Speech API | voz do Juno (reconhecimento e leitura) |
| ESLint 9 + `eslint-config-next` | qualidade de código |

## Como executar

### Pré-requisitos

- **Node.js 20.9 ou superior** (recomendado: Node 26, versão fixada em `.nvmrc`)
- **npm 10 ou superior** (testado com npm 12)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/UX-Brasil/Hackaton-FeCapers.git
cd Hackaton-FeCapers

# 2. (Opcional) Use a versão do Node indicada no projeto
nvm install
nvm use

# 3. Instale as dependências
npm install

# 4. Rode em modo de desenvolvimento
npm run dev
```

Abra http://localhost:3000.

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento em http://localhost:3000 |
| `npm run build` | build de produção em `.next/` |
| `npm start` | serve o build de produção em http://localhost:3000 |
| `npm run lint` | ESLint |
| `npm run typecheck` | checagem de tipos do TypeScript |

### Testar no celular

Com o `npm run dev` rodando, abra no celular (na mesma rede Wi-Fi) o endereço **Network** que
aparece no terminal, por exemplo `http://192.168.0.10:3000`. O `next.config.ts` já libera os IPs
da rede local em `allowedDevOrigins`. Sem isso, o Next bloqueia os scripts de desenvolvimento
e nada interativo funciona no celular (menu mobile, Juno).

### Observações

- O `npm install` recusa versões de Node abaixo do mínimo (`engine-strict` no `.npmrc`).
- O npm 12 bloqueia scripts de instalação de dependências por padrão. O único pacote que precisa de
  um (`unrs-resolver`, usado pelo ESLint) está liberado em `allowScripts` no `package.json`.

## Estrutura de pastas

```text
app/
  layout.tsx          metadados, SEO, Open Graph, JSON-LD e pré-carregamento das fontes
  page.tsx            ordem das seções
  opengraph-image.tsx imagem de compartilhamento (Open Graph)
  twitter-image.tsx   imagem de compartilhamento (X/Twitter)
  manifest.ts         manifest.webmanifest
  robots.ts           robots.txt
  sitemap.ts          sitemap.xml
  llms.txt/           resumo para assistentes de IA
  llms-full.txt/      conteúdo completo para assistentes de IA
  humans.txt/         créditos da equipe
  globals.css         importa os estilos de styles/
assets/og/            fontes em TTF usadas só na imagem de compartilhamento
components/
  layout/             cabeçalho (com menu mobile) e rodapé
  sections/           uma seção da landing por arquivo
  ui/                 botão, toast, voltar ao topo, galeria animada, símbolo em blocos, títulos por linha
  mascot/             Juno, mascote do Apoia.se e o palco do Juno
  motion/             camada de animação (GSAP + ScrollTrigger)
  juno/               botão, painel, mensagens, voz e contato do Juno
content/
  site.ts             textos, áreas, pilares, caminhos, iniciativas e formas de apoio
  testimonials.ts     depoimentos
  community-gallery.ts  fotos da galeria da comunidade
  links.ts            URLs externas e domínio do site
  seo.ts              título, descrições, palavras-chave e equipe
  juno-knowledge.ts   base de conhecimento do Juno
  contact-channels.ts canais oficiais de contato usados pelo Juno
  types.ts            tipos do conteúdo
hooks/                chat do Juno, voz (reconhecimento e leitura), media queries e teclado virtual
lib/
  juno/               intenções, respostas, sessão de conversa e provedores local e remoto
  og/                 layout da imagem de compartilhamento
  llms.ts             textos do llms.txt, llms-full.txt e humans.txt
  utils.ts            utilitários
styles/
  tokens.css          cores, tipografia, espaçamento, raios e sombras
  base.css, components.css, layout.css, sections.css, community-gallery.css, motion.css, juno.css
types/                tipos da Web Speech API
public/               logo, mascotes, imagens, fontes e ícones
```

Textos e listas ficam em `content/`; os componentes só apresentam os dados.

## Links e conteúdo pendente

`content/links.ts` concentra os destinos externos. Hoje só o **Apoia.se** está confirmado.
Os links com valor `null` (formulários de júnior, mentor e head, SouJunior Talk, SouJunior Labs
e redes sociais) mantêm o botão visível e mostram o aviso “será divulgado em breve”;
redes sociais só aparecem no rodapé quando tiverem URL.

`SITE_URL` (canonical, Open Graph, sitemap, robots, JSON-LD e llms.txt) aponta para
https://hackaton-fecapers.vercel.app e deve ser trocado quando houver um domínio oficial.

## Design system

- Paleta oficial em `styles/tokens.css`: navy `#0A1662`, indigo `#0E14BF`, azul `#3C7EF9`,
  roxo `#6366F1`, ciano `#22D3EE`, amarelo `#FACC15`, texto `#242731`, cinza `#F4F4F6`.
- Componentes usam tokens semânticos (`--foreground`, `--surface`, `--border`…); seções escuras
  usam `.surface-dark`, que inverte os tokens em vez de sobrescrever cada componente.
- Tipografia: Funnel Display (títulos), Funnel Sans (texto) e Plus Jakarta Sans (botões e rótulos),
  servidas localmente de `public/fonts/`.
- Botões: `primary`, `secondary` e `ghost`, com estados de hover, foco, clique e desabilitado.
- O símbolo do logo (grade 2×2 de blocos) é o motivo gráfico da página: palco do Juno,
  caminhos de participação e favicon.

## Animações

`components/motion/motion.tsx` aplica o movimento a partir de atributos no HTML, que já chega
completo do servidor:

| Atributo | Efeito |
| --- | --- |
| `data-reveal` | entrada ao rolar |
| `data-stagger` | filhos entram em sequência |
| `data-lines` | título revelado linha a linha |
| `data-draw` | linha da “ponte” desenhada |
| `data-parallax="N"` | parallax discreto (somente desktop) |
| `data-scene` | cenas curtas do Juno e do mascote do Apoia.se |

Com `prefers-reduced-motion: reduce` todas as animações, o parallax e o scroll suave são
desligados. Sem JavaScript o conteúdo aparece normalmente. Não há scroll-jacking.

## Acessibilidade

Landmarks (`header`, `nav`, `main`, `footer`), um `h1` e um `h2` por seção, link “pular para
o conteúdo”, foco visível, menu mobile com foco preso, Escape e `aria-expanded`, botões e links
reais, textos alternativos nos mascotes e contraste AA nos fundos escuros e coloridos.
O Juno também funciona só com teclado, anuncia o próprio estado para leitores de tela e mantém
o campo de texto visível quando o teclado virtual abre no celular.

## Deploy

O site está publicado na [Vercel](https://vercel.com) em https://hackaton-fecapers.vercel.app.
É um projeto Next.js padrão: a Vercel detecta tudo sozinha, e qualquer hospedagem com Node serve
com `npm run build` + `npm start`. Todas as rotas são geradas como arquivos estáticos no build,
inclusive a imagem Open Graph, o `sitemap.xml` e o `llms.txt`.

## Equipe Fecapers

| Integrante | GitHub |
| --- | --- |
| Caio Moraes | [@caiomorhaes](https://github.com/caiomorhaes) |
| João Guilherme Gumiero de Micheli | [@JonasCrack](https://github.com/JonasCrack) |
| Julia Damásio | [@Juliadamassio](https://github.com/Juliadamassio) |
| Vinicius Binda | [@VinnizzZ](https://github.com/VinnizzZ) |
| Vinícius Nishimura | [@Vinishireis](https://github.com/Vinishireis) |

## Licença

Distribuído sob a licença [MIT](LICENSE).
