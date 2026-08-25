# Relatório de Reelaboração dos Mapas — Atividades 6 a 20

Data: 24 de agosto de 2026  
Status geral: **PASS — mapas implementados e rotas oficiais executadas fisicamente**

## Escopo e decisões

- Os objetivos pedagógicos e os sistemas globais existentes foram preservados.
- `PythonSubsetParser`, `CommandInterpreter`, vidas, XP, moedas, persistência, Livro Mágico, progressão e validador de orçamento não foram refeitos.
- A adaptação indispensável ficou restrita à espacialização das interações, sensores orientados, teletransporte com orientação e representação visual de regiões/entidades.
- Os mapas cabem na área atual por escala dinâmica: 68 px/tile nos menores e 35 px/tile no mapa 20 × 14; não foi necessária reforma de câmera nem redução ilegível.
- O modo `?dev=1` permanece usando o fluxo existente e libera ANTERIOR/PRÓXIMA sem alterar o bloqueio normal.

## Resumo

| Ativ. | Dimensão | Áreas | Curvas aprox. | Estrutura | Status |
|---:|---|---:|---:|---|---|
| 6 | 10 x 7 | 3 | 4 | sala inicial, galeria com duas curvas e câmara final | PASS |
| 7 | 11 x 8 | 4 | 4 | sala inicial, desvio de entrada, galeria do Guardião e porta final | PASS |
| 8 | 13 x 9 | 5 | 7 | duas margens, dois desvios obrigatórios e ponte física de três segmentos | PASS |
| 9 | 15 x 10 | 4 | 4 | salão seletor com três espelhos e três alas de destino | PASS |
| 10 | 17 x 12 | 6 | 12 | seis regiões conectadas por desvio, ponte, espelho e retorno ao eixo final | PASS |
| 11 | 11 x 8 | 4 | 7 | desvio de chave, retorno ao eixo e dois bloqueios em sequência | PASS |
| 12 | 13 x 9 | 4 | 6 | bifurcação verdadeira com rota superior e inferior simétricas | PASS |
| 13 | 14 x 10 | 4 | 6 | pedestal, salão com três escolhas e duas validações na rota correta | PASS |
| 14 | 16 x 11 | 5 | 9 | salão central, duas alas opostas, retorno obrigatório e dois selos | PASS |
| 15 | 18 x 12 | 6 | 14 | região inicial, salão central e três rotas teleportadas que convergem na câmara final | PASS |
| 16 | 12 x 8 | 4 | 4 | entrada em L, galeria visual de cinco totens, ponte em curva e margem final | PASS |
| 17 | 14 x 10 | 5 | 7 | entrada, circuito crescente por cinco posições e corredor final selado | PASS |
| 18 | 16 x 11 | 5 | 8 | quatro pequenas câmaras diagonais, placas alternadoras, riscos laterais e saída reta curta | PASS |
| 19 | 18 x 12 | 6 | 12 | grande área de busca com três câmaras, eixos de retorno distintos e porta distante | PASS |
| 20 | 20 x 14 | 5 | 14 | cinco regiões conectadas: totens, armadilhas, baús, rubis e santuário final | PASS |

## Detalhamento por atividade

### Atividade 6 — O Pedestal da Palavra

- Dimensão final: **10 x 7**.
- Estrutura espacial: sala inicial, galeria com duas curvas e câmara final.
- Áreas e curvas: 3 áreas; aproximadamente 4 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - pedestal: pedestal_word (3,6)
  - output_rune: rune (3,7)
  - gate: gate (4,7)
- Mudança na solução oficial: Guto percorre duas curvas, imprime a palavra diante da runa, cruza a grade e entra na câmara final.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 7 — O Guardião da Resposta

- Dimensão final: **11 x 8**.
- Estrutura espacial: sala inicial, desvio de entrada, galeria do Guardião e porta final.
- Áreas e curvas: 4 áreas; aproximadamente 4 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - pedestal: input_pedestal (3,3)
  - output_rune: answer_rune (3,4)
  - guardian: guardian (3,8)
  - door: door (5,9)
- Mudança na solução oficial: A rota obriga Guto a visitar o pedestal, enfrentar o Guardião e se reposicionar diante da porta.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 8 — A Ponte dos Construtores

- Dimensão final: **13 x 9**.
- Estrutura espacial: duas margens, dois desvios obrigatórios e ponte física de três segmentos.
- Áreas e curvas: 5 áreas; aproximadamente 7 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - lever: lever (4,4)
  - pedestal: measure_pedestal (1,6)
  - output_rune: measure_rune (2,6)
  - bridge: bridge1 (4,7), bridge2 (4,8), bridge3 (4,9)
