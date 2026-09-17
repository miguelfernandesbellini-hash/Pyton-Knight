# API e arquitetura — V4

17/09/2026. Complementa a [API V3](../v3/API_V3.md). Phaser e o subconjunto Python permanecem; nenhum comando de movimentação manual foi adicionado.

## Catálogo e compatibilidade

Ordem de carregamento: `activities.js` → `activities-v3.js` → `activities-v4.js`. O último aplica exclusivamente orçamento, moedas, decoração e apresentações de livros/totens. O arquivo é gerado por `node tools/v4/build.cjs`; não regenere os mapas V3 para editar decoração V4.

Cada atividade recebe `v4: true`, `instructionBudget` positivo e cinco entidades `coin` com `persistent: true`. `decorations` é uma lista separada dos mecanismos. `visualVariant: bookshelf` continua sendo uma entidade `inscription`; `visualVariant: v4_totem` continua sendo `totem`.

## Orçamento e tentativas

`CodeBudgetValidator.validar(activity, analysis)` mantém `{ valid, limit, used }`; `used` continua vindo de `PythonSubsetParser.parse(code).analysis.instructionCount`. Blocos, atribuições e comandos seguem exatamente a contagem anterior. Comentários, linhas vazias e quebras de linha não viram instruções artificiais.

Na V4, o interpretador não retorna antes de executar por excesso de orçamento. Analisa sintaxe/whitelist/comandos, inicia a simulação e avalia os objetivos. Cada catálogo inclui um objetivo `budget`, bloqueando conclusão, XP e desbloqueio quando `valid` é falso.

Ao atingir o cristal acima do limite, a terminação é `CODE_BUDGET_EXCEEDED`, agora **após** a simulação. O feedback informa que o objetivo foi alcançado, pede otimização e mostra `used / limit`. Se também houver requisito pedagógico pendente, o Livro continua mostrando-o. Exploração parcial retorna `INCOMPLETE_EXECUTION`. Moedas encontradas e descobertas permanecem válidas mesmo sem conclusão.

`scene.executionCount` aumenta depois de parsing, whitelist e identificação de comandos válidos, imediatamente antes de executar o programa. Código vazio, só comentários, sintaxe inválida, comando desconhecido e conceito bloqueado não contam. Colisão, erro em tempo de execução ou morte contam, pois a simulação começou. EXECUTAR e REINICIAR preservam o contador da visita; TENTAR NOVAMENTE inicia nova partida e zera o contador. Sair e carregar outra cena começa outra visita.

Limites globais de passos, iterações e instruções executadas permanecem obrigatórios; orçamento flexível não desativa proteção contra loops.

## Moedas e migração

Mantidos `schemaVersion: 2` e a chave `pyton_knight_progress_v2`. Extensão opcional:

```json
{
  "coinCollection": {
    "version": 1,
    "ids": ["A01_C01", "A01_C02"],
    "legacyCredit": 0,
    "spent": 0
  }
}
```

IDs válidos: A01_C01 a A20_C05. Normalização elimina duplicados e IDs fora dessas 100 moedas. O saldo é derivado de `legacyCredit + ids.length - spent`. `spent` é reservado para evolução futura e não possui interface de loja nesta versão. Uma compra futura deverá alterar o saldo gasto, preservando sempre os IDs coletados.

Ao migrar um save V3, `legacyCredit` recebe o saldo anterior, e `ids` começa vazio: o save antigo não identifica quais moedas físicas foram coletadas. XP, atividades concluídas, recompensas e desbloqueios são mantidos. Assim, **a campanha V4 rende no máximo 100 moedas novas**; o saldo de um save migrado pode incluir também o crédito anterior. O HUD `Total X / 100` sempre representa a coleção V4, não o saldo legado.

| Método | Contrato |
|---|---|
| `CoinSystem.ensure(scene)` | Carrega estado mais recente e inicializa extensão apenas uma vez; atualiza `scene.playerProgress` |
| `CoinSystem.collect(scene, entity)` | Exige moeda configurada na fase e Guto no mesmo tile; salva ID imediatamente; retorna true só na primeira coleta |
| `CoinSystem.restore(scene)` | Marca moedas salvas como coletadas antes da renderização em cada reset |
| `CoinSystem.stats(scene)` | `{collected, available:5, total, totalAvailable:100}` |

`DungeonSystem.onEnter()` coleta moeda automática. Não existe comando de crédito arbitrário. Moedas salvas não são renderizadas. A conclusão V4 não credita `coinsPending` novamente. XP continua sendo calculado por vidas e pago uma única vez; a opção legada de recompensa em replay não se aplica à V4.

Rubis de A17/A20 são `ruby`; `coletar_rubi()` continua exigindo o tile correto e a whitelist anterior. Rubis e contadores reiniciam a cada execução; não creditam a carteira. `rubis_coletados()` retorna o contador provisório pedagógico. `moedas_coletadas()`, quando disponível na whitelist, retorna a coleção persistente da atividade. Não houve ampliação de comandos permitidos.

## Conclusão

`CompletionSystem.model(scene)` só retorna um modelo quando a conclusão já foi processada, o orçamento é válido e todos os objetivos da atividade estão completos. Divide os objetivos físicos e as regras pedagógicas pelos tipos já existentes, sem listar conceitos futuros ou toda a whitelist.

`show(scene, reward)` monta modal DOM próprio, com `role=dialog`, título acessível, fundo da partida inerte e retenção do foco por Tab. As estatísticas provêm do estado efetivo: vidas, execuções iniciadas, orçamento da análise, baús abertos na tentativa e coleção persistente. Moedas não são apresentadas como requisito.

`retry(scene)` cancela uma execução pendente, fecha o modal, restaura três vidas, zera tentativas e limpa descobertas/mecanismos. Preserva código, etapa tutorial já alcançada, XP, desbloqueios e IDs de moedas. `next(scene)` usa a navegação existente e o progresso já salvo na conclusão; A20 retorna ao menu com opção de revisita. Cliques repetidos são protegidos pela navegação existente.

## Investigação e decoração

`DecorationSystem.draw(scene)` desenha decorações da fase em camada abaixo dos mecanismos e da neblina. As 125 decorações atuais estão em paredes previamente bloqueadas; `solid: false`, sem colisões adicionais.

`isInvestigableNearby(scene, entity)` exige `type: inscription`, texto ainda não lido, distância Manhattan ≤ 1 e visibilidade pelo `DiscoverySystem.canSee`. `updateMarkers(scene)` cria/atualiza `!` com profundidade abaixo da neblina; o marcador acompanha proximidade e leitura. Não revela ID secreto, palavra, número ou texto.

`examinar()` continua usando `MechanismSystem`/`DiscoverySystem.examine`, com as mesmas posições aceitas. A inscrição é registrada no Diário somente nessa interação. A gravação precede a atualização visual, removendo o indicador já no quadro da leitura. Acender luz não lê textos.

Há suporte explícito a decoração futura com `solid: true`: `DungeonSystem.isBlocked()` retorna `WALL_COLLISION`, explica o bloqueio e não causa dano. Nenhuma das 20 atividades adiciona esse tipo de obstáculo.

## Arte dos totens

`AssetCatalog.v4_totem_off/on` aponta para PNGs RGBA 64×64. `MapRenderer.appearance()` escolhe a imagem pelo estado lógico; a transição existente em `AnimationSystem` mantém a energia e as conexões da ponte sincronizadas. A sprite antiga permanece como asset histórico, sem uso nos totens V4. O parser, tileset das paredes e animações direcionais do Guto não foram modificados.
