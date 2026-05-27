## 📄 `GITHUB_UPLOAD_GUIDE.md` – Guia Oficial de Upload para GitHub
# GITHUB_UPLOAD_GUIDE.md

## Guia Passo a Passo Seguro para Upload do Projeto para o GitHub  
**XQuads Squad Worldclass – Agência de IA 24/7**

Este guia garante que:

- ✅ Nenhuma chave de API, token, senha ou dado sensível seja enviado.  
- ✅ Apenas arquitetura, estrutura e documentação sejam compartilhadas.  
- ✅ O repositório seja primeiro PÚBLICO (para análise), depois PRIVADO.

---

## 1. Preparação – Segurança antes de tudo

### 1.1. Verificar `.gitignore`

Antes de qualquer coisa, confirme que seu `.gitignore` contém:

```bash
# .gitignore

# Segredos e variáveis de ambiente
.env
.env.*
!.env.example
.env.local
.env.*.local

# Credenciais e pastas de acesso
credentials/
keys/
secrets/
certs/

# Logs sensíveis
logs/*.log
!logs/.gitkeep

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtualenv
venv/
ENV/
env/

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# Sistemas operacionais
.DS_Store
Thumbs.db

# Testes e cobertura
.pytest_cache/
.coverage
htmlcov/
coverage.xml
```

- [ ] `.gitignore` atualizado com todas as regras acima.

---

### 1.2. Criar arquivo de exemplo para `.env`

Crie um **exemplo seguro** do `.env` (sem chaves reais) para documentar quais variáveis são necessárias:

```bash
# .env.example

# Meta Ads
META_ADS_ACCESS_TOKEN=SEU_TOKEN_AQUI
META_ADS_APP_ID=SEU_APP_ID_AQUI
META_ADS_AD_ACCOUNT_ID=SEU_AD_ACCOUNT_ID_AQUI

# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN=SEU_TOKEN_AQUI
GOOGLE_ADS_LOGIN_CUSTOMER_ID=SEU_LOGIN_CUSTOMER_ID_AQUI
GOOGLE_ADS_CUSTOMER_ID=SEU_CUSTOMER_ID_AQUI

# Banco de Dados
DATABASE_URL=postgresql://user:password@host:port/dbname
DATABASE_USER=SEU_USUARIO_AQUI
DATABASE_PASSWORD=SEU_PASSWORD_AQUI
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Outros
NOTEBOOK_LM_API_KEY=SEU_KEY_AQUI
OBSIDIAN_API_KEY=SEU_KEY_AQUI
```

- [ ] `.env.example` criado com apenas valores de exemplo.  
- [ ] `.gitignore` contém `!.env.example` (para permitir envio do exemplo).

---

### 1.3. Verificar arquivos sensíveis

**NUNCA envie:**

- `.env` (com chaves reais).  
- Arquivos com `credentials/`, `keys/`, `secrets/`.  
- Logs com dados sensíveis.  
- Arquivos pessoais ou de configuração local.

**Evite:**

```bash
# Verificar se há .env com dados reais
cat .env

# Verificar se há arquivos sensíveis no git
git status
```

- [ ] `.env` com chaves reais **não** aparece em `git status`.  
- [ ] Nenhum arquivo sensível aparece em `git status`.

---

## 2. Inicialização do Repositório Git (Local)

### 2.1. Inicializar Git

Na raiz do projeto:

```bash
cd xquads_squad_worldclass
git init
```

- [ ] Repositório local inicializado.

---

### 2.2. Adicionar todos os arquivos

```bash
git add .
```

- [ ] Todos os arquivos adicionados ao staging.

---

### 2.3. Verificar o que será enviado

**Importante:** Confira se nada sensível está sendo enviado.

```bash
git status
```

**Verifique:**

- [ ] `.env` **não** aparece.  
- [ ] `logs/*.log` **não** aparecem.  
- [ ] Nenhum arquivo sensível aparece.  
- [ ] Apenas código, documentação e arquivos de exemplo aparecem.

Se algum arquivo sensível aparecer:

```bash
# Remover arquivo sensível do staging
git rm --cached nome_do_arquivo_sensivel

# Adicionar ao .gitignore (se ainda não estiver)
echo "nome_do_arquivo_sensivel" >> .gitignore

# Re-adicionar arquivos seguros
git add .
```

---

### 2.4. Primeiro commit

```bash
git commit -m "Initial commit: XQuads Squad Worldclass – Arquitetura completa, documentação e segurança"
```

- [ ] Primeiro commit feito.

---

## 3. Criar Repositório no GitHub

### 3.1. Criar repositório PÚBLICO

1. Acesse: https://github.com/new  
2. Preencha:
   - **Repository name**: `XQuadsSquadWorldclass` (ou nome desejado).  
   - **Visibility**: **Public**.  
   - **Add README**: **NÃO** (já temos README local).  
   - **Add .gitignore**: **NÃO** (já temos .gitignore local).  
   - **Add license**: **NÃO** (opcional, se quiser).  
3. Clicar em **Create repository**.

- [ ] Repositório PÚBLICO criado no GitHub.

---

### 3.2. Anotar URL do repositório

