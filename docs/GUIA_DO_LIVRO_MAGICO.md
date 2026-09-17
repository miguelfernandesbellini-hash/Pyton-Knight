# Guia do Livro Mágico

## Organização

O painel possui cabeçalho, missão/objetivos/inscrições, recursos, editor, entrada sob demanda, console/feedback e rodapé. Missão e recursos têm rolagem própria; o editor e as saídas também. O rodapé contém EXECUTAR, RESTAURAR, ANTERIOR e PRÓXIMA. Um botão pode estar desabilitado por execução ou bloqueio da fase, mas não é removido.

O dimensionamento foi implementado com limites CSS; a ausência de sobreposição em resoluções reais ainda precisa da homologação descrita no relatório de testes. No celular o mapa fica acima do Livro; a prioridade de homologação é desktop/notebook.

## Escrever código

O editor usa texto nativo, seleção normal e números de linha. Tab insere quatro espaços; sobre uma seleção, indenta as linhas selecionadas. Shift+Tab remove até quatro espaços das linhas. Enter mantém o nível atual e acrescenta quatro espaços depois de `:` (inclusive antes de comentário).

```python
if tem_chave():
    abrir_porta("door")
else:
    print("Ainda falta a chave")
```

Exemplo ilustrativo: consulte os recursos da atividade antes de usar `print()` ou qualquer comando. As listas são específicas de cada fase; não foi ampliada arbitrariamente a whitelist.

Ao digitar `:` em `else`/`elif`, o editor tenta alinhar com o `if` anterior compatível. Em estruturas aninhadas ambíguas, use Shift+Tab para escolher explicitamente o nível. Não é uma IDE completa nem um formatador de todo o programa.

O padrão editorial é quatro espaços. O interpretador aceita outros níveis consistentes de espaços, como Python, mas rejeita indentação inesperada fora de bloco e dedent sem nível correspondente. Tab literal colado não é aceito pelo subconjunto: substitua por espaços. Linhas vazias e comentários não mudam a estrutura dos blocos. Corpos com apenas comentários continuam sem instrução executável.

## Recursos e dados

“Recursos Python” diferencia sintaxe da linguagem de comandos próprios como `andar_frente()`, `virar_direita()` e `abrir_porta(...)`. Sensores aparecem separados. A lista de objetos publica seus identificadores. Não existem comandos novos `guto.mover_direita()` nesta versão: use os nomes reais exibidos.

Inscrições publicam AURORA, CORAGEM, números das runas, grupos/segmentos e faixas necessárias. O aluno ainda precisa formular operações/condições e percorrer o mapa; não recebe o programa completo nessa área. O guia não lê `testInputs` nem `officialSolution` para montar a interface.

## input e print

Quando o programa alcança `input()`, aparece um formulário destacado com a pergunta, campo e ENVIAR. O foco vai ao campo. Pressione Enter ou ENVIAR. A entrada é uma string; use `int(input(...))` quando a atividade pede inteiro. Campo vazio não se converte automaticamente em zero. Fora desse momento, o formulário permanece oculto.

Comparações de strings mantêm maiúsculas, minúsculas e espaços. Somente os mecanismos de AURORA (atividade 6) e CORAGEM (7) desconsideram espaços externos na saída reconhecida. O texto de input, a variável e o console não são modificados; palavras em minúsculas continuam diferentes. Esta exceção mecânica não flexibiliza comparações Python.

`print()` escreve no console; runas podem exigir posição e condições físicas. Escrever a palavra correta de longe não elimina a necessidade de alcançar o mecanismo.

## Execução e recuperação

EXECUTAR reinicia o mundo da tentativa, valida e executa o texto. Durante a execução, o editor fica somente leitura. Erros mostram a linha quando disponível e destacam essa linha. O feedback é curto, com detalhes dos objetivos em área separada; textos longos têm scroll interno.

RESTAURAR cancela uma entrada/execução pendente e volta ao código/tutorial inicial, preservando as vidas. ANTERIOR e PRÓXIMA respeitam o desbloqueio. O rascunho e a microetapa são lembrados durante a sessão ao navegar e voltar. Recarregar a página não conserva rascunhos, apenas a progressão salva pelo sistema existente.

Perigos continuam consumindo vidas segundo as regras atuais; erros de sintaxe, input inválido, colisão em parede e código incompleto não viram dano letal. Restaurar não concede XP nem duplica moedas.
