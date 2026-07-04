using ControleGastos.Application.DTOs.Pessoas;
using ControleGastos.Application.Exceptions;
using ControleGastos.Application.Interfaces.Repositories;
using ControleGastos.Application.Interfaces.Services;
using ControleGastos.Domain.Entities;
using FluentValidation;

namespace ControleGastos.Application.Services;

public sealed class PessoaService(
    IPessoaRepository pessoaRepository,
    IValidator<CriarPessoaRequest> validator) : IPessoaService
{
    public async Task<PessoaResponse> CriarAsync(CriarPessoaRequest request, CancellationToken cancellationToken = default)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        var pessoa = new Pessoa(request.Nome!, request.Idade!.Value);
        await pessoaRepository.AdicionarAsync(pessoa, cancellationToken);

        return PessoaResponse.FromEntity(pessoa);
    }

    public async Task<IReadOnlyList<PessoaResponse>> ListarAsync(CancellationToken cancellationToken = default)
    {
        var pessoas = await pessoaRepository.ObterTodasAsync(cancellationToken);
        return pessoas.Select(PessoaResponse.FromEntity).ToList();
    }

    // as transações da pessoa saem junto (cascade configurado no banco)
    public async Task ExcluirAsync(int id, CancellationToken cancellationToken = default)
    {
        var pessoa = await pessoaRepository.ObterPorIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Pessoa não encontrada.");

        await pessoaRepository.RemoverAsync(pessoa, cancellationToken);
    }
}
