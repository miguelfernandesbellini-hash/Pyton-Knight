# Relatório técnico de alterações

Período: 14–15/09/2026. Base: projeto recebido, não reconstruído. Backup e suíte inicial executados antes de modificar o código.

| Alteração | Problema original | Solução / implementação | Arquivos | Classe/função | Decisão / impacto |
| --- | --- | --- | --- | --- | --- |
| Indentação e blocos | Rejeição de dois espaços/comentários válidos | Indentação relativa do filho e dedent consistente; comentários ignorados antes da validação | systems/PythonSubsetParser.js | childBlock, parser de if/for/while | Preserva estrutura; não remove todos os espaços |
| Expressões Python | Comparações/coerções divergentes | AST de comparação encadeada; not em precedência própria; and/or retornam operandos | systems/PythonSubsetParser.js; systems/CommandInterpreter.js | parseNot, compare, evaluate | Sem alteração nas respostas oficiais |
| Conversões e aridade | int vazio/decimal textual e range textual aceitos | Validação de tipos, aridade e inteiros; truncamento numérico | systems/DungeonSystem.js | callApi | Entradas inválidas deixam de passar silenciosamente |
| Palavras | Espaços externos impediam mecanismos | Normalização exclusivamente para AURORA/CORAGEM | systems/DungeonSystem.js; systems/MissionObjectiveSystem.js | outputMatches, avaliar | Sem alterar input, variáveis ou comparação textual |
| Editor | Ausência de Tab/autoindentação/linha de erro | Componente nativo com transformações testáveis e gutter | ui/CodeEditor.js; ui/GameUI.js | transform, alignBranch, attach, marcarErro | Sem IDE externa |
| Livro e feedback | Alturas livres deslocavam rodapé | Flex delimitado, áreas com scroll e feedback curto | ui/game.css; ui/GameUI.js; systems/CommandInterpreter.js | criar, definirFeedback, executarPrograma | CSS ainda exige homologação real |
| Dados e recursos | Valores apenas internos/gabarito | Guia explícito por atividade e recursos da whitelist | ui/ActivityGuide.js; ui/GameUI.js | data, resources, criar | Não entrega a rota/solução completa |
| Input e cancelamento | Entrada pouco clara e risco de execução órfã | Formulário, foco, submit e promessa cancelável | ui/GameUI.js; systems/CommandInterpreter.js; systems/PlayerController.js | solicitarEntrada, cancelar, checkCancellation | Sem perder vidas ao cancelar |
| Navegação/tutorial | Estado residual e rascunho perdido | Init explícito, rascunho por atividade e cleanup no shutdown | Game.js; ui/GameUI.js | init, navegar, restaurarRascunho, destruir | Progressão permanece no sistema original |
| Câmera | Mapas inteiros reduzidos | Modelo limitado, zoom/pan/follow/recenter, viewport isolada | systems/CameraController.js; Game.js | CameraModel, Controller, update | Somente visão; células 64 px |
| Visual | Entidades geométricas e identidade inconsistente | Assets Castle selecionados, estados de sprites e microanimações | systems/AssetCatalog.js; assets/official-manifest.json; systems/MapRenderer.js; systems/BarrierSystem.js; Preloader.js | appearance, desenhar, atualizarEntidades | Colisões independentes da arte |
| Orientação | Indicador não seguia posição | Posição do indicador atualizada com Guto; flip oeste | systems/PlayerController.js | atualização de posição/orientação | Sem novas animações complexas |
| Mecanismos | Pressão retida e alavanca sem alternância | Liberação ao sair, guarda de entrada repetida e toggle | systems/DungeonSystem.js | onEnter, callApi, applyConnections | M01 genérico por fixture; M03 preserva soluções |
| Placa da atividade 12 | Sensor alterava sem espinhos | Duas conexões com estados inversos | activities.js | atividade 12 / entities[0].connections | Nenhuma posição/rota/solução alterada |
| Objetivos | Atualização só ao final | Reavaliação após eventos físicos | systems/DungeonSystem.js; systems/CommandInterpreter.js | refresh, executarPrograma | Mesmos critérios de vitória |
| Persistência | Falha de armazenamento descartava fallback | Cache em memória respeitado depois de falha | systems/PersistenceService.js | load/save/resetForTests | Sem promessa de persistir após fechar página quando bloqueado |
| Menu e transições | Menu pouco acabado | Resumo de progresso e fade simples | MainMenu.js; ui/game.css; Game.js | create, navegar | Sem login/perfis |
| Registro e testes | Ausência de comparação desta atualização | 118 testes novos, evidências e documentos | tests/; docs/ | node:test; documentos técnicos | Suíte original não editada |

## Organização, substituições e integridade

`MANIFESTO_DE_ALTERACOES.csv` relaciona cada arquivo recebido alterado e cada arquivo novo com SHA-256 anterior/atual. Não houve exclusão nem movimentação de arquivos recebidos. CSS e novos módulos foram adicionados ao carregamento; o visual interno de MapRenderer, GameUI, MainMenu e Game foi substituído sobre a lógica existente. PNGs oficiais foram copiados para os caminhos de execução; arquivos-fonte dos pacotes foram preservados. Os cinco assets históricos continuam disponíveis, embora caminho/parede/grade antigos não componham a nova dungeon.

A diferença serializada em `evidencias/comparacao_atividades.json` contém somente `/11/entities/0/connections`. Mapas, posições iniciais, soluções, orçamentos, recompensas e condições de vitória permanecem idênticos. Não foram adicionados loja, equipamento, login, backend, multiplayer, áudio completo, Python completo ou controles manuais de Guto.

## Correções durante o próprio desenvolvimento

A inicialização do texto do editor, o temporizador de centralização e as dimensões do spritesheet de alçapão foram corrigidos antes da entrega. Falhas dos testes novos também foram investigadas: comparação de timestamps em replay, expectativa de código inicial antes do tutorial, seletor CSS incorreto e assinatura de onEnter eram erros de teste, não alterações indevidas no jogo. Os testes foram ajustados ao comportamento verificável, sem remover asserções de recompensas/estado.

## Resultado e limites

Suíte original PASS e 118 novos testes PASS. Integração de componentes executada com adaptadores. Homologação visual/compatibilidade, divergências de documentação histórica e limitações de avaliação pedagógica estão explicitadas no registro de bugs e no relatório de testes. Não se declara ausência absoluta de regressões sem essa homologação.