- Mudança na solução oficial: O desvio ativa a alavanca; o produto 2 × 3 energiza a runa e torna os três tiles da ponte transitáveis.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 9 — O Salão dos Espelhos Rúnicos

- Dimensão final: **15 x 10**.
- Estrutura espacial: salão seletor com três espelhos e três alas de destino.
- Áreas e curvas: 4 áreas; aproximadamente 4 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - pedestal: rune_pedestal (5,1)
  - output_rune: selector_rune (5,2)
  - mirror: mirror3 (5,4), mirror5 (5,6), mirror7 (5,8)
  - hazard: wrong_spikes_3 (1,3), wrong_spikes_7 (7,4)
  - gate: cofre (2,12)
- Mudança na solução oficial: O resultado 5 também é a distância até o espelho correto; na ala correta Guto contorna o cofre antes do cristal.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 10 — O Cofre das Três Runas

- Dimensão final: **17 x 12**.
- Estrutura espacial: seis regiões conectadas por desvio, ponte, espelho e retorno ao eixo final.
- Áreas e curvas: 6 áreas; aproximadamente 12 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - pedestal: pedestal_a (1,3), pedestal_b (4,4), pedestal_c (7,12)
  - lever: lever (4,3)
  - output_rune: rune_b (4,5), rune_c (7,11)
  - bridge: bridge1 (4,9), bridge2 (4,10), bridge3 (4,11)
  - mirror: mirror5 (7,10)
  - gate: cofre (9,5)
- Mudança na solução oficial: A Boss distribui A, B e C em câmaras diferentes; o produto abre a ponte e o código final ativa o espelho que leva ao cofre.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 11 — A Porta do Guardião

- Dimensão final: **11 x 8**.
- Estrutura espacial: desvio de chave, retorno ao eixo e dois bloqueios em sequência.
- Áreas e curvas: 4 áreas; aproximadamente 7 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - key: key (3,3)
  - door: door (4,7)
  - guardian: guardian (5,8)
- Mudança na solução oficial: A chave está fora da rota principal; Guto volta ao eixo, abre a porta e depois enfrenta o Guardião.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 12 — Os Dois Caminhos

- Dimensão final: **13 x 9**.
- Estrutura espacial: bifurcação verdadeira com rota superior e inferior simétricas.
- Áreas e curvas: 4 áreas; aproximadamente 6 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - toggle_plate: plate (3,2)
  - hazard: spikes_upper (2,6), spikes_lower (6,6)
- Mudança na solução oficial: Cada variante ativa os espinhos de uma ala; if/else conduz por rotas distintas e convergentes.
- Testes: 2 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 13 — A Câmara das Comparações

- Dimensão final: **14 x 10**.
- Estrutura espacial: pedestal, salão com três escolhas e duas validações na rota correta.
- Áreas e curvas: 4 áreas; aproximadamente 6 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - pedestal: energy_pedestal (8,4)
  - door: door_low (4,3), door_equal (4,10), door_high (2,7), door_second (2,10)
  - guardian: guardian_high (3,7), guardian_second (2,9)
- Mudança na solução oficial: A energia 12 conduz à ala ≥ 10 e ainda precisa satisfazer uma segunda comparação antes do cristal.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 14 — O Selo das Duas Alavancas

- Dimensão final: **16 x 11**.
- Estrutura espacial: salão central, duas alas opostas, retorno obrigatório e dois selos.
- Áreas e curvas: 5 áreas; aproximadamente 9 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - lever: lever_blue (5,2), lever_green (5,13)
  - toggle_plate: toggle_plate (5,10)
  - hazard: spikes (5,11)
  - gate: gate_main (4,7), gate_side (3,9)
- Mudança na solução oficial: Guto percorre as duas alas, usa a placa para neutralizar os espinhos e retorna aos selos AND/OR.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 15 — O Julgamento dos Três Portões

- Dimensão final: **18 x 12**.
- Estrutura espacial: região inicial, salão central e três rotas teleportadas que convergem na câmara final.
- Áreas e curvas: 6 áreas; aproximadamente 14 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - key: key (8,3)
  - lever: lever (10,6)
  - pedestal: power_pedestal (6,6)
  - portal: portal1 (6,3), portal2 (3,6), portal3 (6,10)
  - gate: gate (2,15)
