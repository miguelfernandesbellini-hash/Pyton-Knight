# API e arquitetura — rodada V3

Estado em 16/09/2026. A base técnica é a versão funcional enviada. O parser `PythonSubsetParser.js`, o catálogo histórico, os módulos de persistência/progressão, o editor e os limites globais foram preservados. O interpretador foi estendido com rastreamento de execução; não foi reescrito.

## Carregamento e autoria

`index.html` carrega `activities.js` e depois `activities-v3.js`. O segundo arquivo substitui os dados das 20 atividades no mesmo `window.ACTIVITIES`; não cria um jogo paralelo. As cenas, o menu, a câmera e o Livro Mágico continuam usando as APIs existentes.

| Módulo | Responsabilidade |
|---|---|
| `tools/v3/unit1.cjs` … `unit4.cjs` | Fonte de autoria dos mapas e soluções atuais |
| `tools/v3/build.cjs` | Gerador determinístico do overlay V3 |
| `DiscoverySystem` | Visibilidade, salas iluminadas, inscrições, regiões e Diário |
| `MechanismSystem` | Requisitos reutilizáveis, mecanismos automáticos, sequência de placas e contexto de novos comandos |
| `AnimationSystem` | Movimento, orientação, interação, dano, medo, teleporte e transições aguardadas |
| `SpriteAtlasSystem` | Preparação dos quadros e âncoras a partir das fontes de arte V3 |
| `DungeonSystem` | API existente, colisão, inventário e aplicação das conexões |
| `MissionObjectiveSystem` | Objetivos físicos e evidências pedagógicas efetivamente executadas |
| `CommandInterpreter` | Parser existente, execução segura e registro do contexto/origem dos dados |

Os tipos legados `door`, `gate`, `guardian`, `pressure_plate`, `toggle_plate`, `bridge` e `bridge_segment` continuam válidos. `family` agrupa semanticamente as entidades sem quebrar seus identificadores.

## API acessível ao aluno

| Comando/sensor | Retorno | Contexto e regra |
|---|---|---|
| `andar_frente(n=1)` | booleano | Inteiro de 0 ao limite global; percorre um tile por vez, com colisão antes do movimento |
| `virar_direita()` / `virar_esquerda()` | booleano | Atualiza orientação lógica e pose visual |
| `examinar()` **novo** | texto | Inscrição no mesmo tile ou à frente, visível; registra no Diário |
| `ativar_interruptor()` **novo** | booleano | Interruptor no mesmo tile ou ortogonalmente adjacente; revela suas salas |
| `sala_iluminada()` **novo** | booleano | Consulta a região atual; API disponível para autoria, não liberada automaticamente em toda fase |
| `tem_inscricao_a_frente()` **novo** | booleano | Consulta a inscrição visível à frente; mesma restrição de whitelist |
| `ativar_alavanca(id opcional)` | booleano | Alavanca local; alterna OFF/ON e aplica conexões |
| `abrir_porta(id opcional)` | booleano | Porta/grade/guardião local; `false` se faltar requisito; colisão bloqueada durante abertura |
| `entrar_espelho(valor)` / `entrar_portao(valor)` | booleano | Guto precisa estar no tile do objeto; requisitos e classificação verificados antes de transportar |
| `ativar_runa(id opcional)` | booleano | Totem ou runa no mesmo tile ou à frente; V3 não permite energizar a ponte diretamente |
| `coletar_rubi(id opcional)` | booleano | Guto no tile do rubi; coleta uma vez e incrementa o contador físico |
| `abrir_bau(id opcional)` | conteúdo | Mesmo tile/à frente; `key`, `empty`, `coin` ou conteúdo configurado; abertura registrada na busca |
| `desativar_armadilha(id opcional)` | booleano | Somente armadilha à frente; ação fora de contexto produz erro sem remover vida |
| `input(prompt)` | texto | Em fases configuradas, exige pedestal local e as inscrições requeridas |
| `print(...)` | nenhum | Console; runas exigem contexto local, saída esperada, pistas e origem nos inputs quando configurada |
| `int(valor)` / `range(...)` | inteiro / sequência limitada | Semântica do subconjunto preservada, com guardas existentes |

Sensores preservados: `tem_chave`, `porta_aberta`, `porta_final_bloqueada`, `armadilha_ativa`, `tem_armadilha_a_frente`, `tem_placa_a_frente`, `placa_ativa`, `alavanca_ativa`, `alavanca_azul_ativa`, `alavanca_verde_ativa`, `ponte_ativa`, `tem_bau_a_frente`, `encontrou_chave`, `caminho_livre`, `moedas_coletadas`, `rubis_coletados`, `corredor_continua`.

Sensores de inventário/estado global continuam sendo consultas; ações que alteram o mundo exigem contexto espacial. `rubis_coletados()` em V3 conta rubis, não moedas opcionais. `corredor_continua()` detecta o mecanismo de piso à frente; a lava cenográfica não compõe os percursos dos loops.

A whitelist final está em cada atividade de `CATALOGO_ATIVIDADES.json` e na matriz. A existência de uma API não a libera antes da unidade apropriada. Não há `eval`, acesso a JavaScript ou movimento absoluto/WASD.

## Portas, placas, pontes e espinhos

### Requisitos de porta

| Campo | Semântica |
|---|---|
| `requires: [flags]` | Todas as flags verdadeiras (AND) |
| `requiresAny: [flags]` | Ao menos uma flag verdadeira (OR) |
| `requiresKey: true` | Inventário transitório contém chave |
| `requiresClues: [ids]` | Textos foram examinados e registrados |
| `condition: {input, operator, value}` | Compara a entrada numérica do pedestal: `>=`, `>`, `<`, `==`, `!=` |
| `minRubies`, `minRunes`, `minTraps` | Contadores reais de ações/itens atingiram o mínimo |
| `variantMinTraps: [n…]` | Mínimo selecionado pelo cenário |
| `automatic: true` | Abre ao satisfazer requisitos, com animação aguardada |
| `lockHint` | Aviso contextual, sem resposta secreta |

