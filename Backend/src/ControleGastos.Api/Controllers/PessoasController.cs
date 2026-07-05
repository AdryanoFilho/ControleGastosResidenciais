using ControleGastos.Api.Models;
using ControleGastos.Application.DTOs.Pessoas;
using ControleGastos.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/pessoas")]
[Produces("application/json")]
public sealed class PessoasController(IPessoaService pessoaService) : ControllerBase
{
    /// <summary>Cadastra uma pessoa.</summary>
    /// <response code="201">Pessoa criada.</response>
    /// <response code="400">Dados inválidos.</response>
    [HttpPost]
    [ProducesResponseType(typeof(PessoaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PessoaResponse>> Criar(PessoaRequest request, CancellationToken cancellationToken)
    {
        var pessoa = await pessoaService.CriarAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, pessoa);
    }

    /// <summary>Lista as pessoas cadastradas.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PessoaResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PessoaResponse>>> Listar(CancellationToken cancellationToken) =>
        Ok(await pessoaService.ListarAsync(cancellationToken));

    /// <summary>Atualiza uma pessoa existente.</summary>
    /// <remarks>A idade não pode ser reduzida para menos de 18 anos se a pessoa possuir receitas.</remarks>
    /// <response code="200">Pessoa atualizada.</response>
    /// <response code="400">Dados inválidos ou regra de negócio violada.</response>
    /// <response code="404">Pessoa não encontrada.</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(PessoaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PessoaResponse>> Atualizar(int id, PessoaRequest request, CancellationToken cancellationToken) =>
        Ok(await pessoaService.AtualizarAsync(id, request, cancellationToken));

    /// <summary>Exclui a pessoa e todas as transações dela.</summary>
    /// <response code="204">Pessoa excluída.</response>
    /// <response code="404">Pessoa não encontrada.</response>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Excluir(int id, CancellationToken cancellationToken)
    {
        await pessoaService.ExcluirAsync(id, cancellationToken);
        return NoContent();
    }
}