Após criar, o GitHub mostrará algo como:

```bash
https://github.com/SEU_USUARIO/XQuadsSquadWorldclass.git
```

Copie essa URL.

---

## 4. Conectar Repositório Local ao Remoto

### 4.1. Adicionar remote

Na raiz do projeto local:

```bash
git remote add origin https://github.com/SEU_USUARIO/XQuadsSquadWorldclass.git
```

Substitua `SEU_USUARIO` pelo seu usuário do GitHub.

- [ ] Remote adicionado.

---

### 4.2. Verificar remote

```bash
git remote -v
```

Deve mostrar:

```bash
origin  https://github.com/SEU_USUARIO/XQuadsSquadWorldclass.git (fetch)
origin  https://github.com/SEU_USUARIO/XQuadsSquadWorldclass.git (push)
```

- [ ] Remote verificado.

---

## 5. Enviar para o GitHub (Push)

### 5.1. Fazer push para a branch main

```bash
git push -u origin main
```

Se sua branch principal for `master`:

```bash
git push -u origin master
```

- [ ] Push feito com sucesso.

---

### 5.2. Verificar no GitHub

1. Acesse: `https://github.com/SEU_USUARIO/XQuadsSquadWorldclass`  
2. Verifique:
   - Todos os arquivos foram enviados.  
   - `.env` **não** aparece.  
   - `logs/` não contém logs sensíveis.  
   - Apenas código, documentação e arquivos de exemplo aparecem.

- [ ] Repositório no GitHub verificado.  
- [ ] Nenhum arquivo sensível foi enviado.

---

## 6. Alterar Repositório para PRIVADO (Após Análise)

### 6.1. Quando alterar

Após:

- Equipe analisar a arquitetura.  
- Você ter certeza de que tudo está correto.  
- Decidir trancar o repositório permanentemente.

---

### 6.2. Alterar para PRIVADO

1. Acesse: `https://github.com/SEU_USUARIO/XQuadsSquadWorldclass`  
2. Clique em **Settings**.  
3. Role até a seção **Danger Zone**.  
4. Clique em **Change repository visibility**.  
5. Selecione **Change visibility to private**.  
6. Confirme a alteração.

**Resultado:**

- Repositório agora é **PRIVADO**.  
- Apenas pessoas com acesso autorizado podem ver.  
- Tudo fica restrito e seguro.

- [ ] Repositório alterado para PRIVADO.

---

## 7. Checklist Final de Segurança

- [ ] `.gitignore` contém `.env`, `logs/*.log`, `credentials/`, etc.  
- [ ] `.env.example` criado com apenas valores de exemplo.  
- [ ] `git status` não mostra nenhum arquivo sensível.  
- [ ] `.env` com chaves reais **não** foi enviado.  
- [ ] Nenhum arquivo de credenciais foi enviado.  
- [ ] Logs sensíveis **não** foram enviados.  
- [ ] Repositório PÚBLICO criado temporariamente.  
- [ ] Repositório alterado para PRIVADO após análise.  
- [ ] Apenas arquitetura, estrutura e documentação foram compartilhadas.

---

## 8. Comandos Git Resumidos (Ordem Correta)

```bash
# 1. Inicializar
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Verificar o que será enviado
git status

# 4. Commitar
git commit -m "Initial commit: XQuads Squad Worldclass – Arquitetura completa, documentação e segurança"

# 5. Criar repositório no GitHub (PÚBLICO temporariamente)
# -> Acesse https://github.com/new e crie o repositório

# 6. Conectar ao remoto
git remote add origin https://github.com/SEU_USUARIO/XQuadsSquadWorldclass.git

# 7. Verificar remote
git remote -v

# 8. Fazer push
git push -u origin main

# 9. (Opcional) Alterar para PRIVADO após análise
# -> Settings → Danger Zone → Change visibility to private
```

---

## 9. O Que Será Compartilhado

### ✅ **O que será enviado:**

- Código dos agentes (`.py`).  
- YAML e JSON de configuração (apenas placeholders, sem chaves reais).  
- Documentação completa (`README.md`, `ARCHITECTURE.md`, `docs/`, `prompts/`, etc.).  
- Scripts principais (`run_agent_squad.py`, `Makefile`, etc.).  
- Arquivos de configuração de exemplo (`.env.example`, `requirements.txt`, etc.).  
- Tests (`tests/`).  
- CI/CD (`.github/workflows/ci.yml`).

### ❌ **O que NÃO será enviado:**

- `.env` com chaves reais.  
- Credenciais, chaves, certificados.  
- Logs sensíveis.  
- Arquivos pessoais ou de configuração local.  
- VirtuaLenv (`venv/`, `ENV/`).

---

## 10. Frase Final

> **Compártile apenas a arquitetura e a inteligência do sistema. Nunca exponha dados de acesso.**  
> **Depois, trancar tudo permanentemente alterando o repositório para PRIVADO.**

---

Seguindo este guia, você garante que:

- ✅ Seu projeto é seguro.  
- ✅ Nenhum dado sensível é enviado.  
- ✅ Apenas a arquitetura é compartilhada.  
- ✅ O repositório é trancado permanentemente após análise.