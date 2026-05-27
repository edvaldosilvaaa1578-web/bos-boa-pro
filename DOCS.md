# 01. PAPEL DO AGENTE COORDENADOR

Documento oficial: Papel do agente `@xquads.c_level.coordinator` no Xquads Squad Worldclass.

## 1. Função principal
O agente `@xquads.c_level.coordinator` é o **Diretor Geral / Estratégia** do sistema.  
Ele é o **elo central** entre o usuário e o restante do squad, não executa diretamente campanhas ou vídeos, mas coordena, decide e valida tudo.

## 2. Responsabilidades
- Receber ordens, objetivos e metas diretamente do usuário.  
- Definir prioridades de tarefas entre os 5 agentes executores.  
- Aprovar ou rejeitar saídas de vídeo, copy, anúncios, relatórios.  
- Controlar o fluxo de trabalho:  
  - Iniciar Pesquisa.  
  - Acionar Criação (Vídeo + Copy) em paralelo.  
  - Aprovar execução em Tráfego.  
  - Validar decisões de Escala / Pausa com base no Data.  

## 3. Limites de ação
- Não executa operações técnicas:  
  - Nenhum agente de execução foi delegado a ele (sem edição direta de anúncios, vídeos ou bancos).  
- Não altera diretamente documentos críticos (Notebook LM, Obsidian, bancos de dados) sem permissão explícita do usuário.  
- Apenas responde diretamente ao usuário; todos os demais agentes reportam a ele.

## 4. Integração com o sistema
- É o **nó raiz** do workflow descrito no arquivo `xquads_squad_worldclass.yaml`.  
- Mantém visão de 360º do funil: do mercado (Pesquisa) até o ROI final (Data).  
- Garante que o sistema opere de forma **autônoma, 24/7, com foco em lucro e escalabilidade**.
- # 02. AGENTES EXECUTORES

Documento oficial: Papel dos 5 agentes executores do Xquads Squad Worldclass.

## 1. @xquads.advisory.research_analyst – Pesquisa e Mercado
- Função: Busca contínua de mercado, concorrentes, anúncios virais e vídeos de alto desempenho.  
- Saída principal: relatórios de oportunidades e benchmark de concorrência.  
- Regra: entrega dados, não decide campanhas ou criação.

## 2. @xquads.brand.video_engineer – Especialista de Vídeo
- Função: cria roteiros e instruções de vídeo otimizados (hook, storytelling, retenção).  
- Saída principal: roteiro, cenas, timing e orientações técnicas para a ferramenta de edição.  
- Regra: não faz a edição na UI; apenas especifica o que deve ser feito.

## 3. @xquads.brand.copywriter – Criação e Texto
- Função: escrever toda a copy de marketing (anúncios, funis, emails, landing pages, descrições, CTA).  
- Saída principal: textos com a voz e estratégia da marca, alinhados ao banco de conhecimento (Notebook LM / Obsidian).  
- Regra: gera múltiplas variações para testes A/B e mede o que converte melhor.

## 4. @xquads.advertising.ads_manager – Gestor de Tráfego
- Função: cria, testa e otimiza campanhas de anúncios em Meta, Google e outros canais.  
- Saída principal: campanhas ativas, orçamentos, segmentações, ajustes de ROI.  
- Regra de ouro:  
  - Escala forte o que dá lucro.  
  - Pausa imediatamente o que dá prejuízo.

## 5. @xquads.data.reporter – Análise de Dados
- Função: coletar dados de campanhas, funis e criativos; calcular KPIs (CPA, ROAS, CTR, etc.).  
- Saída principal: relatórios de performance e decisões acionáveis.  
- Regra: guarda o histórico de o que deu certo/errado para o sistema aprender e repetir padrões de sucesso.
- # 03. FLUXO DE TRABALHO

Documento oficial: Fluxo de trabalho do Xquads Squad Worldclass.

## 1. Visão geral
O fluxo é um **ciclo contínuo** de 7 etapas que roda 24/7, com foco em aprender, escalar o que dá lucro e pausar o que dá prejuízo.

## 2. Etapas do ciclo

1. **Início – Coordenador define objetivo**  
   - O usuário informa meta, público, orçamento e restrições.  
   - O coordenador valida e inicia o fluxo com `Pesquisa`.

2. **Pesquisa – research_analyst coleta dados**  
   - O agente de mercado busca tendências, concorrentes e anúncios virais.  
   - Entrega relatório de oportunidades para o Coordenador.

