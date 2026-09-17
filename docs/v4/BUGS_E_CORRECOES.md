# Registro de ajustes e correções — V4

17/09/2026. Nenhuma regressão aberta nos casos automatizados executados. As mudanças de regra abaixo foram expressamente solicitadas; não são correções do conteúdo pedagógico.

| ID | Ajuste | Resultado |
|---|---|---|
| PK-041 | Orçamento impedia explorar com programas longos | V4 executa normalmente e avalia orçamento somente para conclusão; mesmos contadores semânticos |
| PK-042 | Moedas dependiam da conclusão e se misturavam a rubis | Coleção de 100 IDs salva no pickup; rubis mantidos na tentativa; sem farming em resets/replays |
| PK-043 | Resumo de vitória insuficiente | Modal com objetivos e regras locais, estatísticas reais, retry/próximo/final |
| PK-044 | Tentativas incluíam parsing inválido | Incremento V4 somente quando o programa válido inicia a simulação |
| PK-045 | Investigação sem indicação de proximidade | ! contextual, respeitando neblina e leitura; estantes reutilizam examinar/Diário |
| PK-046 | Totens antigos destoavam da arte | Nova fonte pixel art e quadros OFF/ON, mantendo conexões e estados V3 |
| PK-047 | Atualização visual ocorria antes de registrar a inscrição | Registro precede atualização; estante e ! mudam já na interação |
| PK-048 | Opção histórica de replay poderia contrariar recompensa única V4 | V4 ignora recompensa em replay, preservando comportamento histórico nos catálogos anteriores |
| PK-024 | Homologação visual no navegador | **PENDENTE**: ERR_BLOCKED_BY_CLIENT confirmado novamente |

Durante a auditoria, o primeiro verificador de moedas tratava toda região deepDark da A18 como danosa, ignorando `fearVariants`. O verificador foi alinhado à configuração real; os 145 percursos passaram sem modificar a fase ou sua dificuldade. Esse foi um ajuste da ferramenta de teste, não uma alteração de gameplay.

Paredes, mapas, soluções, parser e planilha acadêmica foram preservados. Nenhum bloqueio decorativo novo foi adicionado às fases de produção.
