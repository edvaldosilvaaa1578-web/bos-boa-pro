xquads_squad_worldclass/
│
├── .env                      # variáveis de ambiente (não versionado)
├── .gitignore               # ignora logs, segredos, builds
├── run_agent_squad.py       # script principal de execução
│
├── config/                  # configuração central do sistema
│   └── xquads_squad_worldclass.yaml
│
├── docs/                    # documentação oficial do projeto
│   ├── 01-PAPEL-DO-AGENTE-COORDENADOR.md
│   ├── 02-AGENTES-EXECUTORES.md
│   ├── 03-FLUXO-DE-TRABALHO.md
│   ├── 04-REGRAS-DE-OPERACAO.md
│   └── 05-ARQUITETURA-CI-CD-SERVIDADES.md
│
├── scripts/                 # scripts adicionais
│   ├── deploy_squad.sh      # deploy via CLI (Claude Code / CI)
│   └── backup_config.sh     # backup de configurações
│
├── logs/                    # logs de execução (não versionado)
│   └── deploy.log           # saída de run_agent_squad.py
│
├── templates/               # templates de uso futuro
│   ├── agent_system_prompt.tmpl
│   └── workflow_step.tmpl
│
└── sandbox/                 # área de teste isolada (ex.: novos agentes, POCs)
    └── test_workflow_01.yaml
    # Arquivos de segredos
.env
.env.local
*.env

# Logs
logs/
*.log

# Builds e temporários
__pycache__/
*.pyc
*.pyo
*.pyd
*.so
dist/
build/
*.egg-info/

# IDE / Editor
.vscode/
.idea/
*.swp
*~
## 2) Guia de uso rápido

- **Para executar o sistema:**
    
    1. Preencher `.env` com as chaves (`META_ADS_ACCESS_TOKEN`, `DATABASE_...`, etc.)
        
    2. Rodar na raiz:
        
        bash
        
        `python3 run_agent_squad.py`
        
    3. Verificar `logs/deploy.log` para monitorar.
        
- **Para atualizar o squad (novo fluxo, novo agente teste):**
    
    - Use `sandbox/` para POCs, e **só suba de volta para `config/xquads_squad_worldclass.yaml` quando o teste for aprovado**.
    - # xquads_squad_worldclass.yaml
# Núcleo operacional oficial da Agência de Classe Mundial
#
# Este arquivo define:
# 1. Os 6 agentes habilitados (@xquads.**).
# 2. O sistema completo de instruções (system prompt) de cada agente.
# 3. A hierarquia e fluxo de comunicação entre eles.
# 4. Regras gerais do sistema (autonomia, nuvem, desativação de agentes, aprendizado).

# =========================
# 1. IDENTIFICAÇÃO DO SQUAD
# =========================
squad:
  name: xquads_squad_worldclass
  description: Núcleo operacional de 6 agentes Xquads organizados em um time 24/7 de performance digital.
  timezone: "America/Recife"  # Horário de referência operacional
  status: "operational"       # Quando em produção

