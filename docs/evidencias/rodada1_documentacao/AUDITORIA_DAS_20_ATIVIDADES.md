# Auditoria das 20 atividades

Todas as soluções oficiais e replays da suíte original passaram; todas as 20 fases também executaram com os componentes de UI/renderer reais sob adaptadores. A tabela abaixo descreve dados efetivamente publicados no guia e a configuração preservada. Não afirma que mecânicas ausentes foram adicionadas.

| Atividade | Conceito | Mapa (colunas×linhas) / início (linha,coluna) | Entidades atuais | Dados publicados | Resultado automático |
| --- | --- | --- | --- | --- | --- |
| 1 — Primeiros Passos | Atribuição de variável e movimento orientado | 7×4 / (1,1) | Tiles básicos | Guto começa olhando para Leste. Cada casa caminhável corresponde a um passo. | PASS |
| 2 — O Caminho Mutável | Reatribuição | 7×4 / (1,1) | Tiles básicos | Reatribuir é guardar um novo valor no mesmo nome de variável. | PASS |
| 3 — As Grades da Masmorra | Operações entre variáveis | 7×5 / (1,1) | Tiles básicos | As grades bloqueiam a passagem entre duas casas, mesmo quando ambas têm piso. | PASS |
| 4 — O Corredor de Lava | Operadores +, - e * | 7×6 / (1,1) | Tiles básicos | A lava é letal. Uma colisão com parede ou grade apenas interrompe o programa. | PASS |
| 5 — O Labirinto das Variáveis | Integração da Unidade 1 | 8×6 / (1,1) | Tiles básicos | Planeje as curvas antes de executar. O orçamento conta instruções, inclusive na mesma linha. | PASS |
| 6 — O Pedestal da Palavra | print() e saída de dados | 10×7 / (1,1) | gate, output_rune, pedestal | Palavra gravada: AURORA; Produza a palavra junto à runa. A grade abre automaticamente. | PASS |
| 7 — O Guardião da Resposta | input(), variável e print() | 11×8 / (1,1) | door, guardian, output_rune, pedestal | Palavra gravada: CORAGEM; Receba a palavra no pedestal e envie-a à runa com print(). Depois interaja com o Guardião e com a porta, quando estiver perto de cada um. | PASS |
| 8 — A Ponte dos Construtores | int(input()) e processamento numérico | 13×9 / (1,1) | bridge, lever, output_rune, pedestal | Grupos: 2 · Segmentos por grupo: 3; A inscrição pede o produto: grupos × segmentos. Acione a alavanca antes de enviar o total à runa. | PASS |
| 9 — O Salão dos Espelhos Rúnicos | Múltiplas entradas e processamento | 15×10 / (5,1) | gate, hazard, mirror, output_rune, pedestal | Primeira runa: 2 · Segunda runa: 3; Some as duas runas. O resultado identifica o espelho e a distância a partir do pedestal. Caminhe até o espelho para entrar nele. | PASS |
| 10 — O Cofre das Três Runas | Integração de entrada, processamento e saída | 17×12 / (1,1) | bridge, gate, lever, mirror, output_rune, pedestal | Runa A: 1 · Runa B: 2 · Runa C: 3; Inscrição da ponte: A × B. Inscrição final: (A × B) + C. Envie cada resultado junto à runa correspondente. | PASS |
| 11 — A Porta do Guardião | if e condição booleana | 11×8 / (1,1) | door, guardian, key | A chave está no desvio. Os dois bloqueios exigem a chave e interação próxima. | PASS |
| 12 — Os Dois Caminhos | if / else | 13×9 / (4,1) | hazard, toggle_plate | Placa ON: rota superior segura. Placa OFF: rota inferior segura.; Consulte placa_ativa() na bifurcação. A placa fica no desvio; seu estado inicial pode variar. | PASS |
| 13 — A Câmara das Comparações | Operadores relacionais | 14×10 / (8,1) | door, guardian, pedestal | Energia da runa: 12; Primeiro Guardião: energia maior ou igual a 10. Segundo Guardião: energia diferente de 0.; Converta a entrada em número. Cada Guardião abre a porta conectada quando você interage perto dele. | PASS |
| 14 — O Selo das Duas Alavancas | and / or | 16×11 / (9,7) | gate, hazard, lever, toggle_plate | Selo principal: alavanca azul E alavanca verde. Passagem secundária: azul OU verde.; A placa alterna os espinhos a cada nova pisada. As alavancas mantêm o estado até novo acionamento. | PASS |
| 15 — O Julgamento dos Três Portões | if / elif / else e integração | 18×12 / (10,1) | gate, key, lever, pedestal, portal | Poder da runa: 25; Sol (3): poder ≥ 20. Lua (2): 10 ≤ poder < 20. Sombra (1): poder < 10.; Os portões exigem chave e alavanca. Caminhe até o portão correspondente antes de entrar. | PASS |
| 16 — A Ponte dos Ecos | for + range() | 12×8 / (1,1) | bridge_segment, totem | A galeria tem 5 totens. Cada ativação constrói um segmento da ponte. | PASS |
| 17 — A Câmara dos Rubis | for + acumulador | 14×10 / (1,1) | coin, door | A porta pede 5 rubis. O acumulador desta atividade deve se chamar total e terminar com 5.; Colete no tile do rubi. Observe o padrão de distâncias no circuito. | PASS |
| 18 — O Corredor das Placas | while e condição de continuidade | 16×11 / (1,1) | hazard, toggle_plate | corredor_continua() verifica perigo ativo à frente. desativar_armadilha() age no perigo à frente.; As placas do percurso alternam os perigos laterais. Observe as curvas entre as zonas seguras. | PASS |
| 19 — A Chave Perdida | while + break | 18×12 / (10,1) | chest, door | A chave está em um dos 3 baús; a posição varia entre sessões. Ela só é revelada ao abrir o baú.; Abrir um baú exige estar nele ou olhar para ele na casa anterior. Interrompa a busca quando encontrar a chave. | PASS |
| 20 — O Santuário do Basilisco | Integração final das quatro unidades | 20×14 / (1,1) | bridge_segment, chest, coin, guardian, hazard, totem | Provas: 3 totens, armadilhas, busca em 3 baús e coleta de 3 rubis.; A proteção final exige chave, totens completos, armadilhas neutralizadas e rubis coletados. | PASS |

## Interpretação dos resultados

As coordenadas usam índices iniciando em zero, como o código recebido. Nenhuma startPosition foi alterada. A passagem das soluções garante uma rota funcional oficial, mas não uma prova formal de ausência de toda situação sem saída em toda exploração possível.

As variantes previstas na suíte original cobrem 27 cenários, inclusive escolhas de caminho e busca nos baús; seus inputs e resultados exatos estão em `evidencias/suite-final.json`. Os tutoriais 1, 6, 11 e 16 somam 14 microetapas verificadas.

Atividade 6 ensina print, não input. Atividade 7 usa CORAGEM. Atividades 8, 9, 10, 13 e 15 têm testes de entrada numérica inválida e recuperação. Os dados necessários são publicados no Livro; comparações/operadores não são substituídos por adivinhação de valores secretos.

Atividade 12 recebeu somente conexões de placa/espinhos; sua classificação documental M01 permanece divergente do tipo toggle_plate recebido. Atividades 18/20 não receberam um relógio cíclico novo. Avaliação de presença de conceitos e classificação da atividade 15 exigem revisão pedagógica futura, PK-022/023.
