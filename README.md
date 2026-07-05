# Sistema de Controle de Gastos Residenciais

Sistema para organizar as finanças de uma casa: cadastro dos moradores, registro de receitas e despesas e consulta dos totais de cada um.

## Funcionalidades

- Gerenciamento de moradores
- Cadastro de receitas e despesas
- Consulta de totais por pessoa
- Dashboard com resumo financeiro
- Excluir automaticamente as transações ao remover uma pessoa
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

- Backend organizado em camadas (Domain, Application, Infrastructure e Api), mantendo a regra de negócio concentrada no domínio, independente da interface que consumir a API.
- FluentValidation para retornar mensagens de erro mais claras pro frontend.
- SQLite pela simplicidade, sem exigir configuração extra pra rodar o projeto.
- Cascade delete entre pessoas e transações, evitando registros órfãos no banco.
- React Hook Form + Zod no frontend, pra lidar com formulários e validação sem complicação.
- CSS puro na interface, priorizando controle sobre o layout sem dependências extras.

## Autor

Adryano de Oliveira Cavalcanti Filho

GitHub:
https://github.com/AdryanoFilho
