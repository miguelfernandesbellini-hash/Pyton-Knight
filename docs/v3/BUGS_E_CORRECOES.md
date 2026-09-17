# Bugs e correções — V3

Registros anteriores permanecem em `docs/REGISTRO_DE_BUGS_E_CORRECOES.md`. IDs V3 continuam a numeração livre informada na rodada anterior.

| ID | Problema | Correção / evidência | Estado |
|---|---|---|---|
| PK-023 | Portão incorreto da A15 podia premiar | Regra anterior preservada; três classificações legítimas e seis escolhas erradas testadas | Resolvido e revalidado |
| PK-024 | Navegador bloqueia localhost | `ERR_BLOCKED_BY_CLIENT`; plantas/atlas não apresentados como homologação real | **Pendente** |
| PK-027 | Informação de input entregue pela interface anterior | Novas inscrições locais, pré-requisitos de leitura, Diário, campo vazio e ajuda sem resposta | Resolvido |
| PK-028 | Reexecução apagava conhecimento junto com a tentativa | DiscoverySystem separado; reset de itens/mecanismos preserva leituras e luz; REINICIAR limpa | Resolvido |
| PK-029 | Movimento e orientação pareciam teleporte | Sprite direcional, âncoras uniformes, tile a tile, câmera acompanha sprite em movimento | Implementado; percepção visual aguarda PK-024 |
| PK-030 | Lava redundante como piso letal | V3 bloqueia tile de lava; perigos são espinhos sinalizados | Resolvido |
| PK-031 | Valores literais podiam ignorar o processamento de inputs | Origem das entradas propagada por expressões e validada nas runas | Resolvido para os casos auditados |
| PK-032 | Conceitos decorativos podiam satisfazer objetivos por análise estática | Evidência de comandos executados dentro de laço/condição; uso de variável, reatribuição e acumulador | Resolvido para os casos auditados |
| PK-033 | Contagem confundia rubis com moedas opcionais | Contador físico separado e requisitos do mundo | Resolvido |
| PK-034 | Ponte ou porta visualmente abria fora da ordem do comando | Transições aguardadas e colisão durante `opening`; segmentos individualizados | Resolvido em testes lógicos |
| PK-035 | Cofre da A9 podia ser contornado lateralmente | Gargalo de parede preservando a rota oficial; auditoria de corte físico | Resolvido |
| PK-036 | `ativar_runa()` junto à ponte permitia ignorar a galeria | V3 limita a ativação a totens/runas; ponte recebe conexões | Resolvido |
| PK-037 | Baú liberava colisão durante o quadro intermediário | Estado `opening` bloqueia até o callback final | Resolvido |
| PK-038 | Portal energizava visualmente depois do transporte | Energia na origem precede fade/teleporte/fade de saída | Resolvido em teste de ordem |
| PK-039 | Regiões sobrepostas registravam a galeria em lugar da cripta | Prioridade pela região mais específica, com desempate declarado | Resolvido |
| PK-040 | Testes novos comparavam timestamp de replay e campo inexistente | Fixture compara progresso/recompensas, permite `updatedAt` mudar e usa o schema original | Resolvido; runtime de progressão preservado |

Durante a implementação, também foram corrigidos a indentação de `break` no gerador, marcadores de saída sobrescritos ao abrir caminhos e mínimos de armadilhas/retornos por variante. Esses ajustes estão cobertos pelas soluções A18–20. Nenhuma restauração de backup foi usada como base da retomada.

Não há defeito funcional conhecido nos casos automatizados finais. Essa afirmação não substitui PK-024 nem o playtest acadêmico. A auditoria de programas é baseada em casos relevantes, não em demonstração formal de impossibilidade de qualquer programa artificioso.
