using ControleGastos.Api.Middleware;
using ControleGastos.Application.DTOs.Pessoas;
using ControleGastos.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/pessoas")]
[Produces("application/json")]
public sealed class PessoasController(IPessoaService pessoaService) : ControllerBase
{
    /// <summary>Cadastra uma nova pessoa.</summary>
    /// <response code="201">Pessoa cadastrada com sucesso.</response>
    /// <response code="400">Dados inválidos.</response>
    [HttpPost]
    [ProducesResponseType(typeof(PessoaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(RespostaDeErro), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PessoaResponse>> Criar(CriarPessoaRequest request, CancellationToken cancellationToken)
    {
        var pessoa = await pessoaService.CriarAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, pessoa);
    }

    /// <summary>Lista todas as pessoas cadastradas.</summary>
    /// <response code="200">Lista de pessoas.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PessoaResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PessoaResponse>>> Listar(CancellationToken cancellationToken) =>
        Ok(await pessoaService.ListarAsync(cancellationToken));

    /// <summary>Exclui uma pessoa e todas as suas transações.</summary>
    /// <param name="id">Identificador da pessoa.</param>
    /// <response code="204">Pessoa excluída com sucesso.</response>
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
