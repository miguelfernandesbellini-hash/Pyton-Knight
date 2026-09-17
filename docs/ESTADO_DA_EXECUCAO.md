# Estado atual — V4, 17/09/2026

Usar esta versão como base. Não restaurar ZIP original, não reconstruir fases V3 e não executar geradores históricos de documentação por engano.

## Concluído

- V3 final exata registrada no GitHub: `8664886f9682d298da8d427ca3b061b5299f0b49`, referência `release/v3-final-2026-09-17`.
- Branch `backup-pre-v3-2026-09-17` preservada em `1ca7e942ef269410b4109036435f4804ace66cdf`.
- V4 sobre os mesmos 20 mapas, paredes, pistas, soluções, variantes e whitelists.
- Orçamento semântico em todas as atividades; execução acima do limite permitida; conclusão exige otimização.
- Modal com objetivos, regras, estatísticas, tentativas válidas, repetir/próxima e conclusão da jornada.
- 100 moedas persistentes, opcionais e não farmáveis; rubis separados; saldo V3 preservado como crédito legado.
- 125 decorações, nove estantes investigáveis, ! contextual e oito totens com novos sprites OFF/ON.
- 269 testes PASS: 221 anteriores + 48 V4; suíte legada PASS.
- 29 cenários, 69 verificações físicas/descoberta e 145 acessos sem dano às moedas aprovados.
- Gabarito V4 e documentação técnica em `docs/v4`; documentos V3 preservados.
- Planilha acadêmica, parser, dados V3, paredes e assets anteriores preservados por integridade.
- Publicação V4 em `main` e `release/v4-2026-09-17`, como revisão sucessora direta da V3. O SHA desta versão é o commit dessas referências; ver `v4/VERSIONAMENTO.md`.

## Pendente

**PK-024 — homologação visual interativa.** A nova tentativa no navegador retornou `net::ERR_BLOCKED_BY_CLIENT`. Fonte dos totens e pranchas estáticas foram inspecionadas. Não foram homologados CSS, foco real, câmera, fluidez, neblina dinâmica ou taxa de quadros no navegador.

Próxima ação: executar o roteiro `v4/HOMOLOGACAO_VISUAL.md` em ambiente acessível, registrar evidências reais e corrigir somente defeitos reproduzidos. Playtest com alunos continua necessário para medir dificuldade/clareza. Próximo ID livre: PK-049.
