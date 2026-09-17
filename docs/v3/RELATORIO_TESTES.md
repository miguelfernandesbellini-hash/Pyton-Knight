# Relatório técnico de testes — V3

Data: 16/09/2026. Ambiente de execução lógica: Node.js 24.19.0 em Linux. Este relatório é separado do Plano_e_Fluxo_de_Testes acadêmico, que não foi alterado.

## Resultado

| Grupo | Baseline | Final V3 |
|---|---:|---:|
| Testes anteriores `*.test.cjs` | 146 PASS | 146 PASS |
| Novos testes V3 | — | 75 PASS |
| Suíte Node completa | 146 PASS | **221 PASS, 0 falhas** |
| Suíte legada `run-tests.cjs` | PASS | PASS |
| Soluções V3 / variantes pelo interpretador real | — | **29 cenários PASS, com replay** |
| Auditoria de mapas | Baseline registrado | **20 mapas PASS** |
| Omissões de pistas/requisitos isolados | — | **69 verificações PASS** |
| Homologação em navegador real | Bloqueada | **PENDENTE — ERR_BLOCKED_BY_CLIENT** |

A suíte legada cobre 27 cenários e replays, matriz de 20 atividades e regressões históricas. Ela continua usando `activities.js` para detectar quebra de compatibilidade. As suítes V3 e `tools/v3/audit.cjs` carregam também `activities-v3.js`, exatamente como o navegador. O êxito da suíte legada sozinho não comprova os mapas atuais.

## Execução e evidências

```bash
node --test --test-reporter=tap tests/*.test.cjs
node tests/run-tests.cjs
node tools/v3/audit.cjs
```

- `evidencias/baseline.tap`: 146 testes aprovados antes das alterações.
- `evidencias/baseline-legada.json`: suíte histórica na base.
- `evidencias/unidade1-regressao.tap`, `unidade2-regressao.tap`, `unidade4-regressao.tap`: checkpoints de compatibilidade durante a implementação. O último inclui as quatro unidades; não foi criado um log separado da Unidade 3.
- `evidencias/suite-final.tap`: 221 testes finais.
- `evidencias/legada-final.json`: suíte legada final.
- `evidencias/auditoria.json`: resultado por mapa, variante, porta, pista, requisito e região.
- `evidencias/verificacao-final.json`: sintaxe, caminhos de assets, integridade de módulos preservados e planilha.
- `evidencias/visual/`: plantas/atlas; revisão estática, não screenshot de navegador.

## Cobertura nova relevante

As 20 soluções oficiais executam no parser/interpreter de produção. A12 cobre os dois estados da placa; A15 cobre poderes 25, 15 e 5 e rejeita seis combinações de portão incorreto; A18 cobre 3/4/5 módulos; A19 e A20 cobrem cada posição da chave com o mesmo algoritmo. Replays preservam código e descobertas sem duplicar recompensas.

A progressão completa foi executada de 1 a 20 com persistência simulada e recarga do serviço. Foram conferidos atividades concluídas, limite de desbloqueio, XP, bolsa, multiplicadores por 1/2/3 vidas, coleta provisória e recompensa única. Programas que excedem orçamento são rejeitados antes de mover Guto.

A separação de descoberta/tentativa é testada: luz e texto lido permanecem; chave, posição e guardião reiniciam. REINICIAR limpa Diário/luz e preserva vidas. A UI das 20 cenas foi montada com adaptadores DOM/Phaser. O Diário inicia vazio, não registra texto só por iluminar e não entrega palavras no formulário de input.

Espinhos possuem contexto de desativação, gatilho/sinal/ciclo e estado recolhido visível; lava cenográfica bloqueia. Escuridão profunda avisa antes de remover exatamente uma vida. As animações têm testes da ordem lógica: porta e baú bloqueiam durante abertura; portal energiza antes do transporte; aparência distingue estados das principais famílias.

Alternativas legítimas: passarela longa da A4; acumulador renomeado, soma explícita e `range(início, fim, passo)` na A17. Não foram exigidos os nomes do gabarito. Testes adversariais cobrem laço decorativo, input ignorado, leitura remota, contador falso via moedas, poder incompatível com variante e ativação da ponte sem totens.

## Falhas encontradas e corrigidas

O primeiro lote novo registrou falhas de fixture: comparação incluía `updatedAt`, que deve mudar a cada salvamento, e acessava `completed` em vez do schema original. A comparação foi corrigida para os dados relevantes. Nenhuma regra estável de progressão foi alterada para fazer esse teste passar. O log intermediário `v3-primeira.tap` foi mantido.

A auditoria encontrou contorno físico do cofre A9 e ativação direta de segmentos da ponte; ambos corrigidos e cobertos por regressão. Durante o desenvolvimento, foram corrigidos o gerador de indentação, marcadores de saída, variantes dos módulos e sincronização visual. Consulte `BUGS_E_CORRECOES.md`.

## Limites

Os adaptadores testam chamadas e estados; não são um motor gráfico real. Não foi medida taxa de quadros, layout CSS, sobreposição no input, enquadramento da câmera ou percepção dos efeitos no navegador. Não foi realizado playtest com alunos. Não há alegação de que 221 testes substituam essas validações.
