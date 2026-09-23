# V6 — homologação manual / PK-024

**PENDENTE DE VALIDAÇÃO HUMANA.** A rodada manual do usuário que originou a V6
está registrada em [homologação V5](../v5/HOMOLOGACAO_VISUAL_SONORA.md).
As funções não apontadas naquela rodada foram consideradas satisfatórias pelo
usuário. Isso não homologa visualmente as alterações novas da V6.

Nesta implementação não houve Computer Use, cliques de teste ou inspeção do jogo
no navegador. Testes de DOM, estados de animação e pixels são evidência técnica.

Usar o [gabarito V6](../../Gabarito_Oficial_Pyton_Knight_V6.txt) à velocidade normal.
Para testar mecanismos com código, encerrar o voo dev antes da execução. Testar
persistência e morte no modo normal; dev não grava a jornada normal.

- [ ] A1–A20: início, objetivo legível, código, conclusão, moedas e XP sem duplicação.
- [ ] A6: ler juramento, responder no campo de input; editor mantém somente código.
- [ ] A12: interruptor começa desligado; pisar não aciona; ativação deliberada muda
  o ambiente sem cor/legenda/brilho que revele diretamente o estado.
- [ ] A13: duas perguntas com nomes dos registros; resposta única não conclui.
- [ ] A14: Diário orienta desvio justo; antigo atalho encontra espinhos ativos.
- [ ] A14/A18: placas falsas plausíveis e inertes; correta apresenta azul.
- [ ] Tutoriais A1/A6/A11/A16: explicações suficientes, sem preencher solução;
  código completo conclui sem mensagem contraditória de etapa pendente.
- [ ] Terceira morte: tela clara, sem continuar a mesma atividade; após reload,
  retorno funciona com três vidas e é preciso concluir a atividade anterior.
- [ ] Limite A1: game over retorna a A1 sem atividade inexistente ou bloqueio.
- [ ] Save normal: atualizar durante exploração/input retoma checkpoint seguro,
  preservando rascunho, vidas, Diário, moedas e estatísticas.
- [ ] A20: final persiste após reload; estatísticas legíveis; reiniciar limpa
  jornada, rascunhos, progresso, moedas e métricas anteriores.
- [ ] Dev: seletor e setas funcionam; digitação não move Guto; normal fica intacto.
- [ ] Portas/grades/guardiões: abertura e fechamento coerentes, sem sumiço abrupto.
- [ ] Moedas: sem quadrado de piso; cores/animação preservadas sobre o chão normal.
- [ ] Paredes: coerentes com o piso, reconhecíveis como obstáculos em todos os mapas.
- [ ] Iluminação, halo, tochas, runas, portais, partículas e névoa preservados;
  pistas ocultas não são reveladas nem pistas necessárias escondidas.
- [ ] Dano, coleta, teleporte, câmera e transições sem sobreposição ou movimentos ruins.
- [ ] HUD, Diário, Livro Mágico, campos e telas de morte/final legíveis e acessíveis.
- [ ] Áudio: clique, música em loop, efeitos, volumes separados, mudo geral,
  continuidade entre cenas/reinício sem músicas sobrepostas. Música provisória.
- [ ] Navegador: sem erros novos, vazamento perceptível ou degradação após repetir cenas.

Ao executar, registrar atividade/passo, esperado/obtido, status, evidência e
eventual correção/reteste. Não marcar PK-024 concluído antes de preencher os itens
relevantes com evidência humana. Não foi feito merge nem congelamento de versão.
