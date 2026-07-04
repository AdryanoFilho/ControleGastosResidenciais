namespace ControleGastos.Application.Exceptions;

// Recurso não encontrado -> vira 404 no middleware de erros.
public sealed class NotFoundException(string message) : Exception(message);
