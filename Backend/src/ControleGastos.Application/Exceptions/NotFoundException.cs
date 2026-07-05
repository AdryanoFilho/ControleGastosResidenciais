namespace ControleGastos.Application.Exceptions;

// recurso nao encontrado > vira 404 no middleware de erros
public sealed class NotFoundException(string message) : Exception(message);
