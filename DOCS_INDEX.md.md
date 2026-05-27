## 📄 `DOCS_INDEX.md` – Índice Unificado da Documentação
# DOCS_INDEX.md

## Índice Unificado da Documentação  
**XQuads Squad Worldclass – Agência de IA 24/7**

Este documento é o **índice central** de toda a documentação do projeto, organizado por:

- Tipo de documento.  
- Objetivo.  
- Quando usar.

---

## 1. Visão geral da documentação

| Pasta / Arquivo | Tipo | Objetivo principal |
|-----------------|------|--------------------|
| `README.md` | Guia inicial | Introdução rápida ao projeto, estrutura e comandos básicos. |
| `ARCHITECTURE.md` | Arquitetura | Visão geral da arquitetura, diagramas Mermaid, fluxos de segredos e CI/CD. |
| `SUMMARY.md` | Resumo de arquivos | Lista unificada de todos os arquivos do projeto e suas funções. |
| `CHANGELOG.md` | Histórico | Histórico de versões e mudanças. |
| `DEPLOY_CHECKLIST.md` | Checklist de deploy | Guia passo a passo para deploy, segurança e verificação. |
| `RUNBOOK.md` | Operação diária | Guia de operação: iniciar, pausar, ajustar orçamento, logs, KPIs, troubleshooting. |
| `docs/` | Documentação oficial | Docs detalhados sobre agentes, fluxo, regras e segurança. |
| `prompts/` | System prompts | Prompts individuais de cada agente. |
| `.github/workflows/ci.yml` | CI/CD | Workflow de CI/CD do GitHub. |
| `Makefile` | Comandos práticos | Comandos curtos: `make setup`, `make test`, etc. |

---

## 2. Documentos na raiz

### 2.1. `README.md`

**Tipo:** Guia inicial.  
**Objetivo:**  
- Apresentar o projeto.  
- Explicar estrutura básica.  
- Dar comandos rápidos de uso.

**Quando usar:**

- Na primeira visita ao projeto.  
- Para lembrar como instalar e rodar.  
- Para ver estrutura de pastas.

**Conteúdo principal:**

- Visão geral.  
- Estrutura de pastas.  
- Como usar (`make setup`, `make test`, `python3 run_agent_squad.py`).  
- Segurança de segredos.  
- Links para docs.

---

### 2.2. `ARCHITECTURE.md`

**Tipo:** Arquitetura do sistema.  
**Objetivo:**  
- Explicar a arquitetura completa.  
- Mostrar diagramas de fluxo.  
- Descrever segredos, CI/CD e ciclo de agentes.

**Quando usar:**

- Para entender como o sistema funciona como um todo.  
- Para revisar fluxos de segredos e segurança.  
- Para visualizar o ciclo de operação dos agentes.

**Conteúdo principal:**

- Visão geral da arquitetura.  
- Diagrama de arquitetura (flowchart Mermaid).  
- Sequence diagram do ciclo de operação.  
- Fluxo de segredos.  
- Fluxo de CI/CD.  
- Componentes principais.

---

### 2.3. `SUMMARY.md`

**Tipo:** Resumo de arquivos.  
**Objetivo:**  
- Listar todos os arquivos do projeto.  
- Indicar caminho e função de cada um.

**Quando usar:**

- Para ter uma visão geral de todos os arquivos.  
- Para encontrar onde está cada coisa.  
- Como índice de arquivos.

**Conteúdo principal:**

- Lista de arquivos na raiz.  
- Lista de arquivos em `tests/`.  
- Lista de arquivos em `logs/`.  
- Lista de arquivos em `docs/`.  
- Lista de arquivos em `prompts/`.  
- Lista de arquivos em `.github/workflows/`.  
- Estrutura completa do projeto.  
- Comandos rápidos de uso.

---

### 2.4. `CHANGELOG.md`

**Tipo:** Histórico de versões.  
**Objetivo:**  
- Registrar mudanças por versão.  
- Manter histórico de evolução do projeto.

**Quando usar:**

- Para ver o que mudou entre versões.  
- Para registrar novas versões.  
- Para auditoria de mudanças.

**Conteúdo principal:**

