import type { ReactNode } from 'react';

interface SummaryCardProps {
  titulo: string;
  valor: string;
  variante?: 'neutro' | 'positivo' | 'negativo';
  icone?: ReactNode;
}

export function SummaryCard({ titulo, valor, variante = 'neutro', icone }: SummaryCardProps) {
  return (
    <div className={`summary-card summary-card--${variante}`}>
      {icone && (
        <span className="summary-card__icone" aria-hidden="true">
          {icone}
        </span>
      )}
      <div className="summary-card__conteudo">
        <span className="summary-card__titulo">{titulo}</span>
        <strong className="summary-card__valor">{valor}</strong>
      </div>
    </div>
  );
}
