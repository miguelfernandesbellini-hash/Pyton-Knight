# Pyton Knight V3 — dungeon educacional

Versão atual da rodada V3, continuada a partir do projeto funcional. As 20 atividades foram redesenhadas com exploração, pistas físicas, iluminação e mecanismos animados, preservando Phaser, interpretador, Livro Mágico e progressão.

**Validação:** 221 testes aprovados (146 anteriores + 75 novos), suíte legada aprovada, 29 cenários V3 e 69 verificações isoladas de pistas/requisitos. **Homologação visual no navegador: PENDENTE**, devido a `ERR_BLOCKED_BY_CLIENT`. Não declarar o acabamento homologado antes dessa etapa.

## Executar

Não há build nem instalação de dependências de produção. Phaser e assets estão incluídos. Com Python 3 instalado, na pasta do projeto:

```bash
python3 -m http.server 8000
```

No Windows, use `py -m http.server 8000`. Abra **http://localhost:8000** em Chrome, Edge ou Firefox. O jogo deve ser servido por HTTP. Para avaliação de todas as fases, use **http://localhost:8000/?dev=1**; esse modo libera o seletor de atividades. No modo normal, os desbloqueios seguem a progressão salva.

Guto é controlado pelo programa no Livro Mágico. Arrastar o mapa e usar zoom são controles da câmera. As quatro orientações e o movimento tile a tile são animados.

## Jogar e descobrir

`EXECUTAR` preserva o código e as descobertas da atividade, mas restaura posição, chaves, moedas provisórias, portas e mecanismos temporários. A luz revelada e as inscrições lidas permanecem durante a atividade. `REINICIAR` limpa código, tutorial e descobertas; preserva vidas e progressão consolidada.

Use `examinar()` diante de livros/inscrições e consulte o **DIÁRIO**. `input()` recebe as descobertas no pedestal; o campo não entrega respostas. Nas atividades 1, 6, 11 e 16, siga VER → EXECUTAR → COMPLETAR → ESCREVER.

| Unidade | Atividades | Conceitos |
|---|---|---|
| 1 | 1–5 | Variáveis, reatribuição, aritmética e movimento |
| 2 | 6–10 | print, input, int e processamento |
| 3 | 11–15 | if, else, elif, comparações, AND/OR |
| 4 | 16–20 | for/range, acumuladores, while e break |

## Documentação atual

- [Gabarito oficial das 20 atividades](Gabarito_Oficial_Pyton_Knight_V3.txt)
- [Resumo da entrega e pendências](docs/v3/ENTREGA_V3.md)
- [API e arquitetura](docs/v3/API_V3.md)
- [Matriz por atividade, mapas e pistas](docs/v3/MATRIZ_ATIVIDADES.md)
- [Auditoria anti-atalho](docs/v3/AUDITORIA_ANTI_ATALHO.md)
- [Relatório de testes](docs/v3/RELATORIO_TESTES.md)
- [Bugs e correções](docs/v3/BUGS_E_CORRECOES.md)
- [Homologação visual](docs/v3/HOMOLOGACAO_VISUAL.md)
- [Assets e lacunas de arte](docs/v3/ASSETS.md)

Os documentos anteriores fora de `docs/v3` são históricos. A planilha acadêmica e o documento oficial V3 foram copiados integralmente para `docs/v3/referencias`, com SHA-256 registrado. O novo gabarito substitui as soluções anteriores apenas para os mapas V3.

## Código e compatibilidade

`activities.js` preserva a base histórica. **O navegador sempre carrega também `activities-v3.js`**, que aplica os 20 mapas atuais. Para editar uma fase, altere `tools/v3/unitN.cjs` e execute `node tools/v3/build.cjs`; depois valide as soluções e gere a documentação com `node tools/v3/document.cjs`.

O parser continua sendo o original. A extensão do interpretador registra contexto de comandos e origem dos inputs para verificar a aplicação pedagógica. Não executa Python arbitrário. Progressão mantém `localStorage`, XP por vidas, moedas consolidadas e recompensa única por atividade. Descobertas permanecem em memória apenas na cena atual; fechar/reabrir a página ou trocar de atividade inicia nova descoberta.

## Testar

Requer Node.js com suporte a `node:test` (validado em Node 24.19.0).

```bash
node --test --test-reporter=tap tests/*.test.cjs
node tests/run-tests.cjs
node tools/v3/audit.cjs
```

Os testes antigos verificam compatibilidade com o catálogo histórico; as suítes `v3-*` e a auditoria verificam o catálogo realmente carregado no jogo. Ambas precisam passar.

`tools/v3/render-review.cjs` gera plantas estáticas e atlas para revisão de arte. Esse utilitário opcional usa `@napi-rs/canvas`, localizado por `CODEX_PRIMARY_RUNTIME_NODE_MODULES` no ambiente de produção dos relatórios; ele não é necessário para jogar ou executar os testes. As imagens já estão incluídas.

## Limites explícitos

A API é um subconjunto pedagógico de Python. Balanceamento de XP/orçamentos e estimativas de tentativas ainda precisam de playtest com alunos. A execução lógica foi validada; enquadramento, CSS, fluidez, câmera e legibilidade final em navegador real aguardam PK-024. Estados de interação, medo, dano e vitória combinam poses direcionais com efeitos procedurais; não possuem folhas desenhadas exclusivas para cada ação.
