# 💰 Controle de Gastos Residenciais

Sistema completo para controle de gastos de uma residência: cadastro de pessoas, registro de receitas e despesas por pessoa e consulta de totais consolidados.

**Backend:** .NET 8 · ASP.NET Core Web API · Entity Framework Core · SQLite
**Frontend:** React 19 · TypeScript · Vite · Axios · React Hook Form · Zod

---

## 📋 Índice

- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Como executar o Backend](#-como-executar-o-backend)
- [Como executar o Frontend](#-como-executar-o-frontend)
- [Migrations](#-migrations)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Regras de negócio implementadas](#-regras-de-negócio-implementadas)
- [Endpoints da API](#-endpoints-da-api)
- [Decisões técnicas](#-decisões-técnicas)
- [Possíveis melhorias futuras](#-possíveis-melhorias-futuras)

---

## 🏛 Arquitetura

O backend segue **Clean Architecture simplificada**, com as dependências sempre apontando para o centro (Domain):

```
API  →  Application  →  Domain
 ↘  Infrastructure  ↗
```

| Camada | Responsabilidade |
|---|---|
| **Domain** | Entidades ricas (`Pessoa`, `Transacao`), enum `TipoTransacao` e regras de negócio como invariantes das entidades. Não depende de nada. |
| **Application** | Casos de uso (Services), DTOs de entrada/saída, validações (FluentValidation) e contratos de repositório (ports). |
| **Infrastructure** | Implementação da persistência: `DbContext`, mapeamentos, repositórios e migrations (EF Core + SQLite). |
| **API** | Controllers enxutos (sem regra de negócio), middleware global de erros, Swagger, CORS e composição da injeção de dependência. |

O frontend separa responsabilidades em `pages` (telas), `components` (UI reutilizável), `services` (comunicação HTTP), `hooks` (estado e ciclo de vida de dados), `schemas` (validação Zod), `types` (contratos) e `utils` (formatação).

## 🛠 Tecnologias

**Backend**

- .NET 8 / ASP.NET Core Web API
- Entity Framework Core 8 + SQLite (persistência em arquivo)
- FluentValidation (validação de entrada)
- Swashbuckle / Swagger (documentação dos endpoints)

**Frontend**

- React 19 + TypeScript + Vite
- Axios (HTTP), React Hook Form (formulários), Zod (validação)
- React Router (navegação)
- CSS puro com design tokens — sem bibliotecas pesadas de UI

## ▶ Como executar o Backend

Pré-requisito: [.NET SDK 8+](https://dotnet.microsoft.com/download)

```bash
cd Backend
dotnet run --project src/ControleGastos.Api
```

A API sobe em **http://localhost:5000** e o Swagger fica disponível em **http://localhost:5000/swagger**.

> O banco SQLite (`controle_gastos.db`) é criado automaticamente na primeira execução — as migrations pendentes são aplicadas na inicialização, então basta executar o projeto.

## ▶ Como executar o Frontend

Pré-requisito: [Node.js 20.19+](https://nodejs.org/)

```bash
cd Frontend
npm install
npm run dev
```

A aplicação abre em **http://localhost:5173** (a API precisa estar em execução).

Para apontar para outra URL de API, defina a variável `VITE_API_URL` (padrão: `http://localhost:5000/api`).

## 🗄 Migrations

As migrations já estão versionadas e são aplicadas automaticamente ao iniciar a API. Para executá-las manualmente:

```bash
cd Backend
dotnet ef database update --project src/ControleGastos.Infrastructure --startup-project src/ControleGastos.Api
```

Para criar uma nova migration:

```bash
dotnet ef migrations add NomeDaMigration --project src/ControleGastos.Infrastructure --startup-project src/ControleGastos.Api --output-dir Persistence/Migrations
```

> O repositório inclui um manifesto de ferramenta local (`dotnet-tools.json`). Se o `dotnet ef` não estiver disponível, execute `dotnet tool restore` dentro de `Backend/`.

## 📁 Estrutura do projeto

```
├── Backend/
│   ├── ControleGastos.sln
│   └── src/
│       ├── ControleGastos.Domain/          # Entidades ricas, enums e exceções de domínio
│       │   ├── Entities/                   # Pessoa, Transacao
│       │   ├── Enums/                      # TipoTransacao
│       │   └── Exceptions/                 # DomainException
│       ├── ControleGastos.Application/     # Casos de uso
│       │   ├── DTOs/                       # Requests e Responses (records imutáveis)
│       │   ├── Interfaces/                 # Contratos de services e repositórios
│       │   ├── Services/                   # PessoaService, TransacaoService, RelatorioService
│       │   ├── Validators/                 # FluentValidation
│       │   └── Exceptions/                 # NotFoundException
│       ├── ControleGastos.Infrastructure/  # Persistência
│       │   ├── Persistence/                # AppDbContext, Configurations, Migrations
│       │   └── Repositories/               # Implementações EF Core
│       └── ControleGastos.Api/             # Camada HTTP
│           ├── Controllers/                # Controllers enxutos
│           └── Middleware/                 # Tratamento global de erros
├── Frontend/
│   └── src/
│       ├── components/                     # layout/, ui/, feedback/
│       ├── pages/                          # Dashboard, Pessoas, Transações, Totais
│       ├── services/                       # Axios + serviços por recurso
│       ├── hooks/                          # useFetch, usePessoas, useTransacoes, useToast...
│       ├── schemas/                        # Validações Zod
│       ├── types/                          # Contratos TypeScript da API
│       ├── utils/                          # Formatação de moeda
│       └── styles/                         # CSS global com design tokens
└── README.md
```

## ✅ Regras de negócio implementadas

| Regra | Onde é garantida |
|---|---|
| Nome obrigatório (máx. 100) e idade ≥ 0 | Validator (mensagem amigável) + invariante da entidade `Pessoa` |
| Descrição obrigatória (máx. 200), valor > 0 e tipo obrigatório | Validator + invariante da entidade `Transacao` |
| Transação exige pessoa existente | `TransacaoService` (retorna **404** se a pessoa não existir) |
| **Menores de 18 anos só cadastram despesas** (vale também na edição) | Entidade `Transacao` (domínio) — a UI também desabilita a opção "Receita" preventivamente |
| Pessoa com receitas não pode ter a idade reduzida para menos de 18 anos | Entidade `Pessoa` (domínio), na atualização |
| Excluir pessoa remove todas as suas transações | `DELETE CASCADE` configurado no banco via EF Core |
| Persistência entre execuções | SQLite em arquivo |
| Totais por pessoa + total geral (receitas, despesas, saldo) | Propriedades calculadas da entidade `Pessoa` + `RelatorioService` |

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/pessoas` | Cadastra uma pessoa |
| `GET` | `/api/pessoas` | Lista as pessoas |
| `PUT` | `/api/pessoas/{id}` | Atualiza uma pessoa |
| `DELETE` | `/api/pessoas/{id}` | Exclui a pessoa e suas transações |
| `POST` | `/api/transacoes` | Cadastra uma transação |
| `GET` | `/api/transacoes` | Lista as transações |
| `PUT` | `/api/transacoes/{id}` | Atualiza uma transação |
| `DELETE` | `/api/transacoes/{id}` | Exclui uma transação |
| `GET` | `/api/relatorios/totais` | Totais por pessoa + total geral |

Erros seguem um formato JSON padronizado, produzido por um middleware global:

```json
{
  "status": 400,
  "titulo": "Erro de validação.",
  "detalhe": null,
  "erros": { "nome": ["O nome é obrigatório."] }
}
```

- **400** — erro de validação ou regra de negócio violada
- **404** — recurso não encontrado
- **500** — erro inesperado (logado no servidor, sem vazar detalhes internos)

## 🧠 Decisões técnicas

- **Entidades ricas:** as invariantes (valor > 0, menor de idade sem receita etc.) vivem no construtor das entidades. É impossível instanciar um objeto de domínio em estado inválido, independentemente de quem o chama.
- **Validação em duas camadas:** FluentValidation cuida da qualidade da *entrada* (mensagens claras por campo, agregadas em um único retorno 400); o domínio garante as *invariantes*. A duplicação aparente é intencional — cada camada protege um nível diferente.
- **Interfaces de repositório na Application:** a camada de aplicação define os contratos (ports) e a Infrastructure os implementa (adapters), mantendo a regra de dependência da Clean Architecture.
- **Repositórios persistem por operação:** como cada caso de uso executa uma única escrita, um Unit of Work separado adicionaria complexidade sem benefício (KISS).
- **Cascade delete no banco:** a remoção das transações da pessoa é garantida pelo próprio SQLite (`ON DELETE CASCADE`), tornando a regra atômica e imune a esquecimentos no código.
- **Totais calculados no domínio:** `TotalReceitas`, `TotalDespesas` e `Saldo` são comportamento da entidade `Pessoa`, não do serviço — a agregação em memória também evita limitações do provider SQLite com `SUM` de `decimal`. Para o volume de dados de uma residência, o custo é irrelevante (ver melhorias futuras).
- **Migrations aplicadas na inicialização:** atende ao requisito de "funcionar apenas executando o projeto", sem abrir mão do fluxo padrão de `dotnet ef database update`.
- **Enum serializado como texto:** `"Receita"`/`"Despesa"` no JSON e no banco, tornando API e dados autoexplicativos.
- **Frontend sem bibliotecas de UI:** CSS puro com design tokens mantém o bundle leve; `useFetch` centraliza loading/erro/refetch e descarta respostas de requisições obsoletas; a regra do menor de idade é espelhada na UI (opção Receita desabilitada) para feedback imediato, mas a garantia final é sempre do backend.

## 🚀 Possíveis melhorias futuras

- Testes unitários (domínio e services) e de integração (WebApplicationFactory)
- Paginação e filtros nas listagens
- Agregação dos totais via SQL (quando o volume de dados justificar)
- Data/hora na transação e relatórios por período
- Autenticação/autorização (ex.: perfis por morador)
- CI com build, lint e testes automatizados
- Containerização com Docker Compose

---

Desenvolvido como parte de uma avaliação técnica. 🎯
