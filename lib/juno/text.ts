/** Limite de caracteres por pergunta enviada ao Juno. */
export const JUNO_MAX_QUESTION_LENGTH = 1000;

/** Minúsculas, sem acentos e com espaços simples — base de toda comparação. */
export function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}#+.&/@-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Casa `term` só como palavra (ou expressão) inteira: "java" não casa com "javascript". */
function termPattern(term: string, flags = 'u') {
  return new RegExp(`(^|[^\\p{L}\\p{N}#+])${escapeRegExp(term)}(?=$|[^\\p{L}\\p{N}#+])`, flags);
}

export function hasTerm(text: string, term: string) {
  return termPattern(term).test(text);
}

/** Remove as ocorrências inteiras de `term`, preservando o resto do texto. */
export function removeTerm(text: string, term: string) {
  return text.replace(termPattern(term, 'gu'), '$1 ');
}

/** Junta itens como "A, B e C". */
export function joinList(items: readonly string[]) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

export function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/** Texto para leitura em voz alta: sem marcadores e com pausas nas quebras. */
export function toSpeakableText(text: string) {
  return text
    .replace(/^\s*[•\-–]\s*/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ', ')
    .replace(/\s*—\s*/g, ', ')
    .replace(/([.!?])\s*[.,]\s*/g, '$1 ')
    .trim();
}

/** Divide em trechos curtos: alguns navegadores cortam falas longas. */
export function splitForSpeech(text: string, maxLength = 180) {
  const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    const next = `${current} ${sentence}`.trim();
    if (next.length > maxLength && current) {
      chunks.push(current);
      current = sentence.trim();
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

const SENSITIVE_PATTERNS = [
  // CPF: 000.000.000-00 ou 11 dígitos
  /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
  // Números de cartão: 13 a 19 dígitos, com ou sem separadores
  /\b(?:\d[ -]?){13,19}\b/g,
];

/** Remove documentos e números de cartão antes de exibir ou guardar a mensagem. */
export function redactSensitive(text: string) {
  return SENSITIVE_PATTERNS.reduce((value, pattern) => value.replace(pattern, '[dado removido]'), text);
}

export function containsSensitiveNumber(text: string) {
  return SENSITIVE_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

/** Primeira letra maiúscula e pontuação final — usado na transcrição de voz. */
export function tidyTranscript(text: string) {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (!trimmed) return '';
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (/[.!?]$/.test(capitalized)) return capitalized;
  const isQuestion = /^(como|qual|quais|quando|onde|quem|o que|por que|porque|quanto|quantos|quantas|posso|pode|tem|existe|existem|a soujunior|e )/i.test(
    trimmed,
  );
  return `${capitalized}${isQuestion ? '?' : '.'}`;
}
