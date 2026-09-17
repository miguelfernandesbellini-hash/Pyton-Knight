# Adendo de conciliação documental — PK-022

Este adendo descreve a versão atual e prevalece na interpretação das divergências abaixo. Os DOCX históricos e a planilha acadêmica não foram editados. As referências `mechanics` em activities.js são metadados históricos; o comportamento é determinado pelas entidades e pelo runtime.

| Referência histórica | Estado efetivo preservado | Leitura correta nesta versão |
| --- | --- | --- |
| Atividade 12 citada como M01 | `plate` é `toggle_plate`; conexões opostas de espinhos | M02: alterna por entrada, não exige pressão contínua. ON libera rota superior, OFF inferior |
| Atividade 15 cita M01/M02 | Chave, alavanca, pedestal, três portais, grade; nenhuma placa configurada | Não afirmar que essa fase exercita placas. Exercita classificação, entrada e pré-requisitos físicos |
| Atividades 18/20 associadas a M12 cíclico | Sensores, desativação e mecanismos por eventos; não há relógio de ciclo | Perigos dependem de estado/evento. Não apresentar espera temporal como solução |
| M01 genérico | Runtime libera placa de pressão ao sair; teste por fixture | Suporte do motor não prova uso em uma atividade que não instancia pressure_plate |
| Gabarito histórico alinhado à esquerda | Blocos perderam indentação | Usar officialSolution da versão principal e o gabarito de 20 atividades nela incluído; nunca eliminar indentação para executar o histórico |

Não se adicionou uma mecânica cíclica nem se transformou a placa alternadora em pressão, pois isso alteraria os comportamentos preservados pelo pedido. A conciliação foi resolvida por documentação da implementação real, não por declaração fictícia de recursos.

Na atividade 15, o último valor recebido pelo input contextual no pedestal determina a faixa do portal. Renomear ou reatribuir a variável do aluno não altera a informação física recebida. Dados publicados no Livro: 25 e as três faixas; os cenários de teste 15 e 5 continuam válidos com a solução oficial.

Objetivos de uso agora recebem evidência de execução. Uma cadeia if/elif/else alcançada conta sua estrutura completa, mesmo quando apenas um ramo é selecionado — condição necessária para preservar as três soluções oficiais. Isso não constitui uma prova formal da qualidade de qualquer algoritmo; elimina a aceitação baseada exclusivamente em código morto e valida a escolha concreta do portal.
