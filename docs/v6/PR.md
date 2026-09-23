# V6: jornada persistente, correções de atividades e polimento

A jornada agora conserva progresso e descobertas, apresenta game over com retorno
obrigatório à atividade anterior e termina em uma tela persistente após A20, com
estatísticas e reinício limpo. O modo dev oferece voo com save separado em memória.

A6 recebe o juramento pelo formulário de input; A12 usa interruptor discreto;
A13 exige as duas respostas; A14 exige desvio para desativar espinhos. Tutoriais
orientam sem preencher código nem bloquear uma solução completa. Diário recebeu
fragmentos narrativos; placas falsas foram adicionadas onde aplicável. Portas
usam transições consistentes, moedas ficam sem fundo e paredes usam paleta coerente.

Preserva os 20 mapas, parser, mecanismos não afetados, recompensas e áudio/iluminação
V5. Inclui a V5 ainda não publicada, mantendo seus commits originais no histórico.

Validação: 326/326 testes (45 novos V6), suíte legada PASS, 28 cenários oficiais,
74 verificações de requisitos, 140 acessos às moedas e integridade de assets.
Regressões de game over/reload e compatibilidade de animações corrigidas e retestadas.

**PR deve permanecer em rascunho: PK-024 e homologação visual/sonora pendentes.**
Não foi usado Computer Use. Música provisória. Ver `docs/v6/TESTES.md` e
`docs/v6/HOMOLOGACAO_MANUAL.md`. Sem merge automático.
