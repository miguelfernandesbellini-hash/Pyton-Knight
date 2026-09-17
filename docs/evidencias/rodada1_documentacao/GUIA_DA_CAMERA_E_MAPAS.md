# Guia da câmera e dos mapas

- Roda para cima aproxima; para baixo afasta. Os botões + e − são alternativas.
- Zoom inicial: 100%; mínimo: 55%; máximo: 200%. Células permanecem com 64 pixels no mundo, sem encolher todos os mapas para caberem inteiros.
- Arraste com o botão principal sobre o mapa para explorar. Isso nunca move Guto.
- Centralizar no Guto aproxima suavemente a visão do personagem.
- Durante a execução, a câmera acompanha Guto suavemente. Arrastar interrompe esse acompanhamento; centralizar durante a execução o retoma. Ao executar novamente, o acompanhamento é ativado.

## Limites e integração Phaser

`CameraModel` calcula o centro permitido a partir das dimensões do mapa e de viewport/zoom. Em um eixo onde o mapa é menor que a área visível, o mapa fica centralizado; margens vazias são inevitáveis nesse caso e não representam pan infinito. Em mapas maiores, a câmera fica limitada às bordas. O zoom usa o cursor como âncora até encontrar um limite.

`Controller.resize` lê a área `.dungeon-viewport` e chama `camera.setViewport`. `apply` usa `setZoom` e `setScroll`, considerando que o zoom Phaser ocorre ao redor do centro da viewport. Os limites são aplicados pelo modelo, sem uma segunda aplicação conflitante de `setBounds`.

A aproximação usa interpolação exponencial com constante de 130 ms. Centralização isolada termina após aproximadamente 850 ms. Eventos de resize/ResizeObserver recalculam a área. Eventos de ponteiro usam captura para manter o arraste coerente. Shutdown remove listeners e observador.

Livro Mágico, HUD, menu e controles vivem no DOM, fora da câmera. Não há comandos WASD, movimento por clique ou pan que altere posição, colisão, rumo ou objetivos do personagem.

## Mapas preservados

A comparação dos 20 objetos de atividades confirma mapas, startPosition, obstáculos, regiões, rotas, soluções e regras de vitória idênticos. A única mudança de configuração é a conexão da placa da atividade 12 aos espinhos superiores/inferiores, para o sensor continuar coerente após interação.

## Validação

Há testes automatizados para limites, zoom ancorado, mapas menores, arraste sem movimento de Guto, suavização, centralização, adaptação da viewport Phaser e descarte de eventos. Esses testes usam modelo numérico e adaptador Phaser. A sensação de uso, nitidez, geometria final da viewport e gestos no navegador real estão PENDENTES; não confundir resultados dos adaptadores com uma captura renderizada.
