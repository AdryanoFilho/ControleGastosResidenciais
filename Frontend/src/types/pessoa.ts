export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export interface CriarPessoaPayload {
  nome: string;
  idade: number;
}
