# Relatório de testes — rodada 2, 15/09/2026

## ANTES

A entrega anterior tinha 118 testes novos PASS e suíte original PASS, com PK-022/023/024 pendentes. O baseline recebido, logs e relatórios anteriores permanecem em evidencias/ e evidencias/rodada1_documentacao/. Não foram repetidas etapas iniciais nem restaurado backup.

## DEPOIS

**146 testes PASS: os mesmos 118 testes anteriores + 28 novos.** Suíte legada PASS com a preparação do teste contextual de portais ajustada ao novo pré-requisito. Não declarar que o arquivo literalmente anterior passou sem alteração: ele falhou por tentar portal sem input, e foi preservado como evidência.

| Suíte/cenário | Antes desta rodada | Depois |
| --- | --- | --- |
| 118 testes anteriores | PASS | PASS, arquivos preservados |
| Soluções oficiais, variantes e replay | PASS | PASS (27 cenários e 27 replays) |
| 25 → Sol, 15 → Lua, 5 → Sombra | Correto podia funcionar, errado também | Exclusividade validada |
| 18 combinações: seis poderes × três portais | Sem validação de faixa | PASS |
| Três soluções completas da 15 | PASS | PASS |
| Três programas com ramo forçado errado | Brecha | Sem vitória/recompensa; PASS |
| Portal sem input | Fixture permitia | Recusado, PASS |
| Comando em if False e for sem iteração | Presença podia satisfazer objetivo | Recusados, PASS |
| Novos papéis de sprites/cofre | Imagens simbólicas | Catálogo e renderer PASS |
| Navegador real | Bloqueado | Bloqueado novamente; PENDENTE |

Os 28 testes novos estão em tests/final-polish.test.cjs. As verificações diretas de portal usam estado preparado; três testes negativos adicionais executam o programa completo no interpretador. Nos casos errados, são conferidos flag, estado, posição, vidas e/ou ausência de recompensa, conforme o nível do teste.

## Comandos e evidências

```sh
node tests/run-tests.cjs
node --test tests/regression.test.cjs tests/editor-camera.test.cjs tests/ui-integration.test.cjs tests/final-polish.test.cjs
```

`evidencias/rodada2/suite-legada-atualizada.json`: suíte legada ajustada, 27 cenários, matriz das 20 fases, 15 mapas, 23 regressões globais, tutoriais. As contagens de checks declaradas não são testes independentes; alguns cenários usam fixtures.

`evidencias/rodada2/testes-completos.tap`: 146 PASS, 0 FAIL, 0 ignorados. Inclui atividade 12 e conexões nas duas variantes, palavras/inputs, editor, zoom/pan/limites/follow, interface e menu. Os 118 arquivos de teste anteriores não foram editados nesta rodada.

`evidencias/rodada2/suite-original-recebida.cjs`: snapshot da suíte legada antes de ajustar prepareRequirements. Alteração documentada: fornecer poder válido quando o teste isola proximidade de portal. Todas as asserções anteriores foram mantidas.

`evidencias/rodada2/integridade.json`: prova de activities.js e XLSX idênticos à entrega anterior; manifesto de arquivos.

## Arte e visual

Cinco PNGs gerados inspecionados diretamente: guardião, basilisco, pedestal, runa e totem. Todos têm canal alpha transparente e dimensões registradas. Integração usa proporção natural; catálogos, existência de arquivos e papéis do renderer verificados. Revisão CSS manteve menu estreito visível, conteve input-data e ajustou botões.

**Nenhuma renderização real do jogo foi homologada.** O navegador retornou ERR_BLOCKED_BY_CLIENT; adaptadores de DOM/Phaser não medem CSS nem pixels. Não afirmar que botões estão visualmente sempre acessíveis em toda resolução, nem que o estilo final em escala de jogo foi aprovado. A PK-024 permanece aberta.

## Roteiro pendente

Servir a pasta principal com `python -m http.server 8000`. Em Chrome/Edge/Firefox acessível, registrar versões e resoluções 1360×820, 1024×768, 900×600 e estreita. Verificar as 20 fases, especialmente 12 e 15; rodapé com 200 linhas e feedback extenso; input/Enter/ENVIAR/restaurar; zoom e pan nos limites; centralização/follow; menu, transições e sprites em escala real. Capturar antes/depois de portas, baús, runas e guardiões. Registrar resultados nestes documentos, nunca na planilha acadêmica.

PK-022 resolvida documentalmente; PK-023 corrigida e testada; PK-024 pendente. Não foi acrescentado backend, controle manual de Guto, nova atividade ou mudança de mapa.
