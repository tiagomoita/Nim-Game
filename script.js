var board;
var vetor = [];
var vetor2 = [];
var vetor3 = [];
var vetor4_total = [];
var vetor5_n_retirar = [];
var vetor5_indices_das_primeiras_bolas = [];
var numero_bolas;
var flag;
var flag2 = true;
var matriz_binaria = [];
var start_game = false;
var win;
var select = -1;
var game_id;
var atualizar;
var ranking;

function $(id){
    return document.getElementById(id);
};

function hide(id){
    $(id).style.display = 'none';
};

function show(id){
    $(id).style.display = 'block';
};
function toggle(id){
var x = $(id);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}



function Board(id,size){
    this.id=id;
    this.divBoard=$(id);
    this.size=size;
   
    var k=size;
    numero_bolas=k;
    for(i=k-1;i>0;i--){
    	numero_bolas = +numero_bolas + i;
    }
    //LISTA	
   	for(i=0;i<numero_bolas;i++){
   		vetor3[i] = i;
   	}
   	//BOLAS_EM_CADA COLUNA
   	for(i=size,j=0;i>0;i--,j++){
   		vetor[j] = i;
   	}
   	//MATRIZ BINARIO & INDICES DAS PRIMEIRAS BOLAS
   	for(var i=0;i<size;i++){
   		matriz_binaria.push([0,0,0,0]);
      vetor5_indices_das_primeiras_bolas[i] = 0;
   	}
   	//Saber a que coluna pertence cada ID
   	var col = 0;
   	var ind=0;
   	while(ind<numero_bolas){
   		for(j=0;j<k;j++,ind++){
   			vetor2[ind] = col;
   		}
   		k--;
   		col++;
   	}

    //preencher o vetor5_indices_das_primeiras_bolas
    var aux = size;
    var index = 0;
    for(var i=0;i<size;i++){
      vetor5_indices_das_primeiras_bolas[i] = index;
      for(var j=0;j<aux;j++){
        index++;
      }
      aux--;
    }
    //console.log("indices_primeiras_bolas:" + vetor5_indices_das_primeiras_bolas);

    this.draw = function() {
        var line=0;
        var linhas=0;
        var colunas=0;
        for(var i =0; i<this.size;i++){
            var div2=createDiv();
            for(var k =i ;k<this.size;k++){
              //  var div2=createDiv();
                var div=createDivCircle(line,linhas,size,colunas);
                div2.appendChild(div);

                line++;
                linhas++;
            }
            linhas=0;
            colunas++;
           
            this.divBoard.appendChild(div2); 
        }
    },
    
    this.clear = function(){
        var nodes = this.divBoard.childNodes;
        for(var i in nodes ){
           if(nodes[i].nodeType != undefined){
                nodes[i].remove();
            }
        }
    }  
}
function createDiv() {
    var div = document.createElement("div");
    div.id = "div";
    div.className = "div_tabuleiro";
    return div;
}
function createDivCircle(text,linhas,tamanho,colunas) {
    var div = document.createElement("div");
    var dificuldade =$("dificuldade").value;
    var single_multi =$("comeca").value;
    div.id = "circle"
    div.className = "circle";
    div.value = text;
    div.value2 = linhas;
    
    div.addEventListener("click", function(){
      	Apagar(this.value);
      	flag = true;
      	if(vetor3.length == 0){
    		Vencedor(flag);
    		return;
      	}
      	if(single_multi == 1){
	      	if(dificuldade == 1){
	    		Computador_Aleatorio(); 
	      	}
	      	if(dificuldade == 2){
	        	if(flag2 == true)
	          		Computador_Aleatorio(); 
	        	else
	          		Computador_Binario();
	      	}
	      	if(dificuldade == 3){
	        	Computador_Binario();
	      	}
  		}
    	if(vetor3.length == 0){
    		Vencedor(flag);
    		return;
    	}	
    });
    return div;
}
function Apagar(selecionado){
	var single_multi =$("comeca").value;
    var size =$("sizeBoard").value;
    var dificuldade =$("dificuldade").value;

    var list = document.getElementsByClassName("circle");

    var n_apagados = 0;
    for(i=selecionado; ;i++){ 
        var object = list[i];
        try{
           	if(list[i+1].value2 <= list[i].value2){
           		var index = vetor3.indexOf(i);
           		if(index > -1){
           			vetor3.splice(index, 1);
           		}
                if(object.style.visibility != "hidden"){
                	n_apagados++;
                }
                object.style.visibility = "hidden"; 
                break;
            }
        }
        catch(err){
            if(list[i].value == list.length - 1){
            	var index = vetor3.indexOf(i);
            	if(index > -1){
           			vetor3.splice(index, 1);
           		}
                if(object.style.visibility != "hidden"){
                	n_apagados++;
                }
                object.style.visibility = "hidden"; 
                break;
            }
        }
     
        var index = vetor3.indexOf(i);
		if(index > -1){
           	vetor3.splice(index, 1);
        }
       	if(object.style.visibility != "hidden"){
           	n_apagados++;
        }   
        object.style.visibility = "hidden"; 	   
    }

    if(single_multi == 2){
    	select = selecionado;
    	notify(select,game_id);
    }

    //ATUALIZAR A TABELA DE BOLAS EM CADA COLUNA
    var column = vetor2[selecionado];
    vetor[column] = vetor[column] - n_apagados;   
}
function Vencedor(flag1){
	if(flag1 == false){
       	alert("PERDEU");
    }
    if(flag1 == true){
    	alert("PARABÉNS! GANHOU");
    }
}
function Computador_Aleatorio(){	
	flag = false;
 	flag2 = false;

	while(true){
    var aleatorio = vetor3[Math.floor(Math.random()*vetor3.length)];
    Apagar(aleatorio);
		break;
	}
}
function Computador_Binario(){
  flag = false;
  flag2 = true;

  var size =$("sizeBoard").value;
  Atualizar_Matriz();

  console.log(matriz_binaria);
  console.log(vetor4_total);

  for(i=0;i<size;i++){
    vetor5_n_retirar[i] = 0;
  }

  for(var i=0;i<4;i++){
    if(vetor4_total[i] % 2 == 0)
      vetor4_total[i] = 0;
    else
      vetor4_total[i] = 1;
  }

  console.log(vetor4_total);

  for(var i=0;i<size;i++){
    for(var j=0;j<4;j++){
      if(vetor4_total[j] == 1){
        if(matriz_binaria[i][j] == 1){
          switch(j){
            case 0: vetor5_n_retirar[i] += 8;break;
            case 1: vetor5_n_retirar[i] += 4;break;
            case 2: vetor5_n_retirar[i] += 2;break;
            case 3: vetor5_n_retirar[i] += 1;break;
          }
        } 
        if(matriz_binaria[i][j] == 0){
          switch(j){
            case 0: vetor5_n_retirar[i] -= 8;break;
            case 1: vetor5_n_retirar[i] -= 4;break;
            case 2: vetor5_n_retirar[i] -= 2;break;
            case 3: vetor5_n_retirar[i] -= 1;break;
          }
        } 
      }
    }
    vetor5_n_retirar[i] = Math.abs(vetor5_n_retirar[i]);
  }

  console.log("bolas a retirar em cada coluna: " + vetor5_n_retirar);
  console.log("bolas em cada coluna: " + vetor);

  var coluna = -1;
  var coluna_aux = -1;
  for(var i=0;i<size;i++){
  	if(vetor[i] > coluna_aux){
  		coluna_aux = vetor[i];
  		coluna = i;
  	}
  }

  console.log("coluna: "+ coluna);
   
  var n_bolas_a_retirar = vetor5_n_retirar[coluna]; 
  console.log("retirar: "+ n_bolas_a_retirar);

  var id = Descobrir_ID(coluna,n_bolas_a_retirar);
  Apagar(id);
 
  Atualizar_Matriz();
}
function play() {
	var x = $("tab");
    if (x.style.display === "block") 
        x.style.display = "none";
	var x = $("rules");
    if (x.style.display === "block") 
        x.style.display = "none";
    var x = $("painel_rank");
    if (x.style.display === "block") 
        x.style.display = "none";
	show("tab");
    var size =$("sizeBoard").value;
    var start =$("start").value;
    var dificuldade =$("dificuldade").value;
    if(board != undefined){
      board.clear();
    }
    
    board = new Board("tab",size);
    board.draw();
    if(start == 2 && dificuldade == 1 || start == 2 && dificuldade == 2){
    	Computador_Aleatorio(); 
    } 
    if(start == 2 && dificuldade == 3){
      Computador_Binario();
    }   
}
function Regras(){
	var x = $("rules");
    if (x.style.display === "block") 
        x.style.display = "none";
	var x = $("tab");
    if (x.style.display === "block") 
        x.style.display = "none";
    var x = $("painel_rank");
    if (x.style.display === "block") 
        x.style.display = "none";
    show("rules");
}
function ranking(){
	clear_table();
	var x = $("painel_rank");
    if (x.style.display === "block") 
        x.style.display = "none";
	var x = $("tab");
    if (x.style.display === "block") 
        x.style.display = "none";
    var x = $("rules");
    if (x.style.display === "block") 
        x.style.display = "none";
    show("painel_rank");
	ranking1();
}
function Decimal_to_Binary(decimal){
	var str = "" + decimal;
	var bin = (+str).toString(2);
	return(bin);
}
function Atualizar_Matriz(){
  var size =$("sizeBoard").value;
  var dificuldade =$("dificuldade").value;

  for(i=0;i<size;i++){
    var String_Binary = Decimal_to_Binary(vetor[i]);
    var zeros = 4 - String_Binary.length;
    var String_zero = "";
    for(j=zeros;j>0;j--){
      String_zero = String_zero + "0";
    }
    var String_Final = String_zero + String_Binary; 
    for(var k=0;k<4;k++){
      matriz_binaria[i][k] = String_Final[k];
    }
  }

  for(i=0;i<4;i++){
    vetor4_total[i] = 0;
  }

  for(var l=0;l<4;l++){
    for(var m=0;m<size;m++){
       vetor4_total[l] += Number(matriz_binaria[m][l]);
    }
  }
}
function Descobrir_ID(coluna,retirar){
  var aux = vetor[coluna] - retirar;
  var id = vetor5_indices_das_primeiras_bolas[coluna];
  id = id + aux;
  return id;
}

