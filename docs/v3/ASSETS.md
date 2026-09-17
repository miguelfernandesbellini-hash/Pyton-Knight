# Assets utilizados e lacunas de arte — V3

A linguagem visual usa as referências fornecidas: pedra grafite/violeta, dungeon em pixel art, objetos com contorno e mecanismos legíveis. Nenhum mapa de referência foi copiado. O catálogo completo de papéis de textura está em `systems/AssetCatalog.js`; os assets anteriores foram mantidos.

| Família | Arquivo/fonte usada | Estados e integração |
|---|---|---|
| Guto | `assets/v3/guto-source.png` | 16 quadros; idle e três poses de passo por direção. Atlas normalizado em 64×64, pés alinhados |
| Piso | `assets/v3/tiles-source.png` | Pedra padrão, rachada, marcação rúnica e tablado de ponte |
| Paredes/bordas/vazios | `assets/dungeon/castle_details/individual_tiles/` | Faces, topo, variação, arcos, borda e vazio profundo da base |
| Portas/grades | Mesmo tileset Castle | Fechado/aberto com deslocamento e fade intermediários; guardiões usam sprite próprio |
| Alavancas/interruptores | `assets/v3/props-source.png` | OFF/ON, reação curta; azul/verde diferenciados por tint |
| Livros/inscrições | Mesmo atlas V3 | Fechado/lido; conteúdo textual no diálogo/Diário após interação |
| Baús/cofres | Mesmo atlas V3 | Fechado, abrindo, aberto |
| Runas/placas | Mesmo atlas V3 | Inativa/energizada; famílias compartilham paleta e símbolo |
| Portais/espelhos | Mesmo atlas V3 | Inativo/ativo; pulso e fade de transporte |
| Rubi e cristal | Mesmo atlas V3 | Rubi vermelho e cristal azul distinguíveis |
| Espinhos | `assets/dungeon/traps/spikes/spikes_on.png` e `spikes_off.png` | Sete quadros para subida/retração; quadro de furos visível quando recolhidos |
| Chave | `assets/dungeon/interactives/keys/key_idle.png` | Asset da base; coleta remove objeto e atualiza HUD |
| Moedas | Tile Castle `tile_x12.png` | Ouro opcional, separado do contador de rubis |
| Guardião/Basilisco/pedestal/totem | `assets/custom/` | Sprites integrados na rodada anterior, preservados; tints/efeitos por estado |
| Luz/sombra | `DiscoverySystem` + `AnimationSystem` | Máscara gráfica por tile, visão local, memória, transição de luz e redução de visibilidade |
| Feedback/interface | `ui/GameUI.js`, `ui/game.css` | Inscrição, Diário, vidas, inventário, console, input e conclusão |

## Preparação técnica

As três novas fontes V3 foram geradas nesta rodada a partir das referências. Os arquivos-fonte foram preservados. `SpriteAtlasSystem` remove o fundo magenta de personagem/objetos em tempo de carregamento, recorta as células e normaliza âncoras. O tileset usa seus quatro quadrantes. O Phaser continua configurado com `pixelArt: true`.

Ordem real das linhas de Guto: baixo, direita, esquerda, cima. O mapeamento foi ajustado ao atlas produzido, mantendo a orientação lógica. `docs/v3/evidencias/visual/guto-atlas.png` e `props-atlas.png` permitem conferir os recortes isoladamente.

As referências visuais originais acompanham `referencias/visuais`. As licenças já presentes da base acompanham `licenses/`, sem alteração. Este inventário registra origem e uso; não atribui autoria nova a materiais recebidos nem altera seus termos.

## Lacunas visuais explícitas

- Giro usa troca da pose direcional. Interação, dano, medo e vitória usam a mesma arte direcional com deslocamento, tremor, tint e salto; não foram desenhadas folhas exclusivas dessas ações.
- Portas usam estados da base com transição procedural, em vez de uma folha dedicada de vários quadros de grade subindo.
- Placas de pressão, alternância, estado lógico e sequência compartilham a família rúnica OFF/ON. Um botão de pressão com depressão desenhada própria seria refinamento adicional.
- Tipos de inscrição diferentes reutilizam o livro e sua janela textual; não há variantes exclusivas desenhadas para cada lápide, estante, mural ou pergaminho do catálogo proposto.
- Bordas/cantos e decoração extra reutilizam o tileset existente. A ambientação funcional está integrada; variedade ornamental adicional permanece uma possibilidade de arte, não uma dependência para executar as 20 atividades.
- Não há asset obrigatório ausente no carregamento estático. A aceitação artística final, recortes em movimento, escala no zoom e legibilidade em tela real dependem de PK-024.

Não é preciso contratar arte externa para rodar esta entrega. Se for exigida animação desenhada quadro a quadro para todas as ações acima, será necessária uma rodada adicional de arte. Essa lacuna é diferente da implementação funcional dos estados, que está presente e testada logicamente.
