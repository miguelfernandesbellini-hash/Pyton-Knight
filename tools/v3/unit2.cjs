module.exports=({Layout:L,obj:o,code,make,tutorial})=>{
 const all=[];let l,a;
 const dataObjectives=[o.concept('input','Receba os dados descobertos com input()'),o.concept('int','Converta as entradas numéricas'),o.concept('arithmetic','Processe os valores no programa')];
 l=new L(20,12).room('entrada','Vestíbulo da palavra',6,1,3,3,'lit',{initiallyVisible:true}).room('arquivo','Arquivo antigo',2,5,3,3,'dark').room('runa','Galeria da voz',6,8,3,4).room('final','Câmara iluminada',6,15,3,4,'dark').path([7,2],[7,17]).path([7,6],[3,6]).start(7,2).exit(7,17);
 l.light('luz',4,6,['arquivo','final']);l.clue('juramento','Livro do amanhecer',2,6,'Quando a noite caiu sobre o reino, os cavaleiros esperaram a AURORA. Esta é a palavra que a runa conserva.');l.entity('runa','output_rune',7,10);l.gate('grade',7,13,['read_juramento','wordPrinted']);
 a=make(6,l,{descricao:'Visite o arquivo, leia a inscrição e dê voz à palavra encontrada junto à runa.',design:'Arquivo fora da rota principal; print produz luz e abre a grade somente após a leitura.',requirePrintContext:true,outputRules:[{expected:'AURORA',contextId:'runa',requires:['read_juramento'],flags:['wordPrinted'],states:[{entityId:'runa',state:'correct'}]}],guide:['print() faz o programa produzir uma saída.','Use examinar() diante do livro. Depois consulte o Diário e imprima a palavra junto à runa.'],objectives:[o.clue('juramento','Leia a inscrição do arquivo'),o.concept('print','Produza uma saída com print()'),o.flag('wordPrinted','Energize a runa com a palavra encontrada'),o.exit()],officialSolution:code(`andar_frente(4)
virar_esquerda()
andar_frente(3)
ativar_interruptor()
andar_frente()
examinar()
virar_direita()
virar_direita()
andar_frente(4)
virar_esquerda()
andar_frente(4)
palavra = "AURORA"
print(palavra)
andar_frente(7)`)});
 const discover=a.officialSolution.split('\n').slice(0,6).join('\n');
 tutorial(a,['andar_frente(4)',discover,discover+'\nvirar_direita()\nvirar_direita()\nandar_frente(4)\nvirar_esquerda()\nandar_frente(4)',a.officialSolution.replace('"AURORA"','"complete com a palavra do Diário"')],[{usedCommand:'andar_frente'},{flag:'read_juramento'},{minimumPosition:{linha:7,coluna:10}},null],['Observe a bifurcação para o arquivo.','Execute a visita e leia o texto que Guto encontrou.','Retorne à runa de saída.','Complete o texto de palavra com sua descoberta e observe a consequência de print().']);all.push(a);
 l=new L(22,14).room('entrada','Pórtico do guardião',8,1,3,3,'lit',{initiallyVisible:true}).room('biblioteca','Biblioteca do juramento',2,3,3,5,'dark').room('sombra','Corredor sem luz',5,4,3,1,'dark').room('pedestal','Salão de resposta',8,7,3,4).room('guardiao','Pórtico protegido',8,12,3,2).room('final','Porta do juramento',8,17,3,4,'dark').path([9,2],[9,19]).path([9,4],[3,4]).start(9,2).exit(9,19);
 l.light('luz',7,4,['sombra','biblioteca','final']);l.clue('memoria','Memória do cavaleiro',3,4,'Não foi a força que sustentou os cavaleiros, mas a CORAGEM. O guardião espera ouvir a virtude preservada nesta memória.');l.entity('pedestal','pedestal',9,8,{requiresClues:['memoria']});l.entity('runa','output_rune',9,9);l.entity('guardian','guardian',9,12,{requires:['answerEchoed'],requiresClues:['memoria']});l.entity('door','door',9,15,{requires:['answerEchoed'],requiresClues:['memoria']});
 all.push(make(7,l,{descricao:'Descubra a virtude do antigo juramento na biblioteca e apresente sua resposta ao Guardião.',design:'Corredor escuro leva à biblioteca remota; o pedestal recebe a descoberta e a runa a ecoa para os bloqueios.',allowedCommands:['abrir_porta'],requireInputContext:true,requirePrintContext:true,outputRules:[{expected:'CORAGEM',minInputSources:1,contextId:'runa',requires:['read_memoria'],flags:['answerEchoed'],states:[{entityId:'runa',state:'correct'}]}],guide:['O pedestal aceita input() depois que a biblioteca foi investigada.','Reutilize a variável recebida em print() junto à runa.'],objectives:[o.clue('memoria','Investigue a memória na biblioteca'),o.concept('input','Receba a palavra no pedestal'),o.concept('print','Ecoe a resposta com print()'),o.state('guardian','defeated','Libere o Guardião'),o.state('door','open','Abra a porta do juramento'),o.exit()],codigoInicial:'# visite a biblioteca antes do pedestal',testInputs:['CORAGEM'],officialSolution:code(`andar_frente(2)
virar_esquerda()
andar_frente(2)
ativar_interruptor()
andar_frente(3)
examinar()
virar_direita()
virar_direita()
andar_frente(5)
virar_esquerda()
andar_frente(4)
resposta = input("Virtude do juramento: ")
print(resposta)
andar_frente(3)
abrir_porta("guardian")
andar_frente(3)
abrir_porta("door")
andar_frente(5)`)}));
 l=new L(25,17).room('entrada','Margem oeste',7,1,3,3,'lit',{initiallyVisible:true}).room('oficina_a','Oficina dos grupos',2,4,3,3,'dark').room('hub','Pátio dos construtores',7,6,3,6).room('oficina_b','Oficina dos segmentos',12,10,3,4,'dark').room('travessia','Ponte retrátil',8,15,1,3,'dark').room('final','Margem leste',7,19,3,5,'dark').path([8,2],[8,22]).path([8,5],[3,5]).path([8,11],[13,11]).start(8,2).exit(8,22);
 l.light('luz_a',4,5,['oficina_a']);l.clue('grupos','Registro de equipes',2,5,'Duas equipes trabalharam nesta margem. Cada equipe fabrica a mesma quantidade de segmentos registrada na outra oficina.');l.entity('pedestal_a','pedestal',3,5,{requiresClues:['grupos']});l.light('luz_b',12,11,['oficina_b','travessia','final']);l.clue('segmentos','Registro de fabricação',14,11,'Cada equipe fabrica três segmentos. Multiplique equipes por segmentos para produzir o material da ponte.');l.entity('pedestal_b','pedestal',13,11,{requiresClues:['segmentos']});l.entity('lever','lever',13,12,{flag:'leverDone'});l.entity('runa','output_rune',13,10);for(let c=15;c<=17;c++)l.entity(`bridge${c-14}`,'bridge',8,c,{mode:'whole'});
 all.push(make(8,l,{descricao:'Investigue as duas oficinas, leia suas quantidades e calcule o material que constrói a travessia.',design:'Dados em margens laterais distintas; produto, alavanca e leituras constroem a ponte retrátil.',allowedCommands:['ativar_alavanca'],requireInputContext:true,requirePrintContext:true,outputRules:[{expected:'6',minInputSources:2,contextId:'runa',requires:['read_grupos','read_segmentos','leverDone'],flags:['bridgeReady'],states:[{entityId:'runa',state:'correct'},...[1,2,3].map(i=>({entityId:`bridge${i}`,state:'active'}))]}],guide:['Leia um registro em cada oficina.','O produto representa material; a alavanca prepara a construção.'],objectives:[o.clue('grupos','Investigue a oficina dos grupos'),o.clue('segmentos','Investigue a oficina dos segmentos'),...dataObjectives,o.flag('bridgeReady','Materialize a ponte'),o.exit()],codigoInicial:'# investigue as duas oficinas',testInputs:['2','3'],officialSolution:code(`andar_frente(3)
virar_esquerda()
andar_frente(4)
ativar_interruptor()
andar_frente()
examinar()
grupos = int(input("Equipes: "))
virar_direita()
virar_direita()
andar_frente(5)
virar_esquerda()
andar_frente(6)
virar_direita()
andar_frente(4)
ativar_interruptor()
andar_frente()
examinar()
segmentos = int(input("Segmentos por equipe: "))
ativar_alavanca()
total = grupos * segmentos
print(total)
virar_direita()
virar_direita()
andar_frente(5)
virar_direita()
andar_frente(11)`)}));
 l=new L(29,17).room('entrada','Salão oeste',7,1,3,3,'lit',{initiallyVisible:true}).room('runa_a','Arquivo da primeira runa',2,4,3,3,'dark').room('runa_b','Arquivo da segunda runa',12,8,3,3,'dark').room('calculo','Mesa dos espelhos',7,9,3,3).room('espelhos','Galeria dos destinos',7,14,3,3).room('falso_a','Espelho da névoa',3,14,3,3).room('falso_b','Espelho do eco',11,14,3,3).room('final','Cofre além do espelho',2,21,3,6,'dark').path([8,2],[8,15]).path([8,5],[3,5]).path([8,9],[13,9]).path([4,15],[12,15]).start(8,2).exit(3,25);
 l.light('luz_a',4,5,['runa_a']);l.clue('primeira','Fragmento do sol',2,5,'O primeiro fragmento guarda o menor número primo.');l.light('luz_b',12,9,['runa_b','final']);l.clue('segunda','Fragmento da lua',14,9,'O segundo fragmento guarda o número de lados de um triângulo. Some os fragmentos para escolher o espelho.');l.entity('pedestal','pedestal',8,10,{requiresClues:['primeira','segunda']});l.entity('runa','output_rune',8,11);l.entity('mirror5','mirror',8,15,{value:5,requires:['mirrorReady'],requiresClues:['primeira','segunda'],flag:'correctMirror',target:{row:3,column:21,facing:'LESTE'}});l.entity('mirror3','mirror',4,15,{value:3,correct:false,label:'Eco sem destino'});l.entity('mirror7','mirror',12,15,{value:7,correct:false,label:'Névoa sem destino'});l.entity('cofre','gate',3,23,{requires:['correctMirror']});
 // O cofre ocupa a única passagem entre as duas metades da sala.
 l.map[2][23]=0;l.map[4][23]=0;
 all.push(make(9,l,{descricao:'Encontre os fragmentos em duas alas, interprete seus valores e calcule qual espelho leva ao cofre.',design:'Duas pistas interpretativas e um pedestal central; destino correto isolado do salão, falsos espelhos não concedem recompensa.',allowedCommands:['entrar_espelho','abrir_porta'],instructionBudget:38,requireInputContext:true,requirePrintContext:true,outputRules:[{expected:'5',minInputSources:2,contextId:'runa',requires:['read_primeira','read_segunda'],flags:['mirrorReady'],states:[{entityId:'runa',state:'correct'}]}],guide:['O Diário registra os fragmentos como foram encontrados.','Some os valores; os números nos espelhos identificam destinos, não respostas de input.'],objectives:[o.clue('primeira','Leia o primeiro fragmento'),o.clue('segunda','Leia o segundo fragmento'),...dataObjectives,o.flag('correctMirror','Atravesse o espelho correspondente ao cálculo'),o.state('cofre','open','Abra o cofre no destino'),o.budget(),o.exit()],codigoInicial:'# encontre e interprete os fragmentos',testInputs:['2','3'],officialSolution:code(`andar_frente(3)
virar_esquerda()
andar_frente(4)
ativar_interruptor()
andar_frente()
examinar()
virar_direita()
virar_direita()
andar_frente(5)
virar_esquerda()
andar_frente(4)
virar_direita()
andar_frente(4)
ativar_interruptor()
andar_frente()
examinar()
virar_direita()
virar_direita()
andar_frente(5)
virar_direita()
andar_frente()
a = int(input("Primeiro fragmento: "))
b = int(input("Segundo fragmento: "))
portal = a + b
print(portal)
andar_frente(portal)
entrar_espelho(portal)
andar_frente()
abrir_porta("cofre")
andar_frente(3)`)}));
 l=new L(26,21).room('entrada','Pórtico das três runas',9,1,3,3,'lit',{initiallyVisible:true}).room('halo_a','Selo da aurora',8,8,2,5,'dark').room('hub','Salão do cofre',10,8,1,5).room('halo_b','Selo da forja',11,8,2,2,'dark').room('halo_c','Selo da memória',11,10,2,3,'dark').room('ala_a','Arquivo da aurora',2,9,3,3,'dark').room('ala_b','Oficina da forja',16,4,3,4,'dark').room('ala_c','Arquivo da memória',16,14,3,4,'dark').room('final','Tesouro das três runas',9,17,3,7,'dark').path([10,2],[10,22]).path([10,10],[3,10]).path([10,5],[17,5]).path([11,11],[13,11],[13,15],[17,15],[17,17]).start(10,2).exit(10,22);
 l.light('luz_a',3,11,['ala_a','halo_a']);l.clue('a','Fragmento da aurora',2,10,'A marca A representa a unidade: 1. Guarde-a para a forja.');l.entity('pedestal_a','pedestal',3,10,{requiresClues:['a']});l.light('luz_b',17,4,['ala_b','halo_b']);l.clue('b','Fragmento da forja',18,5,'A marca B representa um par: 2. O produto A × B constrói a ponte do arquivo restante.');l.entity('pedestal_b','pedestal',17,5,{requiresClues:['b']});l.entity('lever','lever',16,5,{flag:'leverDone'});l.entity('rune_b','output_rune',17,6);for(let r=14;r<17;r++)l.entity(`bridge${r-13}`,'bridge',r,15);l.light('luz_c',17,14,['ala_c','halo_c','final']);l.clue('c','Fragmento da memória',18,15,'A marca C representa três vigias. Ao produto da forja, some os vigias para despertar o espelho do cofre.');l.entity('pedestal_c','pedestal',17,15,{requiresClues:['c']});l.entity('rune_c','output_rune',17,16);l.entity('mirror5','mirror',17,17,{value:5,requires:['runesPrinted'],flag:'mirrorDone',target:{row:10,column:12,facing:'LESTE'}});l.entity('cofre','gate',10,13,{requires:['leverDone','bridgeReady','runesPrinted','mirrorDone','light_halo_a','light_halo_b','light_halo_c'],requiresClues:['a','b','c']});
 all.push(make(10,l,{descricao:'Investigue as três alas, construa a travessia e processe os fragmentos para abrir o cofre central.',design:'Hub e três alas: produto de A e B monta a ponte; C completa o código; espelho retorna ao cofre e cada ala ilumina um selo do salão.',allowedCommands:['ativar_alavanca','entrar_espelho','abrir_porta'],instructionBudget:56,requireInputContext:true,requirePrintContext:true,outputRules:[{expected:'2',minInputSources:2,contextId:'rune_b',requires:['read_a','read_b','leverDone'],flags:['bridgeReady'],states:[{entityId:'rune_b',state:'correct'},...[1,2,3].map(i=>({entityId:`bridge${i}`,state:'active'}))]},{expected:'5',minInputSources:3,contextId:'rune_c',requires:['bridgeReady','read_c'],flags:['runesPrinted'],states:[{entityId:'rune_c',state:'correct'}]}],guide:['A forja usa o produto dos dois primeiros fragmentos.','O último arquivo completa o processamento e o espelho retorna ao cofre.','Cada ala acende uma parte do salão.'],objectives:[o.clue('a','Descubra o fragmento da aurora'),o.clue('b','Descubra o fragmento da forja'),o.clue('c','Descubra o fragmento da memória'),...dataObjectives,o.flag('bridgeReady','Construa a ponte da memória'),o.flag('mirrorDone','Use o espelho de retorno'),o.state('cofre','open','Abra o cofre central'),o.budget(),o.exit()],codigoInicial:'# três alas guardam partes do processamento',testInputs:['1','2','3'],officialSolution:code(`andar_frente(8)
virar_esquerda()
andar_frente(7)
ativar_interruptor()
examinar()
a = int(input("Marca da aurora: "))
virar_direita()
virar_direita()
andar_frente(7)
virar_direita()
andar_frente(5)
virar_esquerda()
andar_frente(7)
ativar_interruptor()
examinar()
b = int(input("Marca da forja: "))
ativar_alavanca()
parcial = a * b
print(parcial)
virar_direita()
virar_direita()
andar_frente(7)
virar_direita()
andar_frente(6)
virar_direita()
andar_frente(3)
virar_esquerda()
andar_frente(4)
virar_direita()
andar_frente(4)
ativar_interruptor()
examinar()
c = int(input("Marca da memória: "))
codigo = parcial + c
print(codigo)
virar_esquerda()
andar_frente(2)
entrar_espelho(codigo)
abrir_porta("cofre")
andar_frente(10)`)}));
 return all;
};
