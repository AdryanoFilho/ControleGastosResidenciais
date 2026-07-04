namespace ControleGastos.Application.Exceptions;

/// <summary>
/// Lançada quando um recurso solicitado não existe.
/// Convertida em resposta HTTP 404 pelo middleware de tratamento de erros.
/// </summary>
public sealed class NotFoundException(string message) : Exception(message);
