# Entrega técnica — Pyton Knight V3

A continuação preservou a versão funcional atual e o trabalho já concluído. O projeto inclui as 20 atividades redesenhadas, novo gabarito, sistemas reutilizáveis de descoberta/mecanismos/animação e as correções finais de auditoria.

**Estado técnico:** 221 testes aprovados; suíte legada aprovada; 29 cenários V3 e 69 verificações de ausência de pistas/requisitos aprovados. **Estado de homologação visual:** pendente por `ERR_BLOCKED_BY_CLIENT` (PK-024). A rodada de implementação e documentação está entregue; a aceitação final em navegador real continua aberta.

## Arquivos principais

| Entregável | Local |
|---|---|
| Projeto executável | `index.html`, Phaser local, código e assets na raiz |
| Catálogo ativo das 20 atividades | `activities-v3.js` |
| Soluções oficiais | `Gabarito_Oficial_Pyton_Knight_V3.txt` |
| Gabarito no caminho compatível anterior | `Gabarito_Final_Pyton_Knight_20_Atividades.txt`, mesmo conteúdo V3 |
| API nova/alterada | `docs/v3/API_V3.md` |
| Objetivos, conceitos, mapas, regiões, pistas, dependências, variantes e tentativas | `docs/v3/MATRIZ_ATIVIDADES.md` |
| Catálogo estruturado para auditoria | `docs/v3/CATALOGO_ATIVIDADES.json` |
| Baseline, novos testes, regressões e resultado | `docs/v3/RELATORIO_TESTES.md` e `evidencias/` |
| Registro de correções | `docs/v3/BUGS_E_CORRECOES.md` |
| Auditoria anti-atalho e respostas | `docs/v3/AUDITORIA_ANTI_ATALHO.md` |
| Homologação validada/pendente | `docs/v3/HOMOLOGACAO_VISUAL.md` |
| Assets e lacunas de arte | `docs/v3/ASSETS.md` |
| Fontes recebidas e planilha preservada | `docs/v3/referencias/` |

## Preservação

O parser, o modelo de progressão, a persistência, o editor e os limites globais não foram substituídos. O catálogo histórico fica intacto para compatibilidade; o overlay atual é carregado pelo mesmo jogo. Os arquivos anteriores de documentação permanecem como histórico, com README e estado de execução apontando para a V3. A planilha acadêmica foi copiada sem edição e conferida por SHA-256.

Não há reinicialização do projeto, retorno a backup antigo, controle WASD ou troca de tecnologia. Soluções podem ser completas em uma execução quando o aluno conhece a dungeon; descoberta parcial e ajuste do programa permanecem naturais.

## Próxima etapa exata

Homologar no navegador acessível, seguindo `HOMOLOGACAO_VISUAL.md`. Corrigir apenas falhas reproduzidas e atualizar PK-024 com evidência real. Não refazer baseline, mapas, poses ou soluções já validados. As lacunas de arte procedural versus animação desenhada estão listadas em `ASSETS.md`.
