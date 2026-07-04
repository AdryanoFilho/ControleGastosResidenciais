using ControleGastos.Domain.Enums;
using ControleGastos.Domain.Exceptions;

namespace ControleGastos.Domain.Entities;

/// <summary>
/// Pessoa responsável por movimentações financeiras da residência.
/// </summary>
public class Pessoa
{
    public const int MaioridadeEmAnos = 18;
    public const int NomeTamanhoMaximo = 100;

    private readonly List<Transacao> _transacoes = [];

    public int Id { get; private set; }
    public string Nome { get; private set; }
    public int Idade { get; private set; }

    public IReadOnlyCollection<Transacao> Transacoes => _transacoes.AsReadOnly();

    public bool EhMenorDeIdade => Idade < MaioridadeEmAnos;

    public decimal TotalReceitas => SomarPorTipo(TipoTransacao.Receita);
    public decimal TotalDespesas => SomarPorTipo(TipoTransacao.Despesa);
    public decimal Saldo => TotalReceitas - TotalDespesas;

    public Pessoa(string nome, int idade)
    {
        DomainException.Garantir(!string.IsNullOrWhiteSpace(nome), "O nome da pessoa é obrigatório.");
        DomainException.Garantir(nome.Trim().Length <= NomeTamanhoMaximo,
            $"O nome deve possuir no máximo {NomeTamanhoMaximo} caracteres.");
        DomainException.Garantir(idade >= 0, "A idade não pode ser negativa.");

        Nome = nome.Trim();
        Idade = idade;
    }

    /// <summary>Construtor exigido pelo Entity Framework Core.</summary>
    private Pessoa()
    {
        Nome = string.Empty;
    }

    /// <summary>
    /// Indica se a pessoa pode registrar uma transação do tipo informado.
    /// Menores de idade podem registrar apenas despesas.
    /// </summary>
    public bool PodeRegistrar(TipoTransacao tipo) =>
        tipo == TipoTransacao.Despesa || !EhMenorDeIdade;

    private decimal SomarPorTipo(TipoTransacao tipo) =>
        _transacoes.Where(transacao => transacao.Tipo == tipo).Sum(transacao => transacao.Valor);
}