- `v1.0.0` – lançamento inicial.  
- Descrição das mudanças.  
- Próximos passos planejados.

---

### 2.5. `DEPLOY_CHECKLIST.md`

**Tipo:** Checklist de deploy.  
**Objetivo:**  
- Garantir deploy seguro e validado.  
- Verificar segurança, testes, CI/CD.

**Quando usar:**

- Antes do primeiro deploy.  
- Antes de subir para produção.  
- Para auditoria de segurança.

**Conteúdo principal:**

- Pré-requisitos.  
- Segurança de segredos.  
- Validação de YAML e estrutura.  
- Testes locais.  
- CI/CD.  
- Deploy inicial.  
- Deploy em produção.  
- Pós-deploy.  
- Checklist sintetizado.

---

### 2.6. `RUNBOOK.md`

**Tipo:** Guia de operação diária.  
**Objetivo:**  
- Ensinar como operar o squad no dia a dia.  
- Como iniciar, pausar, ajustar orçamento.  
- Como ler logs e KPIs.  
- O que fazer em caso de erro.

**Quando usar:**

- No dia a dia da operação.  
- Para treinar novos operadores.  
- Em caso de erro ou problema.

**Conteúdo principal:**

- Visão geral do sistema.  
- Como iniciar o squad.  
- Monitoramento diário.  
- Como ajustar orçamento e metas.  
- Como pausar o squad.  
- Troubleshooting (erros comuns).  
- Rotinas diárias.  
- Lista de comandos rápidos.

---

## 3. Pasta `docs/` – Documentação Oficial

### 3.1. `docs/01-PAPEL-DO-AGENTE-COORDENADOR.md`

**Tipo:** Papel do agente.  
**Objetivo:**  
- Descrever função do Coordenador.  
- Limites, o que pode/não pode.  
- Como coordena os outros agentes.

**Quando usar:**

- Para entender o papel do Coordenador.  
- Para treinar o Coordenador.  
- Para revisar limites de ação.

---

### 3.2. `docs/02-AGENTES-EXECUTORES.md`

**Tipo:** Agentes executores.  
**Objetivo:**  
- Detalhar cada um dos 6 agentes.  
- Função, objetivo, regras, o que entregam.

**Quando usar:**

- Para entender cada agente.  
- Para treinar novos agentes.  
- Para revisar funções e regras.

---

### 3.3. `docs/03-FLUXO-DE-TRABALHO.md`

**Tipo:** Fluxo de trabalho.  
**Objetivo:**  
- Descrever o ciclo 1→2→3→4→5→6→7.  
- Ordem, paralelismo, aprovações.

**Quando usar:**

- Para entender o ciclo de operação.  
- Para revisar fluxo de trabalho.  
- Para treinar o sistema.

---

### 3.4. `docs/04-REGRAS-GERAIS.md`

**Tipo:** Regras de operação.  
**Objetivo:**  
- Listar regras de operação, automação, orçamento.  
- O que é proibido, o que é obrigatório.

**Quando usar:**

- Para revisar regras de operação.  
- Para definir limites de autonomia.  
- Para auditoria de regras.

---

### 3.5. `docs/05-SEGURANCA-E-CICD.md`

**Tipo:** Segurança e CI/CD.  
**Objetivo:**  
- Descrever segredos, injeção de variáveis, logs.  
- CI/CD, boas práticas, auditoria.

**Quando usar:**

- Para entender segurança do projeto.  
- Para configurar CI/CD.  
- Para auditoria de segurança.

---

## 4. Pasta `prompts/` – System Prompts

### 4.1. Prompts individuais

| Arquivo | Agente | Função |
|---------|--------|--------|
| `prompts/@xquads.c_level.coordinator.md` | Coordenador | System prompt do Diretor Geral / Estratégia. |
| `prompts/@xquads.advisory.research_analyst.md` | Pesquisa | System prompt do Research Analyst. |
| `prompts/@xquads.brand.video_engineer.md` | Vídeo | System prompt do Video Engineer. |
| `prompts/@xquads.brand.copywriter.md` | Copy | System prompt do Copywriter. |
| `prompts/@xquads.advertising.ads_manager.md` | Tráfego | System prompt do Ads Manager. |
| `prompts/@xquads.data.reporter.md` | Dados | System prompt do Data Reporter. |

