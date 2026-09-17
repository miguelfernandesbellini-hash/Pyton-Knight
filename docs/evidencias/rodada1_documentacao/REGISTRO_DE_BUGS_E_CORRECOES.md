# Registro de bugs e correções

IDs estáveis desta atualização. “Corrigido na implementação” não equivale à homologação visual. A suite inicial passava, mas não cobria todos estes defeitos.

## PK-001 — Indentação válida rejeitada

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Parser exigia múltiplos de quatro também em comentários. Blocos regulares de quatro espaços já passavam no baseline.
- **Como reproduzir:** Executar if/else com dois espaços por nível ou comentário com espaço isolado.
- **Resultado esperado:** Nível do bloco inferido pelo filho; dedent e indentação inesperada continuam rejeitados.
- **Correção / decisão:** Nível do bloco inferido pelo filho; dedent e indentação inesperada continuam rejeitados.
- **Arquivos alterados ou analisados:** systems/PythonSubsetParser.js
- **Teste realizado:** Sondagens antes; testes de blocos, comentários e 20 soluções com dois espaços.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-002 — Livro Mágico sem altura estável

- **Status:** CORRIGIDO NA IMPLEMENTAÇÃO
- **Descrição / resultado observado / causa:** Layout anterior tinha altura mínima e conteúdo expansível; risco de rodapé fora da viewport confirmado por inspeção do código.
- **Como reproduzir:** Carregar atividade longa e inserir muitas linhas.
- **Resultado esperado:** Painel com altura máxima, flex e áreas independentes.
- **Correção / decisão:** Painel com altura máxima, flex e áreas independentes.
- **Arquivos alterados ou analisados:** ui/GameUI.js; ui/game.css
- **Teste realizado:** Contrato CSS e integração; medição visual pendente PK-024.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-003 — Feedback desloca controles

