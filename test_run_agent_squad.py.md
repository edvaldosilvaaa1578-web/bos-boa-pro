# tests/test_run_agent_squad.py
# Testes unitários do XQuads Squad Worldclass (pytest)
#
# Usa as fixtures centralizadas em tests/conftest.py.

import yaml

from run_agent_squad import (
    read_yaml_text,
    load_env_vars,
    replace_secrets_in_text,
)


class TestRunAgentSquad:

    def test_01_yaml_reading(self, mock_run_agent_squad_paths):
        """Testa se o YAML é lido corretamente como texto."""
        content = read_yaml_text()
        assert "squad" in content
        assert "test_squad" in content
        assert "%%META_ADS_ACCESS_TOKEN%%" in content
        assert "${GOOGLE_ADS_DEVELOPER_TOKEN}" in content

    def test_02_env_loading(self, mock_run_agent_squad_paths):
        """Testa se o .env é carregado e guarda as variáveis."""
        env = load_env_vars()

        assert "META_ADS_ACCESS_TOKEN" in env
        assert "GOOGLE_ADS_DEVELOPER_TOKEN" in env
        assert "DATABASE_USER" in env
        assert "DATABASE_PASSWORD" in env

        assert env["META_ADS_ACCESS_TOKEN"] == "abc123"
        assert env["GOOGLE_ADS_DEVELOPER_TOKEN"] == "xyz789"
        assert env["DATABASE_USER"] == "test_user"
        assert env["DATABASE_PASSWORD"] == "secret_pass"

    def test_03_secrets_substitution(self, mock_run_agent_squad_paths):
        """Testa substituição de %%VARIAVEL%% e $VARIAVEL no YAML."""
        yaml_text = read_yaml_text()
        env_secrets = load_env_vars()

        result = replace_secrets_in_text(yaml_text, env_secrets)

        # Placeholders não devem mais existir
        assert "%%META_ADS_ACCESS_TOKEN%%" not in result
        assert "${GOOGLE_ADS_DEVELOPER_TOKEN}" not in result
        assert "%%DATABASE_USER%%" not in result
        assert "%%DATABASE_PASSWORD%%" not in result

        # Valores reais devem existir
        assert "abc123" in result
        assert "xyz789" in result
        assert "test_user" in result
        assert "secret_pass" in result

        # YAML substituído ainda é um dict válido
        config = yaml.safe_load(result)
        assert isinstance(config, dict)
        assert config["squad"]["name"] == "test_squad"

    def test_04_text_parsed_as_dict(self, mock_run_agent_squad_paths):
        """Confirma que o YAML substituído ainda é um dict válido."""
        yaml_text = read_yaml_text()
        env_secrets = load_env_vars()

        yaml_with_secrets = replace_secrets_in_text(yaml_text, env_secrets)
        config = yaml.safe_load(yaml_with_secrets)

        assert isinstance(config, dict)
        assert "squad" in config
        assert "secrets_placeholders" in config
