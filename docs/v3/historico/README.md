# Pyton Knight — 20 Atividades

Pyton Knight é um jogo educacional em Phaser 3 no qual o aluno resolve desafios escrevendo um subconjunto controlado de Python. Esta versão reúne quatro unidades e 20 atividades, preserva a Unidade 1 e acrescenta movimentação orientada, Livro Mágico permanente, objetivos, vidas, XP, moedas e progressão persistente.

## Estado da entrega

- 20 atividades em quatro unidades.
- Tutoriais guiados nas Atividades 1, 6, 11 e 16.
- Bosses nas Atividades 5, 10, 15 e 20.
- Atividades 6–20 reelaboradas como dungeons exploráveis, de 10 × 7 a 20 × 14 tiles, com salas, curvas, alas, desvios e mecanismos espaciais.
- 27 cenários oficiais/variantes, 300 verificações funcionais, 210 verificações específicas de mapa, 23 regressões globais e 27 reexecuções validadas.
- Código preservado entre execuções; mundo transitório sempre reiniciado.
- XP, moedas e desbloqueio persistidos em `localStorage`.

## Tecnologias e execução

O projeto usa HTML5, CSS3, JavaScript e Phaser 3 local, sem build e sem dependências de produção. Sirva a pasta por HTTP:

```bash
cd Pyton-Knight-20-Atividades-Mapas-Reelaborados
python3 -m http.server 8000
```

Abra `http://localhost:8000`. Para liberar todas as atividades durante desenvolvimento, use `http://localhost:8000/?dev=1`.

Não existe controle principal por WASD. Guto é controlado pelo código no Livro Mágico.

## Testes

```bash
node tests/run-tests.cjs
```

O comando retorna JSON e falha se alguma asserção não passar. Em cada atividade, a suíte testa solução correta, execução incompleta, sintaxe, comando desconhecido, reset, nova execução, colisão real, parada sem colisão, perigo letal, vidas, código preservado, conceito futuro bloqueado, objetivo pedagógico, recompensa e ausência de duplicação. Para as Atividades 6–20 há ainda uma matriz própria de geometria: dimensão, início, cristal, alcance de entidades, paredes, conectividade com espelhos/portais, giros, sensores orientados, contexto de interação, rota oficial, reset, perigos, objetivos e proteção contra atalhos pedagógicos. Também cobre as duas rotas da Atividade 12, as três classificações da Atividade 15, as variantes de baús das Atividades 19 e 20, tutoriais, orçamento, proteção contra loops e regressões globais.

## Mapas reelaborados

As Atividades 6–20 usam regiões declaradas em `activities.js` e destacadas de forma provisória pelo renderizador. O espaço novo tem função de navegação, mecanismo, decisão, risco, coleta ou retorno; não foi criado apenas para alongar corredores. A progressão cresce dentro de cada unidade e culmina em Bosses de 17 × 12, 18 × 12 e 20 × 14 tiles.

A escala dos tiles é calculada para a área de dungeon. Ela varia de 68 px nos mapas menores até 35 px no mapa 20 × 14, mantendo o Livro Mágico e a interface existentes sem uma reforma de câmera. As regiões e entidades recebem rótulos provisórios para leitura do puzzle.

## Arquitetura

| Arquivo | Responsabilidade |
|---|---|
| `activities.js` | Catálogo declarativo: mapas, objetivos, tutoriais, mecânicas, limites e soluções. |
| `systems/PythonSubsetParser.js` | Tokenização, indentação, AST e análise semântica. |
| `systems/CommandInterpreter.js` | Execução segura, bloqueios pedagógicos e causas de término. |
| `systems/DungeonSystem.js` | API autorizada, sensores orientados, interação contextual, entidades e estados reutilizáveis. |
| `systems/PlayerController.js` | Orientação, movimento, colisões, perigos e destinos espaciais de espelhos/portais. |
| `systems/MissionObjectiveSystem.js` | Avaliação dos objetivos físicos e computacionais. |
| `systems/TutorialSystem.js` | Microetapas dos quatro tutoriais. |
| `systems/CodeBudgetValidator.js` | Contagem semântica do orçamento. |
| `systems/PersistenceService.js` | Persistência versionada no navegador. |
| `systems/ProgressionSystem.js` | Desbloqueio, XP, moedas e idempotência. |
| `systems/MapRenderer.js` e `BarrierSystem.js` | Renderização do mapa, barreiras e mecânicas. |
| `ui/GameUI.js` | Livro Mágico, editor, entrada, console, feedback e HUD. |

## Livro Mágico

O painel permanece aberto durante a atividade e contém missão, objetivos atualizados, tutor quando aplicável, editor Python, campo de `input()`, console de `print()`, feedback, vidas, orientação, XP, moedas, progresso e botões de execução/navegação.