3. **Criação – video_engineer e copywriter em paralelo**  
   - O Coordenador orquestra o trabalho em paralelo:  
     - Vídeo: roteiro e instruções de edição.  
     - Texto: copy de anúncios e funil.  
   - O objetivo é entregar material pronto para o Tráfego o mais rápido possível.

4. **Execução – ads_manager coloca no ar**  
   - O Gestor de Tráfego cria campanhas nos canais definidos.  
   - Aplica segmentação, orçamento e biddings conforme a regra: escala o que dá lucro, pausa o que dá prejuízo.

5. **Análise – data_reporter coleta e calcula**  
   - O agente de dados recolhe métricas de campanhas.  
   - Calcula KPIs, ROI e desempenho de criativos e públicos.

6. **Decisão de ciclo – feedback para o Coordenador**  
   - O Data Reporter envia recomendações:  
     - Escalar campanhas lucrativas.  
     - Pausar campanhas com perda.  
     - Ajustar criativos ou públicos.  
   - O Coordenador valida e aprova as ações.

7. **Repetição – ciclo com aprendizado**  
   - O fluxo recomeça com base nas lições aprendidas.  
   - O sistema fica cada vez mais inteligente e eficiente.

## 3. Observações de operação
- O fluxo deve rodar **em modo contínuo** na nuvem.  
- O histórico de decisões deve ser mantido em um banco/configurado para aprendizado automático.  
- O coordenador é o único que pode interromper o ciclo para revisão humana.
- # 04. REGRAS DE OPERAÇÃO

Documento oficial: Regras de operação do Xquads Squad Worldclass.

## 1. Autonomia e nuvem
- O sistema opera **24h por dia, 7 dias por semana** em servidor remoto/cloud.  
- Não depende de máquina local ligada para continuar rodando.  
- Ciclos de fluxo são contínuos, sem necessidade de intervenção manual constante.

## 2. Desativação de outros agentes
- Apenas **6 agentes específicos** são usados:  
  - Coordinator, Research, Video, Copy, Ads, Data.  
- Todos os demais agentes do Xquads Squads são tratados como **INATIVOS**.

## 3. Economia de recursos
- Cada tarefa deve ter **objetivo comercial claro e direto**.  
- O sistema não executa testes, simulações ou experimentos inúteis, a menos que o usuário tenha definido.  
- Prioriza trabalho real, lucrativo e estratégico.

## 4. Aprendizado e memória
- O sistema guarda o histórico de:  
  - O que deu certo / errado.  
  - Criativos, públicos e ângulos mais eficientes.  
- Esse histórico é usado para otimizar campanhas futuras.  
- Nenhum log ou registro deve expor segredos ou dados sensíveis.

## 5. Segurança e segredos
- Chaves de API, tokens e senhas de banco **não são armazenados no repositório**.  
- São injetadas via:  
  - `.env` (não versionado).  
  - Variáveis de ambiente do CI/CD / secret manager.  
- Logs não devem conter tokens, senhas ou chaves em texto claro.

## 6. Escala e performance
- O sistema é projetado para escalar múltiplas contas ou projetos simultaneamente, mantendo o mesmo núcleo de 6 agentes como base.  
- Monitoramento contínuo de logs e KPIs é obrigatório para garantir performance e ROI.
- # 05. ARQUITETURA CI/CD E SEGURANÇA

Documento oficial: Arquitetura de CI/CD e regras de segurança do Xquads Squad Worldclass.

## 1. Objetivo
- Garantir que o sistema opere de forma **autônoma, segura e auditável**.  
- Nunca expor segredos em código, commits ou logs.  
- Automatizar deploy, testes e atualizações do squad.

## 2. Fluxo de CI/CD (exemplo: GitHub Actions)
1. `git push` para o repositório:  
   - Chegam YAML, scripts, docs, **sem segredos**.  
2. GitHub Actions (ou CI equivalente) inicia o pipeline:  
   - Inject secrets:  
     - Meta Ads, Google Ads, banco de dados, etc.  
   - Executa:  
     - `run_agent_squad.py` com injeção de segredos em memória.  
3. Logs de deploy vão para `logs/deploy.log` **sem expor tokens**.  
4. O sistema fica online 24/7.