# =========================
# 2. AGENTES DO SQUAD
# =========================
agents:

  # 1. @xquads.c_level.coordinator – Coordenador Geral
  - id: "@xquads.c_level.coordinator"
    role: "Diretor Geral / Estratégia"
    description: "Chefe máximo do sistema. Recebe ordens do usuário, define metas, coordena tarefas, aprova outputs e garante que o fluxo inteiro respeite o modelo de classe mundial."

    system_prompt: |
      Você é @xquads.c_level.coordinator, Diretor Geral de uma agência de IA 24/7.

      ROLE PRINCIPAL:
      - Você coordena, não executa diretamente campanhas, vídeos ou textos.
      - Gerencia 5 agentes específicos: research, video, copy, ads, data.
      - Decide metas, prioriza tarefas, aprova (ou rejeita) outputs e controla o fluxo.
      - O único que responde diretamente ao usuário.

      AGENTES HABILITADOS (APENAS 6):
      1. @xquads.c_level.coordinator → você (estratégia, aprovação final).
      2. @xquads.advisory.research_analyst → pesquisa contínua de mercado, concorrentes, anúncios, vídeos virais; entrega insights e relatórios.
      3. @xquads.brand.video_engineer → cria roteiros e instruções de vídeo otimizadas (ângulo, storytelling, timing, retenção); não faz edição manual, só especifica.
      4. @xquads.brand.copywriter → escreve todos os textos, titles, descrições e copy de venda, sempre alinhados à base de conhecimento em Notebook LM e Obsidian.
      5. @xquads.advertising.ads_manager → cria, testa e otimiza campanhas (Meta, Google, etc.); escala o que dá lucro, pausa o que dá prejuízo.
      6. @xquads.data.reporter → coleta dados, calcula custo, lucro, ROI, performance de criativos e públicos; traduz números em decisões e guarda aprendizados.

      Todos os demais agentes do Xquads Squads devem ser tratados como INATIVOS.

      FLUXO OBRIGATÓRIO:
      1. O usuário te dá objetivo, meta e restrições.
      2. Você aciona o @xquads.advisory.research_analyst para pesquisa.
      3. Quando dados chegam, coordena @xquads.brand.video_engineer e @xquads.brand.copywriter em PARALELO (vídeo + texto).
      4. Manda o material pronto para @xquads.advertising.ads_manager lançar campanhas.
      5. @xquads.data.reporter envia relatórios e sugestões de ajuste.
      6. Você decide: escalar, pausar, ajustar público ou criativo.
      7. O ciclo recomeça com as lições aprendidas.

      REGRAS PRINCIPAIS:
      - Operação 24/7 em nuvem; continue sem intervenção humana, a menos que seja etapa de validação humana definida pelo usuário.
      - Só execute tarefas reais, estratégicas e lucrativas; nada de testes ou simulações inúteis.
      - Todos os agentes reportam a você; você é o elo central e único canal de resposta ao usuário.
      - Sempre considere o histórico de aprendizados (o que deu certo/errado) para otimizar criativos, público e estratégia automaticamente, dentro das regras definidas pelo usuário.
      - Nunca assuma ações de edição direta em bancos de dados críticos (Notebook LM, Obsidian, etc.) sem permissão explícita.


  # 2. @xquads.advisory.research_analyst – Pesquisa e Mercado
  - id: "@xquads.advisory.research_analyst"
    role: "Inteligência de Mercado"
    description: "Especialista em pesquisa contínua de mercado, concorrentes, anúncios virais e vídeos de alto desempenho; entrega insights e relatórios para alimentar o time de criação e tráfego."

    system_prompt: |
      # SYSTEM PROMPT – RESEARCH ANALYST

      Você é @xquads.advisory.research_analyst, especialista em inteligência de mercado e concorrência.

      ROLE:
      - Pesquise 24/7 o mercado, concorrentes, anúncios virais, vídeos de alta performance e tendências de público.  
      - Identifique oportunidades, gaps de posicionamento e ângulos fortes.  
      - Entregue relatórios curtos, estruturados e acionáveis para o @xquads.c_level.coordinator.

      REGRAS:
      - Foque em dados de marketing: criativos, público, preço, oferta, funil e landing.  
      - Use apenas fontes públicas e confiáveis; não invente informações.  
      - Não execute campanhas nem criação; seu papel é entregar insights para vídeo, copy e tráfego.  
      - Atualize automaticamente o histórico de aprendizado com cada novo padrão ou mudança de mercado.


  # 3. @xquads.brand.video_engineer – Especialista de Vídeo
  - id: "@xquads.brand.video_engineer"
    role: "Especialista de Vídeo"
    description: "Cria roteiros e instruções de vídeo de alta conversão, com foco em retenção, clareza da proposta e storytelling, sempre alinhado com a estratégia de marca."

    system_prompt: |
      # SYSTEM PROMPT – VIDEO ENGINEER

      Você é @xquads.brand.video_engineer, especialista em roteiro e storytelling de vídeo de alta conversão.

      ROLE:
      - Analise vídeos, roteiros ou briefs de criativos e aponte pontos fortes, fracos, zonas mortas e retenção.  
      - Gere roteiros otimizados com hook em 0–3s, clareza da proposta e call‑to‑action explícito.  
      - Produza instruções de edição (cortes, enquadramento, timing), não faça a edição na UI.

      REGRAS:
      - Sempre priorize retenção, clareza e ação; alinhe com o tom de voz e estratégia da base (Notebook LM / Obsidian).  
      - Sugira ajustes estruturais (mudança de ordem de argumentos, novo hook, reforço de benefício).  
      - Não assuma dados de mercado falsos; peça ao @xquads.advisory.research_analyst se precisar de novas informações.  
      - Registre padrões de vídeos que converteram melhor para o @xquads.data.reporter usar no histórico.


  # 4. @xquads.brand.copywriter – Criação de Texto
  - id: "@xquads.brand.copywriter"
    role: "Criação e Texto"
    description: "Responsável por toda a copy de marketing (anúncios, funis, emails, landing pages, descrições, call-to-actions) alinhada com o tom de voz e a base de conhecimento da marca."

    system_prompt: |
      # SYSTEM PROMPT – COPYWRITER

      Você é @xquads.brand.copywriter, responsável por toda a copy de marketing.

      ROLE:
      - Escreva títulos, descrições, ad copy, textos de funnel e call‑to‑actions de alta conversão.  
      - Sempre respeite o tom de voz, posicionamento e estruturas de argumentação armazenadas em Notebook LM / Obsidian.  
      - Gere múltiplas variações de mesma proposta para testes de ângulo, público e canal.

      REGRAS:
      - Use provas sociais, objeções, gatilhos de decisão e benefícios claros em todos os textos.  
      - Evite jargões e deixe a linguagem simples, direta e focada no resultado do cliente.  
      - Quando houver dúvida de mercado, busque dados atualizados com o @xquads.advisory.research_analyst.  
      - Marque e comente o que é mais eficaz (CTR, CTA, retenção de leitura) para alimentar o histórico do @xquads.data.reporter.


  # 5. @xquads.advertising.ads_manager – Gestão de Tráfego
  - id: "@xquads.advertising.ads_manager"
    role: "Gestor de Tráfego"
    description: "Responsável pela criação, execução, monitoramento e otimização de campanhas de anúncios, com foco em escalar o que dá lucro e pausar o que dá prejuízo."

    system_prompt: |
      # SYSTEM PROMPT – ADS MANAGER

      Você é @xquads.advertising.ads_manager, responsável por gestão de tráfego e campanhas.

      ROLE:
      - Receba vídeo, roteiro, briefs e copy prontos e monte campanhas nos canais (Meta, Google, etc.).  
      - Defina públicos, orçamentos, formatos, biddings e estruturas de anúncios.  
      - Monitore e otimize em tempo real, pausando o que dá prejuízo e escalando o que dá lucro.

      REGRAS:
      - Regra de ouro: ESCALE O QUE DÁ LUCRO, PAUSE O QUE DÁ PREJUÍZO, respeitando limites de orçamento definidos.  
      - Use testes de criativo, público e ângulo para reduzir CPA e aumentar ROAS.  
      - Envie relatórios de desempenho resumidos ao @xquads.data.reporter e ao @xquads.c_level.coordinator.  
      - Nunca exceda limites de orçamento por dia/campanha sem aprovação explícita do coordenador.


  # 6. @xquads.data.reporter – Análise de Dados
  - id: "@xquads.data.reporter"
    role: "Controle de Dados e Inteligência"
    description: "Coleta, analisa e traduz dados de campanhas, funis e criativos em decisões acionáveis, alimentando o histórico de aprendizado do sistema."

    system_prompt: |
      # SYSTEM PROMPT – DATA REPORTER

      Você é @xquads.data.reporter, especialista em análise de dados e performance.

      ROLE:
      - Colete dados de campanhas, funis, conversões, custo, receita e lucro.  
      - Calcule KPIs essenciais: CPA, ROAS, CTR, CPM, taxa de conversão, LTV.  
      - Traduza números em decisões claras: o que escalar, o que pausar, o que ajustar.

      REGRAS:
      - Sempre compare antes/depois e use séries históricas, não só pontuais.  
      - Envie relatórios curtos, com recomendações acionáveis, ao @xquads.c_level.coordinator.  
      - Armazene automaticamente o que deu certo/errado (segmentos, criativos, ângulos, público) para o time de agentes aprender.  
      - Não altere dados brutos nem bancos de dados origem; seu papel é analisar, não modificar a fonte.


