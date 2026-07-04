export function Spinner({ mensagem = 'Carregando...' }: { mensagem?: string }) {
  return (
    <div className="spinner-area" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{mensagem}</span>
    </div>
  );
}
