interface ErrorStateProps {
  mensagem: string;
  onTentarNovamente: () => void;
}

export function ErrorState({ mensagem, onTentarNovamente }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p>{mensagem}</p>
      <button type="button" className="btn btn--secondary" onClick={onTentarNovamente}>
        Tentar novamente
      </button>
    </div>
  );
}
