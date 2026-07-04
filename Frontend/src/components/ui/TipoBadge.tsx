import type { TipoTransacao } from '../../types/transacao';

export function TipoBadge({ tipo }: { tipo: TipoTransacao }) {
  return (
    <span className={`badge ${tipo === 'Receita' ? 'badge--receita' : 'badge--despesa'}`}>
      {tipo}
    </span>
  );
}
