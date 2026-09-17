# Auditoria anti-atalho e respostas expostas — V3

Executada sobre as 20 atividades e 29 cenários atuais, pelo mesmo interpretador do jogo. Resultado: PASS nas verificações automatizadas descritas abaixo; homologação visual real permanece pendente.

## Método e limites

- Busca em largura da posição inicial: cristal inacessível com mecanismos fechados e perigos ativos.
- Busca com requisitos satisfeitos e portais válidos: saída alcançável.
- Fechamento isolado de cada porta/grade/guardião, mantendo os demais abertos: sem contorno até o cristal, inclusive usando destinos de portais.
- Omissão individual de cada inscrição obrigatória durante o programa oficial: a atividade não conclui.
- Remoção isolada de chave, flags, dados, contadores e pistas de portas já resolvidas: mecanismo recusa abertura.
- Inspeção das plantas das quatro unidades: bifurcações, salas, perigos, objetos, retornos e alternativas.
- Testes adversariais: print literal sem origem nos inputs, leitura remota, portal incorreto, poder incompatível com variante, laço decorativo, ativação direta da ponte e abertura durante animação.

A auditoria contém 69 omissões/requisitos isolados. Não é uma prova formal de todos os programas Python possíveis; alternativas corretas são permitidas. Não exige múltiplas execuções quando o aluno já conhece a solução.

## Resultado por atividade

| Ativ. | Exploração e dependência física | Variantes | Saída inicial | Omissões/requisitos |
|---|---|---|---|---|
| 1 | Câmara da luz; retorno à passagem central. | 1 | Bloqueada | 1 |
| 2 | Ala da alavanca e retorno ao salão. | 1 | Bloqueada | 1 |
| 3 | Os dois arquivos, em lados opostos. | 1 | Bloqueada | 4 |
| 4 | Sala da lâmpada; oficina de segurança OU passarela de inspeção. | 1 | Bloqueada | 2 |
| 5 | Alas da orientação, mudança e cálculo. | 1 | Bloqueada | 4 |
| 6 | Arquivo antigo e galeria da voz. | 1 | Bloqueada | 3 |
| 7 | Biblioteca, pedestal, guardião e porta. | 1 | Bloqueada | 5 |
| 8 | Duas oficinas e a ponte construída. | 1 | Bloqueada | 2 |
| 9 | Os dois arquivos, mesa dos espelhos e destino do cofre. | 1 | Bloqueada | 3 |
| 10 | Arquivos A, B e C; ponte e espelho de retorno; três selos iluminados. | 1 | Bloqueada | 13 |
| 11 | Ala remota da chave e retorno aos bloqueios. | 1 | Bloqueada | 2 |
| 12 | Bifurcação e galeria segura conforme estado da placa. | 2 | Bloqueada | 1 |
| 13 | Arquivo da energia, arquivo da medida e validadores. | 1 | Bloqueada | 7 |
| 14 | Ala azul, ala verde e placa de segurança; portões OU e E. | 1 | Bloqueada | 3 |
| 15 | Arquivos do Sol, Lua e Sombra; chave, alavanca e destino do ramo correto. | 3 | Bloqueada | 9 |
| 16 | Galeria dos totens, retorno e ponte de cinco segmentos. | 1 | Bloqueada | 0 |
| 17 | Os cinco nichos de rubis e porta do contador. | 1 | Bloqueada | 1 |
| 18 | Três, quatro ou cinco módulos ativos conforme cenário; retorno convergente. | 3 | Bloqueada | 1 |
| 19 | Criptas pesquisadas até a chave; retorno à porta. O prefixo visitado varia. | 3 | Bloqueada | 1 |
| 20 | Galeria das runas, ala de espinhos, busca da chave, três rubis e julgamento. | 3 | Bloqueada | 6 |

## Respostas de input e descoberta

Atividades 7–10, 13 e 15 recebem entradas. A 6 introduz print e esconde a palavra até a leitura. Inspeção do catálogo, guia, editor inicial, tutoriais e DOM adaptado: nenhuma resposta secreta é pré-preenchida ou publicada em objetivo, legenda ou ajuda de input. O campo abre vazio. O Diário só registra textos examinados. Uma sala iluminada torna os objetos visíveis, mas não lê seu texto automaticamente.

Valores de portais identificam destinos; não substituem a investigação dos operandos. A mensagem de erro de um ramo da Atividade 15 pode explicar sua classificação somente após as pistas obrigatórias e a entrada válida. Os testes usam respostas fora da interface; o gabarito é material do avaliador.

## Rotas e objetos opcionais permitidos

- A2: nicho de moeda; A5: nicho de memória/moeda.
- A4: oficina ou passarela são alternativas legítimas, ambas após iluminação.
- A9: espelhos falsos são opções do enigma e não concedem transporte/recompensa.
- A12: apenas a galeria segura da variante é obrigatória.
- A15: apenas o destino do ramo correto deve ser percorrido, após os três arquivos.
- A16: inscrição complementar opcional; A17: lore e moeda extra opcionais.
- A18: os módulos além do comprimento ativo da variante não são exigidos.
- A19/20: busca encerra no baú da chave; os baús posteriores não são exigidos.
- A10: selos do salão precisam acender; pisar em cada quadrado de luz não é requisito.

Não foi identificada sala isolada de enchimento. Os espaços sem objetos próprios são partida, circulação, convergência, iluminação de selo ou saída; a matriz registra suas funções.

## Correções da auditoria final

O cofre da Atividade 9 passou a ocupar um gargalo real, sem contorno lateral. Segmentos V3 só são energizados por conexões dos totens; ativar_runa() junto à ponte não contorna a galeria. Objetivos e soluções aprovadas foram preservados.