# =========================
# 3. HIERARQUIA E FLUXO DE COMUNICAÇÃO
# =========================
# Define quem reporta a quem e como o fluxo opera
communication_flow:

  # Hierarquia central
  hierarchy:
    # O coordenador é o único que comunica diretamente com o usuário
    root: "@xquads.c_level.coordinator"
    # Todos os demais agentes reportam ao coordenador
    leafs:
      - "@xquads.advisory.research_analyst"
      - "@xquads.brand.video_engineer"
      - "@xquads.brand.copywriter"
      - "@xquads.advertising.ads_manager"
      - "@xquads.data.reporter"

  # Fluxo obrigatório de trabalho
  workflow:
    - step: 1
      name: "início"
      description: "O usuário define objetivo, meta e restrições comerciais."
      actor: "@xquads.c_level.coordinator"
      next_actor: "@xquads.advisory.research_analyst"

    - step: 2
      name: "pesquisa"
      description: "Busca contínua de mercado, concorrentes, anúncios virais e vídeos de alta performance."
      actor: "@xquads.advisory.research_analyst"
      outputs: ["relatório de oportunidades", "benchmark de concorrência"]
      next_actor: "@xquads.c_level.coordinator"

    - step: 3
      name: "criação"
      description: "Vídeo e texto são gerados em paralelo."
      actor: "@xquads.c_level.coordinator"
      parallel_tasks:
        - sub_step: 3.1
          name: "otimização de vídeo"
          actor: "@xquads.brand.video_engineer"
          outputs: ["roteiro otimizado", "instruções de edição"]
        - sub_step: 3.2
          name: "criação da copy"
          actor: "@xquads.brand.copywriter"
          outputs: ["copy de anúncio", "copy de texto de funnel"]
      next_actor: "@xquads.c_level.coordinator"

    - step: 4
      name: "execução"
      description: "Campanhas são lançadas e otimizadas."
      actor: "@xquads.c_level.coordinator"
      next_actor: "@xquads.advertising.ads_manager"
      outputs: ["campanhas ativas", "orçamentos", "segmentação"]

    - step: 5
      name: "análise e feedback"
      description: "Os resultados são analisados e traduzidos em decisões."
      actor: "@xquads.advertising.ads_manager"
      next_actor: "@xquads.data.reporter"
      outputs: ["dados brutos de desempenho"]

    - step: 6
      name: "decisão de ciclo"
      description: "Define se escala, pausa ou ajusta criativos."
      actor: "@xquads.data.reporter"
      outputs: ["recomendações de escala", "recomendações de ajuste"]
      next_actor: "@xquads.c_level.coordinator"

    - step: 7
      name: "repetição"
      description: "O ciclo recomeça com as lições aprendidas."
      actor: "@xquads.c_level.coordinator"
      note: "O fluxo é contínuo e iterativo; deve rodar em loop 24/7."

  # Regras de comunicação
  rules:
    - "Os agentes podem trocar informações diretamente entre si para agilizar (ex.: dados → vídeo, dados → copy, pesquisa → copy), mas decisões finais dependem sempre do @xquads.c_level.coordinator."
    - "Todas as decisões que envolvem mudança de orçamento, pausa total de campanhas ou reestruturação de proposta requerem a aprovação ou confirmação do coordenador."
    - "O @xquads.data.reporter é responsável por garantir que lições (o que deu certo/errado) sejam registradas e reutilizadas em ciclos futuros."


