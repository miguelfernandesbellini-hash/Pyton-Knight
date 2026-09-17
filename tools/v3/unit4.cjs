module.exports=({Layout:L,obj:o,code,make,tutorial})=>{
 const all=[];let l,a;
 l=new L(24,15).room('entrada','Margem dos ecos',9,1,3,3,'lit',{initiallyVisible:true}).room('galeria','Galeria dos totens',3,4,3,8,'dark').room('inscricao','Nicho da memória',3,12,3,2,'dark').room('ponte','Ponte dos ecos',10,12,1,5,'dark').room('final','Margem revelada',9,18,3,5,'dark').path([10,2],[10,21]).path([10,5],[4,5],[4,12]).path([4,10],[10,10]).start(10,2).exit(10,21);
 l.light('luz',7,5,['galeria','inscricao','ponte','final']);l.clue('ecos','Memória da galeria',4,12,'Cada totem responde uma vez. O eco de uma ativação materializa um segmento da travessia.');for(let i=0;i<5;i++){l.entity(`t${i+1}`,'totem',4,5+i,{symbol:String(i+1),connections:[{targetId:`bridge${i+1}`,activeState:'active'}]});l.entity(`bridge${i+1}`,'bridge_segment',10,12+i,{mode:'segmented'});}
 a=make(16,l,{descricao:'Visite a galeria e transforme o padrão dos totens em uma repetição. Cada ativação constrói uma parte da ponte.',design:'Desvio à galeria de cinco totens, retorno por uma escada e travessia de cinco segmentos físicos.',allowedCommands:['ativar_runa'],guide:['for repete um bloco para uma quantidade conhecida. range() fornece essa sequência.','Observe o segmento da ponte que responde a cada totem.'],objectives:[o.context('ativar_runa','loop','Ative os totens dentro de for'),o.concept('for','Repita o padrão com for e range()'),...[1,2,3,4,5].map(i=>o.state(`bridge${i}`,'active',`Construa o segmento ${i}`)),o.exit()],officialSolution:code(`andar_frente(3)
virar_esquerda()
andar_frente(2)
ativar_interruptor()
andar_frente(4)
for i in range(5):
    ativar_runa()
    andar_frente()
virar_direita()
andar_frente(6)
virar_esquerda()
andar_frente(11)`)});
 // The gallery is horizontal: turn east after climbing its access stair.
 a.officialSolution=a.officialSolution.replace('andar_frente(4)\nfor','andar_frente(4)\nvirar_direita()\nfor');
 const access=a.officialSolution.split('\n').slice(0,6).join('\n');
 tutorial(a,[access,access+'\nativar_runa()\nandar_frente()',access+'\nfor i in range(2):\n    ativar_runa()\n    andar_frente()',a.officialSolution],[{usedCommand:'ativar_interruptor'},{usedCommand:'ativar_runa'},{usedConcept:'for'},null],['Visite a galeria e acenda a luz.','Execute uma ativação e observe um segmento aparecer.','Veja o mesmo padrão dentro do bloco de repetição.','Aplique a repetição à galeria inteira e atravesse a ponte.']);all.push(a);
 l=new L(29,13).room('entrada','Pátio dos rubis',7,1,3,3,'lit',{initiallyVisible:true}).room('galeria','Galeria de retorno',8,4,1,21).room('final','Câmara do contador',3,23,3,4,'dark').path([8,2],[8,24]).path([8,24],[4,24]).start(8,2).exit(4,24);
 for(let i=0;i<5;i++){let c=4+i*4;l.room(`nicho${i+1}`,`Nicho ${i+1}`,3,c-1,3,3,'dark').path([8,c],[4,c]);l.entity(`r${i+1}`,'coin',4,c,{manualCollect:true});}
 l.light('luz',8,4,[...Array.from({length:5},(_,i)=>`nicho${i+1}`),'final']);l.clue('lore','Registro do lapidador',3,4,'O lapidador guardou uma gema em cada nicho. Uma contagem cresce a cada visita.');l.entity('bonus','coin',3,19);l.entity('door','door',7,24,{minRubies:5});
 all.push(make(17,l,{descricao:'Percorra os nichos repetidos, recolha os rubis e atualize um acumulador para abrir a porta da contagem.',design:'Cinco nichos com o mesmo desvio e retorno; uma porta física exige a contagem real de rubis.',allowedCommands:['coletar_rubi','abrir_porta'],guide:['Guarde a contagem antes do laço e aumente-a a cada coleta.','Rubis vermelhos são coletados com coletar_rubi(); moedas opcionais não contam como rubis.'],objectives:[o.context('coletar_rubi','loop','Colete o padrão de rubis dentro do laço'),{type:'accumulator',value:5,label:'Atualize um acumulador até a contagem necessária'},o.state('door','open','Abra a porta usando o total'),o.context('abrir_porta','condition','Use uma condição para conferir a contagem'),o.exit()],codigoInicial:'total = 0\n# encontre o padrão dos nichos',officialSolution:code(`andar_frente(2)
ativar_interruptor()
virar_esquerda()
total = 0
for i in range(5):
    andar_frente(4)
    coletar_rubi()
    total += 1
    virar_direita()
    virar_direita()
    andar_frente(4)
    virar_esquerda()
    andar_frente(4)
    virar_esquerda()
if total == 5:
    abrir_porta("door")
andar_frente(4)`)}));
 l=new L(26,24).room('entrada','Entrada dos módulos',1,1,2,2,'lit',{initiallyVisible:true}).room('final','Saída dos módulos',19,21,3,3,'dark').start(2,2).exit(20,22);
 for(let i=0;i<5;i++){
  const r=2+i*3,c=2+i*3;
  l.path([r,c],[r,c+3],[r+3,c+3]);
  l.regions.push({id:`modulo${i+1}`,label:`Módulo ${i+1}`,row:r,column:c,width:4,height:4,lightState:i<2?'dark':'deepDark',fearDamage:i>=2,warningSteps:2,fearVariants:i===3?[1,2]:i===4?[2]:[0,1,2]});
  l.light(`luz${i+1}`,r,c,[`modulo${i+1}`,'final']);l.entity(`h${i+1}`,'hazard',r,c+1,{mode:'signal'});
  l.entity(`p${i+1}`,'toggle_plate',r+3,c+3,{flag:`landing${i+1}`,revealsRooms:[`modulo${i+1}`]});
  if(i>=2)l.path([r+3,c+3],[r+3,22]);
 }
 l.path([11,22],[20,22]).exit(20,22);l.gate('gate',19,22,[],{variantMinTraps:[3,4,5]});
 all.push(make(18,l,{descricao:'O comprimento útil varia. Consulte o sensor, ilumine cada trecho e repita a neutralização até o padrão terminar.',design:'Módulos em escada com três, quatro ou cinco armadilhas ativas; saídas de retorno convergem em um selo que exige completar a sequência do cenário.',allowedCommands:['corredor_continua','desativar_armadilha'],variantStates:[[{entityId:'h4',state:'inactive'},{entityId:'h5',state:'inactive'}],[{entityId:'h5',state:'inactive'}],[]],testScenarios:[{variant:0,label:'3 módulos'},{variant:1,label:'4 módulos'},{variant:2,label:'5 módulos'}],guide:['corredor_continua() consulta o mecanismo à frente; não suponha uma quantidade fixa.','Nas salas de névoa densa, Guto avisa que está com medo. Avançar sem acender a luz após o aviso tira uma vida.','O comprimento útil muda entre cenários; use o contador apenas para expressar o retorno.'],objectives:[o.concept('while','Repita enquanto o sensor detectar continuidade'),o.context('desativar_armadilha','loop','Neutralize os espinhos dentro de while'),o.state('gate','open','Complete todos os módulos ativos do cenário'),o.exit()],codigoInicial:'etapas = 0\n# observe o sensor e ilumine antes de avançar',officialSolution:code(`etapas = 0
while corredor_continua():
    ativar_interruptor()
    desativar_armadilha()
    andar_frente(3)
    virar_direita()
    andar_frente(3)
    virar_esquerda()
    etapas += 1
andar_frente(20 - etapas * 3)
virar_direita()
andar_frente(18 - etapas * 3)`)}));
 l=new L(26,15).room('entrada','Pórtico da cripta',9,1,3,3,'lit',{initiallyVisible:true}).room('hub','Galeria da busca',6,4,1,11).room('retorno','Corredor de retorno',10,4,1,15).room('final','Porta da cripta',9,21,3,3,'dark').path([10,2],[10,22]).path([6,4],[6,14]).start(10,2).exit(10,22);
 for(let i=0;i<3;i++){const c=4+i*5;l.room(`cripta${i+1}`,`Cripta ${i+1}`,4,c-1,3,3,'dark').path([6,c],[10,c]);l.entity(`chest${i+1}`,'chest',5,c,{clue:'O registro deste baú foi examinado durante a busca.'});l.light(`luz${i+1}`,6,c,[`cripta${i+1}`,'final']);}
 l.entity('door','door',10,20,{requiresKey:true});
 all.push(make(19,l,{descricao:'A chave muda de baú. Investigue as criptas com while e interrompa a busca assim que encontrá-la.',design:'Três câmaras de busca ligadas por galeria superior e retornos próprios; a saída distante exige a chave descoberta.',allowedCommands:['tem_bau_a_frente','abrir_bau','encontrou_chave','abrir_porta'],chestKeyVariants:['chest1','chest2','chest3'],instructionBudget:30,guide:['Abra o baú à frente. Se encontrar a chave, break encerra a busca imediatamente.','As três variantes devem funcionar com o mesmo programa.','A abertura de baús não atravessa paredes e não funciona à distância.'],objectives:[o.context('abrir_bau','loop','Busque os baús dentro de while'),o.concept('break','Interrompa o laço com break'),{type:'search_stop',label:'Encerre a busca no baú da chave'},{type:'has_key',label:'Encontre a chave variável'},o.state('door','open','Abra a porta distante'),o.budget(),o.exit()],codigoInicial:'# use o sensor para percorrer as criptas',officialSolution:code(`andar_frente(2)
virar_esquerda()
andar_frente(4)
tentativa = 0
while tem_bau_a_frente():
    ativar_interruptor()
    abrir_bau()
    if encontrou_chave():
        break
    tentativa += 1
    virar_direita()
    andar_frente(5)
    virar_esquerda()
virar_direita()
virar_direita()
andar_frente(4)
virar_esquerda()
andar_frente(15 - tentativa * 5)
abrir_porta("door")
andar_frente(3)`)}));
 l=new L(32,27).room('entrada','Pórtico do santuário',13,1,3,3,'lit',{initiallyVisible:true}).room('hub','Salão dos selos',12,7,5,7,'dark').room('runas','Galeria das runas',4,5,3,8,'dark').room('ponte','Escada da ponte',8,12,3,1,'dark').room('final','Santuário do cristal',7,19,3,3,'dark').room('julgamento','Pórtico do Basilisco',12,19,3,3,'dark').path([14,2],[14,27]).path([14,6],[5,6],[5,12],[14,12]).path([14,8],[18,8]).path([18,8],[18,10],[20,10],[20,12],[22,12],[22,22]).path([18,27],[12,27],[12,24],[14,24]).path([14,20],[8,20]).start(14,2).exit(8,20);
 l.light('luz_runas',7,6,['runas','ponte']);for(let i=0;i<3;i++){l.entity(`t${i+1}`,'totem',5,6+2*i,{symbol:String(i+1),revealsRooms:['hub'],connections:[{targetId:`bridge${i+1}`,activeState:'active'}]});l.entity(`bridge${i+1}`,'bridge_segment',8+i,12,{mode:'segmented'});}
 for(let i=0;i<2;i++){const r=18+i*2,c=8+i*2;l.regions.push({id:`traps${i+1}`,label:`Ala dos espinhos ${i+1}`,row:r,column:c,height:3,width:3,lightState:'deepDark',fearDamage:true,warningSteps:2});l.light(`luz_traps${i+1}`,r,c,[`traps${i+1}`,'hub']);l.entity(`h${i+1}`,'hazard',r,c+1,{mode:'signal'});}
 for(let i=0;i<3;i++){const c=16+i*3;l.room(`cripta${i+1}`,`Cripta do selo ${i+1}`,21,c,3,2,'dark').path([22,c],[18,c],[18,27]);l.entity(`chest${i+1}`,'chest',22,c+1);l.light(`luz_busca${i+1}`,22,c,[`cripta${i+1}`,'hub']);}
 l.path([20,16],[20,22]);
 for(let i=0;i<3;i++){const r=18-i*2;l.room(`rubi${i+1}`,`Nicho do rubi ${i+1}`,r,26,1,3,'dark');l.entity(`r${i+1}`,'coin',r,27,{manualCollect:true});}
 l.exit(8,20);l.light('luz_rubis',18,27,['rubi1','rubi2','rubi3','julgamento','final']);l.clue('lei','Inscrição do santuário',13,20,'O Basilisco reconhece as três runas, a neutralização dos espinhos, a chave encontrada e os três rubis. A condição final deve refletir os selos conquistados.');l.entity('basilisk','guardian',11,20,{requiresKey:true,minRunes:3,minTraps:2,minRubies:3,requiresClues:['lei']});
 all.push(make(20,l,{descricao:'Reúna os selos das alas de runas, espinhos, busca e rubis. Volte ao santuário e formule o julgamento final.',design:'Hub liga quatro provas conhecidas: for constrói a ponte, while atravessa espinhos, while/break encontra a chave e o acumulador reúne rubis; a condição abre o Basilisco.',allowedCommands:['ativar_runa','corredor_continua','desativar_armadilha','tem_bau_a_frente','abrir_bau','encontrou_chave','coletar_rubi','rubis_coletados','tem_chave','abrir_porta'],chestKeyVariants:['chest1','chest2','chest3'],instructionBudget:72,guide:['Todos os selos são físicos. Uma parte da prova não substitui as demais.','A luz cresce conforme as alas são resolvidas.','Na névoa, ilumine antes de continuar após o aviso de medo.'],objectives:[o.context('ativar_runa','loop','Use for na ala da ponte'),o.context('desativar_armadilha','loop','Use while nos espinhos'),o.context('abrir_bau','loop','Faça a busca com laço'),o.concept('break','Pare ao encontrar a chave'),{type:'search_stop',label:'Encerre a busca assim que a chave aparecer'},o.context('coletar_rubi','loop','Repita a coleta de rubis'),{type:'accumulator',value:3,label:'Atualize o acumulador dos rubis'},o.clue('lei','Leia o julgamento no santuário'),o.concept('and','Combine as condições finais'),o.state('basilisk','defeated','Remova as proteções do Basilisco'),o.budget(),o.exit()],codigoInicial:'# integre os padrões das quatro alas',officialSolution:code(`andar_frente(4)
virar_esquerda()
andar_frente(6)
ativar_interruptor()
andar_frente(3)
virar_direita()
for i in range(3):
    ativar_runa()
    andar_frente(2)
virar_direita()
andar_frente(9)
virar_direita()
andar_frente(4)
virar_esquerda()
andar_frente(4)
virar_esquerda()
while corredor_continua():
    ativar_interruptor()
    desativar_armadilha()
    andar_frente(2)
    virar_direita()
    andar_frente(2)
    virar_esquerda()
andar_frente(4)
tentativa = 0
while tem_bau_a_frente():
    ativar_interruptor()
    abrir_bau()
    if encontrou_chave():
        break
    tentativa += 1
    virar_esquerda()
    andar_frente(2)
    virar_direita()
    andar_frente(3)
    virar_direita()
    andar_frente(2)
    virar_esquerda()
virar_esquerda()
andar_frente(4)
virar_direita()
andar_frente(11 - tentativa * 3)
ativar_interruptor()
virar_esquerda()
total = 0
for i in range(3):
    coletar_rubi()
    total += 1
    andar_frente(2)
virar_direita()
virar_direita()
andar_frente(2)
virar_direita()
andar_frente(7)
virar_direita()
andar_frente()
examinar()
if tem_chave() and total == 3:
    andar_frente()
    abrir_porta("basilisk")
    andar_frente(4)`)}));
 return all;
};
