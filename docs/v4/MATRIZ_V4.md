# Matriz de alterações por atividade — V4

17/09/2026. As geometrias, regiões, requisitos, pistas, variantes e soluções permanecem iguais à [matriz V3](../v3/MATRIZ_ATIVIDADES.md). Coordenadas linha/coluna em base zero. As moedas são opcionais; não substituem rubis ou chaves.

| Atividade | Conceito | Solução / limite semântico | Moedas C01 a C05 (linha,coluna) | Decorações | Estantes investigáveis |
|---|---|---|---|---|---|
| 1. Primeiros Passos | Atribuição de variável e movimento orientado | 11 / 18 | (6,6); (7,6); (8,13); (8,1); (2,5) | 3 | — |
| 2. O Caminho Mutável | Reatribuição | 12 / 22 | (6,6); (7,8); (12,6); (6,15); (8,1) | 4 | — |
| 3. As Grades da Masmorra | Operações entre variáveis | 24 / 26 | (6,4); (11,12); (6,20); (6,10); (8,7) | 5 | — |
| 4. O Corredor da Forja | Operadores +, - e * | 16 / 28 | (4,6); (7,8); (6,20); (13,5); (10,14) | 6 | — |
| 5. O Labirinto das Variáveis | Integração da Unidade 1 | 24 / 38 | (6,9); (13,5); (4,15); (10,21); (8,1) | 7 | — |
| 6. O Pedestal da Palavra | print() e saída de dados | 14 / 20 | (5,6); (7,11); (6,18); (8,1); (8,15) | 4 | juramento |
| 7. O Guardião da Resposta | input(), variável e print() | 18 / 26 | (4,4); (9,11); (8,20); (10,1); (8,7) | 5 | memoria |
| 8. A Ponte dos Construtores | int(input()) e processamento numérico | 26 / 34 | (5,5); (9,11); (7,23); (9,1); (9,19) | 6 | grupos, segmentos |
| 9. O Salão dos Espelhos Rúnicos | Múltiplas entradas e processamento | 30 / 38 | (5,5); (9,9); (2,26); (3,15); (13,16) | 8 | primeira, segunda |
| 10. O Cofre das Três Runas | Integração de entrada, processamento e saída | 40 / 56 | (6,10); (13,11); (9,23); (10,1); (18,17) | 6 | a, b, c |
| 11. A Porta do Guardião | if e condição booleana | 16 / 24 | (6,7); (8,12); (7,21); (9,1); (9,18) | 5 | — |
| 12. Os Dois Caminhos | if / else | 18 / 28 | (5,6); (5,16); (9,23); (12,11); (9,1) | 5 | — |
| 13. A Câmara das Comparações | Operadores relacionais | 30 / 36 | (6,5); (8,12); (7,24); (14,9); (9,1) | 6 | — |
| 14. O Selo das Duas Alavancas | and / or | 26 / 40 | (5,7); (8,11); (7,26); (9,1); (9,19) | 7 | — |
| 15. O Julgamento dos Três Portões | if / elif / else e integração | 48 / 65 | (12,5); (10,12); (13,33); (3,24); (21,23) | 10 | — |
| 16. A Ponte dos Ecos | for + range() | 13 / 20 | (5,5); (10,11); (9,22); (11,1); (3,13) | 5 | — |
| 17. A Câmara dos Rubis | for + acumulador | 17 / 26 | (5,8); (8,16); (3,19); (9,1); (5,26) | 8 | — |
| 18. O Corredor das Placas | while e condição de continuidade | 12 / 28 | (6,8); (11,19); (21,23); (1,1); (13,14) | 7 | — |
| 19. A Chave Perdida | while + break | 20 / 30 | (7,4); (10,13); (9,23); (4,10); (11,1) | 7 | — |
| 20. O Santuário do Basilisco | Integração final das quatro unidades | 61 / 72 | (7,12); (18,23); (15,1); (23,16); (9,21) | 11 | — |

## Regras comuns

- Duas moedas seguem o percurso natural; pelo menos duas exigem desvios em cada variante. Cinco IDs permanentes por atividade, de A01_C01 a A20_C05.
- 125 decorações sobre células de parede já existentes; nenhuma nova colisão nas atividades de produção. Paredes e tileset estrutural preservados.
- As inscrições existentes da Unidade 2 recebem apresentação de estante. Mesmas posições, IDs, textos e requisitos de examinar().
- Indicador ! em todas as inscrições examináveis, apenas visível a até um tile ortogonal e antes da leitura. Sem indicador em estantes decorativas.
- Totens das A16 e A20: mesmos IDs e conexões, novos sprites OFF/ON.
- Limites crescem dentro de cada unidade. A Unidade 4 volta a limites menores para valorizar a compactação por laços, sem alterar os programas oficiais.
- Tentativas esperadas para aprendizagem continuam as estimativas V3. O modal registra execuções reais, não essas estimativas.

## Evidências

[Acesso às moedas nos 29 cenários](evidencias/auditoria-moedas.json) · [Pistas, portas e dependências](evidencias/auditoria.json) · [Plantas das quatro unidades](evidencias/visual/)