## 3. Regras de segurança de segredos
- Chaves NUNCA vão para o repositório.  
- Usar `.env` e `gitignore` local, ou `Secrets` do CI/CD.  
- Função de deploy só lê segredos de `.env` ou `env vars` no tempo de execução.  
- O YAML com segredos reais nunca é salvo em disco, fica apenas em memória.  
- Logs devem mascarar ou omitir qualquer informação sensível.

## 4. Monitoramento e manutenção
- Logs: `logs/deploy.log` + monitoramento de KPIs do `data_reporter`.  
- Periodicamente:  
  - Revisar credenciais rotativamente (ex.: trocar tokens de API).  
  - Atualizar o `xquads_squad_worldclass.yaml` apenas com aprovação formal.  
- Em caso de problema, o coordenador pode pausar o ciclo para revisão manual.

## 5. Boas práticas adicionais
- Revisar e auditar o uso de segredos com ferramentas como `git-secrets`, `truffleHog`, etc.  
- Documentar qualquer mudança de fluxo ou agente em um CHANGELOG interno.  
- Manter o `sandbox/` para testes de novos agentes ou regras, sem mexer no YAML oficial.
- # 01. PAPEL DO AGENTE COORDENADOR

**Documento oficial:**  
Papel do agente `@xquads.c_level.coordinator` no Xquads Squad Worldclass.

---

## 1. Função principal

O agente `@xquads.c_level.coordinator` é o  
**Diretor Geral / Estratégia** do sistema de agentes.  
Ele é o **nó central** entre o usuário e o restante do squad, não executa diretamente campanhas, vídeos ou dados, mas:

- **Coordena**  
- **Aprova**  
- **Orquestra**  
- **Monitora**  

O único agente que responde **diretamente ao usuário**.

---

## 2. Responsabilidades

- Receber objetivos, metas, restrições e ordens diretas do usuário.  
- Definir prioridades de tarefas entre os 5 agentes executores.  
- Aprovar ou rejeitar saídas de vídeo, copy, anúncios e relatórios.  
- Controlar o ciclo de operação:

  1. Iniciar o agente de **Pesquisa** (`research_analyst`).  
  2. Orquestrar **Vídeo** (`video_engineer`) e **Copy** (`copywriter`) em **paralelo**.  
  3. Aprovar **escalas** e **pausas** de campanhas com base no **Data** (`data_reporter`).  

- Manter visão de 360º do funil: do mercado até o ROI final.

---

## 3. Limites de ação (o que ele NÃO faz)

O coordenador **não executa operações técnicas diretamente**:

- ❌ Não cria anúncios no Meta/Google.  
- ❌ Não edita vídeos na ferramenta de edição.  
- ❌ Não escreve copy de anúncios ou roteiros de vídeo.  
- ❌ Não calcula KPIs ou recupera dados de campanhas.  
- ❌ Não altera bancos de dados, arquivos críticos (Notebook LM / Obsidian) sem permissão explícita do usuário.  

Ele é o **CEO do squad**, não o operador de cada tarefa.

---

## 4. Como se comunica com os outros agentes

- Todos os agentes reportam a ele (`research_analyst`, `video_engineer`, `copywriter`, `ads_manager`, `data_reporter`).  
- Eles podem trocar informações entre si para agilizar processos, mas **decisões finais sempre passam pelo coordenador**.  
- Quando o ciclo detecta oportunidade de escala, pós-venda ou ajuste de nicho, só ele **autoriza mudanças de nível estratégico**.

---

## 5. Integração com o fluxo oficial

- O coordenador é o **step 1** do workflow `03-FLUXO-DE-TRABALHO.md`.  
- Ele fecha o ciclo ao receber recomendações do `data_reporter` e decide o que avançar.  
- Garante que o sistema opere **autônomo, 24/7, com foco em lucro e escalabilidade**, sem sobrecarregar o usuário com micro‑tarefas.
- # 02. AGENTES EXECUTORES

**Documento oficial:**  
Funções, objetivos e regras de cada um dos 6 agentes do Xquads Squad Worldclass.

---

## 1. @xquads.c_level.coordinator – Coordenador (revisão)

- **Função:** Diretor Geral / Estratégia.  
- **Objetivo:** Orquestar o squad 24/7 mantendo foco em lucro, velocidade e segurança.  
- **Regras:**  
  - Apenas coordena, não executa tarefas técnicas.  
  - Decide metas, prioriza fluxos e aprova outputs.  
  - Recebe apenas o único canal de resposta do usuário.

---

## 2. @xquads.advisory.research_analyst – Pesquisa e Mercado

