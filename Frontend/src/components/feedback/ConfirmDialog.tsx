interface ConfirmDialogProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  processando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  processando = false,
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  if (!aberto) {
    return null;
  }

  return (
    <div className="dialog-overlay" role="presentation" onClick={onCancelar}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-titulo"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="dialog-titulo">{titulo}</h2>
        <p>{mensagem}</p>
        <div className="dialog__acoes">
          <button type="button" className="btn btn--secondary" onClick={onCancelar} disabled={processando}>
            Cancelar
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirmar} disabled={processando}>
            {processando ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