function Register(){
  var form = $("formulario");
	var nick = form.nome.value;
	var password = form.password.value;

	var objecto = {nick: nick, pass: password};
  	var json = JSON.stringify(objecto);
	//console.log(json);


	var xhr = new XMLHttpRequest();
	xhr.open("POST","http://twserver.alunos.dcc.fc.up.pt:8023/register",true);
  xhr.setRequestHeader("Content-type", "application/json");
	
	xhr.onreadystatechange = function(){
    	if(xhr.readyState == 4){
    		var users = xhr.responseText;
    		server = JSON.parse(users);
    		console.log(server);
        if(xhr.status == 201){
          alert("User successfully registered!\nInsert your username and password to log in.");
          form.nome.value = "";
          form.password.value = "";
        }
    		if(xhr.status == 200){//LOGIN
	    		if(server.error == null){
	    			hide("icone");
    				hide("login");
    				show("menu");
	    			alert("Password accepted");
	    		}
    		}
    		else{
    			if(xhr.status == 401){
	    			alert("Wrong password");
	    			form.password.value = "";
	    		}
    		}
    		return;
    	}
	}
	xhr.send(json);
}
function Join(){
	var single_multi =$("comeca").value;
	if(single_multi == 2){
		var form = $("formulario");
		var nick = form.nome.value;
		var password = form.password.value;
		var group = "23";
		var size =$("sizeBoard").value;

		var objecto = {group: group, nick: nick, pass: password, size: size};
	   	var json = JSON.stringify(objecto);
		console.log(json);

		var xhr = new XMLHttpRequest();
		xhr.open("POST","http://twserver.alunos.dcc.fc.up.pt:8023/join",true);
		xhr.onreadystatechange = function(){
	    	if(xhr.readyState == 4){
	    		jogo = JSON.parse(xhr.responseText);
	    		console.log(jogo);
	    		game_id = jogo.game;
	    		board = new Board("tab",size);
    			board.draw();
	    		update(nick,game_id);
	    		return;
	    	}
		}
		xhr.send(json);
	}
	else{
		alert("You are in Singleplayer mode,change to Multiplayer to be able to use this function.");
	}
}
function update(user,game_id){
  var xhr = new XMLHttpRequest();
  xhr.open("GET","http://twserver.alunos.dcc.fc.up.pt:8008/update?nick="+user+"&game="+game_id,true);
  var eventSource = new EventSource("http://twserver.alunos.dcc.fc.up.pt:8008/update?nick="+user+"&game="+game_id);
  eventSource.onmessage = function(event){
  	var size =$("sizeBoard").value;
  	atualizar = JSON.parse(event.data);
  		 		
  	console.log("atualizar");
  		
  	atualizar.rack.reverse();

  	console.log(atualizar);
  }  
}
function notify(select,game){
	var form = $("formulario");
	var nick = form.nome.value;
	var password = form.password.value;
	var stack = vetor2[select];	
	var pieces = select - vetor5_indices_das_primeiras_bolas[stack];
	
	//alert("stack: " + stack);
	//alert("pieces: " + pieces);

	var objecto = {nick: nick, pass: password, game: game, stack: stack, pieces: pieces};
	var json = JSON.stringify(objecto);
	console.log(json);

	var xhr = new XMLHttpRequest();
	xhr.open("POST","http://twserver.alunos.dcc.fc.up.pt:8008/notify",true);
	xhr.onreadystatechange = function(){
		var size =$("sizeBoard").value;
	   	if(xhr.readyState == 4){
	   		notificacoes = JSON.parse(xhr.responseText); 	
	   		console.log(notificacoes);
	   		
	   		
	    }
	}
	xhr.send(json);
}
/*
function leave(){
	var form = $("formulario");
	var nick = form.nome.value;
	var password = form.password.value;
	var size =$("sizeBoard").value;

	var objecto = {nick: nick, pass: password, game: game_id};
  var json = JSON.stringify(objecto);
	console.log(json);

	var xhr = new XMLHttpRequest();
	xhr.open("POST","http://twserver.alunos.dcc.fc.up.pt:8008/leave",true);
	if(xhr.readyState == 4 && xhr.status == 200){
		var close = JSON.stringify(xhr.responseText);
		if(close == "{}"){
			eventSource.close();
			alert("You left the game");
		}
	}
}
*/
function ranking1(){
	var size =$("sizeBoard").value;

	var objecto = {size: size};
  	var json = JSON.stringify(objecto);
	//console.log(json);

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://twserver.alunos.dcc.fc.up.pt:8023/ranking",true);
	xhr.setRequestHeader("Content-type", "application/json");


	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4){
			var rank = xhr.responseText;
    		ranking = JSON.parse(rank);
    		console.log(ranking);
		}
		if (xhr.status == 200) {
			//console.log("RANKING: " + ranking[0].nick);
			for (i = 0; i < ranking.length; i++) {
				var line = $("tabelaclassificacao").rows[i+1];
				if (ranking[i] !== undefined) {
					line.cells[0].innerHTML = (i+1) + 'º ' + ranking[i].nick;
					line.cells[1].innerHTML = ranking[i].victories;
					line.cells[2].innerHTML = ranking[i].games;

				}
			}
		}
	}
	xhr.send(json);
}
function clear_table(){
	for (i = 1; i < 12; i++) {
		var line = $("tabelaclassificacao").rows[i];	

			line.cells[0].innerHTML = "";
			line.cells[1].innerHTML = "";
			line.cells[2].innerHTML = "";
	}
}


function sair(){
	window.location.reload();
}