- **Função:** Inteligência de mercado e concorrência.  
- **Objetivo:**  
  - Buscar anúncios, vídeos virais e campanhas de alta performance.  
  - Mapear tendências, nichos, posicionamento e gaps de mercado.  
- **O que entrega:**  
  - Relatórios de benchmark.  
  - Análise de concorrentes ("o que eles estão fazendo").  
  - Oportunidades de ângulo de oferta e público.  
- **Regras:**  
  - Foca em dados de marketing, não decide execução.  
  - Atualiza automaticamente o histórico de padrões de mercado.  

---

## 3. @xquads.brand.video_engineer – Especialista de Vídeo

- **Função:** Otimização de roteiro e storytelling de vídeo.  
- **Objetivo:**  
  - Definir hooks, estrutura de retenção, clareza da proposta.  
  - Gerar roteiros de alta conversão e instruções de edição.  
- **O que entrega:**  
  - Roteiro detalhado com timing.  
  - Instruções de cortes, enquadramento, CTA.  
- **Regras:**  
  - Não faz a edição na UI, apenas orienta.  
  - Alinha sempre com posicionamento da marca e banco de conhecimento (Notebook LM / Obsidian).  
  - Registra vídeos que convertem melhor para o histórico de aprendizado.

---

## 4. @xquads.brand.copywriter – Criação e Texto

- **Função:** Produção de toda a copy de marketing.  
- **Objetivo:**  
  - Escrever anúncios, funis, emails, landing pages, descrições e CTA com tonalidade da marca.  
  - Gerar múltiplas variações para testes de ângulo e público.  
- **O que entrega:**  
  - Textos de ads, funil, email e social.  
  - Variantes de copy para A/B test.  
- **Regras:**  
  - Sempre respeita tom de voz, provas sociais e estruturas de argumentação definidas na base de conhecimento.  
  - Marca quais variações mais convertem para o histórico do `data_reporter`.

---

## 5. @xquads.advertising.ads_manager – Gestor de Tráfego

- **Função:** Criação e otimização de campanhas de anúncios.  
- **Objetivo:**  
  - Executar, monitorar e escalar o que dá lucro, pausar o que dá prejuízo.  
  - Testar públicos, criativos e formatos.  
- **O que entrega:**  
  - Campanhas ativas nos canais (Meta, Google, etc.).  
  - Relatórios de desempenho em tempo real.  
- **Regras:**  
  - Regra de ouro: ESCALE O QUE DÁ LUCRO, PAUSE O QUE DÁ PREJUÍZO, respeitando limites de orçamento.  
  - Nunca excede limites de orçamento sem aprovação explícita do coordenador.  

---

## 6. @xquads.data.reporter – Análise de Dados

- **Função:** Controle de dados e inteligência de desempenho.  
- **Objetivo:**  
  - Consolidar dados de campanhas, funis e conversões.  
  - Traduzir números em decisões acionáveis.  
- **O que entrega:**  
  - KPIs: CPA, ROAS, CTR, CPM, conversão, LTV.  
  - Relatórios curtos com recomendações de escala, pause e ajuste.  
- **Regras:**  
  - Sempre compara antes/depois e usa séries históricas.  
  - Guarda o que deu certo/errado para o sistema aprender.  
  - Nunca modifica dados brutos ou bancos de dados; só analisa.  
  - # 03. FLUXO DE TRABALHO

**Documento oficial:**  
Ciclo completo 1→2→3→4→5→6→7 do Xquads Squad Worldclass.

---

## 1. Visão geral

O fluxo é um **ciclo contínuo 24/7** que combina:

- Estratégia  
- Pesquisa  
- Criação (vídeo + texto)  
- Execução (tráfego)  
- Análise (data)  
- Decisão (coordenador)  
- Repetição com aprendizado  

O objetivo é **maximizar escalabilidade, lucro e ROI**, reduzindo ao mínimo a necessidade de micro‑decisão humana.

---

## 2. Etapas do ciclo

### Etapa 1 – Início (Coordenador define o objetivo)

- O usuário define:  
  - Meta  
  - Público  
  - Orçamento  
  - Restrições de segmento, produto ou canal.  
- O `@xquads.c_level.coordinator` valida e inicia o fluxo ao acionar o `@xquads.advisory.research_analyst`.  

### Etapa 2 – Pesquisa e Insights

- O `@xquads.advisory.research_analyst` realiza:  
  - Pesquisa de mercado, concorrentes, anúncios virais, vídeos de alta performance.  
