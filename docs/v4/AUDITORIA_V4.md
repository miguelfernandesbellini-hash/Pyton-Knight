# Auditoria de preservação, exploração e respostas — V4

17/09/2026. Resultado automatizado: **20 mapas, 29 cenários e 69 verificações isoladas aprovados**. O trabalho mantém o redesign V3 e acrescenta moedas, decoração e regras de conclusão; não refaz a arquitetura das fases.

## Rotas e requisitos

- Cristal inicialmente inacessível por rota direta em cada uma das 20 atividades.
- Portas, grades e guardiões, quando fechados isoladamente, não podem ser contornados até o cristal.
- Omitir cada inscrição obrigatória impede concluir; remover chave, flags, entradas, pistas ou contadores exigidos impede abrir o mecanismo correspondente.
- Soluções oficiais passam em todos os cenários. Mantida a validação dos três portões da A15 e das posições de chave da A19/A20.
- Moedas e decoração não alteram tiles, corredores, regiões, portas ou conexões. Não foi adicionado bloqueio ao caminho oficial.
- Nenhuma moeda exige ativação de portal incorreto. Destinos convergentes da A15 podem ser explorados depois de uma travessia legítima.

O significado das regiões e das alternativas permitidas permanece documentado na [auditoria V3](../v3/AUDITORIA_ANTI_ATALHO.md). Baús posteriores à chave, galeria alternativa da A12, módulos inativos da A18 e recompensas opcionais não se tornaram requisitos artificiais.

## Moedas

Cinco moedas por fase, 100 IDs únicos. Cada cenário foi verificado com acesso real de movimento, sem dano, a todas as cinco: **145 verificações nos 29 cenários**. Pelo menos duas moedas por cenário ficam fora do programa oficial. Os caminhos são registrados em [auditoria-moedas.json](evidencias/auditoria-moedas.json).

As fases com portais de ida não precisam permitir retorno a todas as moedas depois do teleporte. As moedas anteriores são acessíveis antes da travessia, permanecem coletadas após EXECUTAR e podem ser procuradas em outra tentativa. Essa exploração é opcional e não altera conclusão ou solução pedagógica.

## Input e investigação

Os prompts, descrições, objetivos, textos iniciais do guia, editor e tutoriais não receberam respostas secretas. Campos de input continuam vazios; a ajuda remete às pistas realmente descobertas. A UI não lê livros automaticamente por proximidade, iluminação ou exibição de `!`.

Estantes investigáveis reutilizam inscrições da Unidade 2: mesmos textos, IDs, coordenadas e exigências de `examinar()`. O marcador informa disponibilidade de investigação, sem revelar conteúdo. O Diário só recebe a descoberta após interação contextual. Estantes decorativas ficam fora do catálogo de entidades interativas.

## Iluminação, medo e estados

Descobertas e luz continuam entre execuções da mesma cena; tentativa restaura posição e mecanismos temporários. REINICIAR e TENTAR NOVAMENTE limpam descoberta, preservando a coleção persistente. Espinhos, medo, portas, pontes, placas, alavancas, runas, baús e portais mantêm as transições e guardas V3.

Os novos totens selecionam os quadros OFF/ON a partir do mesmo estado lógico que controla as pontes. Moeda salva já nasce oculta no reset. O indicador `!` desaparece na mesma atualização em que a inscrição é registrada. Decoração não emite luz de gameplay nem substitui interruptores.

## Limite da auditoria

Busca geométrica, mutações de requisitos e execuções reais não constituem prova formal sobre todo programa possível. A auditoria visual interativa permanece pendente pelo bloqueio do navegador. As plantas revisadas são evidência estática de composição e distribuição, não de fluidez ou câmera.
