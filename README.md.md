# XQuads Squad Worldclass

Sistema de agência autônoma de performance digital baseado no projeto **Xquads Squads** e integrado ao Claude.  
Organiza **6 agentes de IA** em um squad 24/7 focado em **pesquisa, criação, tráfego e dados**.

---

## 📦 Estrutura geral

xquads_squad_worldclass/  
├── .env  
├── .gitignore  
├── run_agent_squad.py  
├── xquads_squad_worldclass.yaml  
├── xquads_squad_worldclass.json # versão JSON compatível  
├── README.md  
├── CHANGELOG.md  
├── docs/ # documentação oficial  
├── prompts/ # system prompts individuais  
└── logs/ # logs de execução
## 3. Como rodar os testes com conftest.py

## 3.1) Instalar dependências

bash

`pip install -r requirements.txt`

## 3.2) Rodar testes

bash

`python -m pytest tests/ -v`

- Fixtures de `tests/conftest.py` são carregadas automaticamente.
    
- Você não precisa importar `conftest.py` manualmente.
    

## 3.3) Rodar com cobertura

bash

`python -m pytest tests/ --cov=run_agent_squad --cov-report=term-missing -v
xquads_squad_worldclass/
├── .env
├── .gitignore
├── run_agent_squad.py
├── xquads_squad_worldclass.yaml
├── xquads_squad_worldclass.json
├── requirements.txt
├── README.md
├── CHANGELOG.md
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # central de fixtures (novo)
│   └── test_run_agent_squad.py    # testes que usam fixtures
├── logs/
├── docs/
├── prompts/
└── .github/
    └── workflows/
        └── ci.yml
        Para testes e dev, você pode confiar no `pyproject.toml`:

bash

`pip install -e ".[dev]"`

Ou manter `requirements.txt` como está antes, e usar:

bash

`pip install -r requirements.txt pip install pytest pytest-cov coverage black flake8`

Se quiser, posso manter o `requirements.txt` atual com tudo.

---

## 3. Como usar os comandos com `pyproject.toml`

## 3.1) Instalar dependências

bash

`# Instalar tudo (core + dev) pip install -e ".[dev]"`

Ou, se preferir usar `requirements.txt` também:

bash

`pip install -r requirements.txt pip install -e ".[dev]"`

## 3.2) Rodar testes com pytest (já com cobertura)

bash

`python -m pytest`
    Com `pyproject.toml`, os opts já estão configurados:

- Cobertura ativa.
    
- Relatórios em texto, HTML e XML.
    
- `--cov-fail-under=70` (se a cobertura for < 70%, o teste falha).
    

## 3.3) Rodar testes com cobertura específica

bash

`python -m pytest tests/ --cov=run_agent_squad --cov-report=term-missing -v`

## 3.4) Ver cobertura no HTML

bash

`python -m pytest python -m coverage html open htmlcov/index.html   # abrindo no navegador`

## 3.5) Rodar linter/formatter

bash

`# Formatar código com black black . # Verificar estilo com flake8 flake8 .`

---

## 4. Estrutura final do projeto (com pyproject.toml)

bash

`xquads_squad_worldclass/ ├── .env ├── .gitignore ├── run_agent_squad.py ├── xquads_squad_worldclass.yaml ├── xquads_squad_worldclass.json ├── requirements.txt ├── pyproject.toml              # novo (configuração central) ├── README.md ├── CHANGELOG.md ├── tests/ │   ├── __init__.py │   ├── conftest.py │   └── test_run_agent_squad.py ├── logs/ ├── docs/ ├── prompts/ └── .github/     └── workflows/        └── ci.yml`   

    ## 2. Como usar os comandos `make`

Em qualquer terminal, na raiz do projeto:

## 2.1) Instalação

bash

`make setup`

Isso roda:

bash

`python3 -m pip install --upgrade pip python3 -m pip install -r requirements.txt python3 -m pip install -e ".[dev]"`

## 2.2) Rodar testes

bash

`make test`

Isso executa:

bash

`python3 -m pytest`

## 2.3) Rodar testes com cobertura

bash

`make coverage`

Gera:

- Relatório no terminal.
    
- HTML em `htmlcov/`.
    
- XML em `coverage.xml`.
    

