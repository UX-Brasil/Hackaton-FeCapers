import type {CSSProperties} from 'react';
import {ArrowUp} from 'lucide-react';
import {links, socialLinks} from '@/content/links';
import {footerCommunity, footerNavigation} from '@/content/site';

const publishedSocialLinks = socialLinks.filter(
  (link): link is {label: string; href: string} => link.href !== null,
);

export function Footer() {
  const columns = publishedSocialLinks.length > 0 ? 3 : 2;

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid" style={{'--footer-columns': columns} as CSSProperties}>
          <div className="site-footer__brand">
            <img src="/images/soujunior-logo.png" alt="SouJunior" width={240} height={56} loading="lazy" />
            <p>
              Comunidade aberta e gratuita onde profissionais iniciantes ganham experiência prática em tecnologia.
            </p>
          </div>

          <nav aria-labelledby="footer-sobre">
            <h2 id="footer-sobre" className="site-footer__title">
              SouJunior
            </h2>
            <ul>
              {footerNavigation.map((link) => (
                <li key={link.href}>
                  <a className="footer-link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-comunidade">
            <h2 id="footer-comunidade" className="site-footer__title">
              Comunidade
            </h2>
            <ul>
              {footerCommunity.map((link) => (
                <li key={link.href}>
                  <a className="footer-link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a className="footer-link" href={links.apoiaSe} target="_blank" rel="noopener noreferrer">
                  Apoia.se<span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            </ul>
          </nav>

          {publishedSocialLinks.length > 0 && (
            <nav aria-labelledby="footer-redes">
              <h2 id="footer-redes" className="site-footer__title">
                Redes
              </h2>
              <ul>
                {publishedSocialLinks.map((link) => (
                  <li key={link.label}>
                    <a className="footer-link" href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} SouJunior. Todos os direitos reservados.</p>
          <a className="footer-link" href="#topo">
            Voltar ao topo <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
