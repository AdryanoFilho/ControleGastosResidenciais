using ControleGastos.Domain.Enums;
using ControleGastos.Domain.Exceptions;

namespace ControleGastos.Domain.Entities;

/// <summary>
/// Movimentação financeira (receita ou despesa) pertencente a uma pessoa.
/// </summary>
public class Transacao
{
    public const int DescricaoTamanhoMaximo = 200;

    public int Id { get; private set; }
    public string Descricao { get; private set; }
    public decimal Valor { get; private set; }
    public TipoTransacao Tipo { get; private set; }
    public int PessoaId { get; private set; }
    public Pessoa? Pessoa { get; private set; }

    public Transacao(string descricao, decimal valor, TipoTransacao tipo, Pessoa pessoa)
    {
        ArgumentNullException.ThrowIfNull(pessoa);

        DomainException.Garantir(!string.IsNullOrWhiteSpace(descricao), "A descrição da transação é obrigatória.");
        DomainException.Garantir(descricao.Trim().Length <= DescricaoTamanhoMaximo,
            $"A descrição deve possuir no máximo {DescricaoTamanhoMaximo} caracteres.");
        DomainException.Garantir(valor > 0, "O valor da transação deve ser maior que zero.");
        DomainException.Garantir(Enum.IsDefined(tipo), "O tipo da transação é inválido.");
        DomainException.Garantir(pessoa.PodeRegistrar(tipo),
            "Pessoas menores de 18 anos podem cadastrar apenas despesas.");

        Descricao = descricao.Trim();
        Valor = valor;
        Tipo = tipo;
        Pessoa = pessoa;
        PessoaId = pessoa.Id;
    }

    /// <summary>Construtor exigido pelo Entity Framework Core.</summary>
    private Transacao()
    {
        Descricao = string.Empty;
    }
}
