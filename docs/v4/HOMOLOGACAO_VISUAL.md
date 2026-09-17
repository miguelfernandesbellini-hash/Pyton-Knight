# Homologação visual — V4

**PENDENTE — PK-024.** Em 17/09/2026, o navegador Chrome remoto recusou abrir `http://127.0.0.1:8000/` com:

```text
Browser Use cannot open http://127.0.0.1:8000 in tab 1.
Browser reported: net::ERR_BLOCKED_BY_CLIENT
```

Não foi contornado o bloqueio e não foi obtida uma partida em navegador real. Essa evidência não indica defeito no jogo nem confirma seu layout no navegador. Os testes restantes foram executados normalmente.

## Validado nesta rodada

| Item | Evidência e alcance |
|---|---|
| Totens novos | Fonte gerada inspecionada; mesma silhueta OFF/ON; PNGs RGBA 64×64, escala/âncora compartilhadas; seleção do quadro ligada ao estado lógico |
| Decoração e moedas | Quatro pranchas das unidades inspecionadas; 20 plantas geradas; distribuição moderada; paredes preservadas |
| Estantes e ! | Testes de proximidade, visibilidade, leitura, afastamento e Diário no adaptador de cena |
| Moedas ocultas | Sprite invisível desde o carregamento/reset quando o ID já foi salvo |
| Modal | DOM próprio, títulos, objetivos/regras locais, estatísticas, retry, próximo e A20 testados logicamente |
| Orçamento | Indicador semântico, destaque de excesso, execução permitida e feedback de otimização testados |
| Sistemas V3 | 221 testes anteriores preservados, incluindo estados, iluminação e animações por callback |

As imagens em `evidencias/visual` usam os assets e as funções de aparência do jogo, com regiões reveladas para inspeção. **Não são capturas de uma partida real.** O adaptador DOM não renderiza CSS; portanto, não certifica o layout do modal.

## Pendente para homologação em ambiente acessível

1. Servir a pasta e conferir carregamento de todos os assets no Phaser.
2. Abrir A6–A10: aproximar/afastar de livros e estantes; observar `!` com neblina, zoom e câmera; ler e conferir retirada imediata do indicador.
3. Conferir estantes decorativas: sem `!`, sem interação e sem novo bloqueio no piso.
4. A16/A20: observar ativação dos novos totens e materialização dos segmentos de ponte; conferir contraste e legibilidade em escala de partida.
5. Executar código acima do limite; observar exploração, moedas e pistas funcionando, objetivo final sem modal e mensagem de otimização. Otimizar e confirmar o modal.
6. Conferir modal com poucos objetivos (A1) e muitos objetivos (A20), em 1366×768, 1920×1080 e largura reduzida. Validar rolagem, botões, foco, teclado e ausência de sobreposição.
7. Conferir estatísticas de baús nas três posições da chave em A19/A20 e tentativas após parsing inválido, colisão, morte e sucesso.
8. Coletar moeda, executar, reiniciar, morrer, trocar de fase, voltar, fechar e reabrir o mesmo endereço/perfil; conferir ausência de reaparecimento e crédito repetido.
9. TENTAR NOVAMENTE: mesma fase, código preservado, três vidas, zero tentativas, recompensas já salvas. PRÓXIMA: próxima fase desbloqueada. A20: CONCLUIR JORNADA e menu final.
10. Revalidar o roteiro V3 de luz, medo, espinhos, portas, baús, portais, câmera e Guto. Registrar navegador, dimensões, capturas reais e defeitos reproduzíveis antes de encerrar PK-024.

Sem nova lacuna de arte externa obrigatória identificada nesta revisão estática. Fluidez, composição no viewport real e playtest com alunos continuam pendentes; não foram substituídos por testes automatizados.
