# Assets e arte — V4

17/09/2026. Reutiliza o [catálogo V3](../v3/ASSETS.md), incluindo Guto direcional, pisos, portas, espinhos, alavancas, iluminação, baús, runas, portais e textos.

## Nova arte

| Arquivo | Uso |
|---|---|
| `assets/v4/totem-source.png` | Fonte original gerada: dois estados do mesmo totem, RGBA 1774×887 |
| `assets/v4/totem-off.png` | Quadro inativo normalizado, RGBA 64×64 |
| `assets/v4/totem-on.png` | Quadro energizado normalizado, RGBA 64×64 |

Ferramenta: **image_gen integrada**, modo de geração, sem CLI/API alternativa. Fonte gerada em 17/09/2026 e incorporada ao projeto. A referência de estilo foi o atlas V3 já integrado e inspecionado. A normalização técnica em `tools/v4/prepare-assets.cjs` recorta as células, preserva alfa, aplica a mesma escala com vizinho mais próximo e alinha ambas pela base. Não redesenha a imagem. Os PNGs finais estão incluídos: não é necessário gerar arte ao executar o jogo.

Prompt final utilizado:

> Use case: stylized-concept. Asset type: a single game sprite sheet for Pyton Knight V4, a polished 2D pixel-art dungeon. Create exactly TWO frames side by side in an evenly divided two-column, one-row sheet. They show the SAME stone RUNE TOTEM in the SAME front/top-down RPG perspective, proportions, silhouette, anchoring and size: left INACTIVE with a dark carved angular diamond rune, right ACTIVATED with that same rune lit vivid cyan and small golden trim highlights. Each object is fully separated, centered in its half with ample empty margins and an identical bottom baseline. Subject: a low broad slate-gray carved stone monument on a stepped square plinth, beveled stone cap, engraved diamond emblem on the front, a thin bronze band. Crisp readable silhouette at 54 pixels tall, coarse deliberate pixel clusters, dark navy outlines, restrained 16-bit palette, shadowed purple/slate stones, gray blue bevel highlights, aged gold details. Match the style of the dungeon props image shown earlier in the conversation; it is a STYLE REFERENCE only, do not reproduce its objects. No wall tiles, no environment, no characters, no lettering, no labels, no numbers, no grid lines, no watermark. Genuinely transparent background with alpha, no checkerboard or ground plane. The two frames must differ only in illuminated rune state, not geometry. No smooth painting, no blur, no soft glow outside the silhouette.

## Reuso e integração

125 decorações usam os papéis já disponíveis: `banner_blue_plain`, `banner_blue_gold`, `painting_landscape`, `painting_castle`, `shield_blue`, `shield_gold`, `weapons_crossed_steel`, `weapons_crossed_gold` e `bookshelf_left`. Estantes investigáveis usam `bookshelf_left/right` com as inscrições já existentes; moedas usam `coin_pile`; rubis usam `v3_ruby`. O `!` é um pequeno elemento de texto monoespaçado de alto contraste no Phaser, sob a neblina.

Não foram substituídas paredes, animações de Guto ou sprites já aprovadas. A imagem antiga `assets/custom/totem.png` continua no histórico/catálogo legado, mas os oito totens de produção V4 usam os PNGs novos.

## Revisão e pendências

Fonte dos totens e quatro pranchas das unidades inspecionadas visualmente. Os 20 mapas possuem plantas estáticas em `evidencias/visual`. Densidade decorativa moderada, sem objetos adicionais no percurso e sem nova colisão. Nenhum outro prop foi trocado sem necessidade.

Não foi identificada dependência nova de arte externa para esta rodada. Os efeitos procedurais V3 para interação, medo, dano e vitória continuam, sem folhas exclusivas desenhadas para cada ação. A legibilidade final de sprites, `!`, estados e modal no navegador continua pendente de PK-024.
