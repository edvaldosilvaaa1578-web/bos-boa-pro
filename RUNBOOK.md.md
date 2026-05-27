## 📄 `RUNBOOK.md` – Guia de Operação Diária
# RUNBOOK.md

## Runbook de Operação Diária – XQuads Squad Worldclass  
**Agência de IA 24/7 – Guia de Operação, Monitoramento e Troubleshooting**

Este documento é o **guia operacional diário** para quem opera o squad XQuads.

- Como iniciar o squad.  
- Como pausar.  
- Como ajustar orçamento e metas.  
- Como ler logs e KPIs.  
- O que fazer em caso de erro.

---

## 1. Visão geral do sistema

O sistema é composto por:

- **6 agentes**:
  1. `@xquads.c_level.coordinator` – Diretor Geral / Estratégia.  
  2. `@xquads.advisory.research_analyst` – Pesquisa e Mercado.  
  3. `@xquads.brand.video_engineer` – Especialista de Vídeo.  
  4. `@xquads.brand.copywriter` – Criação e Texto.  
  5. `@xquads.advertising.ads_manager` – Gestor de Tráfego.  
  6. `@xquads.data.reporter` – Análise de Dados.  

- **Script principal**:
  - `run_agent_squad.py`  
  - Lê YAML, carrega `.env`, inicia o squad.

- **Logs**:
  - `logs/deploy.log`  
  - Registro de tudo que o squad faz.

- **Configuração**:
  - `xquads_squad_worldclass.yaml`  
  - Prompts, fluxos, regras, placeholders de segredos.

---

## 2. Iniciar o Squad

### 2.1. Pré-requisitos

Antes de iniciar:

- [ ] `.env` preenchido com chaves reais.  
- [ ] Dependências instaladas:
  ```bash
  make setup
  ```
- [ ] Testes locais passados:
  ```bash
  make test
  make coverage
  ```

### 2.2. Iniciar Localmente

Na raiz do projeto:

```bash
python3 run_agent_squad.py
```

Saída esperada:

```text
🚀 DEPLOY - XQuads Squad Worldclass (Agentes 24/7)
INFO | Lendo arquivo de configuração: xquads_squad_worldclass.yaml
INFO | Substituindo placeholders de segredos no YAML...
INFO | Iniciando orquestrador de agentes...
✅ Squad XQuads iniciado com sucesso!
Squad em operação. Verifique logs/deploy.log para detalhes.
```

### 2.3. Iniciar em Produção (Cloud / Servidor)

Depende do seu ambiente:

- **Exemplo 1 – Servidor com systemd**:
  ```bash
  sudo systemctl start xquads-squad
  ```
- **Exemplo 2 – Docker**:
  ```bash
  docker-compose up -d
  ```
- **Exemplo 3 – Script manual**:
  ```bash
  python3 run_agent_squad.py
  ```

---

## 3. Monitoramento Diário

### 3.1. Ver Logs em Tempo Real

```bash
tail -f logs/deploy.log
```

Saída típica:

```text
2026-05-26 05:00:00 | INFO | DEPLOY - XQuads Squad Worldclass (Agentes 24/7)
2026-05-26 05:00:01 | INFO | Lendo arquivo de configuração: xquads_squad_worldclass.yaml
2026-05-26 05:00:02 | INFO | Substituindo placeholders de segredos no YAML...
2026-05-26 05:00:03 | INFO | Iniciando orquestrador de agentes...
2026-05-26 05:00:04 | INFO | Squad XQuads iniciado com sucesso!
```

Foco:

- Mensagens `INFO` → funcionamento normal.  
- Mensagens `WARNING` → atenção, mas não crítico.  
- Mensagens `ERROR` → problema que precisa de ação.

### 3.2. Verificar KPIs

O `@xquads.data.reporter` calcula e envia:

- CPA (Custo por Aquisição).  
- ROAS (Return on Ad Spend).  
- CTR (Click-Through Rate).  
- CPM (Custo por Mil Impressões).  
- Taxa de conversão.  
- LTV (Lifetime Value).

**Onde ver:**

- No dashboard da plataforma de anúncios (Meta Ads, Google Ads).  
- Nos relatórios enviados pelo `data_reporter` para o coordenador.  
- Em planilhas ou BI conectado ao banco de dados.

**Regras básicas:**

- Se **CPA > limite definido** → pausa ou ajuste de público/criativo.  
- Se **ROAS < mínimo aceitável** → reavaliar oferta, copy, vídeo.  
- Se **CTR baixo** → melhorar hook, copy, criativo.  
- Se **CPM muito alto** → revisar público, bid, segmentação.

---

## 4. Ajustar Orçamento e Metas

### 4.1. Ajustar Orçamento Diário

O orçamento é definido:

- No YAML (limites máximos).  
- E/ou no orquestrador / dashboard de anúncios.

**Passos:**

1. Definir novo orçamento máximo por campanha/dia.  
2. Informar ao `@xquads.c_level.coordinator`:
   - Ex.: “Aumentar orçamento de R$ 100 para R$ 200 por dia na campanha X.”  
3. O coordenador avalia e autoriza:
   - Se dentro das regras → aplica.  
   - Se fora das regras → pede confirmação humana.

### 4.2. Ajustar Meta de ROI / ROAS

Ex.: mudar de “ROAS mínimo 3x” para “ROAS mínimo 5x”.

**Passos:**

1. Definir nova meta.  
2. Comunicar ao coordenador:
   - Ex.: “Nova meta: ROAS mínimo 5x a partir de hoje.”  
