## 📄 `DEPLOY_CHECKLIST.md` – Checklist Completo de Deploy
# DEPLOY_CHECKLIST.md

## Checklist de Deploy – XQuads Squad Worldclass  
**Agência de IA 24/7 – Segurança, Validação e Verificação**

Este documento é um checklist passo a passo para garantir que o projeto está:

- ✅ Seguro (segredos protegidos).  
- ✅ Validado (YAML, testes, CI/CD).  
- ✅ Pronto para produção (24/7, estável e auditável).

---

## 1. Pré-requisitos

Antes de qualquer deploy, verifique:

- [ ] **Python 3.10+** instalado.  
- [ ] **git** instalado e configurado.  
- [ ] **Make** instalado (para `make setup`, `make test`, etc.).  
- [ ] Acesso ao **repositório GitHub/GitLab**.  
- [ ] Acesso às **APIs** necessárias:
  - Meta Ads (Access Token, App ID, Ad Account ID).  
  - Google Ads (Developer Token, Login Customer ID, Customer ID).  
  - Banco de dados (URL, usuário, senha, host, porta).  
  - Outros (Notebook LM, Obsidian, etc., se aplicável).

---

## 2. Segurança de Segredos

### 2.1. Arquivo `.env`

- [ ] `.env` existe na raiz do projeto.  
- [ ] `.env` contém todas as variáveis necessárias:
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
- [ ] `.env` **não está versionado**:
  - Verificar `.gitignore` contém `.env` e `.env.*`.  
  - Rodar `git status` e confirmar que `.env` não aparece como novo/modificado.

### 2.2. Secrets do CI/CD (GitHub Actions)

- [ ] No GitHub:  
  - Ir em **Settings → Secrets and variables → Actions**.  
  - Adicionar secrets com os mesmos nomes das variáveis do `.env`.  
- [ ] Secrets **não aparecem em logs** do CI.  
- [ ] Secrets **não estão em código** ou YAML.

### 2.3. YAML e JSON

- [ ] `xquads_squad_worldclass.yaml` contém **apenas placeholders**:
  - `%%META_ADS_ACCESS_TOKEN%%`  
  - `%%GOOGLE_ADS_DEVELOPER_TOKEN%%`  
  - `%%DATABASE_PASSWORD%%`  
  - etc.
- [ ] Nenhum valor real de API ou senha está no YAML.  
- [ ] `xquads_squad_worldclass.json` também contém apenas placeholders.

### 2.4. Logs

- [ ] `logs/deploy.log` **não contém** tokens, senhas ou chaves em texto claro.  
- [ ] Logs mostram apenas:
  - "Variável META_ADS_ACCESS_TOKEN carregada."  
  - "Substituindo placeholder de META_ADS_ACCESS_TOKEN no YAML."  
  - **Nunca**: "Token real: xxx..."

---

## 3. Validação de YAML e Estrutura

### 3.1. Sintaxe do YAML

- [ ] Rodar validação local:
  ```bash
  yamllint xquads_squad_worldclass.yaml
  ```
- [ ] Arquivo não tem erros de sintaxe.  
- [ ] CI/CD job `validate-config` passa (no GitHub Actions).

### 3.2. Estrutura do Projeto

- [ ] Pastas existem:
  - `tests/`  
  - `docs/`  
  - `prompts/`  
  - `logs/`  
  - `.github/workflows/`
- [ ] Arquivos principais existem na raiz:
  - `run_agent_squad.py`  
  - `xquads_squad_worldclass.yaml`  
  - `xquads_squad_worldclass.json`  
  - `requirements.txt`  
  - `pyproject.toml`  
  - `Makefile`  
  - `README.md`  
  - `CHANGELOG.md`  
  - `ARCHITECTURE.md`  
  - `SUMMARY.md`  
  - `DEPLOY_CHECKLIST.md`

---

## 4. Testes Locais

### 4.1. Instalação

- [ ] Rodar:
  ```bash
  make setup
  ```
- [ ] Dependências instaladas sem erro.

### 4.2. Testes Unitários

- [ ] Rodar testes:
  ```bash
  make test
  ```
- [ ] Todos os testes passam.

### 4.3. Cobertura de Código

- [ ] Rodar cobertura:
  ```bash
  make coverage
  ```
- [ ] Cobertura ≥ 70% (configurado no `pyproject.toml`).  
- [ ] Não há falhas críticas de cobertura.

### 4.4. Lint e Formato

- [ ] Rodar lint:
  ```bash
  make lint
  ```