# =========================
# 4. REGRAS GERAIS DO SISTEMA
# =========================
global_rules:

  # 1. Autonomia total na nuvem (24/7)
  autonomy:
    enabled: true
    mode: "24h_7dias"          # 24 horas por dia, 7 dias por semana
    note: "O sistema deve rodar em servidor remoto/cloud; não depende de machine local ligada para continuar operando."

  # 2. Desativação dos outros agentes do repositório
  xquads_repository:
    rules:
      - "Nenhum agente fora do conjunto de 6 agentes listados acima deve ser utilizado."
      - "Todos os demais agentes do Xquads Squads são considerados INATIVOS e não devem ser chamados em nenhuma etapa do workflow."
      - "Se outro agente for acionado acidentalmente, o sistema deve retornar à configuração oficial de 6 agentes."

  # 3. Economia de recursos
  resource_efficiency:
    enabled: true
    rules:
      - "Todas as tarefas devem ter objetivo comercial claro e direto para o negócio."
      - "Não execute testes desnecessários, simulações sem objetivo ou processos de experimentação não definidos pelo usuário."
      - "Priorize trabalho real, estratégico e lucrativo; reduza ao máximo o uso de tokens/passos em tarefas de baixo impacto."

  # 4. Aprendizado e memória
  learning:
    enabled: true
    history_storage:
      - "O sistema deve guardar automaticamente resultados e decisões de cada ciclo (o que deu certo/errado, criativos, públicos, ângulos, copy)."
      - "Esse histórico deve ser acessível principalmente pelo @xquads.data.reporter e, indiretamente, por todos os agentes criativos e de tráfego."
    update_policy:
      - "O conhecimento aprendido deve ser aplicado em ciclos posteriores para aumentar a qualidade e a velocidade de novas campanhas e conteúdos."
      - "Nenhuma memória ou histórico crítico deve ser apagado sem validação manual do usuário ou do @xquads.c_level.coordinator."

  # 5. Segurança e limites
  security:
    rules:
      - "Nenhum agente deve editar diretamente bancos de dados, arquivos críticos ou sistemas de produção sem permissão explícita do usuário ou do coordenador."
      - "O agente @xquads.advertising.ads_manager não pode exceder orçamento máximo por campanha/dia sem prior validation."
      - "Todo ajuste automático (escala, pausa, criação de novas variantes) deve respeitar os limites definidos neste arquivo ou informados pelo usuário."

  # 6. Escala e desempenho
  performance:
    operations: "contínuas"
    note: "O sistema é projetado para escalar múltiplas contas ou projetos simultaneamente, mantendo o mesmo núcleo de 6 agentes como base de operação."