- **Status:** CORRIGIDO NA IMPLEMENTAÇÃO
- **Descrição / resultado observado / causa:** Caixa anterior sem limite de altura.
- **Como reproduzir:** Produzir feedback extenso.
- **Resultado esperado:** Máximo de altura, scroll e mensagem resumida; objetivos em área própria.
- **Correção / decisão:** Máximo de altura, scroll e mensagem resumida; objetivos em área própria.
- **Arquivos alterados ou analisados:** ui/game.css; ui/GameUI.js; systems/CommandInterpreter.js
- **Teste realizado:** Texto de 1000 linhas mantém os quatro controles no DOM; CSS verificado estaticamente.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-004 — Palavra com espaços externos bloqueia mecanismo

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Comparação mecânica literal rejeitava espaços externos. Palavras exatas passavam originalmente.
- **Como reproduzir:** Imprimir " AURORA " na 6 ou fornecer " CORAGEM " na 7 na solução oficial.
- **Resultado esperado:** Trim só no reconhecimento dos dois mecanismos, incluindo objetivo de saída.
- **Correção / decisão:** Trim só no reconhecimento dos dois mecanismos, incluindo objetivo de saída.
- **Arquivos alterados ou analisados:** systems/DungeonSystem.js; systems/MissionObjectiveSystem.js
- **Teste realizado:** Exata/espaços/incorreta/minúscula nas duas atividades PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-005 — Dados necessários não publicados

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Informações necessárias concentradas em configuração/testInputs ou incompletas na apresentação.
- **Como reproduzir:** Resolver 7–10, 13 ou 15 sem consultar gabarito.
- **Resultado esperado:** Inscrições explícitas e identificadores; guia por atividade independente dos testes.
- **Correção / decisão:** Inscrições explícitas e identificadores; guia por atividade independente dos testes.
- **Arquivos alterados ou analisados:** ui/ActivityGuide.js; ui/GameUI.js
- **Teste realizado:** Guia das 20 atividades; testes de ausência de dependência em officialSolution/testInputs.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-006 — Troca de atividade carrega estado residual

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Scene reutilizada podia manter tutorialStepIndex; editor e estado tinham ciclo pouco explícito.
- **Como reproduzir:** Avançar microetapas e reiniciar/navegar para outra atividade.
- **Resultado esperado:** Init/cleanup, preservação de rascunhos e microetapa por atividade.
- **Correção / decisão:** Init/cleanup, preservação de rascunhos e microetapa por atividade.
- **Arquivos alterados ou analisados:** Game.js; ui/GameUI.js
- **Teste realizado:** 20 ciclos criar/executar/replay/shutdown; navegação e rascunho PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-007 — Conversões numéricas e aridades incorretas

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Coerção JavaScript aceitava/rejeitava entradas divergentes de Python.
- **Como reproduzir:** Executar int(""), int("3.0"), int(3.8), range("2").
- **Resultado esperado:** Validação explícita e truncamento de número finito; mensagens de erro.
- **Correção / decisão:** Validação explícita e truncamento de número finito; mensagens de erro.
- **Arquivos alterados ou analisados:** systems/DungeonSystem.js
- **Teste realizado:** Tipos inválidos, int, range e recuperação em cinco fases numéricas PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-008 — Comparação encadeada e tipos divergentes

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Comparação binária/coerção JS não preservava as regras de comparação Python.
- **Como reproduzir:** Executar x = 3 < 2 < 1 ou x = "10" >= 2.
- **Resultado esperado:** AST encadeada e checagem de ordenação por tipo.
- **Correção / decisão:** AST encadeada e checagem de ordenação por tipo.
- **Arquivos alterados ou analisados:** systems/PythonSubsetParser.js; systems/CommandInterpreter.js
- **Teste realizado:** Comparações encadeadas, tipos e linha de elif PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-009 — and/or e not com semântica divergente

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Operadores retornavam booleano/precedência incorreta.
- **Como reproduzir:** Avaliar valores retornados por 0 or 7, 3 and 4, not com comparação.
- **Resultado esperado:** Retorno do operando com curto-circuito; precedência de not.
- **Correção / decisão:** Retorno do operando com curto-circuito; precedência de not.
- **Arquivos alterados ou analisados:** systems/PythonSubsetParser.js; systems/CommandInterpreter.js
- **Teste realizado:** Programas de lógica e precedência PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-010 — Placa de pressão não libera ao sair

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Não havia tratamento de saída; evento repetido também alternava M02 indevidamente.
- **Como reproduzir:** Em fixture M01, entrar na placa e caminhar para outra célula.
- **Resultado esperado:** occupiedTile e liberação de conexões da pressão.
- **Correção / decisão:** occupiedTile e liberação de conexões da pressão.
- **Arquivos alterados ou analisados:** systems/DungeonSystem.js
- **Teste realizado:** Fixture M01 e entradas repetidas M02 PASS; não representa presença de M01 em todas as fases.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-011 — Alavanca sem retorno de estado

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Ativação não alternava de volta.
- **Como reproduzir:** Acionar duas vezes uma alavanca contextual.
- **Resultado esperado:** Toggle com aplicação dos estados inativos das conexões.
- **Correção / decisão:** Toggle com aplicação dos estados inativos das conexões.
- **Arquivos alterados ou analisados:** systems/DungeonSystem.js
- **Teste realizado:** Fixture M03 e soluções oficiais PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-012 — Objetivos físicos atualizam apenas ao término

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Status não era reavaliado nos eventos físicos.
- **Como reproduzir:** Mover Guto para cumprir objetivo durante programa.
- **Resultado esperado:** Reavaliar em refresh com ambiente corrente.
- **Correção / decisão:** Reavaliar em refresh com ambiente corrente.
- **Arquivos alterados ou analisados:** systems/DungeonSystem.js; systems/CommandInterpreter.js
- **Teste realizado:** Objetivo físico atualizado durante movimento PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-013 — Indicador de orientação fica distante de Guto

- **Status:** CORRIGIDO NA IMPLEMENTAÇÃO
- **Descrição / resultado observado / causa:** Posição da seta não acompanhava a posição atual.
- **Como reproduzir:** Mover o personagem e observar a seta.
- **Resultado esperado:** Atualização de posição e orientação junto do personagem.
- **Correção / decisão:** Atualização de posição e orientação junto do personagem.
- **Arquivos alterados ou analisados:** systems/PlayerController.js
- **Teste realizado:** Renderer/controlador executados nas 20 fases; acabamento visual pendente.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-014 — Fallback de persistência perde progresso

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Leitura descartava o estado de memória.
- **Como reproduzir:** Bloquear localStorage ou simular falha de escrita e depois carregar.
- **Resultado esperado:** storageFailed e cache atualizado; falha de reset tratada.
- **Correção / decisão:** storageFailed e cache atualizado; falha de reset tratada.
- **Arquivos alterados ou analisados:** systems/PersistenceService.js
- **Teste realizado:** Fallback e recompensa idempotente PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-015 — Input sem recuperação controlada

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Pergunta/foco pouco claros; falta de cancelamento coordenado da execução.
- **Como reproduzir:** Iniciar input na 7 e pressionar RESTAURAR.
- **Resultado esperado:** Formulário com submit, cancelamento de promessa e espera da tarefa.
- **Correção / decisão:** Formulário com submit, cancelamento de promessa e espera da tarefa.
- **Arquivos alterados ou analisados:** ui/GameUI.js; systems/CommandInterpreter.js; systems/PlayerController.js
- **Teste realizado:** Enviar entrada exata, cancelar e restaurar sem perder vidas PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-016 — Mapas grandes reduzidos e câmera ausente

