module.exports=({Layout:L,obj:o,code,make,tutorial})=>{
 const all=[];let l,a;
 l=new L(15,11).room('entrada','Vestíbulo',6,1,3,3,'lit',{initiallyVisible:true}).room('camara','Câmara da luz',2,5,3,3,'dark').room('nexo','Passagem central',6,5,3,3).room('final','Câmara do cristal',6,10,3,4,'dark').path([7,2],[7,12]).path([7,6],[3,6]).start(7,2).exit(7,12);
 l.light('luz',2,6,['camara','final']);l.gate('selo',7,9,['light_final']);
 a=make(1,l,{descricao:'Explore a câmara lateral e acenda a luz que revela a saída. Guarde distâncias em variáveis.',design:'Uma câmara lateral de luz abre o selo da saída; voltar ao corredor é obrigatório.',guide:['Cada casa é um passo. Guto começa olhando para Leste.','O símbolo de lâmpada marca um interruptor. Aproxime-se e use ativar_interruptor().'],objectives:[o.variable(),o.light('final','Acenda o interruptor da câmara lateral'),o.exit()],officialSolution:code(`passos = 4
andar_frente(passos)
virar_esquerda()
andar_frente(passos)
ativar_interruptor()
virar_direita()
virar_direita()
andar_frente(passos)
virar_esquerda()
final = passos + 2
andar_frente(final)`)});
 tutorial(a,['passos = 4\nandar_frente(passos)','passos = 4\nandar_frente(passos)\nvirar_esquerda()\nandar_frente(passos)\nativar_interruptor()',a.officialSolution.split('\n').slice(0,8).join('\n'),a.officialSolution],[{usedCommand:'andar_frente'},{flag:'light_final'},{usedCommand:'virar_direita'},null],['Veja Guto caminhar até a bifurcação.','A luz na câmara lateral revela a saída e abre seu selo.','Volte ao corredor; executar novamente preserva a descoberta.','Complete o percurso. A variável pode guardar a distância final.']);all.push(a);
 l=new L(18,15).room('entrada','Vestíbulo',6,1,3,3,'lit',{initiallyVisible:true}).room('hub','Salão de retorno',6,5,3,3).room('alavanca','Ala da alavanca',2,4,3,4,'dark').room('tesouro','Nicho do viajante',11,5,3,3).room('final','Porta do retorno',6,12,3,4,'dark').path([7,2],[7,14]).path([7,6],[3,6]).path([7,6],[12,6]).start(7,2).exit(7,14);
 l.light('luz',4,6,['alavanca','final']);l.entity('lever','lever',2,6,{flag:'leverDone'});l.entity('moeda','coin',12,6);l.gate('porta',7,10,['leverDone']);
 all.push(make(2,l,{descricao:'Uma alavanca distante mantém a passagem final fechada. Encontre-a e reutilize a mesma variável em distâncias diferentes.',design:'Ala norte obrigatória, retorno ao salão e nicho sul opcional com moeda.',allowedCommands:['ativar_alavanca'],guide:['A alavanca conserva seu estado durante a tentativa.','Reatribuição: o mesmo nome pode receber outra distância.'],objectives:[o.variable(),o.reassign(),o.flag('leverDone','Ative a alavanca na ala remota'),o.exit()],codigoInicial:'passos = 4\n# encontre a alavanca',officialSolution:code(`passos = 4
andar_frente(passos)
virar_esquerda()
andar_frente(passos)
ativar_interruptor()
ativar_alavanca()
virar_direita()
virar_direita()
andar_frente(passos)
virar_esquerda()
passos = 8
andar_frente(passos)`)}));
 l=new L(22,16).room('entrada','Pórtico',6,1,3,3,'lit',{initiallyVisible:true}).room('arquivo_a','Arquivo do mestre',2,3,3,3,'dark').room('central','Galeria das grades',6,6,3,5).room('arquivo_b','Arquivo do aprendiz',11,11,3,3,'dark').room('final','Saída selada',6,17,3,4,'dark').path([7,2],[7,19]).path([7,4],[3,4]).path([7,12],[11,12]).start(7,2).exit(7,19);
 l.light('luz_a',4,4,['arquivo_a']);l.clue('base','Caderno do mestre',2,4,'A unidade do mestre é 2. Duas unidades medem a escada do arquivo.');l.light('luz_b',10,12,['arquivo_b','final']);l.clue('fator','Caderno do aprendiz',12,12,'Três unidades medem a galeria além da última grade. Some uma casa para alcançar o cristal.');l.gate('grade',7,15,['read_base','read_fator']);
 all.push(make(3,l,{descricao:'Investigue os dois arquivos. Use os registros para calcular as distâncias e abrir as grades.',design:'Arquivos em lados opostos do corredor; ambas as leituras destravam a grade central.',guide:['examinar() lê o objeto no tile de Guto ou à frente.','O Diário registra somente os textos encontrados.'],objectives:[o.clue('base','Leia o caderno do mestre'),o.clue('fator','Leia o caderno do aprendiz'),o.concept('arithmetic','Calcule uma distância com operações'),o.variable(),o.exit()],codigoInicial:'# alcance os arquivos e examine os cadernos',officialSolution:code(`andar_frente(2)
virar_esquerda()
andar_frente(3)
ativar_interruptor()
andar_frente()
examinar()
base = 2
volta = base * 2
virar_direita()
virar_direita()
andar_frente(volta)
virar_esquerda()
andar_frente(volta * 2)
virar_direita()
andar_frente(3)
ativar_interruptor()
andar_frente()
examinar()
virar_direita()
virar_direita()
andar_frente(volta)
virar_direita()
final = base * 3 + 1
andar_frente(final)`)}));
 l=new L(22,16).room('entrada','Entrada das forjas',6,1,3,3,'lit',{initiallyVisible:true}).room('luz','Sala da lâmpada',2,5,3,3).room('mecanismo','Oficina de segurança',11,5,3,3).room('traps','Piso suspeito',6,8,3,6,'dark').room('detour','Passarela de inspeção',10,10,1,5).room('final','Saída da forja',6,17,3,4,'dark').path([7,2],[7,19]).path([7,6],[3,6]).path([7,6],[12,6]).path([7,8],[10,8],[10,14],[7,14]).start(7,2).exit(7,19);
 l.light('luz',2,6,['traps','final']);l.entity('espinhos','hazard',7,10,{mode:'trigger',initialState:'retracted'});l.entity('seguranca','lever',12,6,{flag:'trapDisabled',connections:[{targetId:'espinhos',activeState:'inactive',inactiveState:'retracted'}]});l.gate('selo',7,15,['light_traps'],{requiresAny:['trapDisabled','visit_detour']});for(let c=9;c<15;c++)l.map[12][c]=4;
 all.push(make(4,l,{nome:'O Corredor da Forja',descricao:'Ilumine o piso suspeito. Use a oficina para recolher os espinhos ou percorra a passarela de inspeção. A lava fica no fosso.',design:'Câmara de luz ao norte e oficina ao sul; travessia curta com espinhos ou retorno pela passarela mais longa.',allowedCommands:['ativar_alavanca'],instructionBudget:28,guide:['Furos no chão sinalizam espinhos que disparam ao pisar.','A oficina controla os espinhos; a passarela evita o mecanismo.','Lava no fosso não é piso caminhável.'],objectives:[o.light('traps','Ilumine a galeria dos espinhos'),o.concept('arithmetic','Use operações para planejar o caminho'),o.variable(),o.budget(),o.exit()],codigoInicial:'base = 2\n# planeje luz, segurança e travessia',officialSolution:code(`base = 2
subida = base * 2
andar_frente(subida)
virar_esquerda()
andar_frente(subida)
ativar_interruptor()
virar_direita()
virar_direita()
descida = subida + 5
andar_frente(descida)
ativar_alavanca()
virar_direita()
virar_direita()
andar_frente(descida - subida)
virar_direita()
andar_frente(subida * 3 + 1)`)}));
 l=new L(23,20).room('entrada','Pórtico do labirinto',8,1,3,3,'lit',{initiallyVisible:true}).room('hub','Salão dos três selos',7,7,5,5).room('luz','Ala da orientação',2,8,3,3).room('calculo','Ala do cálculo',14,3,3,3,'dark').room('alavanca','Ala da mudança',14,8,3,3).room('reliquia','Nicho de memória',3,14,3,3).room('final','Cristal da unidade',8,18,3,4,'dark').path([9,2],[9,20]).path([9,9],[3,9]).path([9,9],[15,9]).path([9,5],[15,5]).path([9,15],[4,15]).start(9,2).exit(9,20);
 l.light('luz',2,9,['calculo','final']);l.entity('mudanca','lever',15,9,{flag:'seal_change'});l.clue('sigilo','Selo do cálculo',15,4,'A porta reconhece quem liga a luz, muda a alavanca e lê este selo. Do corredor central ao cristal, conte três grupos de cinco casas.');l.entity('moeda','coin',4,15);l.gate('porta_final',9,16,['light_final','seal_change','read_sigilo']);
 all.push(make(5,l,{descricao:'Conquiste os três selos nas alas da orientação, mudança e cálculo. Volte ao salão e libere o cristal.',design:'Hub com três alas obrigatórias e nicho opcional; luz, alavanca e inscrição compõem o selo final.',allowedCommands:['ativar_alavanca'],instructionBudget:38,guide:['Cada ala tem uma função: revelar, mudar e investigar.','Use atribuição, reatribuição e operações para expressar o percurso.'],objectives:[o.light('final','Conquiste o selo de luz'),o.flag('seal_change','Conquiste o selo da mudança'),o.clue('sigilo','Conquiste o selo do cálculo'),o.variable(),o.reassign(),o.concept('arithmetic','Combine operações na navegação'),o.budget(),o.exit()],codigoInicial:'base = 3\n# resolva as três alas',officialSolution:code(`base = 3
passos = base * 2 + 1
andar_frente(passos)
virar_esquerda()
passos = base * 2
andar_frente(passos)
ativar_interruptor()
virar_direita()
virar_direita()
andar_frente(passos * 2)
ativar_alavanca()
virar_direita()
virar_direita()
andar_frente(passos)
virar_esquerda()
andar_frente(passos - 2)
virar_esquerda()
andar_frente(passos)
virar_direita()
examinar()
virar_direita()
andar_frente(passos)
virar_direita()
andar_frente(base * 5)`)}));
 return all;
};
