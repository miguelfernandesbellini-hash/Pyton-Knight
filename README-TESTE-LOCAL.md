# Teste local — Pyton Knight V5

V5 IMPLEMENTADA — AGUARDANDO HOMOLOGAÇÃO.
Código e assets do commit 1286337, incluindo o commit de implementação 15c2332.

## Executar

1. Extraia o ZIP e abra um terminal na pasta `Pyton-Knight-V5`, onde está `index.html`.
2. Requisitos: Python 3 e um navegador atual. Não há instalação de pacotes,
   npm install ou build; o Phaser, as imagens e os sons já estão incluídos.
3. Inicie o servidor local:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

No Windows, se necessário, use `py -3 -m http.server 8000 --bind 127.0.0.1`.
Abra http://localhost:8000/ no navegador. Encerre o servidor com Ctrl+C.
Use http://localhost:8000/?dev=1 para selecionar qualquer uma das 20 atividades.
Abra pelo servidor HTTP; não dê duplo clique no HTML.

## Som e homologação

Clique em COMEÇAR/CONTINUAR para liberar o áudio. Abra ÁUDIO no menu ou no
cabeçalho do jogo. Ajuste Música e Efeitos, pressione Silenciar áudio e depois
Ativar áudio. Volte ao menu e troque de atividade: os volumes e o mudo devem
permanecer na sessão, com uma única música contínua. Recarregar a página
restaura os volumes iniciais. A música original atual é provisória.

PK-024 continua PENDENTE de homologação visual e sonora humana. Conferir luzes,
halo, partículas, HUD/Livro, câmera, transições, conclusão, sobreposições e
legibilidade das 20 atividades, além de ouvir o loop e os efeitos.
Checklist completo: `docs/v5/HOMOLOGACAO_VISUAL_SONORA.md`.

## Testes opcionais

Somente para executar a suíte automatizada, instale Node.js 24. Não há pacotes npm.

```powershell
node --test --test-isolation=none --test-reporter=tap tests/*.test.cjs
node tests/run-tests.cjs
```

Os 281 testes estavam aprovados no estado entregue. O Chrome automatizado foi
bloqueado por spawn EPERM no ambiente do Codex; os testes não homologam aparência
ou som. Esta entrega não é V5 FINAL CONGELADA.

O pacote contém todos os 309 arquivos versionados do commit, sem .git, caches ou
credenciais de autenticação. Este guia e MANIFESTO-PACOTE.json são os únicos
acréscimos de embalagem; o código do jogo não foi alterado.
