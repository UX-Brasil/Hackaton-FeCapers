interface JunoSuggestionsProps {
  items: readonly string[];
  label: string;
  disabled?: boolean;
  onPick: (question: string) => void;
}

/** Perguntas prontas: um toque envia a pergunta. */
export function JunoSuggestions({items, label, disabled, onPick}: JunoSuggestionsProps) {
  if (items.length === 0) return null;
  return (
    <div className="jn-chips" role="group" aria-label={label}>
      {items.map((question) => (
        <button key={question} type="button" className="jn-chip" disabled={disabled} onClick={() => onPick(question)}>
          {question}
        </button>
      ))}
    </div>
  );
}
