# Pyton Knight — resumo executivo

Atualização de 14–15/09/2026 sobre a versão recebida. Não foi reconstruído o jogo.

## Entrega

Projeto principal: `01_JOGO_ATUAL/Pyton-Knight-20-Atividades-Mapas-Reelaborados/`.
Abra `docs/RELATORIO_DE_TESTES.md` para evidências e `docs/REGISTRO_DE_BUGS_E_CORRECOES.md` para o registro completo.

- Interpretador: blocos com indentação consistente, comentários, comparações encadeadas, operadores lógicos e conversões corrigidos.
- Livro Mágico: editor com números, linha de erro, Tab/Shift+Tab, autoindentação, áreas delimitadas, dados e comandos visíveis, input explícito e cancelável.
- Dungeon: câmera com zoom 55–200%, pan limitado, centralização e acompanhamento; Castle Dungeon aplicado, mecanismos com estados visuais, HUD/menu/transições revisados.
- Mecânicas: pressão liberada ao sair, alavancas alternáveis, atualização de objetivos e conexões da placa da atividade 12 corrigidas; persistência em memória quando o armazenamento falha.
- Preservação: 20 atividades, mapas, obstáculos, posições iniciais, soluções oficiais, objetivos, XP, moedas e orçamentos mantidos. Única diferença nos dados das atividades: duas conexões da placa da atividade 12.
- Validação: suíte original PASS; 118 novos testes PASS. Soluções oficiais em 27 cenários e respectivos replays PASS. Componentes da interface executados com adaptadores, sem renderização real do navegador.

## Limites da entrega

A versão foi implementada e validada automaticamente, mas **não está integralmente homologada visualmente**. O navegador disponível bloqueou o servidor local (`ERR_BLOCKED_BY_CLIENT`); a instalação de um navegador local também não foi concluída por indisponibilidade de rede. Não foram inventadas capturas, medições CSS, resultados de Chrome/Edge/Firefox ou testes com alunos.

Pendências PK-022 a PK-024: divergências documentais históricas, validação pedagógica por presença de sintaxe/portais e homologação visual/compatibilidade. As soluções oficiais funcionam, mas isso não prova que toda solução alternativa pedagogicamente incorreta seja recusada.

A planilha acadêmica permaneceu byte a byte idêntica. Nenhum status, caso ou célula foi preenchido. Resultados desta atualização ficam exclusivamente nos novos documentos técnicos.

Backup recebido: `00_BACKUP/Versao_Recebida.zip`. Referência acadêmica intacta: `05_REFERENCIA_TESTES/Plano_e_Fluxo_de_Testes_Pyton_Knight.xlsx`.
