module.exports=({Layout:L,obj:o,code,make,tutorial})=>{
 const all=[];let l,a;
 l=new L(23,14).room('entrada','Pórtico do guardião',7,1,3,3,'lit',{initiallyVisible:true}).room('chave','Ala da chave',2,6,3,3,'dark').room('corredor','Galeria de retorno',7,6,3,4).room('guarda','Sala da guarda',7,13,3,3).room('final','Cristal protegido',7,18,3,4,'dark').path([8,2],[8,20]).path([8,7],[3,7]).start(8,2).exit(8,20);
 l.light('luz',5,7,['chave','final']);l.entity('key','key',3,7);l.entity('door','door',8,11,{requiresKey:true});l.entity('guardian','guardian',8,16,{requiresKey:true});
 a=make(11,l,{descricao:'A chave está fora da rota principal. Explore a ala escura e use uma condição para liberar os bloqueios.',design:'Desvio ao norte para iluminar e coletar a chave; retorno a dois bloqueios condicionais.',allowedCommands:['tem_chave','abrir_porta'],guide:['if executa o bloco apenas quando a condição é verdadeira.','tem_chave() consulta o inventário desta tentativa.','A luz permanece descoberta, mas a chave volta ao lugar ao executar.'],objectives:[{type:'has_key',label:'Busque a chave na ala remota'},o.context('abrir_porta','condition','Abra uma passagem dentro de uma condição'),o.state('door','open','Abra a porta com a chave'),o.state('guardian','defeated','Libere o Guardião'),o.exit()],officialSolution:code(`andar_frente(5)
virar_esquerda()
andar_frente(3)
ativar_interruptor()
andar_frente(2)
virar_direita()
virar_direita()
andar_frente(5)
virar_esquerda()
andar_frente(3)
if tem_chave():
    abrir_porta("door")
andar_frente(5)
if tem_chave():
    abrir_porta("guardian")
andar_frente(5)`)});
 tutorial(a,['andar_frente(5)',a.officialSolution.split('\n').slice(0,5).join('\n'),a.officialSolution.split('\n').slice(0,12).join('\n'),a.officialSolution],[{usedCommand:'andar_frente'},{flag:'keyCollected'},{usedConcept:'if'},null],['A porta está na rota principal; procure a chave no desvio.','Ilumine a ala e observe Guto recolher a chave.','O sensor alimenta if; a porta responde ao bloco.','Amplie a mesma regra para o Guardião e o cristal.']);all.push(a);
 l=new L(25,17).room('entrada','Vestíbulo dos caminhos',7,1,3,3,'lit',{initiallyVisible:true}).room('sensor','Bifurcação da placa',7,4,3,3).room('upper','Galeria superior',3,8,3,3,'dark').room('lower','Galeria inferior',11,8,3,3,'dark').room('uniao','Salão de reencontro',7,15,3,3).room('final','Saída das rotas',7,20,3,4,'dark').path([8,2],[8,6]).path([8,6],[4,6],[4,16],[8,16],[8,22]).path([8,6],[12,6],[12,16],[8,16]).start(8,2).exit(8,22);
 l.entity('plate','toggle_plate',7,5,{mode:'logic',label:'Sensor de rota'});l.light('luz',8,6,['upper','lower','final']);l.entity('spikes_upper','hazard',4,12,{mode:'signal'});l.entity('spikes_lower','hazard',12,12,{mode:'signal'});l.gate('selo',8,18,[],{requiresAny:['visit_upper','visit_lower']});
 all.push(make(12,l,{descricao:'Consulte o estado da placa na bifurcação e escolha a galeria segura com if e else.',design:'Duas galerias físicas contornam a parede central; a placa determina qual linha de espinhos está recolhida.',allowedCommands:['placa_ativa'],variantStates:[[{entityId:'plate',state:'on'},{entityId:'spikes_upper',state:'inactive'},{entityId:'spikes_lower',state:'active'}],[{entityId:'plate',state:'off'},{entityId:'spikes_upper',state:'active'},{entityId:'spikes_lower',state:'inactive'}]],guide:['Placa ON: galeria superior segura. Placa OFF: galeria inferior segura.','Consulte placa_ativa() na bifurcação; o estado varia entre cenários.'],objectives:[o.concept('if','Avalie a condição com if'),o.concept('else','Preveja a alternativa com else'),o.context('andar_frente','condition','Faça o movimento depender da condição'),o.exit()],codigoInicial:'# alcance a placa e consulte seu estado',officialSolution:code(`andar_frente(4)
ativar_interruptor()
if placa_ativa():
    virar_esquerda()
    andar_frente(4)
    virar_direita()
    andar_frente(10)
    virar_direita()
    andar_frente(4)
    virar_esquerda()
else:
    virar_direita()
    andar_frente(4)
    virar_esquerda()
    andar_frente(10)
    virar_esquerda()
    andar_frente(4)
    virar_direita()
andar_frente(6)`)}));
 l=new L(26,17).room('entrada','Pórtico da energia',7,1,3,3,'lit',{initiallyVisible:true}).room('energia','Arquivo da energia',2,4,3,3,'dark').room('limiar','Arquivo da medida',12,9,3,3,'dark').room('pedestal','Sala de comparação',7,9,3,4).room('guardas','Galeria dos validadores',7,16,3,1).room('final','Câmara da energia',7,21,3,4,'dark').path([8,2],[8,23]).path([8,5],[3,5]).path([8,10],[13,10]).start(8,2).exit(8,23);
 l.light('luz_a',4,5,['energia']);l.clue('energia','Registro da fonte',2,5,'A fonte conserva uma dúzia de unidades de energia. Receba essa quantidade no pedestal.');l.light('luz_b',12,10,['limiar','final']);l.clue('limiar','Regra dos validadores',14,10,'O primeiro selo exige energia maior ou igual a uma dezena. O segundo rejeita energia igual a zero.');l.entity('pedestal','pedestal',8,11,{requiresClues:['energia','limiar']});l.entity('guardian_high','guardian',8,15,{requiresClues:['energia','limiar'],condition:{input:'pedestal',operator:'>=',value:10}});l.entity('guardian_second','guardian',8,18,{requires:['guardian_highOpen'],condition:{input:'pedestal',operator:'!=',value:0}});
 all.push(make(13,l,{descricao:'Descubra a energia da fonte e a regra dos validadores em arquivos separados. Compare os dados para abrir as passagens.',design:'Informação e limiar em alas opostas; as condições do código e os requisitos físicos dos Guardiões precisam concordar.',allowedCommands:['abrir_porta'],requireInputContext:true,guide:['As inscrições descrevem quantidades; interprete-as antes do pedestal.','Um Guardião não libera passagem quando sua exigência real não é satisfeita.'],objectives:[o.clue('energia','Encontre o registro da fonte'),o.clue('limiar','Encontre a regra dos validadores'),o.concept('comparison','Compare os valores encontrados'),o.context('abrir_porta','condition','Abra as passagens por blocos condicionais'),o.state('guardian_high','defeated','Libere o primeiro validador'),o.state('guardian_second','defeated','Libere o segundo validador'),o.exit()],codigoInicial:'# descubra energia e regra antes de comparar',testInputs:['12'],officialSolution:code(`andar_frente(3)
virar_esquerda()
andar_frente(4)
ativar_interruptor()
andar_frente()
examinar()
virar_direita()
virar_direita()
andar_frente(5)
virar_esquerda()
andar_frente(5)
virar_direita()
andar_frente(4)
ativar_interruptor()
andar_frente()
examinar()
limiar = 10
virar_direita()
virar_direita()
andar_frente(5)
virar_direita()
andar_frente()
energia = int(input("Energia da fonte: "))
andar_frente(3)
if energia >= limiar:
    abrir_porta("guardian_high")
andar_frente(3)
if energia != 0:
    abrir_porta("guardian_second")
andar_frente(6)`)}));
 l=new L(28,18).room('entrada','Vestíbulo dos selos',7,1,3,3,'lit',{initiallyVisible:true}).room('hub','Salão das alavancas',7,6,3,3).room('azul','Ala azul',2,6,3,3,'dark').room('verde','Ala verde',13,6,3,3,'dark').room('or','Galeria do OU',7,12,3,3).room('and','Pórtico do E',7,19,3,2).room('final','Cristal dos selos',7,23,3,4,'dark').path([8,2],[8,25]).path([3,7],[14,7]).start(8,2).exit(8,25);
 l.light('luz',8,7,['azul','verde','final']);l.entity('lever_blue','lever',3,7,{label:'azul',flag:'lever_blue'});l.entity('lever_green','lever',14,7,{label:'verde',flag:'lever_green'});l.entity('plate','toggle_plate',10,7,{connections:[{targetId:'spikes',activeState:'inactive',inactiveState:'active'}]});l.entity('spikes','hazard',12,7,{mode:'signal'});l.entity('gate_side','gate',8,10,{requiresAny:['lever_blue','lever_green']});l.entity('gate_main','gate',8,18,{requires:['lever_blue','lever_green']});
 all.push(make(14,l,{descricao:'Ative as duas alas e use condições combinadas. Uma passagem aceita qualquer alavanca; o selo final exige ambas.',design:'OU libera a passagem com apenas a ala azul; a ala verde exige passar pela placa que recolhe espinhos; E libera o último selo.',allowedCommands:['ativar_alavanca','alavanca_azul_ativa','alavanca_verde_ativa','abrir_porta'],instructionBudget:40,guide:['A placa alterna os espinhos ao ser pisada. Furos visíveis indicam o mecanismo.','A passagem secundária responde a OU; a principal responde a E.'],objectives:[o.state('lever_blue','on','Ative a ala azul'),o.state('lever_green','on','Ative a ala verde'),o.concept('and','Combine condições com and'),o.concept('or','Combine condições com or'),o.context('abrir_porta','condition','Controle a abertura com condições'),o.state('gate_side','open','Abra a passagem de OU'),o.state('gate_main','open','Abra o selo de E'),o.budget(),o.exit()],codigoInicial:'# explore as duas alas e leia os estados',officialSolution:code(`andar_frente(5)
ativar_interruptor()
virar_esquerda()
andar_frente(5)
ativar_alavanca("lever_blue")
virar_direita()
virar_direita()
andar_frente(5)
virar_esquerda()
andar_frente(2)
if alavanca_azul_ativa() or alavanca_verde_ativa():
    abrir_porta("gate_side")
virar_direita()
virar_direita()
andar_frente(2)
virar_esquerda()
andar_frente(5)
ativar_alavanca("lever_green")
virar_direita()
virar_direita()
andar_frente(5)
virar_direita()
andar_frente(10)
if alavanca_azul_ativa() and alavanca_verde_ativa():
    abrir_porta("gate_main")
andar_frente(8)`)}));
 l=new L(35,25).room('entrada','Pórtico do julgamento',11,1,3,3,'lit',{initiallyVisible:true}).room('sol','Arquivo do Sol',3,4,3,3,'dark').room('lua','Arquivo da Lua',17,4,3,3,'dark').room('sombra','Arquivo da Sombra',3,11,3,3,'dark').room('hub','Salão dos três portões',10,8,5,10).room('destino_sol','Caminho do Sol',3,23,3,3,'dark').room('destino_lua','Caminho da Lua',11,23,3,3,'dark').room('destino_sombra','Caminho da Sombra',19,23,3,3,'dark').room('uniao','Pórtico da decisão',11,27,3,3).room('final','Cristal do julgamento',11,31,3,3,'dark').path([12,2],[12,16]).path([4,5],[18,5]).path([12,12],[4,12]).path([4,24],[4,28],[20,28],[20,24]).path([12,24],[12,32]).start(12,2).exit(12,32);
 l.light('luz_sol',4,6,['sol','destino_sol']);l.clue('sol','Lei do Sol',3,5,'O Sol reconhece poder maior ou igual a 20. O portão solar usa o identificador 3.');l.entity('key','key',4,5);l.light('luz_lua',18,6,['lua','destino_lua']);l.clue('lua','Lei da Lua',19,5,'A Lua reconhece poder a partir de 10 quando a lei do Sol não foi atendida. Seu identificador é 2.');l.entity('lever','lever',18,5,{flag:'leverDone'});l.light('luz_sombra',4,13,['sombra','destino_sombra','final']);l.clue('sombra','Registro do julgamento',3,12,'A Sombra recebe o poder abaixo do limiar lunar, pelo portão 1. O poder inscrito nesta tentativa é 25.');l.entities.find(e=>e.id==='sombra').variantTexts=[25,15,5].map(n=>`A Sombra recebe o poder abaixo do limiar lunar, pelo portão 1. O poder inscrito nesta tentativa é ${n}.`);l.entity('power_pedestal','pedestal',12,12,{requiresClues:['sol','lua','sombra'],variantInputs:['25','15','5']});
 for(const [n,r,c,tr,tc] of [[3,12,16,4,24],[2,9,12,12,24],[1,12,9,20,24]]) l.entity(`portal${n}`,'portal',r,c,{value:n,label:{1:'Sombra',2:'Lua',3:'Sol'}[n],requiresKey:true,requires:['leverDone','read_sol','read_lua','read_sombra'],flag:'correctPortal',target:{row:tr,column:tc,facing:'LESTE'}});
 l.map[9][12]=1;l.entity('gate','gate',12,30,{requiresKey:true,requires:['leverDone','correctPortal','read_sol','read_lua','read_sombra']});
 all.push(make(15,l,{descricao:'Investigue os três arquivos, reúna os selos e classifique o poder descoberto para escolher o portão do julgamento.',design:'Três setores obrigatórios revelam limiares, chave, alavanca e poder variável; três destinos convergem apenas após um portal legítimo.',allowedCommands:['ativar_alavanca','entrar_portao','abrir_porta'],instructionBudget:65,requireInputContext:true,guide:['As leis do julgamento estão nos arquivos.','A chave e a alavanca liberam os selos; o poder determina a escolha.','O poder inscrito varia entre cenários. Portões incorretos não transportam nem recompensam.'],objectives:[o.clue('sol','Investigue a lei do Sol'),o.clue('lua','Investigue a lei da Lua'),o.clue('sombra','Descubra o poder e a lei da Sombra'),{type:'has_key',label:'Recolha a chave do julgamento'},o.flag('leverDone','Ative o selo da Lua'),...['if','elif','else','comparison'].map(c=>o.concept(c,`Use ${c==='comparison'?'comparações':c} na classificação`)),o.context('entrar_portao','condition','Faça o portão depender da classificação'),o.flag('correctPortal','Entre no portão legítimo'),o.state('gate','open','Libere a saída do julgamento'),o.budget(),o.exit()],codigoInicial:'# investigue as leis e reúna os selos',testInputs:['25'],testScenarios:[{variant:0,inputs:['25'],label:'Sol'},{variant:1,inputs:['15'],label:'Lua'},{variant:2,inputs:['5'],label:'Sombra'}],officialSolution:code(`andar_frente(3)
virar_esquerda()
andar_frente(8)
ativar_interruptor()
examinar()
virar_direita()
virar_direita()
andar_frente(14)
ativar_interruptor()
examinar()
ativar_alavanca()
virar_direita()
virar_direita()
andar_frente(6)
virar_direita()
andar_frente(7)
virar_esquerda()
andar_frente(8)
ativar_interruptor()
examinar()
virar_direita()
virar_direita()
andar_frente(8)
poder = int(input("Poder do julgamento: "))
if poder >= 20:
    virar_esquerda()
    andar_frente(4)
    entrar_portao(3)
    andar_frente(4)
    virar_direita()
    andar_frente(8)
    virar_esquerda()
    andar_frente()
elif poder >= 10:
    virar_direita()
    virar_direita()
    andar_frente(3)
    entrar_portao(2)
    andar_frente(5)
else:
    virar_direita()
    andar_frente(3)
    entrar_portao(1)
    andar_frente(4)
    virar_esquerda()
    andar_frente(8)
    virar_direita()
    andar_frente()
abrir_porta("gate")
andar_frente(3)`)}));
 return all;
};
