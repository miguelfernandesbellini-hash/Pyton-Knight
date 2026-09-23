# V6 — implementação e decisões

Origem: rodada manual relatada pelo usuário, registrada no documento de
[homologação V5](../v5/HOMOLOGACAO_VISUAL_SONORA.md). Tudo não apontado foi aprovado
pelo usuário na base. Novas alterações visuais continuam sujeitas a inspeção humana.

Branch `feat/v6-gameplay-polimento`, a partir de `1286337`, com `15c2332` preservado.
Nenhuma alteração em main, no parser ou no catálogo histórico V3/V4. Sem agentes,
Computer Use, navegador interativo ou modo de aceleração nesta etapa. Não foi
localizado Vault diretamente disponível nas pastas de referência consultadas;
documentação mantida no projeto, sem configuração de Obsidian.

## Fluxo e persistência

- `JourneySystem` complementa `PersistenceService`/`ProgressionSystem`; não há
  segundo motor de recompensas. A terceira perda de vida mantém zero vidas,
  bloqueia execução/navegação e exige retorno a `max(1, atividade-1)`, com três
  vidas. Reload preserva a obrigação, inclusive ao retornar pelo menu. O marcador
  `recoveryActivity` impede pular diretamente para a missão da morte antes de
  concluir a anterior; não remove XP nem duplica recompensas antigas. Mortes contam vidas perdidas; game overs
  contam conjuntos de três. Colisões e erros de código não contam como morte.
- Chave localStorage anterior preservada. Schema 3 acrescenta `journey` v1:
  atividade atual, finalização, retorno pendente, recuperação obrigatória, checkpoints por atividade,
  descobertas acumuladas e contadores. Mantém XP, IDs de moedas, crédito legado,
  desbloqueios e recompensas antigas.
- Retoma rascunho, variante, vidas, registros lidos, salas iluminadas e conhecimento
  do cenário. Posição, chaves temporárias, respostas, portas e laços recomeçam em
  estado seguro. Não serializa uma execução suspensa ou objetos Phaser.
- Estatísticas: mortes, game overs, moedas únicas, atividades concluídas, execuções
  solicitadas, erros de código, instruções percorridas pelo executor, respostas,
  respostas rejeitadas pelo validador e anotações únicas. Não se atribui acerto/erro
  a um input genérico sem validador. Laços contam o corpo a cada iteração; a
  instrução rejeitada pelo limite de segurança não entra no total executado.
  Não se estima tempo jogado nem histórico de mortes/instruções ausente em saves
  anteriores; a tela avisa quando as contagens começaram na migração para V6.
- A20 salva e mostra **JORNADA CONCLUÍDA**, inclusive após reload. Estatísticas e
  reinício ficam na tela final. Reinício zera a jornada e impede que o shutdown
  da cena antiga regrave seus dados sobre o novo save.
- `?dev=1` usa estado somente em memória, separado do save normal. Seletor e voo
  por setas ficam disponíveis; voo não coleta nem aciona mecanismos, suspende a
  execução e retorna ao início seguro ao ser encerrado. Digitar no editor/input
  não movimenta Guto. Não muda a velocidade dos comandos.

## Atividades e narrativa

| Atividade | Mudança e verificação |
|---|---|
| A6 | `input()` usa o mesmo formulário de A7; resposta AURORA fora do editor, após ler o registro. Literal antigo sem resposta de input não abre o selo. `print` ainda faz parte do objetivo. |
| A12 | Placa substituída por `mechanism_switch`, sempre desligado; pisar não ativa. `ativar_interruptor()` próximo aciona; `interruptor_ativo()` orienta if/else. Arte fixa e sem brilho/feedback de estado; espinhos mostram a consequência. |
| A13 | Duas perguntas sequenciais, vinculadas ao Registro da Fonte (12) e à Regra dos Validadores (10). Ambas corretas são requisitos dos guardiões e da conclusão. Uma resposta isolada não basta. |
| A14 | Contrapeso movido de (10,7) para (3,6), na câmara azul; novo Diário de manutenção orienta o desvio. Antiga rota automática encontra espinhos ativos. Nenhuma célula do mapa mudou. |
| A14/A18 | Duas/quatro placas falsas em pisos acessíveis e sem sobreposição com entidades. Não ativam, brilham ou alteram conexões. A6 é runa, não placa de pressão; A12 deixa de usar placa. |

Anotações e fragmentos de baús receberam relatos curtos, mantendo os números e
palavras aprovados. Gabarito V6 e catálogo derivam do código. Somente as soluções
A6/A12/A13/A14 mudaram. Orçamentos A12/A14 cresceram pelo desvio/interação necessários.
As variantes iniciais ON/OFF de A12 foram removidas para atender ao início sempre
desligado: são 28 cenários oficiais V6 versus 29 históricos V4/V5. Ambos os estados
do novo interruptor têm regressão específica.

Tutoriais A1/A6/A11/A16 mostram orientação e exemplos de sintaxe; não escrevem
partes da solução. O acompanhamento não reseta o mundo nem intercepta a vitória:
solução completa desde a primeira orientação conclui normalmente.

## Visual e recursos

- Portas, grades e guardiões usam `AnimationSystem.transition`, incluindo estados
  intermediários de abertura/fechamento e colisão mantida até o término.
- `SpriteAtlasSystem` deriva uma máscara transparente da pilha de ouro, removendo
  somente o fundo neutro. Cores dos pixels dourados preservadas. Fontes não alteradas.
- Paredes reaproveitam alvenaria e silhueta vertical, com paleta violeta compatível
  com o piso. Não viram tiles caminháveis; colisões e mapas permanecem iguais.
- Arte é preparada uma vez no carregamento, sem novos timers por quadro. Áudio,
  iluminação V5 e atlas do personagem preservados. Sem assets externos novos.
- Corrigido clique do painel de áudio (`pointer-events:auto`). Aprovação visual
  e sonora dessa correção ainda não foi feita após a mudança de escopo.

## Limites de validação

Testes de DOM/Phaser usam adaptadores. Os testes de pixels e referências não
equivalem à homologação visual. Conferir manualmente morte, final, responsividade,
portas, moedas, paredes, interruptor discreto, placas, textos e áudio. Música
permanece provisória. Não declarar V5 ou V6 congelada por resultados automatizados.
