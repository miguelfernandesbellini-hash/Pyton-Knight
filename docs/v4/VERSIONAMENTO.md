# Versionamento — V3 final e V4

Repositório: `miguelfernandesbellini-hash/Pyton-Knight`. Histórico anterior preservado; nenhuma atualização forçada de branch.

| Referência | Versão / identificação |
|---|---|
| `backup-pre-v3-2026-09-17` | Preservada em `1ca7e942ef269410b4109036435f4804ace66cdf` |
| `release/v3-final-2026-09-17` | V3 final exata, commit `8664886f9682d298da8d427ca3b061b5299f0b49` |
| `release/v4-2026-09-17` | Commit desta entrega V4 |
| `main` | Versão atual V4 |

## V3

Mensagem: `Pyton Knight V3 - redesign completo das 20 atividades`.

O commit contém os 234 arquivos rastreados da versão funcional final, incluindo binários, sprites, Phaser, documentação, referências e testes. A árvore remota foi comparada por caminho e SHA de blob com o snapshot local aprovado. Nenhum arquivo foi alterado para criar esse registro. Seu pai é `1ca7e942ef269410b4109036435f4804ace66cdf`.

## V4

Mensagem: `Pyton Knight V4 - decoração, orçamento flexível, conclusão aprimorada e moedas persistentes`.

A V4 sucede diretamente o commit V3 remoto. A publicação inclui a árvore completa e mantém os arquivos anteriores, acrescentando sistemas, catálogo V4, imagens, testes, gabarito e documentação. Assets binários são armazenados como blobs Git integrais; não há ponteiros para arquivos fora do repositório nem dependência de URLs temporárias.

O identificador da V4 é o commit apontado por `release/v4-2026-09-17` e `main` nesta entrega. Ele pode ser consultado sem depender de um SHA autorreferente gravado no próprio commit:

```bash
git fetch origin
git rev-parse origin/main
git rev-parse origin/release/v4-2026-09-17
git rev-parse origin/release/v3-final-2026-09-17
git rev-parse origin/backup-pre-v3-2026-09-17
```

A confirmação final da publicação informa os dois SHAs e verifica a identidade entre `main` e a referência V4, além da preservação da V3 e do backup.

## Projeto executável completo

O jogo é estático: não requer compilação. `index.html`, Phaser local, catálogos, sistemas, UI, sprites e demais assets estão no repositório. Os geradores de dados/arte/documentos são ferramentas opcionais de autoria; seus resultados já estão incluídos. Consulte o README para execução HTTP e testes.