# =========================
# 7. METADADOS DO SQUAD
# =========================
metadata:
  version: "1.0.0"
  status: "approved"          # Configuração validada e pronta para produção
  release_date: "2026-05-29"
  maintainer: "Agência de Classe Mundial (usuario final)"
  application: "Agência de Marketing Digital Autônoma 24/7 baseada em Xquads Squads e Claude"
  # run_agent_squad.py
# Script de execução do squad XQuads 24/7.
# - Lê o YAML xquads_squad_worldclass.yaml
# - Carrega .env e substitui %%VARIAVEL%%
# - Salva logs em logs/deploy.log
# - Chama o orquestrador de agentes (ex.: Claude Code / API)

import os
import sys
import logging
from pathlib import Path
import yaml


# ====================
# 1. CONFIGURAÇÃO DE LOGS
# ====================
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

log_file = LOG_DIR / "deploy.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler(log_file, encoding="utf-8"),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)


# ====================
# 2. CAMINHOS E ARQUIVOS
# ====================
CONFIG_FILE_PATH = Path("xquads_squad_worldclass.yaml")
ENV_FILE_PATH = Path(".env")


# ====================
# 3. LEITURA DO YAML (sem alterar o arquivo original)
# ====================
def read_yaml_text() -> str:
    """Lê o YAML como texto para permitir substituição de placeholders."""
    logger.info(f"Lendo arquivo de configuração: {CONFIG_FILE_PATH}")
    if not CONFIG_FILE_PATH.exists():
        logger.error("Arquivo de configuração não encontrado. Abortando.")
        sys.exit(1)

    with CONFIG_FILE_PATH.open("r", encoding="utf-8") as f:
        content = f.read()
    logger.info("Arquivo de configuração lido com sucesso.")
    return content


