## 📄 `PASSO_A_PASSO.md` – Guia Passo a Passo para Colocar Tudo no Ar
# PASSO_A_PASSO.md

## Resumo Final – O Que Fazer Agora para Colocar Tudo no Ar  
**XQuads Squad Worldclass – Agência de IA 24/7**

Este guia é um **passo a passo prático** do que você precisa fazer agora, do zero até produção.

---

## Etapa 1 – Preparar o ambiente local

### 1.1. Instalar ferramentas

- [ ] Instalar **Python 3.10+**.  
- [ ] Instalar **git**.  
- [ ] Instalar **Make** (para `make setup`, `make test`, etc.).

### 1.2. Criar pasta do projeto

```bash
mkdir xquads_squad_worldclass
cd xquads_squad_worldclass
```

### 1.3. Criar estrutura de pastas

```bash
mkdir tests docs prompts logs .github/workflows
touch tests/__init__.py logs/deploy.log
```

---

## Etapa 2 – Criar todos os arquivos

### 2.1. Arquivos na raiz

Criar na raiz do projeto:

- [ ] `xquads_squad_worldclass.yaml` – configuração oficial do squad.  
- [ ] `xquads_squad_worldclass.json` – versão JSON equivalente.  
- [ ] `run_agent_squad.py` – script principal.  
- [ ] `.env` – variáveis de ambiente (não versionado).  
- [ ] `.gitignore` – segurança.  
- [ ] `Makefile` – comandos práticos.  
- [ ] `requirements.txt` – dependências Python.  
- [ ] `pyproject.toml` – configuração do projeto.  
- [ ] `README.md` – guia inicial.  
- [ ] `CHANGELOG.md` – histórico de versões.  
- [ ] `ARCHITECTURE.md` – arquitetura e diagramas.  
- [ ] `SUMMARY.md` – resumo de todos os arquivos.  
- [ ] `DEPLOY_CHECKLIST.md` – checklist de deploy.  
- [ ] `RUNBOOK.md` – guia de operação diária.  
- [ ] `DOCS_INDEX.md` – índice unificado de documentação.  
- [ ] `QUICK_REFERENCE.md` – cartão de consulta rápida.  
- [ ] `CARTELA_BOLSO.md` – cartão de bolso (tabela única).  
- [ ] `PASSO_A_PASSO.md` – este arquivo.

### 2.2. Pasta `tests/`

- [ ] `tests/__init__.py` – vazio.  
- [ ] `tests/conftest.py` – central de fixtures.  
- [ ] `tests/test_run_agent_squad.py` – testes unitários.

### 2.3. Pasta `docs/`

- [ ] `docs/01-PAPEL-DO-AGENTE-COORDENADOR.md`.  
- [ ] `docs/02-AGENTES-EXECUTORES.md`.  
- [ ] `docs/03-FLUXO-DE-TRABALHO.md`.  
- [ ] `docs/04-REGRAS-GERAIS.md`.  
- [ ] `docs/05-SEGURANCA-E-CICD.md`.

### 2.4. Pasta `prompts/`

- [ ] `prompts/@xquads.c_level.coordinator.md`.  
- [ ] `prompts/@xquads.advisory.research_analyst.md`.  
- [ ] `prompts/@xquads.brand.video_engineer.md`.  
- [ ] `prompts/@xquads.brand.copywriter.md`.  
- [ ] `prompts/@xquads.advertising.ads_manager.md`.  
- [ ] `prompts/@xquads.data.reporter.md`.

### 2.5. Pasta `.github/workflows/`

- [ ] `.github/workflows/ci.yml` – workflow de CI/CD.

---

## Etapa 3 – Configurar segredos

### 3.1. Preencher `.env`

Preencher `.env` com:

```bash
META_ADS_ACCESS_TOKEN=...
META_ADS_APP_ID=...
META_ADS_AD_ACCOUNT_ID=...
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_LOGIN_CUSTOMER_ID=...
GOOGLE_ADS_CUSTOMER_ID=...
DATABASE_URL=...
DATABASE_USER=...
DATABASE_PASSWORD=...
DATABASE_HOST=...
DATABASE_PORT=...
NOTEBOOK_LM_API_KEY=...
OBSIDIAN_API_KEY=...
```

- [ ] `.env` preenchido com chaves reais.

### 3.2. Verificar `.gitignore`

