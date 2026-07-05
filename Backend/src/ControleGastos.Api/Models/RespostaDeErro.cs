namespace ControleGastos.Api.Models;

// formato unico de erro da API
public sealed record RespostaDeErro(int Status, string Titulo, string? Detalhe, IDictionary<string, string[]>? Erros)
{
    public static RespostaDeErro Validacao(IDictionary<string, string[]> erros) =>
        new(StatusCodes.Status400BadRequest, "Erro de validação.", null, erros);

    public static RespostaDeErro RegraDeNegocio(string detalhe) =>
        new(StatusCodes.Status400BadRequest, "Regra de negócio violada.", detalhe, null);

    public static RespostaDeErro NaoEncontrado(string detalhe) =>
        new(StatusCodes.Status404NotFound, "Recurso não encontrado.", detalhe, null);

    public static RespostaDeErro Interno() =>
        new(StatusCodes.Status500InternalServerError, "Erro interno do servidor.",
            "Ocorreu um erro inesperado. Tente novamente mais tarde.", null);
}
