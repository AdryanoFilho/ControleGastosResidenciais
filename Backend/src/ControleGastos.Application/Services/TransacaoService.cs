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
    IValidator<TransacaoRequest> validator) : ITransacaoService
{
    public async Task<TransacaoResponse> CriarAsync(TransacaoRequest request, CancellationToken cancellationToken = default)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);
        var pessoa = await ObterPessoaAsync(request.PessoaId!.Value, cancellationToken);

        // a própria entidade barra receita de menor de idade
        var transacao = new Transacao(request.Descricao!, request.Valor!.Value, request.Tipo!.Value, pessoa);
        await transacaoRepository.AdicionarAsync(transacao, cancellationToken);

        return TransacaoResponse.FromEntity(transacao);
    }

    public async Task<TransacaoResponse> AtualizarAsync(int id, TransacaoRequest request, CancellationToken cancellationToken = default)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        var transacao = await ObterTransacaoAsync(id, cancellationToken);
        var pessoa = await ObterPessoaAsync(request.PessoaId!.Value, cancellationToken);

        transacao.Atualizar(request.Descricao!, request.Valor!.Value, request.Tipo!.Value, pessoa);
        await transacaoRepository.SalvarAlteracoesAsync(cancellationToken);

        return TransacaoResponse.FromEntity(transacao);
    }

    public async Task<IReadOnlyList<TransacaoResponse>> ListarAsync(CancellationToken cancellationToken = default)
    {
        var transacoes = await transacaoRepository.ObterTodasAsync(cancellationToken);
        return transacoes.Select(TransacaoResponse.FromEntity).ToList();
    }

    public async Task ExcluirAsync(int id, CancellationToken cancellationToken = default)
    {
        var transacao = await ObterTransacaoAsync(id, cancellationToken);
        await transacaoRepository.RemoverAsync(transacao, cancellationToken);
    }

    private async Task<Transacao> ObterTransacaoAsync(int id, CancellationToken cancellationToken) =>
        await transacaoRepository.ObterPorIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Transação não encontrada.");

    private async Task<Pessoa> ObterPessoaAsync(int pessoaId, CancellationToken cancellationToken) =>
        await pessoaRepository.ObterPorIdAsync(pessoaId, cancellationToken)
            ?? throw new NotFoundException("Pessoa não encontrada.");
}