Cada EXECUTAR restaura posição, orientação, mecanismos e itens provisórios, mas preserva o texto do editor. Vidas só diminuem em perigo letal; erros de código, parede, porta fechada, orçamento e objetivo incompleto não removem vida.

## API educacional

Movimento:

- `andar_frente(passos=1)`
- `virar_direita()`
- `virar_esquerda()`

Entrada e saída:

- `print(valor)`, `input(mensagem)`, `int(valor)`, `range(...)`

Interação:

- `ativar_alavanca()`, `abrir_porta()`, `entrar_espelho()`, `entrar_portao()`
- `ativar_runa()`, `coletar_rubi()`, `abrir_bau()`, `desativar_armadilha()`

As ações de mundo exigem contexto: alavancas, portas e runas requerem proximidade; espelhos e portais exigem o tile da entidade; rubis de coleta manual exigem o tile; baús e armadilhas são operados à frente. Assim, a API não funciona como telecomando.

Sensores:

- `tem_chave()`, `porta_aberta()`, `porta_final_bloqueada()`
- `armadilha_ativa()`, `tem_armadilha_a_frente()`, `tem_placa_a_frente()`
- `placa_ativa()`, `alavanca_ativa()`, `alavanca_azul_ativa()`, `alavanca_verde_ativa()`
- `ponte_ativa()`, `tem_bau_a_frente()`, `encontrou_chave()`, `caminho_livre()`
- `moedas_coletadas()`, `rubis_coletados()`, `corredor_continua()`

## Subconjunto de Python

São aceitos variáveis, números, textos, booleanos, aritmética, comparadores, `and`, `or`, `not`, chamadas autorizadas, `if`/`elif`/`else`, `for` com `range()`, `while` e `break`. Blocos usam indentação Python. O projeto não usa `eval()` nem `new Function()` e não executa Python arbitrário.

Conceitos futuros são bloqueados conforme a unidade:

| Unidade | Atividades | Conteúdo |
|---|---:|---|
| 1 | 1–5 | variáveis, operações e movimento orientado |
| 2 | 6–10 | `print()`, `input()`, `int()` e processamento |
| 3 | 11–15 | condicionais, comparadores e sensores |
| 4 | 16–20 | `for`, `range()`, acumuladores, `while` e `break` |

## Mecânicas usadas

M01, M02, M03, M05, M06, M07, M08, M09, M12, M14, M17, M18, M19, M20, M21, M22, M23, M24, M26, M30 e os sistemas transversais M31–M37. Mecânicas não necessárias às 20 atividades não foram implementadas artificialmente.

## Vidas, moedas, XP e persistência

- Cada atividade começa com três vidas.
- Apenas `HAZARD_DEATH` remove vida.
- Rubis ficam provisórios durante a tentativa e entram na bolsa após vitória válida.
- XP usa o valor-base da atividade e multiplicadores 1,00 / 0,75 / 0,50 para 3 / 2 / 1 vida.
- Replay não duplica XP nem moedas.
- A chave persistente é `pyton_knight_progress_v2`.

## Orçamento

A contagem é semântica: comentários e linhas vazias não contam; ponto e vírgula gera instruções reais. Há limite nas Atividades 4, 5, 9, 10, 14, 15, 19 e 20.

## Limitações conhecidas

- O editor executa somente o subconjunto educacional, não Python completo.
- Persistência é local ao navegador.
- Alguns mecanismos usam formas e símbolos provisórios por falta de assets finais.
- Áudio e animações avançadas não fazem parte desta entrega.
- A lógica e a geometria foram automatizadas; recomenda-se manter homologação visual e playtest de legibilidade em navegador real antes da etapa final de arte.

## Balanceamento provisório

XP, multiplicadores, valor da moeda, política de replay e guardas do runtime estão centralizados em `systems/GameConstants.js`; orçamentos ficam em `activities.js`. Esses números devem ser recalibrados após playtests.

## Atualização de polimento — setembro de 2026

Consulte `docs/RESUMO_EXECUTIVO.md` e `docs/RELATORIO_DE_TESTES.md` para o estado atual. Câmera: roda/+−, arraste e Centralizar no Guto. Editor: Tab, Shift+Tab e Enter com autoindentação. Testes novos: `node --test tests/regression.test.cjs tests/editor-camera.test.cjs tests/ui-integration.test.cjs`. A suíte original continua sendo `node tests/run-tests.cjs`. Homologação visual real pendente, documentada em PK-024.

## Rodada final — portais e sprites

Consulte docs/RESUMO_EXECUTIVO.md. Agora são 146 testes adicionais; acrescente `tests/final-polish.test.cjs` ao comando node --test. A suíte legada recebeu somente a preparação do poder no teste contextual de portal. PK-022/023 resolvidas; PK-024 visual continua pendente.