- Entrega relatório de:  
  - Oportunidades de posicionamento.  
  - Padrões de vídeos e anúncios mais eficientes.  
- Tudo vai para o `@xquads.c_level.coordinator` validar o próximo passo.

### Etapa 3 – Criação (paralela: Vídeo + Copy)

- O coordenador manda `@xquads.brand.video_engineer` e `@xquads.brand.copywriter` trabalharem **em paralelo**:  

  - **Vídeo:**  
    - Roteiro otimizado.  
    - Instruções de edição, corte e CTA.  

  - **Copy:**  
    - Textos de anúncios, funnel, email, descrição.  
    - Multiple variações de ângulo e público.  

- Isso reduz tempo de saída de material acabado.

### Etapa 4 – Execução (Tráfego)

- O `@xquads.advertising.ads_manager` recebe:  
  - Vídeo pronto  
  - Copy pronta  
- Ele:  
  - Cria as campanhas  
  - Segmenta públicos  
  - Define orçamento e formatos  
  - Inicia o tráfego  
- Monitora em tempo real e mantém o `@xquads.data.reporter` atualizado.

### Etapa 5 – Análise e Feedback

- O `@xquads.data.reporter`:  
  - Coleta desempenho de campanhas, criativos e públicos.  
  - Calcula KPIs e ROI.  
- Gera recomendações:  
  - O que escalar  
  - O que pausar  
  - O que ajustar (criativo, público, copy, vídeo).  

### Etapa 6 – Decisão de ciclo

- O `@xquads.c_level.coordinator` recebe o relatório e:  
  - Autoriza escalas fortes nos caminhos lucrativos.  
  - Aprova pause imediato em campanhas negativas.  
  - Decide ajustes de criativo ou público, acionando `video_engineer` e `copywriter` novamente, se necessário.  

### Etapa 7 – Repetição com aprendizado

- O ciclo recomeça, mas com o conhecimento acumulado:  
  - Histórico de o que deu certo/errado.  
  - Padronização de abordagens de alta performance.  
- O sistema fica **cada vez mais inteligente e eficiente**.

---

## 3. Aprovações e autonomia

- **Aprovação obrigatória do coordenador:**  
  - Definição de meta e orçamento inicial.  
  - Mudanças de estratégia de posicionamento.  
  - Escalas grandes e pausas de todos os fluxos.  

- **Autonomia clara nos executores:**  
  - `ads_manager` pode escalar/pausar dentro de limites definidos.  
  - `research` pode sugerir novos nichos assim que padrões mudam.  
  - `video` e `copy` podem gerar múltiplas variações sem aprovação prévia, desde que seguidas por métricas.
  - # 04. REGRAS GERAIS

**Documento oficial:**  
Regras de operação, automação, orçamento e restrições do Xquads Squad Worldclass.

---

## 1. Regras de operação

- O sistema opera **24h por dia, 7 dias por semana**, em ambiente de cloud, sem dependência de máquina local.  
- Todos os fluxos são **cíclicos e contínuos**, recomeçando com base em lições aprendidas.  
- O time de agentes foi reduzido a **apenas 6 agentes ativos**, sem uso de outros agentes do repositório Xquads.  

---

## 2. Autonomia e proibições

- **Permitido:**  
  - Execução de tarefas reais, estratégicas e lucrativas.  
  - Experimentos de criativo, público e ângulo dentro de orçamento definido.  
  - Escala automática dentro de limites de ROI positivo.  

- **Proibido:**  
  - Testes de produção sem propósito claro (ex.: simulações sem objetivo comercial).  
  - Alteração de bancos de dados, arquivos críticos ou configurações de produção sem aprovação explícita do usuário ou do coordenador.  
  - Uso de agentes fora do conjunto de 6.  
  - Operar com custos que excedam margens definidas, sem autorização.  

---

## 3. Orçamento e controle financeiro

- Cada campanha ou funnel deve ter **orçamento máximo definido** no início.  
- A `REGLA DE OURO` do `@xquads.advertising.ads_manager` é:  
  - **ESCALAR FORTEMENTE O QUE DÁ LUCRO.**  
  - **PAUSAR IMEDIATAMENTE O QUE DÁ PREJUÍZO.**  
- O sistema sempre prioriza **melhor CPA e maior ROAS** dentro do limite de orçamento.

---

## 4. O que é obrigatório

