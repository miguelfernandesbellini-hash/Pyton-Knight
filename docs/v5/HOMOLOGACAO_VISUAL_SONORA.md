# PK-024 — homologação humana da V5

**PENDÊNCIA DE HOMOLOGAÇÃO VISUAL E SONORA.** Nenhum item abaixo foi aprovado
automaticamente. V5 implementada, sem congelamento e sem merge para main.

Executar na pasta do jogo com `python -m http.server 8000` e abrir
`http://localhost:8000/?dev=1`. Usar perfil de teste separado para preservar saves
pessoais. Avaliar também o modo normal com desbloqueio real. Usar os gabaritos V4
existentes; não alterar atividades para facilitar a homologação.

## Checklist

- [ ] Iluminação ambiente melhora a leitura sem escurecer objetivos/comandos.
- [ ] Halo suave acompanha Guto, inclusive durante movimento, dano e teleporte.
- [ ] Tochás/pontos de luz são discretos; sombras respeitam descoberta e paredes.
- [ ] Runas, portais, cristais e objetos mágicos distinguem seus estados.
- [ ] Partículas e feedback de coleta são discretos e não revelam objetos ocultos.
- [ ] Idle/dano/interação mantêm orientação e posição corretas.
- [ ] HUD e Livro Mágico legíveis: vidas, XP, saldo, moedas da fase e objetivos.
- [ ] Tela de conclusão mostra atividade, XP, moedas já coletadas, progresso e ação.
- [ ] Repetir uma conclusão não duplica moedas/XP; A20 oferece concluir jornada.
- [ ] Câmera: arrastar/zoom/centralizar, enquadramento e teleporte confortáveis.
- [ ] Transições entre menu/atividades e teleportes sem piscadas ou travamentos.
- [ ] Sem sobreposições permanentes em 1366×768, 1024×768 e largura de 390 pixels;
      conferir rolagem, formulário input, Diário e modal de conclusão.
- [ ] Movimento reduzido do sistema desliga pulsação/idle/partículas decorativas.
- [ ] Música provisória aprovada artisticamente; ouvir ao menos três loops (~96 s).
- [ ] Autoplay: nenhuma reprodução antes de interação; iniciar por clique e teclado
      em uma sessão nova, incluindo navegador que comece com áudio bloqueado.
- [ ] Volumes de música/efeitos independentes e mudo acessíveis por teclado.
- [ ] Mudo/volumes mantidos ao trocar atividade, repetir e voltar ao menu.
- [ ] Uma única música contínua em pelo menos 20 trocas; nenhum reinício perceptível.
- [ ] Sons de interação, coleta, mecanismo, portal, dano e conclusão equilibrados.
- [ ] Console sem novos erros/warnings e rede sem assets faltantes.
- [ ] Navegador comum permanece fluido; sem crescimento contínuo de sons,
      objetos/listeners após reiniciar e alternar cenas repetidamente.

## Legibilidade e funcionamento das 20 atividades

Registrar aprovado/reprovado, navegador, resolução e observação por atividade.

| Atividade | HUD/Livro/objetivos | Luz/efeitos/câmera | Som/conclusão | Observações |
|---|---|---|---|---|
| A01 | Pendente | Pendente | Pendente | |
| A02 | Pendente | Pendente | Pendente | |
| A03 | Pendente | Pendente | Pendente | |
| A04 | Pendente | Pendente | Pendente | |
| A05 | Pendente | Pendente | Pendente | |
| A06 | Pendente | Pendente | Pendente | |
| A07 | Pendente | Pendente | Pendente | |
| A08 | Pendente | Pendente | Pendente | |
| A09 | Pendente | Pendente | Pendente | |
| A10 | Pendente | Pendente | Pendente | |
| A11 | Pendente | Pendente | Pendente | |
| A12 | Pendente | Pendente | Pendente | |
| A13 | Pendente | Pendente | Pendente | |
| A14 | Pendente | Pendente | Pendente | |
| A15 | Pendente | Pendente | Pendente | |
| A16 | Pendente | Pendente | Pendente | |
| A17 | Pendente | Pendente | Pendente | |
| A18 | Pendente | Pendente | Pendente | |
| A19 | Pendente | Pendente | Pendente | |
| A20 | Pendente | Pendente | Pendente | |

Responsável: ______ · Data: ______ · Commit: ______ · Navegador/versão: ______

Resultado: **PENDENTE**. Só registrar PK-024 concluído após inspeção humana,
correção de eventuais problemas e aprovação explícita. Testes automatizados
não substituem essa aprovação.
# Rodada manual posterior à V5 — origem da V6 (22/09/2026)

Relato fornecido pelo usuário após nova rodada manual. Atividades e funcionalidades
não mencionadas abaixo foram consideradas satisfatórias e aprovadas pelo usuário
no estado atual. Isso não representa uma nova inspeção visual automatizada.

Requisitos derivados: (1) morte definitiva após três vidas e retorno de uma atividade;
(2) campo de resposta do juramento A6; (3) narrativa das anotações; (4) animação de
todas as portas; (5) retirar piso da sprite de moeda; (6) harmonizar paredes com piso;
(7) interruptor discreto em A12; (8) duas respostas obrigatórias em A13;
(9) reposicionar placa de A14 para impedir atalho dos espinhos; (10) placas falsas
nas atividades que usam placas de pressão desde a Unidade 2; (11) coerência dos
textos impactados; (12) tutoriais orientam sem escrever a solução; (13) concluir
missão completa sem retenção indevida em microetapa; (14) normal/dev e voo isolado;
(15) encerramento de A20; (16) persistência e estatísticas da jornada.

Na rodada assistida anterior, A1–A6 foram concluídas pelo gabarito V4. A suspeita A6
era compatível com a regra antiga de print; a V6 muda essa interação por solicitação.
BUG-V5-AUDIO-01: controles herdavam pointer-events:none; correção CSS aplicada,
12/12 testes V5 e 281/281 completos + legado aprovados. Reteste por clique foi
interrompido pela mudança de escopo para V6; não registrar como aprovado visualmente.

A implementação V6 utilizará código/shell/testes. Não usar Computer Use nem
homologar visualmente as novas alterações sem inspeção humana posterior.