- **Status:** IMPLEMENTADO
- **Descrição / resultado observado / causa:** tileSize calculado para encaixar o mapa completo; inexistência de pan/zoom.
- **Como reproduzir:** Abrir dungeon grande na versão recebida.
- **Resultado esperado:** Tile fixo e câmera navegável independente da UI.
- **Correção / decisão:** Tile fixo e câmera navegável independente da UI.
- **Arquivos alterados ou analisados:** systems/CameraController.js; Game.js; ui/GameUI.js
- **Teste realizado:** Modelo e adaptador de eventos PASS; sensação visual pendente.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-017 — Placeholders e identidade visual inconsistente

- **Status:** IMPLEMENTADO
- **Descrição / resultado observado / causa:** Geometria/letras substituíam sprites disponíveis.
- **Como reproduzir:** Inspecionar portas, mecanismos e paredes recebidos.
- **Resultado esperado:** Catálogo oficial, estados de imagens e decoração Castle.
- **Correção / decisão:** Catálogo oficial, estados de imagens e decoração Castle.
- **Arquivos alterados ou analisados:** systems/MapRenderer.js; systems/BarrierSystem.js; systems/AssetCatalog.js; Preloader.js
- **Teste realizado:** PNG/caminhos/quadros e papéis visuais PASS; composição real pendente.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-018 — Regressão de inicialização do editor durante refatoração

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Campo ainda não recebia codigoInicial explicitamente.
- **Como reproduzir:** Criar GameUI na primeira implementação nova.
- **Resultado esperado:** Atribuição na criação antes de inicializar tutorial.
- **Correção / decisão:** Atribuição na criação antes de inicializar tutorial.
- **Arquivos alterados ou analisados:** ui/GameUI.js
- **Teste realizado:** Integração das 20 fases com código inicial/tutorial PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-019 — Regressão de dimensões do alçapão

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Quadro 32×32 configurado para PNG 80×16.
- **Como reproduzir:** Validar spritesheet trapdoor_open após integração.
- **Resultado esperado:** Quadro 16×16 em ambos os catálogos.
- **Correção / decisão:** Quadro 16×16 em ambos os catálogos.
- **Arquivos alterados ou analisados:** systems/AssetCatalog.js; assets/official-manifest.json
- **Teste realizado:** Teste de dimensões de todos os PNG/quadros PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-020 — Temporizador de centralização incompleto durante implementação

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Contador de centralização não inicializado com consistência.
- **Como reproduzir:** Centralizar sem execução na primeira versão do controlador.
- **Resultado esperado:** centerElapsed inicializado/resetado e encerrado aos 850 ms.
- **Correção / decisão:** centerElapsed inicializado/resetado e encerrado aos 850 ms.
- **Arquivos alterados ou analisados:** systems/CameraController.js
- **Teste realizado:** Recenter converge e encerra, mantendo follow durante execução PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-021 — Placa da atividade 12 desassociada dos perigos

- **Status:** CORRIGIDO
- **Descrição / resultado observado / causa:** Placa alternava, mas espinhos mantinham a configuração inicial da variante; faltavam connections.
- **Como reproduzir:** Em qualquer variante, pisar na placa em linha 3/coluna 2.
- **Resultado esperado:** Conectar rota superior e inferior com estados inversos, sem mover elementos.
- **Correção / decisão:** Conectar rota superior e inferior com estados inversos, sem mover elementos.
- **Arquivos alterados ou analisados:** activities.js
- **Teste realizado:** Teste específico nas duas variantes e suíte original PASS.
- **Resultado:** Implementação aplicada. Evidências automatizadas em RELATORIO_DE_TESTES.md; limites visuais mantidos.

## PK-022 — Divergências entre documentos históricos e mapas atuais

