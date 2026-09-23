# V6 — estado para continuidade

Implementação concluída e testes automatizados aprovados em 23/09/2026.
**V6 IMPLEMENTADA — AGUARDANDO HOMOLOGAÇÃO VISUAL MANUAL.** PK-024 aberto.

Branch: `feat/v6-gameplay-polimento`. Base V5: `1286337`, com `15c2332` preservado;
main/V4 não alterada. A pasta local mantém o nome histórico Pyton-Knight-V5,
mas esta branch carrega `activities-v6.js`. Não copiar a V4 nem reaplicar scripts
temporários de implementação sobre esta árvore.

## Blocos implementados

- `ab7242d`: correção de clique do áudio e registro da rodada manual de origem.
- `c82559c`: jornada/save/morte/estatísticas/dev e revisão das atividades/narrativa.
- `c667318`: animações consistentes de portas e arte derivada de moedas/paredes.
- `80a4469`: recuperação obrigatória, retorno pelo menu após reload e métricas precisas.
- Commit de documentação posterior: consultar `git log` para o hash exato.

Consultar [PUBLICACAO.md](PUBLICACAO.md) para o resultado da tentativa de push.
Nenhum merge em main foi realizado.

## Pontos de entrada

- `activities-v6.js`: camada aditiva; gabarito V6 e catálogo são gerados por
  `tools/v6/document.cjs`. Nunca usar geradores históricos para atualizar a V6.
- `systems/JourneySystem.js`: checkpoints, game over, recuperação, final e estatísticas.
- `PersistenceService.js` / `ProgressionSystem.js`: migração compatível e recompensas
  existentes. Chave localStorage preservada; schema 3 / journey v1.
- `systems/DevToolsSystem.js`: voo e isolamento do save normal.
- `MechanismSystem.js` / `DungeonSystem.js`: perguntas associadas e interruptor.
- `TutorialSystem.js`: orientação sem preencher solução ou interceptar sucesso.
- `AnimationSystem.js`, `SpriteAtlasSystem.js`, `MapRenderer.js`: transições e arte.
- `tests/v6-*.test.cjs`: 45 testes V6; conjunto completo 326 PASS, legado PASS,
  28 cenários, 74 verificações de requisitos, 140 acessos às moedas.

Ver [IMPLEMENTACAO.md](IMPLEMENTACAO.md) e [TESTES.md](TESTES.md) para decisões,
falhas, correções, procedimentos e evidências úteis aos capítulos 4 e 5 do TCC.
Não foram escritos capítulos completos nem alterada a Tarefa 1. Não houve agentes,
Computer Use ou alteração da velocidade de jogo.

## Próximo passo

Homologação humana segundo [checklist](HOMOLOGACAO_MANUAL.md), sobretudo morte/final,
retomada normal, A6/A12/A13/A14, placas, narrativa, moedas/paredes/portas, HUD e áudio.
Música ainda provisória. Só corrigir defeitos reproduzidos e retestar as áreas
afetadas; não repetir implementação, reconstruir fases ou declarar versão congelada.
