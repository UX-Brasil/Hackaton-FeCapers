import {useCallback, useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {tidyTranscript} from '@/lib/juno/text';

/**
 * Reconhecimento de voz do navegador (Web Speech API), em pt-BR.
 *
 * A fala vira texto no próprio navegador — o Juno não grava nem guarda áudio.
 * Só começa a ouvir por ação explícita (`start`) e para ao desmontar.
 */

export type VoiceState = 'idle' | 'requesting' | 'listening' | 'review' | 'error';

export type VoiceError =
  | 'unsupported'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'audio-capture'
  | 'no-speech'
  | 'network'
  | 'language'
  | 'generic';

function getRecognitionConstructor() {
  if (typeof window === 'undefined' || !window.isSecureContext) return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

const noopSubscribe = () => () => {};

function toVoiceError(code: SpeechRecognitionErrorCode): VoiceError {
  switch (code) {
    case 'not-allowed':
      return 'not-allowed';
    case 'service-not-allowed':
      return 'service-not-allowed';
    case 'audio-capture':
      return 'audio-capture';
    case 'no-speech':
      return 'no-speech';
    case 'network':
      return 'network';
    case 'language-not-supported':
      return 'language';
    default:
      return 'generic';
  }
}

/** Estado da permissão do microfone, quando o navegador informa. */
async function microphonePermission(): Promise<PermissionState | 'unknown'> {
  try {
    const status = await navigator.permissions.query({name: 'microphone'});
    return status.state;
  } catch {
    return 'unknown';
  }
}

interface Options {
  /** Chamado com a transcrição final, para colocá-la no campo de texto. */
  onTranscript?: (text: string) => void;
}

export function useSpeechRecognition({onTranscript}: Options = {}) {
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => Boolean(getRecognitionConstructor()),
    () => false,
  );
  const [state, setState] = useState<VoiceState>('idle');
  const [interim, setInterim] = useState('');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<VoiceError | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const deniedRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const fail = useCallback((code: VoiceError) => {
    setError(code);
    setInterim('');
    setState('error');
  }, []);

  const start = useCallback(async () => {
    const Recognition = getRecognitionConstructor();
    if (!Recognition) return fail('unsupported');
    if (recognitionRef.current) return;

    // Permissão já negada: explicar de novo em vez de insistir no pedido.
    if (deniedRef.current && (await microphonePermission()) !== 'granted') return fail('not-allowed');

    const recognition = new Recognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let finalText = '';
    let interimText = '';
    let errorCode: SpeechRecognitionErrorCode | null = null;

    recognition.onstart = () => setState('listening');
    recognition.onresult = (event) => {
      finalText = '';
      interimText = '';
      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      setInterim(`${finalText} ${interimText}`.trim());
    };
    recognition.onerror = (event) => {
      errorCode = event.error;
      if (event.error === 'not-allowed') deniedRef.current = true;
    };
    recognition.onend = () => {
      // Cancelado por `cancel()` ou por desmontagem: nada a mostrar.
      if (recognitionRef.current !== recognition) return;
      recognitionRef.current = null;
      if (errorCode && errorCode !== 'aborted' && errorCode !== 'no-speech') return fail(toVoiceError(errorCode));
      const text = tidyTranscript(finalText || interimText);
      setInterim('');
      if (text) {
        setTranscript(text);
        setState('review');
        onTranscriptRef.current?.(text);
      } else if (errorCode === 'aborted') {
        setState('idle');
      } else {
        fail('no-speech');
      }
    };

    recognitionRef.current = recognition;
    setError(null);
    setTranscript('');
    setInterim('');
    setState('requesting');
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      fail('generic');
    }
  }, [fail]);

  /** Termina a escuta e usa o que já foi reconhecido. */
  const stop = useCallback(() => recognitionRef.current?.stop(), []);

  /** Descarta a escuta e a transcrição. */
  const cancel = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    recognition?.abort();
    setInterim('');
    setTranscript('');
    setError(null);
    setState('idle');
  }, []);

  useEffect(
    () => () => {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      recognition?.abort();
    },
    [],
  );

  return {supported, state, interim, transcript, error, start, stop, cancel};
}