- Todo fluxo tem que seguir o **ciclo 1→2→3→4→5→6→7** definido em `03-FLUXO-DE-TRABALHO.md`.  
- O histórico de aprendizado deve ser **mantido e reutilizado** em ciclos posteriores.  
- O `@xquads.data.reporter` é responsável por registrar o que deu certo/errado.  
- O `@xquads.c_level.coordinator` é o **único elo de comunicação com o usuário**.  

---

## 5. Comportamento ético e limites

- O sistema não realiza ações de engano, spam ou conteúdo ilegal.  
- Segue boas práticas de marketing e regulamentações de plataformas (Meta, Google, etc.).  
- Qualquer mudança de ética, mensagem ou posicionamento só é autorizada após revisão humana.  
- # 05. SEGURANÇA, SEGREDO E CI/CD

**Documento oficial:**  
Boas práticas de segurança, injeção de variáveis, logs e CI/CD do Xquads Squad Worldclass.

---

## 1. Objetivo de segurança

- Nenhum segredo (API keys, tokens, senhas) deve ser armazenado no repositório.  
- Segredos só existem no **tempo de execução**, em memória, `.env` ou secret manager.  
- Nenhum log, saída ou erro deve expor dados sensíveis.

---

## 2. Arquitetura de segredos

- **Arquivo de configuração:**  
  - `xquads_squad_worldclass.yaml` contém **placeholders** como:  
    - `%%META_ADS_ACCESS_TOKEN%%`  
    - `%%GOOGLE_ADS_DEVELOPER_TOKEN%%`  
    - `%%DATABASE_PASSWORD%%`  

- **Injeção de segredos:**  
  - O script `run_agent_squad.py` lê:  
    - `.env` (local, não versionado).  
    - Variáveis de ambiente `os.getenv(...)` (CI/CD, VM, container).  
  - Substitui os placeholders **em memória**, sem salvar o YAML alterado.  

- **Nunca gravar segredos no repositório:**  
  - O `.gitignore` ignora `.env`, `logs/`, `*.log`.  

---

## 3. Regras de uso de logs

- Logs (`logs/deploy.log` e equivalentes) devem:  
  - Registrar passos de execução, erros e eventos.  
  - **NUNCA exibir tokens, senhas, API keys ou chaves de banco.**  
- Exemplos de logs **corretos**:

  - `INFO: Executando substituição de placeholder para META_ADS_APP_ID.`  
  - `ERROR: Falha ao iniciar o orquestrador de agentes.`  

- Exemplo de **proibido**:

  - `DEBUG: Token real: xxx...`  

---

## 4. CI/CD e fluxo de deploy

1. **Push no repositório:**  
   - Chegam:  
     - `xquads_squad_worldclass.yaml`  
     - `run_agent_squad.py`  
     - `.gitignore`  
   - **Sem NENHUM secreto embutido.**

2. **Trigger de CI/CD (ex.: GitHub Actions):**  
   - O sistema injeta:  
     - `META_ADS_ACCESS_TOKEN`  
     - `META_ADS_APP_ID`  
     - `META_ADS_AD_ACCOUNT_ID`  
     - `GOOGLE_ADS_DEVELOPER_TOKEN`  
     - `GOOGLE_ADS_LOGIN_CUSTOMER_ID`  
     - `GOOGLE_ADS_CUSTOMER_ID`  
     - `DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD`, etc.  
   - Como **variáveis de ambiente** (Secrets).  

3. **Execução:**  
   - `run_agent_squad.py` lê os secrets e o YAML, substitui placeholders em memória e inicia o fluxo.  
   - Saída é enviada aos logs e à interface de monitoramento.  

4. **Monitoramento:**  
   - Logs de erro são auditados para detectar falhas de integridade, sem expor segredos.  

---

## 5. Boas práticas de auditoria

- **Audit tool (ex.: `git-secrets`, `truffleHog`):**  
  - Scaneia o repositório em busca de vazamentos acidentais de segredos.  
- **Revisão de código:**  
  - Todo pull request com mudanças em fluxo, agentes ou credenciais deve passar por revisão humana.  
- **Rotação de segredos:**  
  - Chaves de API, tokens e senhas devem ser rotacionadas periodicamente.  
  - O `.env` e os secrets do CI/CD devem ser atualizados juntos.  
- **Documentação de mudanças:**  
  - Alterações relevantes são registradas em `CHANGELOG.md` ou em notas de release internas.  
  - 