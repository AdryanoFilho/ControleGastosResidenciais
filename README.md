# Controle de Gastos Residenciais

Sistema para organizar as finanças de uma casa: cadastro dos moradores, registro de receitas e despesas e consulta dos totais de cada um.

## Funcionalidades

- Cadastro, edição e exclusão de pessoas
- Registro de receitas e despesas por pessoa, com edição e exclusão
- Consulta de totais por pessoa e o total geral da casa, com o detalhe das transações de cada um
- Dashboard com o resumo geral
- Menores de 18 anos só podem registrar despesas (a regra vale também na edição)
- Ao excluir uma pessoa, todas as transações dela são removidas juntas
- Confirmação antes de excluir, mensagens de sucesso/erro e atualização automática das telas
- Os dados ficam salvos em um banco SQLite local, então nada se perde ao fechar a aplicação

## Tecnologias

**Backend:** C#, .NET 8, ASP.NET Core Web API, Entity Framework Core, SQLite, FluentValidation e Swagger.

**Frontend:** React, TypeScript, Vite, Axios, React Hook Form, Zod e CSS puro.

## Como rodar o backend

Pré-requisito: [.NET SDK 8+](https://dotnet.microsoft.com/download)

```bash
cd Backend
dotnet run --project src/ControleGastos.Api
```

A API sobe em `http://localhost:5000` e o Swagger fica em `http://localhost:5000/swagger`. O banco é criado sozinho na primeira execução.

## Como rodar o frontend

Pré-requisito: [Node.js 20+](https://nodejs.org/)

```bash
cd Frontend
npm install
npm run dev
```

Abre em `http://localhost:5173` (precisa da API rodando).

## Decisões técnicas

Algumas escolhas que fiz durante o desenvolvimento:

- **Backend em camadas.** Dividi em Domain, Application, Infrastructure e Api. Pode parecer exagero para um CRUD, mas deixou cada coisa no seu lugar: regra de negócio não se mistura com banco nem com HTTP.
- **Regras dentro das entidades.** A regra do menor de idade, por exemplo, vive no construtor de `Transacao`. Não existe caminho no código que crie uma receita para um menor, nem se alguém esquecer de validar em outra tela.
- **Validação em duas camadas.** O FluentValidation devolve mensagens amigáveis por campo para o formulário, e a entidade garante que nada inválido chega ao banco. Parece repetido, mas cada uma protege uma coisa diferente.
- **SQLite** porque não precisa instalar nada: rodou o projeto, o banco aparece. As migrations são aplicadas automaticamente na inicialização.
- **Exclusão em cascata no próprio banco.** Apagar uma pessoa remove as transações via `ON DELETE CASCADE`, sem depender de ninguém lembrar disso no código.
- **Erros padronizados.** Um middleware converte qualquer exceção em um JSON com status 400, 404 ou 500 — o front só lê a mensagem e mostra o aviso.
- **CSS na mão.** Preferi não usar biblioteca de componentes; com CSS puro e variáveis o projeto ficou leve e com o visual do jeito que eu queria.
- **A regra do menor também aparece na interface** (a opção "Receita" fica desabilitada), mas quem garante mesmo é o backend.