- [ ] `.gitignore` contém `.env`, `.env.*`, `logs/`, caches Python, etc.  
- [ ] `git status` não mostra `.env` como novo/modificado.

---

## Etapa 4 – Local

### 4.1. Instalar dependências

```bash
make setup
```

- [ ] Dependências instaladas sem erro.

### 4.2. Rodar testes

```bash
make test
make coverage
```

- [ ] Todos os testes passam.  
- [ ] Cobertura ≥ 70%.

### 4.3. Lint e formato

```bash
make lint
make format
```

- [ ] `flake8` não tem erros críticos.  
- [ ] `black` não tem problemas de formatação.

### 4.4. Validar YAML

```bash
yamllint xquads_squad_worldclass.yaml
```

- [ ] YAML com sintaxe correta.

---

## Etapa 5 – Git e CI/CD

### 5.1. Inicializar commit

```bash
git init
git add .
git commit -m "Initial commit: XQuads Squad Worldclass"
```

- [ ] Primeiro commit feito.

### 5.2. Criar repositório no GitHub

- [ ] Criar repositório no GitHub.  
- [ ] Adicionar remote:
  ```bash
  git remote add origin https://github.com/SEU_USUARIO/XQuadsSquadWorldclass.git
  ```
- [ ] Push:
  ```bash
  git push -u origin main
  ```

### 5.3. Configurar CI/CD

- [ ] No GitHub: **Settings → Secrets and variables → Actions**.  
- [ ] Adicionar secrets (mesmos nomes do `.env`).  
- [ ] CI/CD começa a rodar em push/PR.

### 5.4. Verificar CI no GitHub

- [ ] CI passa no GitHub.  
- [ ] Logs não expõem segredos.

---

## Etapa 6 – Rodar o squad localmente

### 6.1. Iniciar squad

```bash
python3 run_agent_squad.py
```

- [ ] Squad iniciado com sucesso.  
- [ ] `logs/deploy.log` mostra:
  - YAML lido corretamente.  
  - Segredos carregados.  
  - Placeholders substituídos.  
  - Squad iniciado.

### 6.2. Monitorar logs

```bash
tail -f logs/deploy.log
```

- [ ] Logs não expõem segredos.  
- [ ] Funcionamento normal.

---

## Etapa 7 – Deploy em produção (opcional)

### 7.1. Preparar servidor

- [ ] Servidor / cloud configurado.  
- [ ] Python 3.10+ instalado.  
- [ ] Variáveis de ambiente injetadas (`.env`, secret manager, etc.).

### 7.2. Deploy

- [ ] Clonar repositório no servidor.  
- [ ] Instalar dependências:
  ```bash
  make setup
  ```
- [ ] Rodar squad:
  ```bash
  python3 run_agent_squad.py
  ```

### 7.3. Monitoramento

- [ ] Logs coletados e monitorados.  
- [ ] Alertas configurados para erros.  
- [ ] KPIs (CPA, ROAS, CTR, CPM) monitorados.

---

## Etapa 8 – Pós-deploy

### 8.1. Documentação

- [ ] `README.md`, `ARCHITECTURE.md`, `SUMMARY.md`, `DOCS_INDEX.md` atualizados.  
- [ ] `CHANGELOG.md` com `v1.0.0` – lançamento inicial.

### 8.2. Tag no git

```bash
git tag v1.0.0
git push origin v1.0.0
```

- [ ] Tag criada e enviada.

### 8.3. Rotina diária

- [ ] Manhã: logs, KPIs, squad ativo.  
- [ ] Tarde: campanhas, orçamento, criativos.  
- [ ] Noite: logs, observações.

---

## Checklist sintetizado final

- [ ] Ambiente local configurado.  
- [ ] Todos os arquivos criados.  
- [ ] `.env` preenchido e não versionado.  
- [ ] Dependências instaladas.  
- [ ] Testes passados, cobertura ≥ 70%.  
- [ ] Lint e formato OK.  
- [ ] YAML validado.  
- [ ] Git inicializado, commit feito, push para GitHub.  
- [ ] CI/CD configurado, secrets no GitHub.  
- [ ] CI no GitHub passa.  
- [ ] Squad rodando localmente.  
- [ ] Logs monitorados, sem segredos expostos.  
- [ ] (Opcional) Deploy em produção.  
- [ ] Documentação atualizada, tag v1.0.0 criada.

---

Seguindo este guia passo a passo, você coloca o **XQuads Squad Worldclass** no ar, de forma segura, validada e documentada.