- [ ] `flake8` não tem erros críticos.  
- [ ] `black` não tem problemas de formatação.  
- [ ] Se necessário, rodar:
  ```bash
  make format
  ```

---

## 5. CI/CD (GitHub Actions)

### 5.1. Workflow

- [ ] Arquivo `.github/workflows/ci.yml` existe.  
- [ ] Workflow tem jobs:
  - `validate-config`  
  - `test`  
  - `lint-and-check`

### 5.2. Gatilhos

- [ ] CI é acionado em:
  - `push` para `main` e `develop`.  
  - `pull_request` para `main` e `develop`.

### 5.3. Status do CI

- [ ] Push para `main` → CI passa.  
- [ ] Pull Request → CI passa antes de merge.  
- [ ] CI não exibe segredos em logs.

---

## 6. Deploy Inicial (Primeira Vez)

### 6.1. Commit e Push

- [ ] Commit com mensagem clara:
  ```bash
  git add .
  git commit -m "Initial commit: XQuads Squad Worldclass"
  git push origin main
  ```
- [ ] CI no GitHub passa após push.

### 6.2. Execução Local (Primeira Vez)

- [ ] Rodar:
  ```bash
  python3 run_agent_squad.py
  ```
- [ ] Verificar `logs/deploy.log`:
  - YAML lido corretamente.  
  - Segredos carregados.  
  - Placeholders substituídos.  
  - Squad iniciado com sucesso.

### 6.3. Monitoramento Inicial

- [ ] Observar logs em tempo real:
  ```bash
  tail -f logs/deploy.log
  ```
- [ ] Confirmar que:
  - Coordenador inicia o ciclo.  
  - Pesquisa, Vídeo, Copy, Ads, Data operam conforme esperado.  
  - Nenhum erro crítico aparece.

---

## 7. Deploy em Produção (Cloud / Servidor Remoto)

### 7.1. Ambiente de Produção

- [ ] Servidor / cloud configurado (VM, container, Kubernetes, etc.).  
- [ ] Python 3.10+ instalado no servidor.  
- [ ] Variáveis de ambiente injetadas via:
  - `.env` no servidor, **ou**  
  - Secret manager (AWS Secrets Manager, Azure Key Vault, etc.), **ou**  
  - Variáveis de ambiente do orquestrador (Docker, Kubernetes, etc.).

### 7.2. Segurança em Produção

- [ ] `.env` **não está no repositório** do servidor.  
- [ ] Segredos são rotacionados periodicamente.  
- [ ] Logs não expõem segredos.

### 7.3. Monitoramento Contínuo

- [ ] Logs são coletados e monitorados (ex.: cloud logging, ELK, etc.).  
- [ ] Alertas configurados para:
  - Erros no squad.  
  - Falhas de conexão com APIs.  
  - Queda de performance (CPA alto, ROAS baixo).

---

## 8. Pós-Deploy

### 8.1. Documentação

- [ ] Todos os docs atualizados:
  - `README.md`  
  - `ARCHITECTURE.md`  
  - `docs/*`  
  - `SUMMARY.md`  
  - `DEPLOY_CHECKLIST.md`

### 8.2. Versionamento

- [ ] Primeira versão marcou como `v1.0.0` no `CHANGELOG.md`.  
- [ ] Tag no git:
  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```

### 8.3. Manutenção

- [ ] Revisar segredos periodicamente (rotação de tokens).  
- [ ] Atualizar dependências (`requirements.txt`, `pyproject.toml`).  
- [ ] Revisar logs e KPIs semanalmente.  
- [ ] Ajustar orçamento, públicos e criativos conforme necessário.

---

## 9. Checklist Rápido (Versão Sintetizada)

- [ ] Python 3.10+ instalado.  
- [ ] `.env` preenchido e não versionado.  
- [ ] Secrets do CI/CD configurados.  
- [ ] YAML com placeholders (sem chaves reais).  
- [ ] `make setup`, `make test`, `make coverage` passam.  
- [ ] `make lint`, `make format` OK.  
- [ ] CI no GitHub passa.  
- [ ] `run_agent_squad.py` roda localmente sem erro.  
- [ ] Logs não expõem segredos.  
- [ ] Deploy em produção com segredos injetados corretamente.  
- [ ] Monitoramento e alertas configurados.  
- [ ] Documentação atualizada.

---

Este checklist é o **guia oficial de deploy, segurança e verificação** do XQuads Squad Worldclass.
