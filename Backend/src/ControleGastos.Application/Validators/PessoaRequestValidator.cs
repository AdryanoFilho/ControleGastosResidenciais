using ControleGastos.Application.DTOs.Pessoas;
using ControleGastos.Domain.Entities;
using FluentValidation;

namespace ControleGastos.Application.Validators;

public sealed class PessoaRequestValidator : AbstractValidator<PessoaRequest>
{
    public PessoaRequestValidator()
    {
        RuleFor(request => request.Nome)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(Pessoa.NomeTamanhoMaximo)
            .WithMessage($"O nome deve possuir no máximo {Pessoa.NomeTamanhoMaximo} caracteres.");

        RuleFor(request => request.Idade)
            .NotNull().WithMessage("A idade é obrigatória.")
            .GreaterThanOrEqualTo(0).WithMessage("A idade não pode ser negativa.");
    }
}
