# YAAR — Yet Another Agents Repository

Coleção de agentes especializados para Claude Code, portáteis entre projetos via script de instalação.

## Conceito

Claude Code (o orquestrador) lê as instruções do **Mestre** via `CLAUDE.md` e delega tarefas para agentes especializados usando a ferramenta nativa `Agent`. Cada agente roda em seu próprio contexto isolado com um system prompt focado no seu domínio.

```
Dev faz pergunta
  → Claude Code (Mestre) identifica o domínio
    → Delega para o agente correto (Backend / Frontend / CDK)
      → Agente lê suas regras sob demanda
        → Retorna resultado para o Mestre
          → Mestre consolida e responde
```

## Estrutura do repositório

```
yaar/
  agents/
    mestre.md        ← orquestrador: identifica domínio e delega
    backend.md       ← especialista: APIs, banco, lógica de negócio
    frontend.md      ← especialista: React, UI, componentes
    cdk.md           ← especialista: AWS CDK, infra, recursos cloud
  rules/
    backend.md       ← convenções do agente backend (lidas sob demanda)
    frontend.md      ← convenções do agente frontend (lidas sob demanda)
    cdk.md           ← convenções do agente CDK (lidas sob demanda)
  install.sh         ← instala/atualiza os agentes em um projeto alvo
```

## Como funciona em um projeto alvo

Após rodar `install.sh`, o projeto alvo fica com:

```
projeto/
  CLAUDE.md                    ← @.claude/agents/mestre.md
  .claude/
    agents/
      mestre.md                ← baixado de yaar/agents/
      backend.md               ← baixado de yaar/agents/
      frontend.md              ← baixado de yaar/agents/
      cdk.md                   ← baixado de yaar/agents/
  .rules/
    backend.md                 ← baixado de yaar/rules/
    frontend.md                ← baixado de yaar/rules/
    cdk.md                     ← baixado de yaar/rules/
  knowledge/                   ← criado pelo dev, específico do projeto
    backend/
      stack.md                 ← ex: "Node 20, Fastify, PostgreSQL"
    frontend/
      stack.md                 ← ex: "React 18, TypeScript, Tailwind"
    cdk/
      stack.md                 ← ex: "AWS CDK v2, Lambda, RDS"
```

## Três camadas de conhecimento

| Camada | O quê | Onde | Atualiza como |
|---|---|---|---|
| **Persona** | System prompt do agente | `yaar/agents/*.md` → `.claude/agents/` | `install.sh` |
| **Regras** | Convenções universais do agente | `yaar/rules/*.md` → `.rules/` | `install.sh` |
| **Conhecimento** | Contexto específico do projeto | `knowledge/` | Dev, manualmente |

**Regras** são lidas pelo agente sob demanda (Read tool) — não são carregadas em toda interação.  
**Conhecimento** nunca é tocado pelo `install.sh`.

## Instalação e atualização

```bash
# Primeira instalação
curl -fsSL https://raw.githubusercontent.com/PauloFerreira25/yet-another-agents-repository/main/install.sh | bash

# Atualização
./install.sh
```

O script baixa os arquivos de `yaar` via raw GitHub e sobrescreve apenas `.claude/agents/` e `.rules/`. O diretório `knowledge/` nunca é tocado.
