# Entrega V5 — 22/09/2026

**V5 IMPLEMENTADA — AGUARDANDO HOMOLOGAÇÃO.**
**PENDÊNCIA DE HOMOLOGAÇÃO VISUAL E SONORA — PK-024.**

## Base e escopo

Base real: `22001269b7dab2b8a0477564f3efbdfa62a152b8`, V4.
Branch: `feat/v5-polimento-audiovisual`. `main` preservada na V4.
Um único agente principal; sem Computer Use e sem retomar a Tarefa 1.
Não havia AGENTS.md aplicável nem áudio local. O Vault não estava instalado;
este relatório fica pronto para incorporação posterior, sem alterar o Vault.

Mapas, atividades V3/V4, soluções, parser, interpretador, persistência, moedas,
XP, vidas, progressão e mecânicas foram preservados. Não há dependência de produção
nova, backend ou migração de Phaser.

## Implementação e decisões

- `systems/AudioSystem.js`: uma sessão por instância do jogo; uma música em loop;
  início condicionado a gesto real e desbloqueio do Phaser; volumes de música e
  efeitos separados, mudo global dos sons V5; preferências mantidas na sessão.
  Instâncias de efeitos reutilizadas, limite de frequência, listeners e sons
  removidos ao encerrar a instância. Sem localStorage adicional.
- `assets/audio/` e `tools/v5/generate-audio.py`: trilha original provisória de
  32 segundos e seis efeitos originais, sintetizados sem samples externos.
  PCM mono, 22.050 Hz; total inferior a 1,7 MB. Fonte e licença CC0-1.0 registradas.
  A aprovação artística e dos níveis sonoros depende de PK-024.
- `systems/AtmosphereSystem.js`: iluminação 2D decorativa por textura radial
  compartilhada e camadas Phaser, compatível com Canvas/WebGL, sem exigir normal
  maps. Ambiente discreto, halo, tochas, cristais, runas, portais, itens e perigos.
  Névoa e regras de luz de `DiscoverySystem` continuam soberanas: nenhum objeto
  oculto é revelado pela V5.
- Máximo de 64 fontes por cena, 24 pequenas partículas ambientes e 8 anéis de
  feedback transitórios. Sem timers ou emissores adicionais. Objetos reaproveitados
  por frame, textura compartilhada, limpeza explícita em shutdown/reattach.
- `AnimationSystem.js` / `MapRenderer.js`: respiração idle discreta, feedback de
  coleta/interação e sons de dano/conclusão; animações anteriores preservadas.
  Câmera centralizada no teleporte durante o fade quando acompanha Guto, evitando
  percorrer o mapa. Preferência do sistema por movimento reduzido desliga idle,
  pulsação, partículas ambientes e entrada animada da conclusão.
- `GameUI.js` / `game.css`: controles acessíveis por teclado no cabeçalho/menu,
  percentuais de volume, estado de mudo, fechamento com Escape. Layout existente
  preservado; sem painel permanentemente sobre o mapa.
- `CompletionSystem.js`: progresso real X/20 e esclarecimento de que as moedas
  já foram creditadas na coleta. Recompensa e idempotência continuam na lógica V4.
- Integrações de carregamento/ciclo de vida em `Boot.js`, `Preloader.js`,
  `MainMenu.js`, `Game.js` e `index.html`.

## Testes realizados

| Verificação | Resultado |
|---|---|
| `node --test --test-isolation=none --test-reporter=tap tests/*.test.cjs` | 281/281, zero falhas, zero skips |
| Novos `tests/v5-polish.test.cjs` | 12/12 |
| Testes anteriores | 269/269, incluindo 10 de interface V4 |
| `node tests/run-tests.cjs` | PASS |
| `node tools/v3/audit.cjs --v4` | 20 mapas, 29 cenários, 69 omissões/requisitos: PASS |
| `node tools/v4/audit-coins.cjs` | 145 acessos, 29 cenários, 100 IDs: PASS |
| `node --check` nos módulos de produção | Zero falhas |
| Revisão do diff / `git diff --check` | Sem erros de whitespace; escopo preservado |

Novos testes verificam: autoplay, música única após 30 acessos entre cenas,
volumes/mudo, ausência de áudio disponível, integridade dos WAVs e continuidade
do loop, limites de efeitos, cleanup, controles DOM e troca menu/jogo, 20 atividades
sem mutação de estado pela atmosfera, ocultação de luzes, movimento reduzido,
reattach, coleta sem feedback duplicado no reset, teleporte e conclusão sem XP
duplicado. Evidências em `evidencias/`.

Nenhuma regressão de lógica detectada. Os testes V3/V4 não foram afrouxados.
No novo teste do WAV, o critério de emenda foi corrigido para comparar inclinações
das amostras vizinhas: diferença entre amostras consecutivas existe mesmo em um
sinal contínuo. Não foi necessário alterar a composição para mascarar descontinuidade.

## Limites de validação

O lançador padrão `node --test` sofreu `spawn EPERM`; o modo sem subprocessos
executou a suíte completa. A tentativa de smoke no Chrome/Playwright também sofreu
`spawn EPERM`. Não foi usado Computer Use como substituição.

Adaptadores de DOM/Phaser não renderizam CSS nem reproduzem áudio. Não se afirma
ausência de warnings no navegador, homologação de aparência, audição do loop ou
desempenho medido em dispositivo real. Esses itens seguem no checklist PK-024.

## Git e entrega local

O ambiente negou escrita em `.git/index.lock` no checkout original mesmo após a
liberação específica. Os arquivos implementados foram mantidos nesse checkout.
Uma cópia dentro de `outputs/Pyton-Knight-V5` preserva o histórico integral e contém
os commits V5. Não houve force push, alteração de main, exclusão de histórico ou merge.

Commit da implementação e dos testes: `15c2332`.
O commit seguinte registra relatório, checklist, texto do PR e evidências.

Push HTTPS bloqueado: Schannel retornou `SEC_E_NO_CREDENTIALS`; a tentativa com
OpenSSL manteve a verificação TLS, mas falhou no helper de autenticação com
`couldn't create signal pipe` / `unable to get password from user`.
A integração GitHub conseguiu consultar a main, ainda no commit V4. Não foi criado
PR remoto sem branch publicada. O texto completo está em `PR.md`.

Para enviar posteriormente, dentro da cópia da entrega com autenticação funcional:

```powershell
git push -u origin feat/v5-polimento-audiovisual
```

Abra um PR **draft** para `main` usando `PR.md`. Não fazer merge nem congelar V5
antes da aprovação visual/sonora. O checkout original ainda não contém os commits
V5 em seus metadados Git; a cópia da entrega é a referência dos commits desta sessão.

## Pendências reais

1. Executar e aprovar o checklist visual/sonoro nas 20 atividades, incluindo console
   do navegador, autoplay real, escuta do loop e desempenho. PK-024 permanece aberto.
2. Aprovar a trilha original provisória ou substituir somente seu asset após seleção.
3. Publicar os commits e abrir o PR draft após resolver a autenticação local.
4. Incorporar este relatório ao Vault quando a Tarefa 1 estiver disponível.