## 2.4) Linter e style

bash

`# Verificar estilo (flake8) make lint-check # Verificar formatação (black check) make format-check # Rodar ambos (lint) make lint`

## 2.5) Formatar código

bash

`make format`

Isso roda:

bash

`python3 -m black .`

## 2.6) Limpeza

bash

`make clean`

## 2.7) Ajuda

bash

`make help`
## 3. Estrutura final do projeto (com Makefile)

bash

`xquads_squad_worldclass/ ├── .env ├── .gitignore ├── Makefile                      # novo (comandos práticos) ├── run_agent_squad.py ├── xquads_squad_worldclass.yaml ├── xquads_squad_worldclass.json ├── requirements.txt ├── pyproject.toml ├── README.md ├── CHANGELOG.md ├── tests/ │   ├── __init__.py │   ├── conftest.py │   └── test_run_agent_squad.py ├── logs/ ├── docs/ ├── prompts/ └── .github/     └── workflows/        └── ci.yml
xquads_squad_worldclass/
├── .env
├── .gitignore
├── Makefile
├── run_agent_squad.py
├── xquads_squad_worldclass.yaml
├── xquads_squad_worldclass.json
├── requirements.txt
├── pyproject.toml
├── README.md
├── CHANGELOG.md
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_run_agent_squad.py
├── logs/
├── docs/
│   ├── 01-PAPEL-DO-AGENTE-COORDENADOR.md
│   ├── 02-AGENTES-EXECUTORES.md
│   ├── 03-FLUXO-DE-TRABALHO.md
│   ├── 04-REGRAS-GERAIS.md
│   └── 05-SEGURANCA-E-CICD.md
├── prompts/
│   ├── @xquads.c_level.coordinator.md
│   ├── @xquads.advisory.research_analyst.md
│   ├── @xquads.brand.video_engineer.md
│   ├── @xquads.brand.copywriter.md
│   ├── @xquads.advertising.ads_manager.md
│   └── @xquads.data.reporter.md
└── .github/
    └── workflows/
        └── ci.yml
        ## 📂 1. Raiz do projeto

## Arquivos principais

|Arquivo|Função|Descrição|
|---|---|---|
|`.env`|Variáveis de ambiente|Armazena chaves de API reais (Meta Ads, Google Ads, banco, etc.). **Nunca versionado**.|
|`.gitignore`|Segurança|Ignora `.env`, `logs/`, caches Python, builds, etc. Garante que nada sensível vá para o git.|
|`Makefile`|Comandos práticos|Comandos curtos: `make setup`, `make test`, `make coverage`, `make lint`, `make format`, `make clean`.|
|`run_agent_squad.py`|Script principal|Lê YAML, carrega `.env`, substitui placeholders de segredos em memória e inicia o orquestrador de agentes.|
|`xquads_squad_worldclass.yaml`|Configuração oficial|**Núcleo do squad**: 6 agentes, prompts, fluxos, regras, placeholders de segredos. **Nunca tem chaves reais**.|
|`xquads_squad_worldclass.json`|Versão JSON|Versão equivalente em JSON para sistemas que preferem JSON.|
|`requirements.txt`|Dependências|Lista de dependências Python essenciais (`pyyaml`, `python-dotenv`, etc.).|
|`pyproject.toml`|Configuração do projeto|Configura **pytest**, **pytest-cov**, **coverage**, **black**, **flake8**, build system, dependências de dev.|
|`README.md`|Guia inicial|Guia completo: como usar, estrutura, segurança, comandos, links para docs.|
|`CHANGELOG.md`|Histórico|Histórico de versões e mudanças (ex.: `v1.0.0` – lançamento inicial).|

---

## 📂 2. Pasta `tests/`

bash

`tests/ ├── __init__.py ├── conftest.py └── test_run_agent_squad.py`

|Arquivo|Função|Descrição|
|---|---|---|
|`__init__.py`|Identificação|Marca a pasta como módulo Python.|
|`conftest.py`|Central de fixtures|Fixtures reutilizáveis (`test_env_path`, `test_yaml_path`, `mock_run_agent_squad_paths`) para todos os testes.|
|`test_run_agent_squad.py`|Testes unitários|Testes com **pytest** para leitura do YAML, carregamento do `.env` e substituição de placeholders.|

**Comandos principais:**

bash

`make test make coverage python -m pytest tests/ -v`

---

## 📂 3. Pasta `logs/`

bash

`logs/ └── deploy.log`

|Arquivo|Função|Descrição|
|---|---|---|
|`deploy.log`|Logs de execução|Registro de tudo que o `run_agent_squad.py` faz: leitura de YAML, carregamento de `.env`, substituição, início do squad. **Nunca expõe segredos**.|

---

## 📂 4. Pasta `docs/`

bash

`docs/ ├── 01-PAPEL-DO-AGENTE-COORDENADOR.md ├── 02-AGENTES-EXECUTORES.md ├── 03-FLUXO-DE-TRABALHO.md ├── 04-REGRAS-GERAIS.md └── 05-SEGURANCA-E-CICD.md`

|Arquivo|Função|Descrição|
|---|---|---|
|`01-PAPEL-DO-AGENTE-COORDENADOR.md`|Papel do coordenador|Função, limites, o que pode/não pode, como coordena os outros 5 agentes.|
|`02-AGENTES-EXECUTORES.md`|Agentes executores|Detalhe de cada um dos 6 agentes: pesquisa, vídeo, copy, ads, dados.|
|`03-FLUXO-DE-TRABALHO.md`|Ciclo de operação|Passo a passo 1→2→3→4→5→6→7 (início, pesquisa, criação, tráfego, análise, decisão, repetição).|
|`04-REGRAS-GERAIS.md`|Regras de operação|Regras de operação, automação, orçamento, o que é proibido/obrigatório.|
|`05-SEGURANCA-E-CICD.md`|Segurança e CI/CD|Segredos, injeção de variáveis, logs, CI/CD, boas práticas e auditoria.|

Esses docs são sua **documentação oficial do projeto**, pronta para consulta no seu 2º cérebro.

---

## 📂 5. Pasta `prompts/`

bash

`prompts/ ├── @xquads.c_level.coordinator.md ├── @xquads.advisory.research_analyst.md ├── @xquads.brand.video_engineer.md ├── @xquads.brand.copywriter.md ├── @xquads.advertising.ads_manager.md └── @xquads.data.reporter.md`

|Arquivo|Função|Descrição|
|---|---|---|
|`@xquads.c_level.coordinator.md`|Prompt do coordenador|System prompt completo do Diretor Geral / Estratégia.|
|`@xquads.advisory.research_analyst.md`|Prompt de pesquisa|System prompt do Research Analyst.|
|`@xquads.brand.video_engineer.md`|Prompt de vídeo|System prompt do Video Engineer.|
|`@xquads.brand.copywriter.md`|Prompt de copy|System prompt do Copywriter.|
|`@xquads.advertising.ads_manager.md`|Prompt de tráfego|System prompt do Ads Manager.|
|`@xquads.data.reporter.md`|Prompt de dados|System prompt do Data Reporter.|

Cada prompt é um arquivo Markdown com:

- Role
    
- Função
    
- Regras
    
- O que entrega
    

---

## 📂 6. Pasta `.github/workflows/`

bash

`.github/ └── workflows/     └── ci.yml`

|Arquivo|Função|Descrição|
|---|---|---|
|`ci.yml`|CI/CD do GitHub|Workflow de CI: valida YAML, roda testes, verifica estrutura. Job de testes usa pytest + cobertura.|

**Comandos automáticos:**

- Ao fazer push para `main` ou `develop`.
    
- Ao abrir PR (pull request).
    

---

## 📌 Resumo rápido do fluxo de uso

1. **Instalar:**
    
    bash
    
    `make setup`
    
2. **Configurar segredos:**
    
    - Preencher `.env` com chaves reais.
        
3. **Testar localmente:**
    
    bash
    
    `make test make coverage`
    
4. **Rodar o squad:**
    
    bash
    
    `python3 run_agent_squad.py`
    
5. **Ver logs:**
    
    bash
    
    `tail -f logs/deploy.log`
    
6. **Subir para o repo:**
    
    bash
    
    `git add . git commit -m "Initial commit: XQuads Squad Worldclass" git push origin main`
    
        

