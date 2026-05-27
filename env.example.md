## 📄 `.env.example` – Arquivo de Exemplo Detalhado com Comentários
# ===================================================================
# .env.example
# XQuads Squad Worldclass – Variáveis de Ambiente (EXEMPLO)
#
# INSTRUÇÕES:
# 1. Copie este arquivo para .env (não versionado):
#    cp .env.example .env
#
# 2. Substitua cada "SEU_..." pelo valor real das suas chaves.
#
# 3. NUNCA envie .env (com chaves reais) para o GitHub.
#    O .gitignore já ignora automaticamente.
#
# 4. Mantenha este arquivo (.env.example) no repositório
#    para documentar quais variáveis são necessárias.
#
# 5. Para produção, use Secrets do CI/CD (GitHub Actions, etc.)
#    em vez de .env local.
# ===================================================================


# ===================================================================
# 1. META ADS (Facebook Ads)
# ===================================================================
# theseas são usadas para conectar à API do Meta Ads
# para criação, gestão e otimização de campanhas.

# Token de acesso da API do Meta Ads
# Obtido em: https://developers.facebook.com/
# Este token permite acessar a API do Meta Ads.
META_ADS_ACCESS_TOKEN=SEU_META_ADS_ACCESS_TOKEN_AQUI

# ID do Aplicativo do Meta (Facebook App ID)
# Obtido no Facebook Developer Dashboard.
# Usado para identificar seu app no Meta.
META_ADS_APP_ID=SEU_META_ADS_APP_ID_AQUI

# ID da Conta de Anúncios do Meta
# Obtido no Gerenciador de Anúncios do Meta.
# Formato: ad-accounts/123456789
META_ADS_AD_ACCOUNT_ID=SEU_META_ADS_AD_ACCOUNT_ID_AQUI


# ===================================================================
# 2. GOOGLE ADS
# ===================================================================
# Essas variáveis são usadas para conectar à API do Google Ads
# para criação, gestão e otimização de campanhas.

# Token de desenvolvedor do Google Ads
# Obtido em: https://developers.google.com/google-ads/api
# Este token é necessário para acessar a API do Google Ads.
GOOGLE_ADS_DEVELOPER_TOKEN=SEU_GOOGLE_ADS_DEVELOPER_TOKEN_AQUI

# ID do Cliente de Login do Google Ads
# Obtido no Google Ads Manager Account.
# Formato: 123-456-7890 (com traços)
GOOGLE_ADS_LOGIN_CUSTOMER_ID=SEU_GOOGLE_ADS_LOGIN_CUSTOMER_ID_AQUI

# ID do Cliente do Google Ads (conta de anúncios)
# Formato: 1234567890 (sem traços)
GOOGLE_ADS_CUSTOMER_ID=SEU_GOOGLE_ADS_CUSTOMER_ID_AQUI


# ===================================================================
# 3. BANCO DE DADOS (PostgreSQL exemplo)
# ===================================================================
# Essas variáveis são usadas para conectar ao banco de dados
# para armazenamento de dados, logs, KPIs, etc.

# URL de conexão completa com o banco de dados
# Formato: postgresql://usuario:senha@host:porta/banco_de_dados
DATABASE_URL=postgresql://user:password@localhost:5432/xquads_db

# Usuário do banco de dados
DATABASE_USER=SEU_USUARIO_DO_BANCO_AQUI

# Senha do banco de dados
DATABASE_PASSWORD=SEU_PASSWORD_DO_BANCO_AQUI

# Host do banco de dados (localhost ou IP/servidor)
DATABASE_HOST=localhost

# Porta do banco de dados (padrão PostgreSQL: 5432)
DATABASE_PORT=5432


# ===================================================================
# 4. NOTEBOOK LM (Google Notebook LM)
# ===================================================================
# Essa variável é usada para conectar ao Google Notebook LM
# para pesquisa de mercado, análise de dados, etc.

# API Key do Google Notebook LM
# Obtida em: https://ai.google.dev/
NOTEBOOK_LM_API_KEY=SEU_NOTEBOOK_LM_API_KEY_AQUI


# ===================================================================
# 5. OBSIDIAN
# ===================================================================
# Essa variável é usada para conectar ao Obsidian
# para gestão de conhecimento, 2º cérebro, etc.

# API Key do Obsidian (se usar plugin de API)
# Obtida conforme configuração do Obsidian.
OBSIDIAN_API_KEY=SEU_OBSIDIAN_API_KEY_AQUI


# ===================================================================
# 6. OUTRAS VARIÁVEIS OPCIONAIS
# ===================================================================
# Adicione aqui outras variáveis que seu projeto possa precisar.

# Exemplo: Chave de API da OpenAI (se usar Claude / GPT)
# OPENAI_API_KEY=SEU_OPENAI_API_KEY_AQUI

# Exemplo: Chave de API da Anthropic (Claude)
# ANTHROPIC_API_KEY=SEU_ANTHROPIC_API_KEY_AQUI

# Exemplo: URL de webhook para notificações
# WEBHOOK_URL=https://seu-webhook.com/notify

# Exemplo: Nível de log (debug, info, warning, error)
# LOG_LEVEL=info

# Exemplo: Modo de execução (dev, prod)
# ENVIRONMENT=dev


# ===================================================================
# 7. INSTRUÇÕES DE SEGURANÇA
# ===================================================================
# LEIA COM ATENÇÃO:

# 1. NUNCA envie este arquivo (.env.example) com valores reais.
#    Este arquivo é apenas um EXEMPLO, sem chaves reais.

# 2. NUNCA envie .env (com chaves reais) para o GitHub.
#    O .gitignore já ignora automaticamente.

# 3. Para produção, use Secrets do CI/CD:
#    GitHub: Settings → Secrets and variables → Actions
#    GitLab: Settings → CI/CD → Variables
#    AWS: Secrets Manager / Parameter Store

# 4. Rotacione suas chaves periodicamente (ex.: a cada 90 dias).

# 5. Nunca compartilhe chaves por e-mail, chat, etc.
#    Use gerenciadores de senhas (LastPass, 1Password, Bitwarden).

# 6. Revise periodicamente o que está sendo enviado ao git:
#    git status
#    git log --all --full-history -- .env

# ===================================================================
## 📌 Como usar este arquivo

## 1. Criar `.env` a partir do exemplo

bash

`cp .env.example .env`

## 2. Preencher `.env` com chaves reais

Edite `.env` e substitua:

bash

`META_ADS_ACCESS_TOKEN=abc123... META_ADS_APP_ID=123456... # ... preencha todas as variáveis`

## 3. Garantir que `.env` não seja enviado

Verificar `.gitignore`:

bash

`# .gitignore .env .env.* !.env.example`

## 4. Verificar antes de commitar

bash

`git status`

Se `.env` aparecer:

bash

`git rm --cached .env git add .gitignore git commit -m "Remover .env do tracking"`