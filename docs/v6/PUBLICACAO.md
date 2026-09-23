# V6 — publicação e integridade

Estado em 23/09/2026: **push bloqueado pelo ambiente; commits preservados localmente**.

- Repositório: `https://github.com/miguelfernandesbellini-hash/Pyton-Knight.git`.
- Branch local: `feat/v6-gameplay-polimento`; sem upstream V6 configurado.
- Base V5 preservada: `15c2332` e `1286337`.
- Commits V6: `ab7242d`, `c82559c`, `c667318`, `80a4469`, `6f5eaea`, seguidos
  pelo commit deste registro de entrega (obter hash atual com `git rev-parse HEAD`).
- `git fsck --full --no-reflogs`: aprovado. Main continua em `2200126`.
- A integração GitHub consultou a branch V6 e retornou lista vazia.

## Tentativas, sem alterar credenciais

1. Git padrão, `push --set-upstream origin feat/v6-gameplay-polimento`:

   `schannel: AcquireCredentialsHandle failed: SEC_E_NO_CREDENTIALS (0x8009030e)`.

2. Git empacotado, backend OpenSSL apenas para o comando, sem prompt interativo:

   `couldn't create signal pipe, Win32 error 5`

   `fatal: unable to get password from user`.

3. Integração GitHub, criar branch apontando para o commit local exato
   `6f5eaead9e42653e1bd9a77227378db9a764cfcb`:

   HTTP 422, `Object does not exist`.

Os objetos Git locais não chegaram ao servidor. A integração disponível cria
referências apenas para objetos existentes; recriar commits pela API mudaria
os hashes/histórico. Não foi feito force push, alteração de credenciais ou merge.
Nenhum PR foi aberto por não existir a branch remota; [texto preparado](PR.md).

## Retomar publicação

Em terminal com Git/GitHub autenticado, na cópia que contém `.git` e esta branch:

```powershell
git status --short
git push --set-upstream origin feat/v6-gameplay-polimento
```

Depois, confirmar no GitHub o mesmo hash de `git rev-parse HEAD` e abrir PR para
main usando o texto preparado. Não fazer merge antes da homologação humana.

A entrega adicional `Pyton-Knight-V6.zip` contém os arquivos versionados sem
`.git`; o bundle `Pyton-Knight-V6.bundle` preserva o histórico completo para
recuperação/publicação. Ambos são gerados fora do repositório após o commit final.
O ZIP executa sem Git seguindo o README; não é uma cópia de save do navegador.
