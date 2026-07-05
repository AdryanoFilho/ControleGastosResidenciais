using System.Diagnostics.CodeAnalysis;
using ControleGastos.Domain.Enums;
using ControleGastos.Domain.Exceptions;

namespace ControleGastos.Domain.Entities;

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
        DefinirDados(nome, idade);
    }

    // EF Core
    private Pessoa()
    {
        Nome = string.Empty;
    }

    public void Atualizar(string nome, int idade)
    {
        DefinirDados(nome, idade);

        // nao deixa a pessoa virar menor de idade se ja tiver receitas cadastradas
        DomainException.Garantir(!EhMenorDeIdade || TotalReceitas == 0,
            "A pessoa possui receitas cadastradas e não pode ter a idade alterada para menos de 18 anos.");
    }

    // menor de idade so pode registrar despesa
    public bool PodeRegistrar(TipoTransacao tipo) =>
        tipo == TipoTransacao.Despesa || !EhMenorDeIdade;

    [MemberNotNull(nameof(Nome))]
    private void DefinirDados(string nome, int idade)
    {
        DomainException.Garantir(!string.IsNullOrWhiteSpace(nome), "O nome da pessoa é obrigatório.");
        DomainException.Garantir(nome.Trim().Length <= NomeTamanhoMaximo,
            $"O nome deve possuir no máximo {NomeTamanhoMaximo} caracteres.");
        DomainException.Garantir(idade >= 0, "A idade não pode ser negativa.");

        Nome = nome.Trim();
        Idade = idade;
    }

    private decimal SomarPorTipo(TipoTransacao tipo) =>
        _transacoes.Where(transacao => transacao.Tipo == tipo).Sum(transacao => transacao.Valor);
}
