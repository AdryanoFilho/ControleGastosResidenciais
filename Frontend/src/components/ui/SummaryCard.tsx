interface SummaryCardProps {
  titulo: string;
  valor: string;
  variante?: 'neutro' | 'positivo' | 'negativo';
}

export function SummaryCard({ titulo, valor, variante = 'neutro' }: SummaryCardProps) {
  return (
    <div className={`summary-card summary-card--${variante}`}>
      <span className="summary-card__titulo">{titulo}</span>
      <strong className="summary-card__valor">{valor}</strong>
    </div>
  );
}
