validate_env.py
## 📄 `scripts/validate_env.py` – Script de Validação de Variáveis de Ambiente
#!/usr/bin/env python3
# scripts/validate_env.py
#
# ===================================================================
# Script de Validação de Variáveis de Ambiente
# XQuads Squad Worldclass – Segurança e Validação
#
# FUNÇÃO:
# - Verifica se todas as variáveis de ambiente necessárias estão presentes.
# - Mostra quais variáveis estão faltando.
# - Impede a execução do squad se faltar algo crítico.
# - Mostra mensagens claras e amigáveis.
#
# INSTRUÇÕES:
# 1. Salvar em: scripts/validate_env.py
# 2. Tornar executável (opcional):
#    chmod +x scripts/validate_env.py
# 3. Executar antes de rodar o squad:
#    python3 scripts/validate_env.py
#
# ===================================================================

import os
import sys
from pathlib import Path


# ===================================================================
# 1. DEFINIÇÃO DAS VARIÁVEIS NECESSÁRIAS
# ===================================================================

# Variáveis CRÍTICAS – o squad NÃO roda sem elas
REQUIRED_VARS = {
    # Meta Ads
    "META_ADS_ACCESS_TOKEN": "Token de acesso da API do Meta Ads",
    "META_ADS_APP_ID": "ID do Aplicativo do Meta (Facebook App ID)",
    "META_ADS_AD_ACCOUNT_ID": "ID da Conta de Anúncios do Meta",
    
    # Google Ads
    "GOOGLE_ADS_DEVELOPER_TOKEN": "Token de desenvolvedor do Google Ads",
    "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "ID do Cliente de Login do Google Ads",
    "GOOGLE_ADS_CUSTOMER_ID": "ID do Cliente do Google Ads (conta de anúncios)",
    
    # Banco de Dados
    "DATABASE_URL": "URL de conexão completa com o banco de dados",
    "DATABASE_USER": "Usuário do banco de dados",
    "DATABASE_PASSWORD": "Senha do banco de dados",
    "DATABASE_HOST": "Host do banco de dados",
    "DATABASE_PORT": "Porta do banco de dados",
    
    # Outros
    "NOTEBOOK_LM_API_KEY": "API Key do Google Notebook LM",
    "OBSIDIAN_API_KEY": "API Key do Obsidian",
}

# Variáveis OPCIONAIS – o squad roda, mas com funcionalidades limitadas
OPTIONAL_VARS = {
    # OpenAI (se usar)
    "OPENAI_API_KEY": "API Key da OpenAI (opcional)",
    
    # Anthropic / Claude (se usar)
    "ANTHROPIC_API_KEY": "API Key da Anthropic / Claude (opcional)",
    
    # Webhook para notificações
    "WEBHOOK_URL": "URL de webhook para notificações (opcional)",
    
    # Nível de log
    "LOG_LEVEL": "Nível de log (debug, info, warning, error) - padrão: info",
    
    # Ambiente
    "ENVIRONMENT": "Ambiente (dev, prod) - padrão: dev",
}


# ===================================================================
# 2. FUNÇÕES DE VALIDAÇÃO
# ===================================================================

def load_env_file(env_path: Path) -> dict:
    """
    Carrega variáveis de um arquivo .env (se existir).
    
    Args:
        env_path: Caminho para o arquivo .env
        
    Returns:
        dict com as variáveis carregadas
    """
    env_vars = {}
    
    if not env_path.exists():
        print(f"⚠️  Arquivo .env não encontrado em: {env_path}")
        return env_vars
    
    print(f"📄 Carregando arquivo .env: {env_path}")
    
    with env_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            
            # Ignorar linhas vazias e comentários
            if not line or line.startswith("#"):
                continue
            
            # Ignorar linhas sem '='
            if "=" not in line:
                continue
            
            # Separar chave e valor
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip()
            
            # Remover aspas se existirem
            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            if value.startswith("'") and value.endswith("'"):
                value = value[1:-1]
            
            env_vars[key] = value
    
    return env_vars


def validate_required_vars(env_vars: dict) -> tuple:
    """
    Verifica se todas as variáveis obrigatórias estão presentes.
    
    Args:
        env_vars: dict com as variáveis carregadas
        
    Returns:
        tuple: (lista de faltantes, True se todas presentes)
    """
    missing = []
    
    for var_key, var_description in REQUIRED_VARS.items():
        # Verificar no .env
        value = env_vars.get(var_key)
        
        # Se não estiver no .env, verificar no ambiente do sistema
        if not value:
            value = os.getenv(var_key)
        
        # Se ainda não estiver, é falta
        if not value:
            missing.append({
                "key": var_key,
                "description": var_description,
            })
    
    return missing, len(missing) == 0


