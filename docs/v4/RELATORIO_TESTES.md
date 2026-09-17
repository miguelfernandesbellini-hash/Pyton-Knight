# Relatório técnico de testes — V4

17/09/2026. Node.js 24.19.0. **Resultado final: 269/269 PASS, zero falhas e zero testes ignorados.** Baseline preservado: 221 testes (146 históricos + 75 V3). Adicionados 48 testes V4. A suíte legada separada também retornou PASS.

## Execução e evidências

```bash
node --test --test-reporter=tap tests/*.test.cjs
node tests/run-tests.cjs
node tools/v3/audit.cjs --v4
node tools/v4/audit-coins.cjs
```

| Verificação | Resultado | Evidência |
|---|---|---|
| Suítes automatizadas, incluindo UI adaptada | 269 PASS | [suite-final.tap](evidencias/suite-final.tap) |
| Compatibilidade histórica | PASS | [suite-legada.json](evidencias/suite-legada.json) |
| Mapas e variantes no interpretador real | 20 atividades / 29 cenários PASS | [auditoria.json](evidencias/auditoria.json) |
| Pistas e requisitos removidos isoladamente | 69 recusas corretas | [auditoria.json](evidencias/auditoria.json) |
| Acesso físico às moedas | 145 verificações / 100 IDs únicos PASS | [auditoria-moedas.json](evidencias/auditoria-moedas.json) |
| Arte e plantas estáticas | 20 plantas / 4 pranchas inspecionadas | [visual](evidencias/visual/) |
| Homologação interativa no navegador | PENDENTE: ERR_BLOCKED_BY_CLIENT | [relatório visual](HOMOLOGACAO_VISUAL.md) |

`tests/v4-gameplay.test.cjs`: 35 testes. `tests/v4-ui.test.cjs`: 10 testes. `tests/v4-audit.test.cjs`: 3 testes. Os testes anteriores continuam executando o catálogo correspondente à sua versão; os novos testes usam exatamente a sequência de catálogos carregada pelo navegador V4.

## Cobertura dos requisitos solicitados

| Itens do prompt | O que foi verificado |
|---|---|
| 1–5 · Orçamento | Programa acima do limite anda, ilumina, investiga e abre mecanismos; chega ao cristal sem concluir/recompensar/desbloquear; feedback de otimização com uso/limite; programa otimizado conclui; todas as 20 possuem limite |
| 6–8 · Condição e conteúdo do modal | Ausente em execução incompleta ou acima do limite; objetivos e regras obtidos somente da fase corrente; sem conceitos de outras atividades |
| 9–13 · Estatísticas | Vidas, tentativas reais, moedas persistentes, baús abertos/total quando presentes e contagem semântica exata |
| 14–15 · Ações do modal | Retry limpa a partida e não duplica XP/moedas; próxima carrega a fase desbloqueada; A20 retorna ao menu |
| 16–18 · Identidade e crédito | Exatamente 5 moedas por fase, 100 IDs únicos; crédito imediato e idempotente; coleta remota recusada |
| 19–24 · Persistência | EXECUTAR, REINICIAR, morte, saída/retorno, conclusão/replay e novo carregamento do serviço mantêm a moeda coletada e invisível |
| 25–26 · Opcionalidade e limite | Soluções completam todas as fases com moedas removidas do fixture; coletar todas rende 100, repetir/recarregar não aumenta; migração separa crédito legado |
| 27–29 · Investigação | ! surge próximo/visível, desaparece longe/lido; decoração não interage; luz não lê; examinar registra texto e Diário |
| 30–32 · Arte e colisão | Soluções/geometria/posições críticas iguais à V3; sem nova colisão nas fases; bloqueio sólido sintético não tira vida; PNGs dos totens e estados OFF/ON sincronizados com a ponte |
| 33 · Regressão | Soluções, variantes, desbloqueios sequenciais, XP por vidas, baús, chave, pistas, orçamento, animações e recompensas |

## Detalhes dos cenários

A12 possui duas variantes; A15, A18, A19 e A20 possuem três. Os três ramos do julgamento e as três posições da chave de cada atividade de busca passam pelo mesmo parser/interpreter da produção. A alternativa legítima de acumulador renomeado, soma explícita e `range` com início/passo continua aceita. O orçamento não impõe contagem de linhas.

Na auditoria de moedas, snapshots são obtidos de execuções oficiais bem-sucedidas. Os desvios são percorridos pelas APIs reais de movimento e perigo, sem abrir portas artificialmente e sem sofrer dano. Cada cenário possui pelo menos duas moedas fora do percurso oficial. A auditoria respeita as variantes de medo da A18; regiões de módulos inativos não são tratadas como letais quando a própria configuração não prevê dano.

## Regressões e preservação

Nenhuma regressão aberta nos casos executados. Os 20 programas oficiais são comparados com a V3 e executados sem alteração. O parser, os dados V3 e as imagens de paredes são conferidos por integridade. O Plano_e_Fluxo_de_Testes acadêmico não foi editado; a presente documentação não altera seus casos, resultados ou status acadêmicos.

Limite da evidência: adaptadores DOM/Phaser verificam lógica e propriedades, sem renderizar CSS ou medir fluidez. A suíte não encerra PK-024 nem substitui playtest com alunos.
