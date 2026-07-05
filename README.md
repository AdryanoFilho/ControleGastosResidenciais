# Sistema de Controle de Gastos Residenciais

Sistema para organizar as finanças de uma casa: cadastro dos moradores, registro de receitas e despesas e consulta dos totais de cada um.

## Funcionalidades

- Gerenciamento de moradores
- Cadastro de receitas e despesas
- Consulta de totais por pessoa
- Dashboard com resumo financeiro
- Exclusão automática das transações ao remover uma pessoa
- Regra que impede menores de idade de cadastrar receitas
- Persistência dos dados em SQLite

## Tecnologias

**Backend:** C#, .NET 8, ASP.NET Core Web API, Entity Framework Core, SQLite.

**Frontend:** React, TypeScript, Vite, React Hook Form, Zod, CSS.

## Screenshots

![Dashboard](screenshots/dashboard.png)

![Cadastro de Pessoas](screenshots/pessoas.png)

![Transações](screenshots/transacoes.png)

![Totais](screenshots/totais.png)

## Como rodar o backend

Pré-requisito: [.NET SDK 8+]

```bash
cd Backend
dotnet run --project src/ControleGastos.Api
```

## Como rodar o frontend

Pré-requisito: [Node.js 20+]

```bash
cd Frontend
npm install
npm run dev
```

## Decisões técnicas

Algumas escolhas que fiz durante o desenvolvimento:

- **Backend em camadas.** Dividi em Domain, Application, Infrastructure e Api. Pode parecer exagero para um CRUD, mas deixou cada coisa no seu lugar: regra de negócio não se mistura com banco nem com HTTP.
- **Regras dentro das entidades.** A regra do menor de idade, por exemplo, vive no construtor de `Transacao`. Não existe caminho no código que crie uma receita para um menor, nem se alguém esquecer de validar em outra tela.
- **Validação em duas camadas.** O FluentValidation devolve mensagens por campo para o formulário, e a entidade garante que nada inválido chega ao banco. Parece repetido, mas cada uma protege uma coisa diferente.
- **SQLite** porque não precisa instalar nada: rodou o projeto, o banco aparece. As migrations são aplicadas automaticamente na inicialização.
- **Exclusão em cascata no próprio banco.** Apagar uma pessoa remove as transações via `ON DELETE CASCADE`, sem depender de ninguém lembrar disso no código.
- **Erros padronizados.** Um middleware converte qualquer exceção em um JSON com status 400, 404 ou 500 — o front só lê a mensagem e mostra o aviso.
- **CSS na mão.** Preferi não usar biblioteca de componentes; com CSS puro e variáveis o projeto ficou leve e com o visual do jeito que eu queria.
- **A regra do menor também aparece na interface** (a opção "Receita" fica desabilitada), mas quem garante mesmo é o backend.

## Autor

Adryano de Oliveira Cavalcanti Filho

GitHub:
https://github.com/AdryanoFilho
