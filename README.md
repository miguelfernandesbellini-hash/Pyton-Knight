# Pyton Knight V5 — polimento audiovisual

**V5 IMPLEMENTADA — AGUARDANDO HOMOLOGAÇÃO.** PK-024 permanece pendente de
avaliação visual e sonora humana. Esta versão ainda não é a referência final congelada.

A V5 acrescenta uma trilha ambiente original provisória em loop, seis efeitos
sonoros, controles de música/efeitos e mudo compartilhados entre menu e atividades,
iluminação decorativa sob a névoa, halo do Guto, partículas discretas, feedback de
coleta e progresso na conclusão. As 20 atividades, mapas, soluções, interpretador,
Livro Mágico e regras de recompensas da V4 foram preservados.

Abra **ÁUDIO** no menu ou no cabeçalho da dungeon. A música começa após interação
com a página; volume e mudo permanecem durante a sessão, incluindo retorno ao menu.
As preferências de áudio voltam aos valores iniciais ao recarregar a página.

**Validação V5:** 281 testes aprovados (269 existentes + 12 específicos), suíte
legada PASS, 29 cenários oficiais, 69 verificações de requisitos e 145 verificações
de acesso às 100 moedas. O teste no Chrome automatizado foi bloqueado por
`spawn EPERM`; os testes de DOM/renderização usam adaptadores e não homologam
aparência, som, desempenho real ou console do navegador.

- [Relatório V5, decisões e pendências](docs/v5/ENTREGA_V5.md)
- [Checklist de homologação visual e sonora — PK-024](docs/v5/HOMOLOGACAO_VISUAL_SONORA.md)
- [Texto preparado para PR](docs/v5/PR.md)
- [Origem e licença do áudio](assets/audio/README.md)

O conteúdo abaixo descreve a base V4 preservada. Para testar no ambiente restrito
do Codex, use `node --test --test-isolation=none --test-reporter=tap tests/*.test.cjs`.
Esse modo evita o bloqueio de criação de subprocessos sem remover testes.

## Base V4 preservada

Continuação da V3 final: as 20 fases, soluções e paredes foram preservadas. A V4 acrescenta decoração, estantes investigáveis com **!**, novos totens, orçamento flexível para explorar, modal de conclusão e **100 moedas únicas persistentes**.

**Validação:** 269 testes aprovados (221 anteriores + 48 V4), suíte legada PASS, 29 cenários oficiais, 69 verificações de pistas/requisitos e 145 verificações de acesso às moedas. **Homologação visual em navegador real: PENDENTE**, por `ERR_BLOCKED_BY_CLIENT`. Plantas estáticas e testes não substituem essa etapa.

## Executar

Não há build nem dependências externas de produção. Phaser e todos os assets estão incluídos. Na pasta do projeto, com Python 3 instalado:

```bash
python3 -m http.server 8000
```

No Windows: `py -m http.server 8000`. Abra **http://localhost:8000/** no navegador. Use **http://localhost:8000/?dev=1** para selecionar qualquer atividade durante avaliação. No modo normal, o progresso salvo controla os desbloqueios.

Guto se move pelo código do Livro Mágico. Arrastar e aproximar o mapa controla somente a câmera. Tutoriais A1, A6, A11 e A16 mantêm VER → EXECUTAR → COMPLETAR → ESCREVER.

## Explorar e concluir

- EXECUTAR restaura posição, mecanismos, chaves e rubis; preserva as pistas e luz descobertas na atividade. Programas acima do orçamento também executam.
- Para concluir, cumpra os objetivos físicos e pedagógicos **e** o limite de instruções semânticas. O indicador conta instruções do parser, não linhas. Acima do limite, o jogo pede otimização ao alcançar o cristal.
- Use `examinar()` diante de inscrições e estantes investigáveis. O **!** indica proximidade; o Diário só registra a leitura feita pelo jogador. A luz revela objetos, sem ler os livros automaticamente.
- Cada fase tem cinco moedas opcionais. A coleta é salva imediatamente; executar, morrer, reiniciar ou repetir a fase não recria moedas nem duplica o saldo. Rubis vermelhos continuam sendo itens provisórios das atividades de laços.
- A conclusão mostra objetivos, regras e estatísticas. TENTAR NOVAMENTE começa nova partida com três vidas e zero tentativas, preservando código e recompensas salvas. PRÓXIMA ATIVIDADE avança; A20 permite CONCLUIR JORNADA.
- REINICIAR restaura código, tutorial e descobertas; preserva vidas, contador da visita e dados persistentes.

