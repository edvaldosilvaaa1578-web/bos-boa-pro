## 📄 `CARTELA_BOLSO.md` – Cartão de Bolso (Tabela Única)
# CARTELA_BOLSO.md

## Cartão de Bolso – XQuads Squad Worldclass  
**Agência de IA 24/7 – Guia Único de Operações**

---

## Tabela Única de Referência Rápida

| Categoria | Item | Comando / Documento | Quando usar |
|-----------|------|---------------------|-------------|
| **Instalação** | Setup | `make setup` | Primeira vez ou após clonar. |
| **Testes** | Testes unitários | `make test` | Antes de cada commit / deploy. |
| | Cobertura | `make coverage` | Para verificar cobertura ≥ 70%. |
| **Qualidade** | Lint | `make lint` | Antes de commit / push. |
| | Formatar | `make format` | Antes de commit / push. |
| **Limpeza** | Limpar caches | `make clean` | Periodicamente, antes de deploy. |
| **Ajuda** | Ajuda | `make help` | Para ver todos os comandos disponíveis. |
| **Rodar Squad** | Iniciar | `python3 run_agent_squad.py` | Para iniciar o squad. |
| **Logs** | Ver logs em tempo real | `tail -f logs/deploy.log` | No dia a dia, monitorando operação. |
| | Últimas 100 linhas | `tail -n 100 logs/deploy.log` | Para ver histórico recente. |
| **Parar Squad** | Parar (terminal) | `Ctrl+C` | Quando rodando em terminal. |
| | Parar (systemd) | `sudo systemctl stop xquads-squad` | Quando rodando como serviço. |
| | Iniciar (systemd) | `sudo systemctl start xquads-squad` | Para reiniciar serviço. |
| | Status | `sudo systemctl status xquads-squad` | Para verificar se está ativo. |
| **Validação** | Validar YAML | `yamllint xquads_squad_worldclass.yaml` | Antes de deploy, após mudar YAML. |
| **Documentação** | Guia inicial | `README.md` | Primeira visita ao projeto. |
| | Operação diária | `RUNBOOK.md` | Dia a dia, treinar operadores, troubleshooting. |
| | Deploy | `DEPLOY_CHECKLIST.md` | Antes do primeiro deploy. |
| | Arquitetura | `ARCHITECTURE.md` | Entender arquitetura, segredos, CI/CD. |
| | Agentes | `docs/02-AGENTES-EXECUTORES.md` | Entender papel dos 6 agentes. |
| | Coordenador | `docs/01-PAPEL-DO-AGENTE-COORDENADOR.md` | Entender papel do Coordenador. |
| | Fluxo | `docs/03-FLUXO-DE-TRABALHO.md` | Entender ciclo 1→7. |
| | Segurança | `docs/05-SEGURANCA-E-CICD.md` | Entender segredos e CI/CD. |
| | Prompts | `prompts/*.md` | Rever prompts de cada agente. |
| | Arquivos | `SUMMARY.md` | Ver todos os arquivos do projeto. |
| | Docs | `DOCS_INDEX.md` | Índice de toda documentação. |
| | Bolso | `CARTELA_BOLSO.md` | Este cartão de bolso. |
| **Agentes** | Coordenador | `@xquads.c_level.coordinator` | Diretor Geral – coordena tudo. |
| | Pesquisa | `@xquads.advisory.research_analyst` | Pesquisa de mercado, concorrentes. |
| | Vídeo | `@xquads.brand.video_engineer` | Roteiros e instruções de vídeo. |
| | Copy | `@xquads.brand.copywriter` | Copy de anúncios, funis, emails. |
| | Ads | `@xquads.advertising.ads_manager` | Gestão de tráfego, campanhas. |
| | Dados | `@xquads.data.reporter` | KPIs, decisões de escala/pausa. |
| **KPIs** | CPA | Custo por Aquisição | Se alto → pausar, ajustar público/criativo. |
| | ROAS | Retorno sobre gasto em anúncios | Se baixo → revisar oferta, copy, vídeo. |
| | CTR | Taxa de cliques | Se baixo → melhorar hook, copy, criativo. |
| | CPM | Custo por mil impressões | Se alto → revisar público, bid. |
| **Troubleshooting** | Erro YAML | `yamllint xquads_squad_worldclass.yaml` | Corrigir erros de sintaxe. |
| | Erro segredos | Verificar `.env`, CI secrets |tokens faltando, variáveis erradas. |
| | Squad parou | `python3 run_agent_squad.py` | Re-iniciar squad. |
| | CPA alto | Pausar campanhas ruins, testar novos criativos | Performance ruim. |
| | Erro API | Verificar status da API, renovar token | Token expirado, API fora do ar. |
| **Rotina** | Manhã | `tail -n 100 logs/deploy.log`, KPIs | Verificar logs, KPIs, squad ativo. |
| | Tarde | Revisar campanhas, ajustar orçamento | Ajustar orçamento, pedir criativos. |
| | Noite | Ver logs, registrar observações | Garantir squad ativo, registrar. |
| **Regras de Ouro** | Regra principal | **ESCALAR FORTEMENTE O QUE DÁ LUCRO. PAUSAR IMEDIATAMENTE O QUE DÁ PREJUÍZO.** | Sempre. |
| **Segurança** | Regras | Nunca salvar segredos no repositório. Nunca expor segredos em logs. Injetar segredos apenas no tempo de execução. | Sempre. |

---

## Frase de Emergência

> **Se CPA subir muito ou ROAS cair muito:**
> 1. Pausar campanhas ruins imediatamente.  
> 2. Pedir novos criativos (vídeo + copy).  
> 3. Ajustar público / segmentação.  
> 4. Reavaliar oferta e copy.

---

Este `CARTELA_BOLSO.md` é seu **guia único de operações**, pronto para imprimir e colar na parede.