**Quando usar:**

- Para treinar cada agente.  
- Para revisar função e regras de cada agente.  
- Para ajustar prompts se necessário.

---

## 5. Pasta `.github/workflows/` – CI/CD

### 5.1. `.github/workflows/ci.yml`

**Tipo:** Workflow de CI/CD.  
**Objetivo:**  
- Validar YAML.  
- Rodar testes com pytest + cobertura.  
- Verificar estrutura e lint.

**Quando usar:**

- Automaticamente em push/PR.  
- Para garantir qualidade antes de merge.  
- Para auditoria de CI/CD.

---

## 6. Arquivos de Configuração e Comandos

### 6.1. `Makefile`

**Tipo:** Comandos práticos.  
**Objetivo:**  
- Facilitar comandos diários.  
- `make setup`, `make test`, `make coverage`, `make lint`, `make format`.

**Quando usar:**

- Toda vez que for instalar, testar, formatar.  
- Para padronizar comandos.

---

### 6.2. `requirements.txt` e `pyproject.toml`

**Tipo:** Dependências e configuração.  
**Objetivo:**  
- Listar dependências.  
- Configurar pytest, coverage, black, flake8.

**Quando usar:**

- Ao instalar dependências.  
- Ao configurar ambiente de desenvolvimento.

---

## 7. Roteiro de Leitura Recomendado

### 7.1. Primeira vez no projeto

1. `README.md` – visão geral e primeiros passos.  
2. `SUMMARY.md` – perceber estrutura de arquivos.  
3. `ARCHITECTURE.md` – entender arquitetura e fluxos.  
4. `docs/01-PAPEL-DO-AGENTE-COORDENADOR.md` – papel do Coordenador.  
5. `docs/02-AGENTES-EXECUTORES.md` – papel dos outros agentes.

### 7.2. Antes do primeiro deploy

1. `DEPLOY_CHECKLIST.md` – seguir checklist completo.  
2. `docs/05-SEGURANCA-E-CICD.md` – revisar segurança.  
3. `.github/workflows/ci.yml` – entender CI/CD.

### 7.3. Operação diária

1. `RUNBOOK.md` – guia de operação diária.  
2. `logs/deploy.log` – monitorar logs.  
3. Dashboard de anúncios / KPIs – monitorar performance.

### 7.4. Troubleshooting

1. `RUNBOOK.md` – seção de troubleshooting.  
2. `logs/deploy.log` – investigar erros.  
3. `docs/04-REGRAS-GERAIS.md` – revisar regras.

---

## 8. Lista Final de Documentos

| Documento | Caminho | Função principal |
|-----------|---------|------------------|
| README.md | Raiz | Guia inicial e primeiros passos. |
| ARCHITECTURE.md | Raiz | Arquitetura e diagramas. |
| SUMMARY.md | Raiz | Resumo de todos os arquivos. |
| CHANGELOG.md | Raiz | Histórico de versões. |
| DEPLOY_CHECKLIST.md | Raiz | Checklist de deploy e segurança. |
| RUNBOOK.md | Raiz | Guia de operação diária. |
| DOCS_INDEX.md | Raiz | Índice unificado de toda documentação (este arquivo). |
| 01-PAPEL-DO-AGENTE-COORDENADOR.md | docs/ | Papel do Coordenador. |
| 02-AGENTES-EXECUTORES.md | docs/ | Papel dos agentes executores. |
| 03-FLUXO-DE-TRABALHO.md | docs/ | Fluxo de trabalho 1→7. |
| 04-REGRAS-GERAIS.md | docs/ | Regras de operação. |
| 05-SEGURANCA-E-CICD.md | docs/ | Segurança e CI/CD. |
| Todos os prompts | prompts/ | System prompts de cada agente. |
| ci.yml | .github/workflows/ | Workflow de CI/CD. |

---

Este `DOCS_INDEX.md` é o **índice central unificado** de toda a documentação do XQuads Squad Worldclass.
