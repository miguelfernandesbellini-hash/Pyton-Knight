# Pyton Knight — rodada final de correções

15/09/2026. Continuação da entrega anterior, sem reiniciar o projeto ou restaurar backup.

- **PK-022: resolvido documentalmente.** Adendo identifica quais mecânicas existem de fato e quais referências são históricas, sem adicionar relógios ou mudar mapas.
- **PK-023: corrigido.** A atividade 15 verifica o poder recebido no pedestal: 25 → Sol, 15 → Lua, 5 → Sombra; faixas >=20, >=10 e <10. Portal errado interrompe a tentativa com feedback, não ativa, não teleporta, não marca correctPortal nem recompensa. Comandos não executados e laços sem iteração não satisfazem mais objetivos de uso.
- **PK-024: pendente por bloqueio do ambiente.** A nova tentativa de navegador retornou ERR_BLOCKED_BY_CLIENT. Não há homologação visual real nesta entrega.
- **Sprites:** cinco PNGs originais com transparência para guardião, basilisco, pedestal, runa e totem, integrados em `assets/custom/`. Escudos/estante/bandeira deixam esses papéis. Cofre aberto permanece baú; proporções preservadas.
- **Acabamento:** menu acessível em viewport estreita, dados de input com altura limitada, leitura dos botões e HUD ajustada.
- **Testes:** 118 anteriores + 28 novos = 146 PASS. Suíte legada PASS após ajuste de preparação de um teste contextual que não fornecia o poder exigido. A suíte literalmente recebida foi executada antes desse ajuste e falhou nessa expectativa antiga; seu conteúdo foi preservado como evidência.
- **Preservação:** `activities.js` byte a byte idêntico à entrega anterior: 20 atividades, mapas, posições, soluções, objetivos e recompensas preservados. Editor e câmera mantidos. Planilha acadêmica intacta por SHA-256.

Projeto: `01_JOGO_ATUAL/Pyton-Knight-20-Atividades-Mapas-Reelaborados/`. Leia `docs/RELATORIO_DE_TESTES.md` e `docs/ESTADO_DA_EXECUCAO.md`. Histórico completo da primeira rodada em `docs/evidencias/rodada1_documentacao/`.

Ainda falta executar a inspeção visual/compatibilidade em navegador acessível. Não se afirma que testes com adaptadores provem ausência de sobreposições ou que sprites já tenham sido aprovadas em tela de jogo.
