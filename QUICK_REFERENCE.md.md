## 📄 `QUICK_REFERENCE.md` – Cartão de Consulta Rápida
# QUICK_REFERENCE.md

## Cartão de Consulta Rápida  
**XQuads Squad Worldclass – Agência de IA 24/7**

Este é o seu **guia rápido do dia a dia**, com os comandos e documentos mais usados.

---

## 1. Comandos principais (dias de uso)

```bash
# Instalação
make setup

# Testes
make test
make coverage

# Qualidade de código
make lint
make format

# Limpeza
make clean

# Ajuda
make help

# Rodar o squad
python3 run_agent_squad.py

# Ver logs em tempo real
tail -f logs/deploy.log

# Ver últimos 100 linhas do log
tail -n 100 logs/deploy.log

# Parar squad (terminar processo)
Ctrl+C

# Parar squad (systemd)
sudo systemctl stop xquads-squad

# Iniciar squad (systemd)
sudo systemctl start xquads-squad

# Ver status do serviço
sudo systemctl status xquads-squad
```

---

## 2. Documentos principais (quando usar)

| Documento | Quando usar |
|-----------|-------------|
| `README.md` | Primeira visita ao projeto, lembrar comandos básicos. |
| `RUNBOOK.md` | Operação diária, iniciar, pausar, ajustar orçamento, troubleshooting. |
| `DEPLOY_CHECKLIST.md` | Antes do primeiro deploy, antes de subir para produção. |
| `ARCHITECTURE.md` | Entender arquitetura, fluxos, segredos, CI/CD. |
| `docs/01-PAPEL-DO-AGENTE-COORDENADOR.md` | Entender papel do Coordenador. |
| `docs/02-AGENTES-EXECUTORES.md` | Entender papel dos 6 agentes. |
| `docs/03-FLUXO-DE-TRABALHO.md` | Entender ciclo 1→2→3→4→5→6→7. |
| `docs/05-SEGURANCA-E-CICD.md` | Entender segurança, segredos, CI/CD. |
| `prompts/*.md` | Rever prompts de cada agente. |
| `SUMMARY.md` | Ver lista completa de todos os arquivos. |
| `DOCS_INDEX.md` | Ver índice unificado de toda documentação. |

---

## 3. Rotina diária (checklist mínimo)

### 3.1. Manhã

- [ ] Ver logs:
  ```bash
  tail -n 100 logs/deploy.log
  ```
- [ ] Verificar KPIs (CPA, ROAS, CTR, CPM).  
- [ ] Confirmar que squad está rodando.

### 3.2. Tarde

- [ ] Revisar campanhas ativas.  
- [ ] Ajustar orçamento se necessário.  
- [ ] Pedir novos criativos se performance cair.

### 3.3. Noite

- [ ] Verificar logs novamente.  
- [ ] Garantir que squad continua rodando.  
- [ ] Registrar observações.

---

## 4. Troubleshooting rápido

| Problema | Ação rápida |
|----------|-------------|
| Erro ao ler YAML | `yamllint xquads_squad_worldclass.yaml` |
| Erro ao carregar segredos | Verificar `.env` e CI secrets |
| Squad parou | `python3 run_agent_squad.py` (re-iniciar) |
| CPA alto / ROAS baixo | Pausar campanhas ruins, testar novos criativos |
| Erro de API | Verificar status da API, renovar token |

---

## 5. Agentes principais (resumo)

| Agente | Função |
|--------|--------|
| `@xquads.c_level.coordinator` | Diretor Geral / Estratégia – coordena tudo. |
| `@xquads.advisory.research_analyst` | Pesquisa de mercado, concorrentes, anúncios virais. |
| `@xquads.brand.video_engineer` | Roteiros e instruções de vídeo. |
| `@xquads.brand.copywriter` | Copy de anúncios, funis, emails. |
| `@xquads.advertising.ads_manager` | Gestão de tráfego, campanhas, otimização. |
| `@xquads.data.reporter` | KPIs, dados, decisões de escala/pausa. |

---

## 6. KPIs principais (monitorar)

| KPI | O que é | O que fazer |
|-----|---------|-------------|
| CPA | Custo por Aquisição | Se alto → pausar, ajustar público/criativo. |
| ROAS | Retorno sobre gasto em anúncios | Se baixo → rever oferta, copy, vídeo. |
| CTR | Taxa de cliques | Se baixo → melhorar hook, copy, criativo. |
| CPM | Custo por mil impressões | Se alto → revisar público, bid. |

---

## 7. Estrutura de pastas (resumo)

```bash
xquads_squad_worldclass/
├── .env (não versionado)
├── run_agent_squad.py
├── xquads_squad_worldclass.yaml
├── README.md
├── RUNBOOK.md
├── DEPLOY_CHECKLIST.md
├── ARCHITECTURE.md
├── SUMMARY.md
├── DOCS_INDEX.md
├── QUICK_REFERENCE.md (este arquivo)
├── docs/
├── prompts/
├── tests/
├── logs/
└── .github/workflows/
```

---

## 8. Regra de ouro do sistema

> **ESCALAR FORTEMENTE O QUE DÁ LUCRO.**  
> **PAUSAR IMEDIATAMENTE O QUE DÁ PREJUÍZO.**

---

## 9. Regras de segurança (nunca esquecer)

- Nunca gravar segredos no repositório.  
- Nunca expor segredos em logs.  
- Injetar segredos apenas no tempo de execução (`.env`, CI secrets).  
- Usar `make setup`, `make test`, `make coverage` antes de deploy.

---

Este `QUICK_REFERENCE.md` é o seu **cartão de consulta rápida do dia a dia**.
