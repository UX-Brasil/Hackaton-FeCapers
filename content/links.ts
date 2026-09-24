import type {Href} from './types';

/**
 * Endereço público da landing, usado em canonical, Open Graph, sitemap, robots,
 * JSON-LD e llms.txt. Troque pelo domínio oficial quando a página for publicada nele.
 */
export const SITE_URL = 'https://hackaton-fecapers.vercel.app';

/**
 * Destinos externos da landing.
 *
 * Apenas o Apoia.se foi confirmado até agora. Os demais ficam como `null`
 * até a SouJunior publicar os links oficiais: enquanto isso, o botão
 * correspondente continua visível e avisa que o destino será divulgado em breve.
 */
export const links = {
  apoiaSe: 'https://apoia.se/soujunior',
  formJunior: null,
  formMentor: null,
  formHead: null,
  talk: null,
  labs: null,
} satisfies Record<string, Href>;

/**
 * Redes sociais oficiais. Só aparecem no rodapé quando `href` estiver preenchido.
 */
export const socialLinks: {label: string; href: Href}[] = [
  {label: 'LinkedIn', href: 'https://www.linkedin.com/company/soujunior/'},
  {label: 'GitHub', href: null},
  {label: 'Instagram', href: null},
  {label: 'Discord', href: null},
];
