using ControleGastos.Application.DTOs.Transacoes;
using ControleGastos.Domain.Entities;
using FluentValidation;

namespace ControleGastos.Application.Validators;

public sealed class TransacaoRequestValidator : AbstractValidator<TransacaoRequest>
{
    public TransacaoRequestValidator()
    {
        RuleFor(request => request.Descricao)
            .NotEmpty().WithMessage("A descrição é obrigatória.")
            .MaximumLength(Transacao.DescricaoTamanhoMaximo)
            .WithMessage($"A descrição deve possuir no máximo {Transacao.DescricaoTamanhoMaximo} caracteres.");

        RuleFor(request => request.Valor)
            .NotNull().WithMessage("O valor é obrigatório.")
            .GreaterThan(0).WithMessage("O valor deve ser maior que zero.");

        RuleFor(request => request.Tipo)
            .NotNull().WithMessage("O tipo é obrigatório.")
            .IsInEnum().WithMessage("O tipo deve ser Despesa ou Receita.");

        RuleFor(request => request.PessoaId)
            .NotNull().WithMessage("A pessoa é obrigatória.")
            .GreaterThan(0).WithMessage("O identificador da pessoa é inválido.");
    }
}