A coleção é salva no perfil e endereço do navegador. Reabra o mesmo endereço/porta para usar o mesmo save. XP, desbloqueios e saldo anteriores da V3 são preservados; moedas antigas viram crédito legado separado dos 100 IDs da V4.

| Unidade | Atividades | Conteúdo preservado |
|---|---|---|
| 1 | 1–5 | Variáveis, reatribuição, aritmética e movimento |
| 2 | 6–10 | print, input, int e processamento |
| 3 | 11–15 | if, else, elif, comparações, AND/OR |
| 4 | 16–20 | for/range, acumuladores, while e break |

## Documentação atual

- [Entrega V4 e limitações](docs/v4/ENTREGA_V4.md)
- [Gabarito oficial V4 das 20 atividades](Gabarito_Oficial_Pyton_Knight_V4.txt)
- [API, orçamento, coleção e migração](docs/v4/API_V4.md)
- [Matriz V4 por atividade](docs/v4/MATRIZ_V4.md)
- [Testes e cobertura dos requisitos](docs/v4/RELATORIO_TESTES.md)
- [Auditoria de rotas, pistas e moedas](docs/v4/AUDITORIA_V4.md)
- [Bugs e correções](docs/v4/BUGS_E_CORRECOES.md)
- [Homologação visual pendente](docs/v4/HOMOLOGACAO_VISUAL.md)
- [Assets e prompt dos totens](docs/v4/ASSETS.md)
- [Versionamento V3/V4 no GitHub](docs/v4/VERSIONAMENTO.md)

A documentação V3 permanece em `docs/v3`, com matriz completa das regiões, mecânicas, pistas e dependências que continuam em uso. O gabarito V3 está preservado. Documentos de rodadas anteriores fora dessas pastas são históricos. A planilha acadêmica em `docs/v3/referencias` permanece intacta.

## Código e autoria

O navegador carrega `activities.js`, `activities-v3.js` e `activities-v4.js`, nessa ordem. O último é uma camada de adições: não redefine geometrias ou soluções. Parser e contagem semântica são os mesmos da V3.

```bash
node tools/v4/build.cjs
node tools/v4/document.cjs
```

Esses comandos atualizam apenas adições/gabarito/documentos V4. Não regenere o redesign V3 para mudar decoração ou moedas. Todos os resultados necessários para jogar já estão incluídos.

`CoinSystem` controla IDs persistentes; `CompletionSystem` apresenta o resultado validado; `DecorationSystem` desenha ambientação e indicadores. O saldo e o histórico de coleta são separados para futura loja cosmética; nenhuma loja faz parte desta entrega.

## Testar

Validado em Node.js 24.19.0, sem instalar dependências para as suítes:

```bash
node --test --test-reporter=tap tests/*.test.cjs
node tests/run-tests.cjs
node tools/v3/audit.cjs --v4
node tools/v4/audit-coins.cjs
```

Os testes históricos verificam compatibilidade; `v3-*` preservam o baseline; `v4-*` validam o catálogo de produção, as novas regras e suas variantes. Todos precisam passar.

`node tools/v3/render-review.cjs --v4` gera plantas estáticas usando `@napi-rs/canvas`. `tools/v4/prepare-assets.cjs` normaliza o atlas com `sharp`. São ferramentas opcionais de autoria, localizadas por `CODEX_PRIMARY_RUNTIME_NODE_MODULES` neste ambiente; não são necessárias para executar o jogo ou os testes. Imagens prontas e evidências estão no repositório.

## Versões

`main` contém a V4. A V3 final está em `release/v3-final-2026-09-17`, commit `8664886f9682d298da8d427ca3b061b5299f0b49`. A referência V4 é `release/v4-2026-09-17`. A branch `backup-pre-v3-2026-09-17` permanece inalterada.
