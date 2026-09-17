# Relatório de testes — 14–15/09/2026

## Resultado geral

**Suíte original: PASS. Novos testes: 118 PASS / 0 FAIL / 0 ignorados.** Homologação visual e compatibilidade: PENDENTES. Não foram realizados testes com público-alvo. O resultado não equivale à aprovação integral dos 39 casos acadêmicos, que permanecem intactos na planilha.

## ANTES DAS ALTERAÇÕES

Backup concluído antes de editar. `evidencias/BASELINE.md`, `suite_original.json` e `sondagens.json` registram o estado inicial. A suíte recebida já passava: 27 cenários oficiais + 27 replays; matriz de 20 atividades com 15 verificações declaradas; 15 mapas reelaborados com 14 verificações declaradas; 23 regressões globais; 14 microetapas distribuídas em quatro tutoriais.

Essas contagens são as declaradas pela suíte, não centenas de testes independentes adicionais. Algumas verificações de perigo usam fixtures sintéticas: não demonstram perigo natural em cada fase.

As sondagens adicionais reproduziram rejeição de indentação de dois espaços/comentários, espaços externos nas palavras, int vazio/decimal textual, int numérico fracionário e coerções indevidas de range/comparações. AURORA e CORAGEM exatas já funcionavam. A alegação genérica de que todo bloco de quatro espaços falhava não foi reproduzida.

Livro/feedback sem limites, orientação, objetivos e câmera foram auditados por leitura do código. Não existe captura real “antes” gerada nesta execução.

## DEPOIS DAS ALTERAÇÕES

Comandos a executar na pasta principal:

```sh
node tests/run-tests.cjs
node --test tests/regression.test.cjs tests/editor-camera.test.cjs tests/ui-integration.test.cjs
```

O jogo não requer Node; Node é necessário apenas para as suítes. A suíte original não foi editada. O arquivo `evidencias/suite-final.json` conserva o resultado final e `evidencias/novos-testes-final.tap` registra os 118 testes.

| Grupo novo | Quantidade | Cobertura | Resultado |
| --- | ---: | --- | --- |
| regression.test.cjs | 71 | Python, inputs/palavras, 20 soluções reindentadas, progressão, memória, mecanismos, placa 12 e caminhos | PASS |
| editor-camera.test.cjs | 21 | Tab, Shift+Tab, Enter, elif/else, gutter/erros, zoom, pan, limites, recenter, follow, PNG e contrato CSS | PASS |
| ui-integration.test.cjs | 26 | 20 criações/soluções/replays com GameUI/renderer reais e adaptadores; input/cancelamento, navegação, feedback e catálogo | PASS |

Adaptadores fornecem DOM/Phaser mínimos para rodar os componentes reais. Não calculam CSS, não desenham pixels e não substituem a API real do navegador em todos os detalhes. O teste de feedback verifica preservação de elementos; a visibilidade do rodapé é verificada estaticamente, não medida em tela.

## Comparação antes × depois

| Cenário | Antes | Depois |
| --- | --- | --- |
| 27 cenários oficiais e replay | PASS | PASS |
| Mapas, startPosition, soluções, objetivos, XP e moedas preservados | Base recebida | Comparação JSON idêntica |
| Blocos consistentes de quatro espaços | PASS | PASS |
| Blocos consistentes de dois espaços e comentários indentados | FAIL | PASS |
| Indentação inesperada fora de bloco | Rejeitada corretamente | Rejeitada corretamente |
| AURORA/CORAGEM exatas | PASS | PASS |
| Espaços externos nos dois mecanismos | FAIL | PASS; string original preservada |
| int vazio/decimal textual, range textual | Aceitação indevida | Erro sem perder vidas |
| int numérico fracionário | Rejeição indevida | Truncamento correto |
| Comparação texto/número | Coerção indevida | Erro semântico |
| Tab/Shift+Tab/autoindentação | Ausentes | PASS no componente |
| Câmera navegável | Ausente | PASS no modelo/adaptador |
| Placa 12 ao ser alternada | Espinhos não acompanham | PASS nas duas variantes |
| Rodapé e feedback em navegador real | Não homologado nesta execução | PENDENTE |

## Critérios finais solicitados

