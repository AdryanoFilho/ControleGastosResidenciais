using ControleGastos.Application.DTOs.Transacoes;
using ControleGastos.Application.Exceptions;
using ControleGastos.Application.Interfaces.Repositories;
using ControleGastos.Application.Interfaces.Services;
using ControleGastos.Domain.Entities;
using FluentValidation;

namespace ControleGastos.Application.Services;

public sealed class TransacaoService(
    ITransacaoRepository transacaoRepository,
    IPessoaRepository pessoaRepository,
    IValidator<CriarTransacaoRequest> validator) : ITransacaoService
{
    public async Task<TransacaoResponse> CriarAsync(CriarTransacaoRequest request, CancellationToken cancellationToken = default)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        var pessoa = await pessoaRepository.ObterPorIdAsync(request.PessoaId!.Value, cancellationToken)
            ?? throw new NotFoundException("Pessoa não encontrada.");

        // a própria entidade barra receita de menor de idade
        var transacao = new Transacao(request.Descricao!, request.Valor!.Value, request.Tipo!.Value, pessoa);
        await transacaoRepository.AdicionarAsync(transacao, cancellationToken);

        return TransacaoResponse.FromEntity(transacao);
    }

    public async Task<IReadOnlyList<TransacaoResponse>> ListarAsync(CancellationToken cancellationToken = default)
    {
        var transacoes = await transacaoRepository.ObterTodasAsync(cancellationToken);
        return transacoes.Select(TransacaoResponse.FromEntity).ToList();
    }
}