def validate_optional_vars(env_vars: dict) -> list:
    """
    Verifica quais variáveis opcionais estão presentes.
    
    Args:
        env_vars: dict com as variáveis carregadas
        
    Returns:
        lista de variáveis opcionais presentes
    """
    present = []
    missing = []
    
    for var_key, var_description in OPTIONAL_VARS.items():
        value = env_vars.get(var_key)
        
        if not value:
            value = os.getenv(var_key)
        
        if value:
            present.append(var_key)
        else:
            missing.append({
                "key": var_key,
                "description": var_description,
            })
    
    return present, missing


def print_validation_report(missing_required: list, present_optional: list, missing_optional: list):
    """
    Imprime um relatório detalhado da validação.
    
    Args:
        missing_required: lista de variáveis obrigatórias faltantes
        present_optional: lista de variáveis opcionais presentes
        missing_optional: lista de variáveis opcionais faltantes
    """
    print("\n" + "=" * 70)
    print("RELATÓRIO DE VALIDAÇÃO DE VARIÁVEIS DE AMBIENTE")
    print("=" * 70 + "\n")
    
    # Variáveis obrigatórias
    if missing_required:
        print("❌ VARIÁVEIS OBRIGATÓRIAS FALTANTES:\n")
        for var in missing_required:
            print(f"  • {var['key']}")
            print(f"    Descrição: {var['description']}")
            print()
        
        print("-" * 70)
        print(f"Total faltando: {len(missing_required)} variável(éis)")
        print("-" * 70)
    else:
        print("✅ TODAS AS VARIÁVEIS OBRIGATÓRIAS ESTÃO PRESENTES!\n")
    
    # Variáveis opcionais presentes
    if present_optional:
        print("✅ VARIÁVEIS OPCIONAIS PRESENTES:\n")
        for var_key in present_optional:
            print(f"  • {var_key}")
        print()
    
    # Variáveis opcionais faltantes
    if missing_optional:
        print("ℹ️  VARIÁVEIS OPCIONAIS FALTANTES (não críticas):\n")
        for var in missing_optional:
            print(f"  • {var['key']}")
            print(f"    Descrição: {var['description']}")
        print()
    
    print("=" * 70)


# ===================================================================
# 3. FUNÇÃO PRINCIPAL
# ===================================================================

def main():
    """
    Função principal de validação.
    """
    print("\n" + "=" * 70)
    print("🔍 VALIDAÇÃO DE VARIÁVEIS DE AMBIENTE")
    print("XQuads Squad Worldclass – Agência de IA 24/7")
    print("=" * 70 + "\n")
    
    # 1. Determinar caminho do .env
    repo_root = Path(__file__).parent.parent
    env_path = repo_root / ".env"
    
    print(f"📂 Diretório do projeto: {repo_root}")
    print(f"📄 Arquivo .env: {env_path}")
    print()
    
    # 2. Carregar variáveis do .env
    env_vars = load_env_file(env_path)
    
    # Também carregar do ambiente do sistema (CI/CD, etc.)
    for key in REQUIRED_VARS.keys():
        if key not in env_vars:
            value = os.getenv(key)
            if value:
                env_vars[key] = value
    
    # 3. Validar variáveis obrigatórias
    missing_required, all_required_present = validate_required_vars(env_vars)
    
    # 4. Validar variáveis opcionais
    present_optional, missing_optional = validate_optional_vars(env_vars)
    
    # 5. Imprimir relatório
    print_validation_report(missing_required, present_optional, missing_optional)
    
    # 6. Retornar status
    if missing_required:
        print("\n❌ VALIDAÇÃO FALHOU!")
        print()
        print("📝 INSTRUÇÕES PARA CORRIGIR:")
        print()
        print("1. Copie o arquivo .env.example para .env:")
        print(f"   cp {repo_root / '.env.example'} {repo_root / '.env'}")
        print()
        print("2. Edite .env e preencha todas as variáveis faltantes:")
        print(f"   nano {repo_root / '.env'}")
        print("   ou")
        print(f"   vi {repo_root / '.env'}")
        print()
        print("3. Execute novamente:")
        print("   python3 scripts/validate_env.py")
        print()
        print("4. Após validação bem-sucedida, rode o squad:")
        print("   python3 run_agent_squad.py")
        print()
        print("=" * 70 + "\n")
        
        sys.exit(1)
    else:
        print("\n✅ VALIDAÇÃO BEM-SUCEDIDA!")
        print()
        print("🎉 Todas as variáveis obrigatórias estão presentes.")
        print()
        print("🚀 Você pode agora rodar o squad:")
        print()
        print("   python3 run_agent_squad.py")
        print()
        print("=" * 70 + "\n")
        
        sys.exit(0)


if __name__ == "__main__":
    main()