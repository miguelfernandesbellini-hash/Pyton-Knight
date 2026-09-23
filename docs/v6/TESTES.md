# V6 — testes e regressões

## A. Testes automatizados

Rodada final em 23/09/2026, Node.js 24.19.0, após corrigir o retorno do game over
pelo menu. **326/326 testes passaram: 281 existentes + 45 V6; zero falhas ou
skips**, duração 19,85 s. A suíte legada adicional retornou `PASS`.
Não se somam auditorias ao número de testes, pois elas exercitam cenários relacionados.

| Identificação | Procedimento / esperado | Obtido e evidência |
|---|---|---|
| AUTO-01 | Todas as suítes `tests/*.test.cjs`, incluindo `v5-polish.test.cjs`; preservar baseline | 326 PASS — [TAP](evidencias/testes-finais.tap) |
| AUTO-02 | `node tests/run-tests.cjs`; soluções, replay, objetivos, recompensas e mecânicas históricas | PASS — [legado](evidencias/legado.json) |
| AUTO-03 | `node tools/v3/audit.cjs --v6`; rotas oficiais das 20 atividades e requisitos ausentes | 28 cenários PASS, 74 verificações adversariais — [auditoria](evidencias/auditoria.json) |
| AUTO-04 | `node tools/v6/audit-coins.cjs`; acesso sem dano às cinco moedas de cada cenário | 140 verificações PASS, 100 IDs únicos — [moedas](evidencias/auditoria-moedas.json) |
| AUTO-05 | Máscaras e texturas derivadas; referências existentes para cada estado de entidade | 80 caminhos e 3.036 referências válidas; 952 pixels de moeda preservados, 3.144 pixels de fundo removidos — [assets](evidencias/assets-verificados.json) |
| AUTO-06 | `node --check` em arquivos de produção alterados e diretórios systems/ui | 33 arquivos com sintaxe válida |
| AUTO-07 | Regredir fluxo de morte após correção no menu | 45/45 testes V6 PASS — [reteste](evidencias/gameover-reteste.txt) |

O modo `--test-isolation=none` evita criação de subprocessos no ambiente restrito.
Não altera a execução do jogo. Testes usam os adaptadores já adotados no projeto;
não foi criado modo de aceleração. O bloqueio `spawn EPERM` de Chrome é evidência
histórica V5, não uma execução de navegador reivindicada nesta V6.

### Cobertura nova

| Atividade / sistema | Verificação positiva e negativa | Status |
|---|---|---|
| A1–A20 | Todas as soluções e variantes atuais concluem; mapas/barreiras e coordenadas das moedas iguais à V4; soluções fora A6/A12/A13/A14 intactas | PASS |
| A6 | AURORA via input após registro passa; literal antigo, resposta vazia ou errada não passam; campo separado do editor | PASS |
| A12 | Interruptor sempre off; pisada inócua; comando próximo ativa/desativa; conexão com espinhos correta; solução conclui; desenho off/on idêntico | PASS |
| A13 | 12 e 10 exigidos e associados aos dois registros; uma resposta, valor errado ou gabarito antigo não concluem | PASS |
| A14 | Novo percurso lê manutenção e conclui; atalho antigo causa HAZARD_DEATH | PASS |
| Placas A14/A18 | 2/4 falsas em piso acessível, sem sobreposição; pisadas não acendem nem acionam conexões | PASS |
| Tutoriais A1/A6/A11/A16 | Rascunho não é preenchido; solução completa desde etapa zero conclui e recebe recompensa | PASS |
| Vidas / game over | Três mortes, zero vidas, execução bloqueada, A14→A13 e A1→A1; voltar pelo menu após reload realmente remove bloqueio e restaura três vidas | PASS |
| Recuperação | Próxima atividade bloqueada até concluir novamente a anterior; histórico de recompensas preservado | PASS |
| Save | Migração preserva XP/moedas; rascunho, vidas, variante e Diário retomam; mecanismos e respostas temporárias recomeçam; descobertas acumuladas não diminuem ao resetar atividade | PASS |
| A20 / reinício | Final salvo reaparece no menu; estatísticas abrem; reinício zera dados; shutdown antigo não contamina jornada nova | PASS |
| Estatísticas | Laços contam instruções percorridas; erro de sintaxe não adiciona instruções; submissões e rejeições conhecidas contadas | PASS |
| Normal / dev | Voo respeita limites sem coleta/conclusão; execução suspensa durante voo; save normal intacto após completar no dev | PASS |
| Portas | Todas as portas/grades/guardiões usam transição; abertura/fechamento aguardam tween, preservam colisão e restauram alpha/posição | PASS |

A12 agora começa sempre desligada: a variante inicial ligada deixou de existir
por requisito. Por isso a V6 tem 28 cenários / 140 acessos, frente aos 29 / 145
históricos. Nenhuma atividade ou moeda foi removida. Ativação e desativação têm
teste específico. Nenhum teste legado foi alterado para mascarar falhas.

### Falhas encontradas e retestes

| Problema | Causa / correção | Reteste |
|---|---|---|
| V5: clique no áudio não chegava aos controles | Painel herdava `pointer-events:none`; corrigido no CSS | Suíte V5 PASS; clique real permanece pendente nesta etapa sem Computer Use |
| Solução completa presa em etapa tutorial | Transição tutorial interceptava sucesso e resetava estado; V6 acompanha etapas sem interceptar conclusão nem preencher editor | Quatro tutoriais completos PASS desde etapa zero |
| A13 aceitava requisito parcial | Só um input obrigatório; perguntas/flags agora separadas e ambas exigidas | Valores corretos PASS; ausência/erro/solução antiga rejeitados |
| A14 resolvia espinhos incidentalmente | Placa estava na rota trivial; movida para câmara existente e adicionada orientação narrativa | Antiga rota morre; nova conclui com três vidas |
| Regressão de adaptador após uniformizar animação | Restauração de alpha nova era aplicada a entidade histórica sem `setAlpha`; restringida às entidades V6 | Suíte relacionada 96/96 e completa 326/326 PASS; teste histórico preservado |
| Retorno obrigatório podia ser pulado | Histórico de desbloqueio liberava PRÓXIMA; adicionado marcador persistente de recuperação | PRÓXIMA bloqueada até concluir anterior; teste PASS |
| Game over permanecia após retorno pelo menu recarregado | Atualização de save exigia contexto de atividade; MainMenu não tem atividade. Reprodução: `pendingReturn` era 13, esperado null | Atualização de jornada independente da cena; menu→A13 agora sem bloqueio e com três vidas; 45/45 específicos + 326/326 finais PASS |

## B. Homologação visual/manual

Não executada nesta V6, conforme instrução do usuário. A rodada manual de origem
está no registro V5; não foi duplicada. A prancha de assets é evidência de geração,
não uma captura do jogo. Não há aprovação de aparência, som, câmera, responsividade
ou desempenho real inferida a partir dos testes.

Próximo passo: seguir [HOMOLOGACAO_MANUAL.md](HOMOLOGACAO_MANUAL.md) e registrar
observações/evidências. **PK-024 continua pendente.**
