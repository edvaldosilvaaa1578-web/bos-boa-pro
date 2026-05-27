# ===================================================================
# Makefile
# XQuads Squad Worldclass – Comandos práticos para desenvolvimento
#
# Comandos principais:
#   make setup          → instalar dependências
#   make test           → rodar testes
#   make coverage       → rodar testes com cobertura
#   make lint           → rodar linters (flake8, black check)
#   make format         → formatar código com black
#   make clean          → limpar arquivos temporários
#   make help           → mostrar ajuda
# ===================================================================

# shell para uso em Makefile
SHELL := /bin/bash

# Variáveis
PYTHON := python3
PYTEST := $(PYTHON) -m pytest
BLACK := $(PYTHON) -m black
FLAKE8 := $(PYTHON) -m flake8
COVERAGE := $(PYTHON) -m coverage

# Targets phony (não são arquivos)
.PHONY: help setup deps test coverage lint lint-check format clean

# ===================================================================
# HELP
# ===================================================================

help: ## Mostrar ajuda online
	@echo "XQuads Squad Worldclass – Comandos Makefile"
	@echo ""
	@echo "Instalação:"
	@echo "  make setup    Instalar dependências do projeto"
	@echo ""
	@echo "Testes:"
	@echo "  make test     Rodar testes com pytest"
	@echo "  make coverage Rodar testes com cobertura de código"
	@echo ""
	@echo "Qualidade de código:"
	@echo "  make lint     Rodar linters (flake8 + black check)"
	@echo "  make lint-check  Verificar apenas estilo (sem corrigir)"
	@echo "  make format   Formatar código com black"
	@echo ""
	@echo "Limpeza:"
	@echo "  make clean    Limpar arquivos temporários, caches e coberturas"
	@echo ""
	@echo "Utilitários:"
	@echo "  make help     Mostrar esta ajuda"
	@echo ""

# ===================================================================
# INSTALAÇÃO
# ===================================================================

setup: ## Instalar dependências do projeto
	@echo "🔧 Instalando dependências do projeto..."
	$(PYTHON) -m pip install --upgrade pip
	$(PYTHON) -m pip install -r requirements.txt
	$(PYTHON) -m pip install -e ".[dev]"
	@echo "✅ Dependências instaladas."

deps: setup

# ===================================================================
# TESTES
# ===================================================================

test: ## Rodar testes com pytest (configuração já está no pyproject.toml)
	@echo "🧪 Rodando testes com pytest..."
	$(PYTEST)

coverage: ## Rodar testes com cobertura de código
	@echo "📊 Rodando testes com cobertura de código..."
	$(COVERAGE) erase
	$(COVERAGE) run -m pytest
	$(COVERAGE) report -m
	@echo "✅ Cobertura gerada. Ver htmlcov/ para relatório HTML."

# ===================================================================
# LINT & STYLE
# ===================================================================

lint: lint-check format-check ## Rodar linters (flake8 + black check)
	@echo "✅ Lint & style check finalizados."

lint-check: ## Verificar estilo com flake8
	@echo "🔍 Rodando flake8..."
	$(FLAKE8) . || true

format-check: ## Verificar formatação com black
	@echo "🔍 Verificando formatação com black..."
	$(BLACK) --check . || true

format: ## Formatar código com black
	@echo "⚙️  Formatando código com black..."
	$(BLACK) .
	@echo "✅ Código formatado."

# ===================================================================
# LIMPEZA
# ===================================================================

clean: ## Limpar arquivos temporários, caches e coberturas
	@echo "🧹 Limpando arquivos temporários e caches..."
	rm -rf .pytest_cache
	rm -rf __pycache__
	rm -rf */__pycache__
	rm -rf .coverage
	rm -rf coverage.xml
	rm -rf htmlcov
	rm -rf .mypy_cache
	rm -rf .tox
	rm -rf build
	rm -rf dist
	rm -rf *.egg-info
	@echo "✅ Limpeza concluída."

# ===================================================================
# OPCIONAL: DEPLOY (se você quiser integrar com CI/CD no futuro)
# ===================================================================

deploy-check: lint coverage test
	@echo "✅ Todos os checks de qualidade passaram. Pronto para deploy."
	