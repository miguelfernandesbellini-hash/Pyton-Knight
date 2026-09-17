# Relatório técnico — rodada 2

Continuação de 15/09/2026. O relatório completo da primeira rodada está preservado em `evidencias/rodada1_documentacao/RELATORIO_TECNICO_DE_ALTERACOES.md`. O baseline recebido permanece em `evidencias/`.

| Alteração | Problema original | Implementação / função | Arquivos | Impacto e teste |
| --- | --- | --- | --- | --- |
| Classificação dos portais | Qualquer portal marcava correctPortal | `callApi`: compara entity.value com a faixa do último input; lança erro semântico antes de ativar/teleportar; flag falsa no erro | systems/DungeonSystem.js | 18 combinações de valor/portal, três soluções, três programas incorretos e ausência de input |
| Evidência de execução | Conceitos apenas presentes na AST satisfaziam objetivos | `runtimeAnalysis` registra comandos/expressões visitadas; loops só contam após iterar; cadeia condicional alcançada conta if/elif/else | systems/CommandInterpreter.js; systems/MissionObjectiveSystem.js | Código morto e loop vazio recusados; 27 cenários oficiais e tutoriais PASS |
| Sprites próprias | Escudos/estante/bandeira usados como personagens/objetos | PNGs transparentes gerados com image_gen, copiados sem editar, catálogo estendido | assets/custom/*.png; systems/AssetCatalog.js; assets/official-manifest.json | PNG/alpha/proporções inspecionados; papéis e integração testados |
| Estados visuais | Guardião/cofre viravam arco; totem virava tocha | `appearance` mantém personagem com tint/legenda liberada; cofre usa baú aberto; totem/runa mantêm objeto com tint por estado | systems/MapRenderer.js | Testes de papéis, catálogos e 20 ciclos com renderer PASS |
| Proporções | Imagens não quadradas esticadas | Dimensões sourceWidth/sourceHeight e ajuste proporcional ao limite da célula | systems/MapRenderer.js; catálogos | Inspeção de dimensões e integração; aparência real ainda pendente |
| Livro/HUD/menu | Menu sumia em viewport estreita; dados de input podiam crescer | Header móvel preservado; grid reajustado; max-height/scroll de input-data; legibilidade do rodapé | ui/game.css | Revisão estática e 118 regressões; sem alegar medição em navegador |
| Conciliação | Metadados/documentos históricos atribuíam mecânicas ausentes | Adendo autoritativo descreve M01/M02/M12 sem alterar comportamento | docs/ADENDO_DE_CONCILIACAO_DOCUMENTAL.md; 02_DOCUMENTACAO_OFICIAL/ADENDO_VERSAO_ATUAL.md | Comparação com entidades e guia atual |
| Teste contextual legado | Fixture tentava portal sem poder | `prepareRequirements` recebe poder compatível com portal para testar proximidade isoladamente; asserções mantidas | tests/run-tests.cjs | Suíte recebida falhou nessa precondição; após preparar input PASS |

## Preservação e decisões

Nenhuma alteração em activities.js nesta rodada. Mapas, startPosition, soluções, objetivos, XP, moedas, vidas e parâmetros de câmera/editor preservados. O runtime agora faz cumprir a classificação pedida, sem exigir um nome específico de variável. Strings/normalização AURORA/CORAGEM permanecem como na rodada anterior.

A avaliação de uso não exige que todos os ramos de uma cadeia executem na mesma tentativa. Isso seria incompatível com Python e com as soluções oficiais; registra a cadeia efetivamente alcançada. Laços sem nenhuma iteração não demonstram repetição.

Imagens foram geradas pelo modo incorporado image_gen, sem API/CLI externa. Prompts e caminhos estão em MAPA_DE_ASSETS_UTILIZADOS.md. Originais Castle continuam compondo a arquitetura. Nenhum arquivo recebido foi excluído ou movido.

## Validação e limite

Suíte legada com fixture atualizada PASS; 118 testes anteriores + 28 novos PASS. Chrome remoto voltou a bloquear localhost. PK-024 segue PENDENTE, sem capturas inventadas ou publicação externa. O manifesto da rodada relaciona todos os arquivos criados e modificados em relação à entrega anterior.
