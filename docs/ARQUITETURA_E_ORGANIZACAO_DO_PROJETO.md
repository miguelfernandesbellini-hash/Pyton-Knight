# Arquitetura e organização

## Execução local

Na pasta que contém `index.html`, execute `python -m http.server 8000` (Windows: `py -m http.server 8000`, se necessário). Acesse `http://localhost:8000`. Não abra apenas o HTML pelo explorador: o carregamento dos assets exige HTTP. O Phaser está incluído em `phaser.min.js`; não foi adicionado backend ou dependência npm ao jogo.

Para auditoria isolada, `http://localhost:8000/?dev=1` mantém o seletor de atividades já existente. O modo normal respeita o desbloqueio. A persistência pertence ao navegador/origem, não a uma conta.

## Responsabilidades

| Arquivo/pasta | Responsabilidade |
| --- | --- |
| `index.html` | Ordem explícita dos módulos, canvas e raiz DOM `#interface` |
| `Boot.js` | Entrada no carregamento |
| `Preloader.js` | Carrega os cinco assets históricos e o catálogo oficial |
| `MainMenu.js` | Progresso, atividade disponível, continuar e transição |
| `Game.js` | Instância da atividade, ciclo de vida, criação do mundo, UI e câmera |
| `activities.js` | 20 mapas, entidades, variantes, soluções, restrições e tutoriais |
| `systems/PythonSubsetParser.js` | Tokenização, AST, blocos, análise de comandos e instruções |
| `systems/CommandInterpreter.js` | Avaliação assíncrona, whitelist, loops, cancelamento, término |
| `systems/DungeonSystem.js` | Estado de execução, interações contextuais, sensores, input/print e mecanismos |
| `systems/PlayerController.js` | Movimento orientado exclusivamente por código e orientação de Guto |
| `systems/BarrierSystem.js` | Colisão das barreiras entre células e sua representação |
| `systems/MapRenderer.js` | Imagens do mapa, entidades por estado e microanimações |
| `systems/CameraController.js` | Modelo geométrico testável e integração da câmera Phaser com DOM |
| `systems/MissionObjectiveSystem.js` | Avaliação dos objetivos, sem redefinir a vitória |
| `systems/CodeBudgetValidator.js` | Contagem semântica de instruções e orçamento existente |
| `systems/TutorialSystem.js` | Microetapas das atividades 1, 6, 11 e 16 |
| `systems/ProgressionSystem.js` | Recompensas e desbloqueio; idempotência de replay |
| `systems/PersistenceService.js` | localStorage e fallback em memória |
| `ui/GameUI.js` | Livro, input, console, HUD, ações e rascunhos em memória |
| `ui/CodeEditor.js` | Comportamentos de edição sem IDE externa |
| `ui/ActivityGuide.js` | Dados publicados para o jogador e catálogo de comandos permitidos |
| `ui/game.css` | Layout delimitado e responsivo |
| `assets/official-manifest.json` e `systems/AssetCatalog.js` | Caminhos exatos, origem e quadros oficiais |
| `tests/run-tests.cjs` | Suíte legada, com precondição de input do portal atualizada na rodada 2 |
| `tests/*.test.cjs` | Novas regressões de lógica, editor, câmera e integração |
| `tests/helpers.cjs`, `tests/ui-fixture.cjs` | Adaptadores de teste; não entram no HTML de produção |
| `docs/evidencias` | Baseline, logs, integridade e comparação |

## Fluxo

Código → parser/AST → whitelist e orçamento → interpretador → API da dungeon → movimento/interações → objetivos → recompensa única/progressão. A UI observa esse estado. `input()` suspende a promessa até envio ou cancelamento; restaurar/navegar aguarda o encerramento controlado.

O mundo usa células de 64 pixels, com centro inicial de célula em (32,32). A câmera modifica somente a visão. Livro e HUD são elementos DOM fora do mundo Phaser. Não há controle WASD.

Cada carregamento inicializa tutorial/execução, constrói o renderer, reinicia o mundo e instala a câmera. `shutdown` remove eventos do editor/câmera, cancela entrada e limpa o DOM. Os rascunhos persistem apenas durante a sessão da página; não substituem os dados de progresso.

## Fontes preservadas

Os arquivos recebidos das pastas `02_DOCUMENTACAO_OFICIAL`, `03_ASSETS_VISUAL_OFICIAL` e `04_RELATORIOS_E_CONTROLE` não foram editados. Um adendo foi acrescentado à pasta 02 nesta rodada. Relatórios antigos são históricos: os documentos em `docs/` descrevem esta atualização. Consulte o manifesto para cada arquivo criado/alterado; nenhum arquivo recebido foi removido ou renomeado.

## Rodada 2

runtimeAnalysis separa a whitelist/análise estática da evidência de comandos/conceitos usados. A API de portal da atividade 15 valida o último input recebido antes de ativar. assets/custom contém cinco imagens originais complementares. O layout e a câmera permanecem sujeitos à homologação PK-024.
