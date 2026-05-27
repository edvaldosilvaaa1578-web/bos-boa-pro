# tests/conftest.py
#
# Configurações e fixtures centralizados para pytest.
#
# Fixtures definidas aqui estão automaticamente disponíveis
# em todos os testes dentro de tests/ e subpastas.
#
# Recomendação:
# - Manter fixtures genéricas e reutilizáveis aqui.
# - Evitar lógica muito específica de um único teste aqui
#   (deixe isso nos arquivos de teste).

import pytest
from pathlib import Path


# ============================
# FIXTURES DE CAMINHOS
# ============================

@pytest.fixture(scope="session")
def tests_dir(tmp_path_factory):
    """Retorna a pasta de testes temporária."""
    return tmp_path_factory.mktemp("tests")


@pytest.fixture(scope="session")
def test_env_path(tests_dir):
    """
    Cria um arquivo .env.test temporário para testes.

    Fixtures com scope="session" são criadas uma única vez
    e reutilizadas em todos os testes. [web:140]
    """
    env_path = tests_dir / ".env.test"
    env_path.write_text(
        """
META_ADS_ACCESS_TOKEN=abc123
META_ADS_APP_ID=app_id_123
META_ADS_AD_ACCOUNT_ID=ad_account_123
GOOGLE_ADS_DEVELOPER_TOKEN=xyz789
GOOGLE_ADS_LOGIN_CUSTOMER_ID=login_customer_123
GOOGLE_ADS_CUSTOMER_ID=customer_123
DATABASE_URL=postgresql://user:password@host:port/dbname
DATABASE_USER=test_user
DATABASE_PASSWORD=secret_pass
DATABASE_HOST=localhost
DATABASE_PORT=5432
NOTEBOOK_LM_API_KEY=notebook_lm_key_123
OBSIDIAN_API_KEY=obsidian_key_123
""",
        encoding="utf-8",
    )
    return env_path


@pytest.fixture(scope="session")
def test_yaml_path(tests_dir):
    """
    Cria um arquivo YAML de teste temporário.

    Contém placeholders que serão substituídos pelos valores do .env.test.
    """
    yaml_path = tests_dir / "test_config.yaml"
    yaml_path.write_text(
        """
squad:
  name: "test_squad"
  description: "Squad de teste para pytest"
  timezone: "America/Recife"
  status: "operational"

secrets_placeholders:
  meta_ads:
    access_token: "%%META_ADS_ACCESS_TOKEN%%"
    app_id: "%%META_ADS_APP_ID%%"
    ad_account_id: "%%META_ADS_AD_ACCOUNT_ID%%"
  google_ads:
    developer_token: "${GOOGLE_ADS_DEVELOPER_TOKEN}"
    login_customer_id: "${GOOGLE_ADS_LOGIN_CUSTOMER_ID}"
    customer_id: "${GOOGLE_ADS_CUSTOMER_ID}"
  data_storage:
    url: "%%DATABASE_URL%%"
    user: "%%DATABASE_USER%%"
    password: "%%DATABASE_PASSWORD%%"
    host: "%%DATABASE_HOST%%"
    port: "%%DATABASE_PORT%%"
  knowledge_base:
    notebook_lm_api_key: "%%NOTEBOOK_LM_API_KEY%%"
    obsidian_api_key: "%%OBSIDIAN_API_KEY%%"
""",
        encoding="utf-8",
    )
    return yaml_path


# ============================
# FIXTURES PARA O MÓDULO PRINCIPAL
# ============================

@pytest.fixture
def mock_run_agent_squad_paths(test_yaml_path, test_env_path, monkeypatch):
    """
    Sobrescreve temporariamente os caminhos no módulo run_agent_squad.
    Deve ser usado junto com os testes que chamam funções do módulo.
    """
    import run_agent_squad

    original_yaml = run_agent_squad.CONFIG_FILE_PATH
    original_env = run_agent_squad.ENV_FILE_PATH

    run_agent_squad.CONFIG_FILE_PATH = test_yaml_path
    run_agent_squad.ENV_FILE_PATH = test_env_path

    # Informe ao teste para limpar ao final
    yield

    # Restaurar os caminhos originais
    run_agent_squad.CONFIG_FILE_PATH = original_yaml
    run_agent_squad.ENV_FILE_PATH = original_env


# ============================
# FIXTURES FUTURAS (opcional)
# ============================

# Exemplo: se você quiser testar com o YAML real do projeto
# @pytest.fixture(scope="session")
# def real_yaml_path():
#     return Path("xquads_squad_worldclass.yaml")

# Exemplo: se quiser testar com um .env real (não versionado)
# @pytest.fixture(scope="session")
# def real_env_path():
#     return Path(".env")
