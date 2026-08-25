# Relatório Técnico de Implementação — Pyton Knight

Data: 22 de agosto de 2026

## Resultado

A base Phaser foi evoluída de 5 para 20 atividades sem troca de engine. A Unidade 1, seus mapas, barreiras, assets e progressão foram preservados; a API de movimento foi migrada para orientação relativa. As novas unidades compartilham parser, runtime, objetivos, mecanismos e persistência.

## Arquitetura e decisões

- `activities.js` concentra configuração declarativa de mapas, objetivos, tutoriais, limites, entidades e soluções.
- O parser produz AST e análise semântica; não há `eval()` nem execução arbitrária.
- O runtime valida sintaxe, conceito, whitelist e orçamento antes de executar.
- Estado da tentativa é separado do estado persistente.
- Objetivos avaliam resultado e estado, não igualdade textual de código.
- Mecânicas usam entidades configuráveis e conexões reutilizáveis.

## Sistemas implantados

- M31 movimento orientado; M32 execução/reset; M33 vidas.
- M34 bolsa persistente; M35 XP por desempenho.
- M36 objetivos e restrições; M37 orçamento semântico.
- Parser de variáveis, I/O, condicionais, sensores, `for`, `range`, `while` e `break`.
- Guardas de 600 instruções e 100 iterações por laço.

## Mecânicas efetivamente usadas

M01, M02, M03, M05, M06, M07, M08, M09, M12, M14, M17, M18, M19, M20, M21, M22, M23, M24, M26, M30 e M31–M37.

## Problemas, causas e soluções

| Problema | Causa | Solução |
|---|---|---|
| Código incompleto parecia colisão | término e falha física misturados | `INCOMPLETE_EXECUTION` independente de `WALL_COLLISION` |
| Segunda execução carregava estado | reset parcial | reconstrução integral da tentativa antes da AST |
| Movimento acoplado ao mapa | direções absolutas | orientação explícita e três comandos relativos |
| Recompensas duplicáveis | sem registro por atividade | `rewardedActivities` e replay idempotente |
| Loop infinito | laço sem guarda | limites de iterações e instruções |
| Alternativas rejeitadas | validação textual | AST, estado e objetivos declarativos |
| Aritmética inválida virava `NaN` | coerção implícita | validação de tipos e `SEMANTIC_ERROR` |

## Evidência

- 20 atividades e 25 cenários oficiais/variantes: PASS.
- 300 verificações obrigatórias (15 em cada atividade): PASS.
- 25 reexecuções com reset, código preservado e recompensa estável: PASS.
- Tutoriais 1, 6, 11 e 16: PASS etapa por etapa.
- 19 regressões globais: PASS.
- Sintaxe dos JavaScripts autorais e referências de `index.html`: PASS.

## Pendências reais

- Homologação visual manual em navegador real.
- Substituição dos símbolos provisórios quando houver arte final.
- Rebalanceamento após playtests com alunos.