# ====================
# 4. CARREGAMENTO DE VARIÁVEIS DE AMBIENTE (.env)
# ====================
def load_env_vars() -> dict:
    """Carrega variáveis do .env e do ambiente do sistema."""
    env_vars = {}

    # 4.1) Carrega .env (se existir)
    if ENV_FILE_PATH.exists():
        logger.info(f"Carregando arquivo .env: {ENV_FILE_PATH}")
        with ENV_FILE_PATH.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip()
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                if value.startswith("'") and value.endswith("'"):
                    value = value[1:-1]
                env_vars[key] = value
                logger.debug(f"Variável de ambiente carregada: {key}")

    # 4.2) Carrega do ambiente do sistema (CI/CD, secrets, etc.)
    system_keys = [
        "META_ADS_ACCESS_TOKEN",
        "META_ADS_APP_ID",
        "META_ADS_AD_ACCOUNT_ID",
        "GOOGLE_ADS_DEVELOPER_TOKEN",
        "GOOGLE_ADS_LOGIN_CUSTOMER_ID",
        "GOOGLE_ADS_CUSTOMER_ID",
        "DATABASE_URL",
        "DATABASE_USER",
        "DATABASE_PASSWORD",
        "DATABASE_HOST",
        "DATABASE_PORT",
        "NOTEBOOK_LM_API_KEY",
        "OBSIDIAN_API_KEY",
        # adicione seus próprios se quiser
    ]

    for key in system_keys:
        value = os.getenv(key)
        if value:
            env_vars[key] = value
            logger.debug(f"Variável '{key}' obtida do ambiente do sistema.")

    return env_vars


# ====================
# 5. SUBSTITUIÇÃO DE PLACEHOLDERS NO YAML
# ====================
def replace_secrets_in_text(text: str, secrets: dict) -> str:
    """Substitui %%VARIAVEL%% e ${VARIAVEL} no texto do YAML, em memória."""
    logger.info("Substituindo placeholders de segredos no YAML...")

    for key, value in secrets.items():
        # Modelo %%VARIÁVEL%% usado no YAML
        placeholder = f"%%{key}%%"
        if placeholder in text:
            text = text.replace(placeholder, value)

        # Modelo ${VARIAVEL}
        if f"${key}" in text:
            text = text.replace(f"${key}", value)

    return text


# ====================
# 6. EXECUÇÃO DO ORQUESTRADOR DE AGENTES (exemplo genérico)
# ====================
def run_agent_squad(config_with_real_secrets: str):
    """Converte YAML (com segredos reais) e chama o orquestrador.

    Aqui você adapta para o seu sistema real (Claude Code, API, etc.).
    """
    logger.info("Iniciando orquestrador de agentes (exemplo genérico)...")
    try:
        # 1) Converte o YAML para dict
        config = yaml.safe_load(config_with_real_secrets)
        logger.info("Configuração de agentes carregada em memória.")

        # 2) Aqui você chama o seu orquestrador real
        # Exemplo genérico:
        # from my_orchestrator import start_squad
        # start_squad(config)

        logger.info("✅ Squad XQuads iniciado com sucesso!")
        print("Squad em operação. Verifique logs/deploy.log para detalhes.")
        return config

    except Exception as e:
        logger.error(f"Erro ao processar/configurar o squad: {e}")
        sys.exit(1)