- **Status:** PENDENTE
- **Descrição / resultado observado / causa:** M01 é citado onde o mapa usa placa alternadora ou não tem pressão; perigos laterais de 18/20 são controlados por placas, sem relógio cíclico M12. Gabarito histórico alinhado à esquerda perde a sintaxe de blocos.
- **Como reproduzir:** Comparar M01/M12 nos documentos/planilha com entidades de 12, 15, 18 e 20.
- **Resultado esperado:** Documentação e mapa descreverem a mesma mecânica.
- **Correção / decisão:** Fontes preservadas; divergência explicitada. Implementar relógio ou trocar tipo de placa alteraria o comportamento das fases.
- **Arquivos alterados ou analisados:** Nenhum documento oficial alterado.
- **Teste realizado:** Inspeção de configuração, código e documentos; soluções atuais PASS.
- **Resultado:** Pendente; sem alegação de resolução.

- **Impacto:** Rastreabilidade acadêmica pode atribuir mecanismos não presentes.
- **Motivo:** Preservar documentos e mecânicas recebidas; revisar com a equipe antes de redesenhar.
- **Risco:** Não considerar o item homologado apenas por soluções oficiais PASS.
- **Recomendação futura:** Conciliar biblioteca/roteiro com o mapa atual em atividade acadêmica separada; manter a planilha intacta.

## PK-023 — Presença de sintaxe não prova uso pedagógico correto

- **Status:** PENDENTE
- **Descrição / resultado observado / causa:** Objetivos verificam presença na AST; código não executado pode cumprir presença de conceito. Todos os portais da 15 gravam correctPortal; não há validação direta da faixa escolhida contra a entrada.
- **Como reproduzir:** Inspecionar used_concept e os três portais da atividade 15.
- **Resultado esperado:** A avaliação distinguir uso correto e incorreto do conceito ensinado.
- **Correção / decisão:** Mantidos os critérios recebidos; recomenda-se especificar avaliação dinâmica e casos negativos antes de alterar vitória.
- **Arquivos alterados ou analisados:** systems/MissionObjectiveSystem.js; systems/TutorialSystem.js; activities.js (análise, sem mudança de regra).
- **Teste realizado:** Inspeção estática confirmada; não foi alegado teste exaustivo de todas as soluções alternativas.
- **Resultado:** Pendente; sem alegação de resolução.

- **Impacto:** Soluções alternativas podem atingir o objetivo sem demonstrar o raciocínio esperado.
- **Motivo:** Alterar critérios de vitória exige uma decisão pedagógica e novos casos oficiais.
- **Risco:** Não considerar o item homologado apenas por soluções oficiais PASS.
- **Recomendação futura:** Definir invariantes por conceito e rotas alternativas; depois implementar avaliação dinâmica sem exigir nomes arbitrários.

## PK-024 — Homologação visual e compatibilidade não executada

- **Status:** PENDENTE
- **Descrição / resultado observado / causa:** Navegador bloqueou localhost com ERR_BLOCKED_BY_CLIENT; instalação local não concluiu por timeout de rede.
- **Como reproduzir:** Abrir servidor local no navegador de teste do ambiente.
- **Resultado esperado:** Interface e câmera verificadas em navegador real, com evidências.
- **Correção / decisão:** Testes lógicos e adaptadores concluídos; roteiro manual entregue. Nenhum contorno de bloqueio ou publicação externa.
- **Arquivos alterados ou analisados:** docs/RELATORIO_DE_TESTES.md
- **Teste realizado:** Não executado em Chrome/Edge/Firefox reais.
- **Resultado:** Pendente; sem alegação de resolução.

- **Impacto:** Sobreposições, nitidez e sensação de câmera podem ter problemas não detectados por adaptadores.
- **Motivo:** Bloqueio técnico do ambiente de navegador.
- **Risco:** Não considerar o item homologado apenas por soluções oficiais PASS.
- **Recomendação futura:** Executar o roteiro manual entregue, salvar capturas e registrar navegador/resolução/data.

## Falhas de desenvolvimento dos próprios testes

A primeira execução do contrato CSS usava `textarea` em vez do seletor real `#pk-code`. A primeira integração comparava `updatedAt` no replay (que pode mudar sem duplicar recompensa), esperava codigoInicial em vez da primeira microetapa em 11/16 e buscava input na atividade 6, que ensina print. O teste novo da placa omitiu os argumentos row/column. Esses defeitos de teste foram corrigidos mantendo a validação substantiva. Logs intermediários disponíveis em evidencias; resultado final: 118 PASS, 0 FAIL. Não foram atribuídos falsamente ao produto.
