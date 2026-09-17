# Homologação visual — V3

**Status: PENDENTE — PK-024.** O navegador remoto retornou `net::ERR_BLOCKED_BY_CLIENT` ao abrir `http://127.0.0.1:8000/?dev=1`. Não foi obtida uma sessão jogável no navegador real. O bloqueio não foi contornado e nenhum resultado de renderização real foi inventado.

## O que foi validado

| Evidência | Resultado e alcance |
|---|---|
| Fontes e atlas de Guto | Inspecionados: quatro direções, idle/caminhada, âncoras e recorte do fundo |
| Atlas de objetos | Inspecionado: alavancas, interruptores, livros, runas, portais, baús, rubi e cristal |
| Tileset | Piso, variação rachada, marcação rúnica e ponte integrados; paredes/vazios reutilizam a base |
| Quatro pranchas de unidade / 20 plantas | Inspecionadas estaticamente quanto a rotas, objetos, escala relativa e propósito dos espaços |
| Estados visuais por código | Testes distinguem OFF/ON, fechado/aberto, ponte, espinhos e portais |
| Sequência lógica de animação | Testes de callback verificam porta/baú bloqueados até completar abertura e portal energizado antes de transportar |
| UI em adaptador DOM/Phaser | 20 cenas montam; Diário/pistas/input/reinício funcionam logicamente; não mede layout CSS |

As imagens em `evidencias/visual` são geradas em canvas com os mesmos assets e funções de aparência do jogo, com toda a geometria revelada para inspeção. **Não são screenshots da partida e não comprovam câmera, iluminação dinâmica, taxa de quadros ou legibilidade no navegador.**

## O que permanece pendente

- Carregamento real do atlas pelo Phaser e alinhamento das quatro animações no tamanho de exibição.
- Fluidez do movimento, giros, interação, dano, medo, vitória e teleporte em execução real.
- Sincronia perceptível de portas, baús, runas, alavancas, interruptores e segmentos de ponte.
- Expansão da luz, alcance do círculo local e transições da neblina, inclusive durante pan/zoom.
- Visibilidade dos furos dos espinhos em diferentes níveis de zoom e antes de qualquer dano.
- Câmera e contenção do Livro, editor, Diário, inscrições e formulário de input em 1366×768, 1920×1080 e largura reduzida.
- Navegação por teclado nos controles da interface, foco do input, rolagem e eventuais sobreposições.
- Playtest com alunos para tempo, dificuldade e clareza das pistas.

## Roteiro de homologação no ambiente acessível

1. Servir a pasta por HTTP e abrir `/?dev=1`; observar console e falhas de carregamento.
2. Percorrer as 20 atividades com o gabarito, usando os quatro tutoriais pelas microetapas.
3. Na A7, executar uma visita parcial, conferir Diário e luz, executar novamente e depois REINICIAR.
4. Na A4, observar furos e disparo, testar oficina e passarela. Na A14, observar placa/espinhos e as duas portas.
5. Na A16, observar cada segmento aparecer após sua iteração. Na A19/20, a busca deve parar visualmente no baú da chave.
6. Na A15, testar os três cenários; confirmar ausência de teleporte/recompensa no ramo incorreto. Variantes podem ser abertas pelo console de desenvolvimento do jogo com `pytonKnightGame.scene.start('Game', {atividadeIndex: 14, variantIndex: 0})`, alterando o índice para 1 e 2. A19/A20 usam índices de atividade 18/19.
7. Na A18 e A20, comparar cômodo escuro/iluminado; testar aviso de medo antes de uma perda de vida.
8. Registrar capturas reais, dimensão, navegador e defeitos reproduzíveis. Atualizar PK-024 somente depois disso.

Esse roteiro não modifica o Plano_e_Fluxo_de_Testes acadêmico, preservado integralmente.
