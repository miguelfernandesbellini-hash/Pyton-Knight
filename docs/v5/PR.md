# feat(v5): polimento audiovisual sobre a V4

Destino: `main` · Origem: `feat/v5-polimento-audiovisual` · Abrir como **draft**.

A V4 não tinha áudio ambiente nem controles de som. Esta mudança acrescenta uma
trilha original provisória em loop, efeitos discretos e controles de música,
efeitos e mudo que acompanham a sessão entre menu e atividades.

Adiciona iluminação decorativa sob a névoa existente, halo do Guto, brilho em
tochas/runas/portais/itens, partículas limitadas e feedback de coleta. Completa a
apresentação da conclusão com progresso X/20 e moedas já creditadas. A câmera
centraliza no destino durante o fade do teleporte. Os recursos novos respeitam
movimento reduzido e têm limpeza no ciclo de vida do Phaser.

Preserva as 20 atividades, mapas, soluções, interpretador, Livro Mágico, XP,
moedas, vidas, persistência e progressão. Nenhuma migração ou dependência de
produção nova. Áudio original documentado em `assets/audio/README.md` (CC0-1.0).

## Validação

- 281/281 testes: 269 existentes e 12 V5; zero falhas/skips.
- Suíte legada PASS; 20 mapas e 29 cenários oficiais; 69 requisitos verificados.
- 145 verificações de acesso às 100 moedas: PASS.
- Sintaxe dos módulos e diff verificados. Nenhuma regressão de lógica detectada.
- Novos testes cobrem música única, autoplay, volume/mudo, transições de controles,
  cleanup, limites de efeitos e atmosfera nas 20 atividades sem mutar o mundo.

## Aprovação pendente

**V5 IMPLEMENTADA — AGUARDANDO HOMOLOGAÇÃO.** PK-024 continua aberto. Chrome
automatizado bloqueado no ambiente por `spawn EPERM`; testes com adaptadores não
comprovam aparência, audição, console ou desempenho real. Homologar conforme
`docs/v5/HOMOLOGACAO_VISUAL_SONORA.md`, incluindo a aprovação da música provisória.

Não fazer merge nem declarar V5 final congelada antes da homologação humana.
