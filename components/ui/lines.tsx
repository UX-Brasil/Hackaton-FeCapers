import {Fragment, type ReactNode} from 'react';

/**
 * Quebra um título em linhas mascaradas para a revelação por linha.
 * Os espaços entre as linhas mantêm o texto correto para leitores de tela,
 * cópia e indexação.
 */
export function Lines({lines}: {lines: ReactNode[]}) {
  return lines.map((line, index) => (
    <Fragment key={index}>
      {index > 0 && ' '}
      <span className="line">
        <span className="line__inner">{line}</span>
      </span>
    </Fragment>
  ));
}