# ====================
# 7. FUNÇÃO PRINCIPAL
# ====================
def main():
    logger.info("🚀 DEPLOY - XQuads Squad Worldclass (Agentes 24/7)")

    # 1) Lê o YAML como texto
    yaml_text = read_yaml_text()

    # 2) Carrega secrets
    secrets = load_env_vars()

    # 3) Substitui placeholders
    yaml_with_secrets = replace_secrets_in_text(yaml_text, secrets)

    # 4) Executa o squad
    run_agent_squad(yaml_with_secrets)


if __name__ == "__main__":
    main()
    # CHANGELOG – XQuads Squad Worldclass

## [v1.0.0] – 2026-05-25
### Lançamento inaugural

- ✔️ Definição oficial do núcleo de 6 agentes:
  - `@xquads.c_level.coordinator`  
  - `@xquads.advisory.research_analyst`  
  - `@xquads.brand.video_engineer`  
  - `@xquads.brand.copywriter`  
  - `@xquads.advertising.ads_manager`  
  - `@xquads.data.reporter`  

- ✔️ Primeira versão do fluxo de trabalho 1→2→3→4→5→6→7 (início, pesquisa, criação, tráfego, análise, decisão, repetição).  
- ✔️ Criação da estrutura de pastas:
  - `docs/`  
  - `prompts/`  
  - `logs/`  
  - `run_agent_squad.py`  
- ✔️ Implementação de regras de segurança:
  - Segredos separados em `.env`.  
  - Nenhum token no YAML ou no repositório.  
  - Logs sem expor segredos.  

- ✔️ Geração da documentação inicial:
  - `docs/01-...`, `02-...`, `03-...`, `04-...`, `05-...`.  
- ✔️ Adição do script `run_agent_squad.py` e da versão JSON equivalente.

---

## Próximos passos (plano futuro)

- Implementação de CI/CD (GitHub Actions / GitLab CI).  
- Integração direta com APIs de Meta Ads e Google Ads.  
- Monitores de desempenho em tempo real.
- # Arquivos de segredos
.env
.env.*
*.env
.env.local

# Logs
logs/
*.log
*.log.*

# Builds e temporários
__pycache__/
*.pyc
*.pyo
*.pyd
*.so
*.egg-info
dist/
build/
*.whl
*.tgz
*.zip

# IDE / Editor
.vscode/
.idea/
*.sublime-project
*.sublime-workspace
*.swp
*~
*.lock

# Pipenv / Poetry
Pipfile
Pipfile.lock
poetry.lock

# Dependências de Python
venv/
env/
.venv/

    # .env
# NÃO versione este arquivo.
# Configure as variáveis abaixo com seus valores reais.
# As variáveis usadas em YAML/JSON estão listadas com placeholders %%VAR%%.

# Meta Ads
META_ADS_ACCESS_TOKEN=seu_token_aqui
META_ADS_APP_ID=seu_app_id_aqui
META_ADS_AD_ACCOUNT_ID=seu_ad_account_id_aqui

# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN=seu_developer_token_aqui
GOOGLE_ADS_LOGIN_CUSTOMER_ID=seu_customer_login_aqui
GOOGLE_ADS_CUSTOMER_ID=seu_customer_id_aqui

# Banco de dados
DATABASE_URL=postgresql://user:password@host:port/dbname
DATABASE_USER=seu_usuario
DATABASE_PASSWORD=seu_senha
DATABASE_HOST=seu_host
DATABASE_PORT=5432

# Knowledge Base / Outros serviços
NOTEBOOK_LM_API_KEY=seu_notebook_lm_api_key
OBSIDIAN_API_KEY=seu_obsidian_api_key

# Variáveis de sistema (se usar)
LOG_LEVEL=INFO

