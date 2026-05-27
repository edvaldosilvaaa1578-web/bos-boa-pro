# ===================================================================
# pyproject.toml
# XQuads Squad Worldclass – Configuração oficial do projeto
#
# Inclui:
# - pytest (testes)
# - pytest-cov (cobertura)
# - coverage (engine de cobertura)
# - black (formatação)
# - flake8 (lint)
# ===================================================================

# ------------------------------------------------------------------
# Build system (opcional, mas recomendado)
# ------------------------------------------------------------------
[build-system]
requires = ["setuptools>=61", "wheel"]
build-backend = "setuptools.build_meta"

# ------------------------------------------------------------------
# Informações básicas do projeto (opcional para uso interno)
# ------------------------------------------------------------------
[project]
name = "xquads-squad-worldclass"
version = "1.0.0"
description = "Núcleo operacional de uma agência de IA 24/7 baseada em Xquads Squads e Claude"
readme = "README.md"
license = { text = "Proprietário" }
requires-python = ">=3.10"
authors = [
    { name = "Agência de Classe Mundial" }
]
dependencies = [
    "pyyaml>=6.0",
    "python-dotenv>=1.0",
]

# ------------------------------------------------------------------
# Dependências de desenvolvimento (testes, linters, ferramentas)
# ------------------------------------------------------------------
[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "pytest-cov>=4.0",
    "coverage[toml]>=7.0",
    "black>=23.0",
    "flake8>=6.0",
]

# ------------------------------------------------------------------
# Configurações do pytest
# ------------------------------------------------------------------
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]

# Opções padrão para pytest-cov (cobertura)
addopts = [
    "-v",
    "--cov=run_agent_squad",
    "--cov-report=term-missing",
    "--cov-report=html",
    "--cov-report=xml",
    "--cov-fail-under=70",
    "--no-cov-on-fail",
]

# ------------------------------------------------------------------
# Configurações do coverage (engine de cobertura)
# ------------------------------------------------------------------
[tool.coverage.run]
branch = true
source = ["."]
omit = [
    "tests/*",
    "*/tests/*",
    "*/__pycache__/*",
    "*/.pytest_cache/*",
    "*/venv/*",
    "*/env/*",
]

[tool.coverage.report]
precision = 2
show_missing = true
fail_under = 70
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "raise AssertionError",
    "raise NotImplementedError",
    "if __name__ == .__main__.:",
    "if TYPE_CHECKING:",
    "@abstractmethod",
]

[tool.coverage.html]
directory = "htmlcov"

[tool.coverage.xml]
output = "coverage.xml"

# ------------------------------------------------------------------
# Configurações do black (formatação de código)
# ------------------------------------------------------------------
[tool.black]
line-length = 88
target-version = ["py310"]
include = '\.pyi?$'
exclude = '''
/(
    \.git
    | \.hg
    | \.mypy_cache
    | \.tox
    | \.venv
    | _build
    | buck-out
    | build
    | dist
    | tests/__pycache__
    | .pytest_cache
)/
'''

# ------------------------------------------------------------------
# Configurações do flake8 (lint)
# ------------------------------------------------------------------
[tool.flake8]
max-line-length = 88
extend-ignore = [
    "E203",  # E203 conflita com o black
    "W503",  # W503 conflita com o black
]
exclude = [
    ".git",
    "__pycache__",
    ".tox",
    ".venv",
    "build",
    "dist",
    ".pytest_cache",
]

# ------------------------------------------------------------------
# Configurações de segurança de segredos (flag de CI)
# ------------------------------------------------------------------
# Nota:
# - Este arquivo não armazena segredos.
# - Chaves reais devem ser injetadas via .env ou segredos do CI/CD.
# - Logs nunca devem conter tokens, senhas ou chaves em texto claro.