| Critério | Evidência / status |
| --- | --- |
| 20 atividades carregam e soluções funcionam | 20 ciclos de componentes; 27 cenários da suíte original PASS |
| Progressão, desbloqueio, replay e recompensas únicas | Suíte original + percurso sequencial das 20 PASS |
| Vidas, derrota, perigos, colisões | Suíte original PASS, incluindo fixtures; não houve playtest manual de toda rota possível |
| XP e moedas | Recompensa, idempotência e fallback PASS |
| Portas, chaves, placas, alavancas e sensores | Soluções e regressões + fixtures M01/M02/M03 PASS |
| if/elif/else, for/while, guardas e orçamento | Suíte original e novas regressões PASS |
| Input/print, palavras e dados visíveis no DOM | Inputs corretos/incorretos e guia por atividade PASS |
| Editor, Tab, Shift+Tab e autoindentação | Transformações e eventos do componente PASS |
| Livro estável, botões visíveis e feedback sem sobreposição | Implementado, contrato CSS PASS; medição visual PENDENTE |
| Zoom/pan/limites/centralização/follow | Modelo e eventos no adaptador PASS; uso real PENDENTE |
| Assets e caminhos | Arquivos, assinaturas PNG, quadros e papéis no catálogo PASS; carregamento/renderização real PENDENTE |
| Anterior/próxima e rascunho | Integração e bloqueio de fase PASS |
| Menu, HUD, fade e microanimações | Implementados; acabamento visual PENDENTE |
| Testes antigos/novos e documentação | PASS; sete documentos obrigatórios + complementos presentes |
| Compatibilidade e público-alvo | NÃO EXECUTADOS |

## Referência à planilha, sem preenchimento

Os 39 casos foram consultados apenas como planejamento. `evidencias/plano_referencia.txt` contém uma extração de leitura, e `COBERTURA_DO_PLANO.md` relaciona seus IDs a esta auditoria. Campos de resultado/status, rastreabilidade, conteúdo e formatação do XLSX não foram alterados. A comprovação SHA-256 está em `evidencias/integridade.json`.

## Falhas intermediárias e regressões

Foram corrigidas regressões de implementação do editor inicial, contador da centralização e quadros do alçapão (PK-018–020). Novos testes tiveram erros de expectativa/fixture corrigidos, descritos no registro. Depois da última mudança funcional (conexões da atividade 12), a suíte original passou e todos os 118 testes novos passaram. Não restaram falhas automatizadas conhecidas. PK-022–024 permanecem pendentes.

## Homologação manual pendente — roteiro exato

1. Servir por HTTP e abrir Chrome/Edge/Firefox. Registrar versões reais, SO, data e resoluções 1360×820, 1024×768 e 900×600. Abrir também viewport estreita para documentar limites responsivos.
2. Nas 20 fases, capturar a tela inicial e a final com solução oficial; nas 1/6/11/16, percorrer todas as microetapas. Usar inputs da inscrição, não valores memorizados do gabarito.
3. Colar código de 200 linhas, selecionar/Tab/Shift+Tab, provocar erro no final e rolar. Confirmar números alinhados, seleção, linha marcada e quatro botões sempre acessíveis.
4. Produzir console/feedback extensos e abrir input; medir/capturar ausência de sobreposição do rodapé. Enviar Enter e ENVIAR; cancelar com RESTAURAR e MENU.
5. Em mapas grandes, usar roda e +/− até ambos os limites. Arrastar nos quatro extremos; conferir que Guto não mudou de célula. Centralizar, executar movimento, interromper follow com pan e centralizar novamente.
6. Concluir → desbloquear → PRÓXIMA → ANTERIOR, repetidamente. Conferir rascunho, microetapa, dimensões e recompensas. Recarregar a página para verificar persistência real.
7. Inspecionar portas, grades, baús abertos/fechados, rune, chaves, espinhos e lava; conferir arte legível, transições e console de erros/requisições HTTP.
8. Registrar PASS/FAIL no presente conjunto de documentos, nunca na planilha acadêmica. Anexar capturas somente se realmente produzidas.

## Ponto de continuidade

Leia `ESTADO_DA_EXECUCAO.md`. Não refaça backup, baseline nem reconstrução do projeto. O próximo passo material é a homologação em navegador acessível, seguida somente de correções reproduzidas e das respectivas regressões.
