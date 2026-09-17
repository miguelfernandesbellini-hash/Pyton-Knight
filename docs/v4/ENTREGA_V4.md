# Pyton Knight V4 — entrega técnica

17/09/2026. Continuação da V3 final, sem reconstrução das fases. **269 testes aprovados: 221 anteriores + 48 novos.** Suíte legada aprovada. Homologação visual interativa permanece **PENDENTE — PK-024**, devido a `net::ERR_BLOCKED_BY_CLIENT`.

## O que mudou

- Orçamento semântico em todas as atividades: permite executar e explorar acima do limite; exige otimização para concluir. Os guardas globais contra loops excessivos continuam ativos.
- Modal de conclusão com nome, objetivos locais, regras pedagógicas, moedas, baús quando presentes, vidas, tentativas e instruções. Repetição sem duplicar recompensas; próxima atividade e conclusão da jornada.
- Cinco moedas opcionais por fase, 100 IDs únicos. Coleta salva imediatamente, independente de conclusão, morte ou reinício. Rubis pedagógicos continuam provisórios e separados das moedas.
- 125 decorações de parede, reutilizando arte da dungeon. Nenhuma nova colisão nas fases. Geometria, texturas e desenho das paredes preservados.
- Nove inscrições existentes da Unidade 2 apresentadas como estantes investigáveis. Indicador `!` em inscrições próximas e visíveis, retirado após leitura. Estantes decorativas não interagem. Luz não registra texto no Diário.
- Oito totens das A16/A20 com nova arte pixel art OFF/ON, mesma escala, âncora, posições e conexões.
- Base de coleção persistente separada do saldo, preparada para gastos futuros. Nenhuma loja implementada.

## Preservado

Os 20 mapas, inícios, orientações, barreiras, regiões, pistas, posições funcionais, variantes, whitelists e soluções oficiais V3 permanecem iguais. A exceção de dados é a padronização solicitada das moedas: três moedas opcionais antigas foram incorporadas aos novos IDs; os oito rubis passaram a `type: ruby`, mantendo IDs e posições. Objetivos receberam apenas o orçamento onde faltava.

Parser e contagem semântica não foram alterados. Livro Mágico, descoberta, tutoriais, animações do Guto e mecanismos, XP por vidas e desbloqueios permanecem. O registro de progressão usa a mesma chave de armazenamento. O saldo anterior é preservado como crédito legado, sem inventar moedas já coletadas.

O Plano_e_Fluxo_de_Testes acadêmico foi preservado byte a byte. Os relatórios abaixo são exclusivamente técnicos desta rodada.

## Evidências e documentos

| Item | Arquivo |
|---|---|
| Soluções das 20 atividades | [Gabarito oficial V4](../../Gabarito_Oficial_Pyton_Knight_V4.txt) |
| APIs, estado, orçamento e migração | [API_V4.md](API_V4.md) |
| Limites, moedas, decoração por fase | [MATRIZ_V4.md](MATRIZ_V4.md) |
| Testes e cobertura dos requisitos | [RELATORIO_TESTES.md](RELATORIO_TESTES.md) |
| Auditoria física e descoberta | [AUDITORIA_V4.md](AUDITORIA_V4.md) |
| Ajustes e correções | [BUGS_E_CORRECOES.md](BUGS_E_CORRECOES.md) |
| Arte, origem e prompt | [ASSETS.md](ASSETS.md) |
| Validação visual e roteiro pendente | [HOMOLOGACAO_VISUAL.md](HOMOLOGACAO_VISUAL.md) |
| GitHub, V3 e V4 | [VERSIONAMENTO.md](VERSIONAMENTO.md) |

## Executar a entrega

Sem build ou dependência externa de produção: Phaser, código e imagens estão incluídos. Na raiz, execute `python3 -m http.server 8000` (Windows: `py -m http.server 8000`) e abra `http://localhost:8000/`. Use `/?dev=1` para o seletor de avaliação; o modo normal mantém os desbloqueios.

Persistência é local ao perfil e à origem do navegador. Reabrir o mesmo endereço mantém a coleção. `localhost` e `127.0.0.1`, portas diferentes, perfis diferentes ou limpeza dos dados do navegador são saves distintos. Se o navegador recusar localStorage, o fallback histórico mantém somente a sessão; não há servidor de contas nesta versão.

## Limites da entrega

Sem homologação de CSS, câmera, fluidez, foco e animações em navegador real nesta sessão. Pranchas de arte e testes de DOM/Phaser adaptado não substituem essa etapa. O balanceamento com alunos continua sujeito a playtest. Não houve revisão estrutural do conteúdo pedagógico.