Senha textual e combinação são representadas por flags produzidas por `outputRules`, podendo combinar chave, alavancas, pistas e contadores. Não há comparador textual arbitrário novo em `condition`.

### Placas

`pressure_plate` mantém ON enquanto ocupada; sair desfaz suas conexões. `toggle_plate` alterna ao entrar novamente; ficar parado não repete a ativação. `mode: 'logic'` representa estado consultável configurado pela variante, sem alternar ao pisar.

`mode: 'sequence'` usa `sequenceGroup` e `sequenceIndex` para um grupo ordenado. Uma entrada fora de ordem apaga o grupo; a ordem completa produz `sequence_<grupo>` e suas conexões. Progresso fica em `runState.sequences`. Esse modo reutilizável foi testado isoladamente; os mapas atuais usam principalmente alternância e estado lógico, sem introduzir um novo conceito pedagógico no boss.

Conexões usam `{targetId, activeState, inactiveState}`. O estado final do alvo é aplicado pela mesma família de animação. Portas só perdem colisão quando o estado aberto é concluído.

### Pontes

`bridge`/`mode: 'whole'` representa a ponte retrátil; `bridge_segment`/`mode: 'segmented'` representa segmentos independentes. As conexões dos totens energizam os segmentos. O comando de cada iteração aguarda o aparecimento do segmento antes do próximo movimento. Inativa: abismo bloqueado; ativa: tablado caminhável.

### Espinhos e lava

`hazard` aceita `mode: 'trigger'`, `'signal'` e `'cycle'`. `retracted` mostra furos e pode disparar ao pisar; `active` causa dano; `inactive` está desativado. Placas/alavancas usam conexões. Ciclos usam `worldTick`, `period`, `safeTicks` e `phase`: avançam por movimento de tile, sem punir o tempo que o aluno passa editando. As 20 atividades usam gatilho e controle por mecanismo; o modo cíclico tem teste isolado.

Na V3, tile de lava (`4`) é bloqueado como cenário e não mata por pisada. O comportamento histórico permanece apenas para a suíte de compatibilidade que carrega o catálogo antigo.

## Descoberta, iluminação e medo

| Estado | Duração |
|---|---|
| Posição, orientação, portas, mecanismos temporários, chave, moedas provisórias, contadores, inputs e sequência | Nova tentativa a cada EXECUTAR |
| `inscriptions`, `litRooms`, `regions`, `tiles`, `knownObjects` | Entre EXECUTARs na mesma cena/atividade |
| XP, bolsa, atividades concluídas e desbloqueios | `localStorage`, chave original `pyton_knight_progress_v2` |

`DiscoverySystem.restore()` recompõe apenas flags de leitura, visita e iluminação. Itens e portas não são salvos como descoberta. Uma porta automática poderá reabrir quando uma descoberta persistida satisfizer seu requisito.

Regiões aceitam `lightState: 'lit' | 'dark' | 'deepDark'`, `initiallyVisible`, `fearDamage`, `warningSteps` e `fearVariants`. Regiões sobrepostas priorizam a área mais específica; em empate, a declarada por último. A proximidade possui linha de visão; paredes bloqueiam a visão local. Iluminação revela geometria e objetos, mas não registra automaticamente textos.

Sombra profunda reduz o raio local. Há aviso, pose/tremor de medo e tolerância configurada antes de `HAZARD_DEATH`. Não há dano por ficar parado escrevendo. Uma morte remove exatamente uma vida; ao chegar a zero, a regra original restaura a sessão para três. Descobertas já adquiridas permanecem.

`REINICIAR` limpa descobertas, código e etapas do tutorial; preserva vidas e recompensas consolidadas. Trocar de atividade ou recarregar a página inicia nova descoberta. Rascunhos de código mantêm o comportamento original de navegação.

## Animação e sincronização

Guto: `idle_up/down/left/right` e `walk_up/down/left/right`. Quatro quadros por direção, com âncora uniforme. `turn` usa a pose da nova orientação; interação, dano, medo e vitória usam poses com tweens/tints. Movimento dura cerca de 210 ms por tile. O controlador espera o tween antes de atualizar a posição e verificar a entrada no piso.

Portas, guardiões, pontes e baús usam estado intermediário `opening`, mantendo colisão. Baús têm quadros fechado/abrindo/aberto. Espinhos usam os sete quadros do asset original. Alavancas/interruptores têm OFF/ON e reação curta. Portais energizam na origem, fazem fade de entrada, mudam a posição e fazem fade de saída. Luz progride em cerca de 480 ms. O modo de teste ignora duração, mas preserva a ordem lógica; testes específicos simulam o callback de tween antes de liberar colisão.

## Evidência pedagógica e compatibilidade

O interpretador registra ações aceitas, ordem, variáveis utilizadas, laços e condições em execução. Valores de `input()` carregam metadados de origem por variável, conversão e operações; `print` pode exigir duas ou três entradas distintas, evitando que um literal ignorando inputs ative a solução.

Objetivos novos: `discovered`, `illuminated`, `visited`, `command_context`, `variable_movement`, `reassigned`, `accumulator`, `search_stop`. Avaliam execução real, sem exigir nome exato de variável. As soluções alternativas de aritmética, range e rota foram testadas. Isso não constitui prova formal de todos os possíveis programas maliciosos; o jogo continua aceitando programas legítimos que atendem ao mundo e à whitelist.
