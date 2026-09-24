import {useCallback, useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {splitForSpeech, toSpeakableText} from '@/lib/juno/text';

/**
 * Leitura das respostas em voz alta (SpeechSynthesis), sempre a pedido da
 * pessoa — nunca automática. É um extra: sem suporte, o botão não aparece.
 */

const noopSubscribe = () => () => {};

function isSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function pickVoice(voices: SpeechSynthesisVoice[]) {
  const portuguese = voices.filter(({lang}) => lang.replace('_', '-').toLowerCase().startsWith('pt'));
  return (
    portuguese.find(({lang, localService}) => lang.replace('_', '-') === 'pt-BR' && localService) ??
    portuguese.find(({lang}) => lang.replace('_', '-') === 'pt-BR') ??
    portuguese[0] ??
    null
  );
}

export function useSpeechSynthesis() {
  const supported = useSyncExternalStore(noopSubscribe, isSupported, () => false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  // Cada fala tem um número; eventos de uma fala cancelada são ignorados.
  const turnRef = useRef(0);

  useEffect(() => {
    // Alguns navegadores só carregam as vozes depois da primeira consulta.
    if (supported) window.speechSynthesis.getVoices();
  }, [supported]);

  const stop = useCallback(() => {
    turnRef.current += 1;
    if (isSupported()) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  const speak = useCallback((id: string, text: string) => {
    if (!isSupported()) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const turn = ++turnRef.current;
    const finish = () => {
      if (turnRef.current === turn) setSpeakingId(null);
    };
    const voice = pickVoice(synth.getVoices());
    // Trechos curtos: o Chrome interrompe falas longas.
    const chunks = splitForSpeech(toSpeakableText(text));
    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = voice?.lang ?? 'pt-BR';
      if (voice) utterance.voice = voice;
      utterance.onerror = finish;
      if (index === chunks.length - 1) utterance.onend = finish;
      synth.speak(utterance);
    });
    setSpeakingId(id);
  }, []);

  useEffect(
    () => () => {
      turnRef.current += 1;
      if (isSupported()) window.speechSynthesis.cancel();
    },
    [],
  );

  return {supported, speakingId, speak, stop};
}
