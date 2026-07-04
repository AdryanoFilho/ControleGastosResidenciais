const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatarMoeda = (valor: number): string => formatadorMoeda.format(valor);
