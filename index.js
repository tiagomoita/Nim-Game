var http = require('http');
var fs = require('fs');
var url = require('url');
var crypto = require('crypto');
var dns  = require('dns');
var connect = require('connect');
var express = require('express');
var cors = require('cors');
var chance = require('chance');
var stream = require('stream');
var bodyparser = require('body-parser');

var app = express();
var salts = new chance();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: true
}));

const hostname = "twserver.alunos.dcc.fc.up.pt";
const port = 8023;

function send200Response(response){
	response.writeHead(200, {'Content-Type' : 'text/plain'});
	response.write("{}");
	response.end();
}
function send400Response(response){
	response.writeHead(400,{"Content-Type": "text/plain"});
	response.write("Bad Request");
	response.end();
}
function send401Response(response){
	response.writeHead(401, {'Content-Type' : 'text/html'});
	response.write(JSON.stringify({error: "User registered with a different password"}));
	response.end();
}
function send404Response(response){
	response.writeHead(404,{"Content-Type": "text/plain"});
	response.write("Not Found");
	response.end();
}

check();
function check(){
	var file = fs.readFile('users.txt',function(err,data){
		try{
			//console.log(data.toString());
			//console.log(JSON.parse(data.toString()));
			JSON.parse(data.toString());
		}
		catch(e){
			fs.writeFile('users.txt',"[]",function(err){});
		}
	});
}
function sort(object){
	object.sort(function(a, b){
		if(a.victories == b.victories){
			return parseInt(a.games) - parseInt(b.games);
		}
		return -(parseInt(a.victories) - parseInt(b.victories));
	});
}
function isInteger(x) {
    return x % 1 === 0;
}

app.post('/register',function(request,response){
	
	var file = fs.readFile('users.txt',function(err,data){
	if(!err){
		var user = request.body.nick;
		var pass = request.body.pass;
		var object = JSON.parse(data.toString('utf8'));
		//console.log(object);
		var flag = 1;

		for(var i=0;i<object.length;i++){
			var object1 = JSON.stringify(object);
			//console.log(object1);
			if(object[i].nick === user){
				var password = crypto.createHash('md5').update(object[i].salt + pass).digest('hex');
				//console.log("pass: " + pass);
				//console.log("password: " + password);
				if(password === object[i].pass){
					flag = 2 //200
					break;
				}
				else{
					flag = 3//401
					break;
				}
				break;
			}
			else{
				flag = 1;//NEW USER
			}
		}
		if(flag == 1){
			var salt = salts.string({
				length: 4
			});
			var password = crypto.createHash('md5').update(salt + pass).digest('hex');
			var save_user = {};
			save_user.nick = user;
			save_user.pass = password;
			save_user.salt = salt;
			//console.log(save_user);
			object.push(save_user);
			//console.log(object);
			fs.writeFile('users.txt',JSON.stringify(object),function(err){
				if(err)
					return console.log(err);
			})
			response.writeHead(201,{"Content-Type": "text/plain"});
			response.write(JSON.stringify("User successfully registered!"));
			response.end();
		}
		else if(flag == 2){
			send200Response(response);
		}
		else{
			send401Response(response);
		}
	}
	else{
		send404Response(response);
	}	

	});
});

app.post('/ranking',function(request,response){
	try{
		var file = fs.readFile('ranking.txt', function(err, data){
	        if(!err){
	            var object = JSON.parse(data.toString('utf8'));
	           	var size = request.body.size;
	           	//console.log(object[size]);
	           	var string = JSON.stringify(request.body);
	           	if(string === "{}"){
	           		response.writeHead(401, {'Content-Type' : 'text/html'});
					response.write(JSON.stringify({ "error": "Undefined size" }));
					response.end();	
	           	}
	           	if(isInteger(size)){
	           		if(object[size] != undefined){
	           			sort(object[size]);
	           			response.writeHead(200, {'Content-Type' : 'text/plain'});
						response.write(JSON.stringify(object[size]));
	           		}
	           		else{
	           			response.writeHead(401, {'Content-Type' : 'text/html'});
						response.write(JSON.stringify({"error": "Doens't exist table with this size"}));		
	           		}
	           	}
	           	else{
	           		response.writeHead(401, {'Content-Type' : 'text/html'});
					response.write(JSON.stringify({ "error": "Invalid size" }));
	           	}
	           	response.end();
	        }
	        else{
	        	send404Response(response);	
	        }
	    });
	}
	catch(err){
		console.log("Erro JSON");
	}
});


app.listen(port,function(){
	console.log(`Server running at http://${hostname}:${port}/`);
});