3. O coordenador ajusta:
   - Critérios de escala/pausa.  
   - Estratégia de campanhas.

---

## 5. Pausar o Squad

### 5.1. Pausar Parcialmente (Campanha / Canal)

- No Meta Ads / Google Ads:
  - Pausar campanhas específicas.  
- Ou comunicar ao coordenador:
  - Ex.: “Pausar campanha X no Meta Ads.”

### 5.2. Pausar Totalmente (Squad Inteiro)

**Opção 1 – Parar o processo:**

```bash
# Se rodando em terminal:
Ctrl+C

# Se rodando como serviço:
sudo systemctl stop xquads-squad
```

**Opção 2 – Parar via comando:**

Se você tiver um script adicional de parada:

```bash
python3 stop_squad.py
```

**Opção 3 – Remover permissão de execução:**

- No orquestrador, desativar o squad.  
- Ou remover permissão do coordenador para iniciar novos ciclos.

---

## 6. Troubleshooting – O que fazer em caso de erro

### 6.1. Erro ao Ler YAML

**Sintomas:**

```text
ERROR | Erro ao ler o YAML: ...
```

**Causas comuns:**

- YAML corrompido.  
- Sintaxe errada (indentação, chaves, aspas).

**Ação:**

1. Rodar:
   ```bash
   yamllint xquads_squad_worldclass.yaml
   ```
2. Corrigir erros relatados.  
3. Rodar:
   ```bash
   make test
   ```
4. Re-iniciar o squad.

---

### 6.2. Erro ao Carregar Segredos

**Sintomas:**

```text
ERROR | Falha ao ler .env, continuando com o ambiente do sistema: ...
ERROR | Variável 'META_ADS_ACCESS_TOKEN' não encontrada.
```

**Causas comuns:**

- `.env` não existe.  
- Variáveis faltando no `.env`.  
- Secrets do CI/CD não configurados.

**Ação:**

1. Verificar `.env`:
   ```bash
   cat .env
   ```
2. Confirmar que todas as variáveis necessárias existem.  
3. Se CI/CD:
   - Verificar **Settings → Secrets** no GitHub.  
4. Re-iniciar o squad.

---

### 6.3. Erro de Conexão com API (Meta/Google/DB)

**Sintomas:**

```text
ERROR | Falha ao conectar com Meta Ads API: ...
ERROR | Timeout ao conectar ao banco de dados.
```

**Causas comuns:**

- Token expirado.  
- Chave inválida.  
- Servidor/API fora do ar.  
- Problema de rede.

**Ação:**

1. Verificar status da API:
   - Meta: https://developers.facebook.com/status/  
   - Google: https://www.google.com/appsstatus/  
2. Renovar token/chave se expirado.  
3. Re-iniciar o squad após nova configuração.

---

### 6.4. CPA Alto / ROAS Baixo

**Sintomas:**

- CPA > limite definido.  
- ROAS < mínimo aceitável.

**Ação:**

1. Verificar criativos (vídeo, copy).  
2. Revisar público (segmentação).  
3. Pedir ao coordenador:
   - “Reduzir orçamento, pausar campanhas ruins, testar novos criativos.”  
4. Acionar `research_analyst` para nova pesquisa de mercado.  
5. Acionar `video_engineer` e `copywriter` para novos criativos.

---

### 6.5. Squad Parou de Operar

**Sintomas:**

- Nenhum log novo em `logs/deploy.log`.  
- Processo não está rodando.

**Ação:**

1. Verificar se o processo está ativo:
   ```bash
   ps aux | grep run_agent_squad
   ```
2. Se não estiver:
   - Re-iniciar:
     ```bash
     python3 run_agent_squad.py
     ```
3. Se usar serviço:
   ```bash
   sudo systemctl restart xquads-squad
   ```
4. Verificar logs:
   ```bash
   tail -f logs/deploy.log
   ```

---

## 7. Rotinas Diárias

### 7.1. Rotina da Manhã

- [ ] Verificar logs:
  ```bash
  tail -n 100 logs/deploy.log
  ```
- [ ] Verificar KPIs:
  - CPA, ROAS, CTR, CPM.  
- [ ] Confirmar que:
  - Squad está rodando.  
  - Não há erros críticos.

### 7.2. Rotina da Tarde

- [ ] Revisar campanhas ativas.  
- [ ] Ajustar orçamento se necessário.  
- [ ] Pedir novos criativos se performance cair.

### 7.3. Rotina da Noite

- [ ] Verificar logs novamente.  
- [ ] Garantir que:
  - Squad continua rodando.  
  - Não há erros críticos.  
- [ ] Registrar observações em `CHANGELOG.md` ou anotações internas.

---

## 8. Lista de Comandos Rápidos

```bash
# Iniciar squad
python3 run_agent_squad.py

# Ver logs em tempo real
tail -f logs/deploy.log

# Ver últimos 100 linhas do log
tail -n 100 logs/deploy.log

# Parar squad (se rodando em terminal)
Ctrl+C

# Parar squad (systemd)
sudo systemctl stop xquads-squad

# Iniciar squad (systemd)
sudo systemctl start xquads-squad

# Ver status do serviço
sudo systemctl status xquads-squad

# Testes locais
make test
make coverage

# Lint e format
make lint
make format

# Instalação
make setup
```

---

## 9. Contato e Suporte

- **Responsável técnico**: [Seu nome / equipe].  
- **Canal de comunicação**: [Slack, Discord, e-mail].  
- **Horário de atenção**: [24/7, horário comercial, etc.].

---

Este runbook é o **guia oficial de operação diária** do XQuads Squad Worldclass.