- Mudança na solução oficial: Os três ramos levam a regiões distintas e convergem diante do mesmo portão final.
- Testes: 3 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 16 — A Ponte dos Ecos

- Dimensão final: **12 x 8**.
- Estrutura espacial: entrada em L, galeria visual de cinco totens, ponte em curva e margem final.
- Áreas e curvas: 4 áreas; aproximadamente 4 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - totem: t1 (3,4), t2 (3,5), t3 (3,6), t4 (3,7), t5 (3,8)
  - bridge_segment: bridge1 (4,9), bridge2 (5,9), bridge3 (6,9), bridge4 (6,8), bridge5 (6,7)
- Mudança na solução oficial: Cada iteração ativa um totem diferente e um segmento correspondente; a rota então dobra duas vezes sobre a ponte.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 17 — A Câmara dos Rubis

- Dimensão final: **14 x 10**.
- Estrutura espacial: entrada, circuito crescente por cinco posições e corredor final selado.
- Áreas e curvas: 5 áreas; aproximadamente 7 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - coin: r1 (6,4), r2 (6,5), r3 (8,5), r4 (8,2), r5 (4,2)
  - door: door (5,7)
- Mudança na solução oficial: As distâncias 1, 2, 3, 4 e 5 formam um circuito espacial; o acumulador libera a porta ao final.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 18 — O Corredor das Placas

- Dimensão final: **16 x 11**.
- Estrutura espacial: quatro pequenas câmaras diagonais, placas alternadoras, riscos laterais e saída reta curta.
- Áreas e curvas: 5 áreas; aproximadamente 8 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - hazard: h1 (1,2), h2 (3,4), h3 (5,6), h4 (7,8), side1 (2,2), side2 (4,4), side3 (6,6), side4 (8,8)
  - toggle_plate: p1 (3,3), p2 (5,5), p3 (7,7), p4 (9,9)
- Mudança na solução oficial: Cada iteração remove o perigo frontal e desloca Guto até a próxima placa, formando o zigue-zague.
- Testes: 1 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 19 — A Chave Perdida

- Dimensão final: **18 x 12**.
- Estrutura espacial: grande área de busca com três câmaras, eixos de retorno distintos e porta distante.
- Áreas e curvas: 6 áreas; aproximadamente 12 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - chest: chest1 (10,4), chest2 (7,6), chest3 (9,11)
  - door: door (1,15)
- Mudança na solução oficial: A busca percorre até três câmaras; break preserva a posição encontrada e cada caso usa um eixo de retorno até a porta.
- Testes: 3 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

### Atividade 20 — O Santuário do Basilisco

- Dimensão final: **20 x 14**.
- Estrutura espacial: cinco regiões conectadas: totens, armadilhas, baús, rubis e santuário final.
- Áreas e curvas: 5 áreas; aproximadamente 14 mudanças de direção/curvas.
- Mecânicas posicionadas:
  - totem: t1 (1,1), t2 (1,3), t3 (3,3)
  - bridge_segment: bridge1 (3,4), bridge2 (3,5), bridge3 (3,6)
  - hazard: h1 (5,6), h2 (7,8)
  - chest: chest1 (8,13), chest2 (10,13), chest3 (12,13)
  - coin: r1 (12,16), r2 (12,15), r3 (11,15)
  - guardian: basilisk (11,18)
- Mudança na solução oficial: As cinco provas ocupam regiões próprias; o código controla a passagem física entre elas e só libera o santuário após chave e três rubis.
- Testes: 3 rota(s)/variante(s) com SUCCESS; dimensão, início, cristal, entidades, paredes, conectividade, giros, sensores, contexto, reset, perigos, objetivos, execução incompleta e proteção contra atalho com PASS.
- Status: **PASS**.

## Interações espacializadas

- `input()` e `print()` contextuais quando a atividade usa pedestal/runa.
- `ativar_alavanca()` exige proximidade; `abrir_porta()` exige proximidade do bloqueio.
- `entrar_espelho()` e `entrar_portao()` exigem que Guto esteja no tile da entidade e preservam orientação de destino.
- `coletar_rubi()` exige o tile do rubi nas atividades de coleta manual.
- `abrir_bau()` e `desativar_armadilha()` operam no objeto à frente.
- `tem_bau_a_frente()`, `tem_armadilha_a_frente()`, `tem_placa_a_frente()` e `corredor_continua()` respeitam a orientação.

## Resultado dos testes

- 27 casos oficiais/replays: PASS.
- 300 verificações funcionais: PASS.
- 210 verificações específicas de mapa: PASS.
- 23 regressões globais: PASS.
