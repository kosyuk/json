var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var db = new Db('responsysEmail', 
					new Server("localhost", 27017, {safe: true},
						{autor_reconnect: true}, {}));
db.open(function(){
	console.log("mongodb is opened");
	db.collection('email', function(error, email){
		db.email = email;
	});
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.listen(3000);

app.get('/email', function(req,res){
	db.email.find().toArray(function(err, items){
		res.send(items);
	});
});

app.get('/email/:email', function(req,res){
	db.email.find({emailName:req.params.email}).toArray(function(err, items){
		res.send(items[0]);
	});
});

app.post("/email", function(req, res){
	db.email.update({emailName:req.body.emailName},
					{$set:{
							emailName:req.body.emailName,
							inputJSON:req.body.inputJSON,
							selectedItems:req.body.selectedItems,
							textRemove:req.body.textRemove,
							capitalizeLetters:req.body.capitalizeLetters,
							firstLetterLowerCase:req.body.firstLetterLowerCase,
					}}, {upsert: true});
	res.end();
});

app.delete("/email/:email", function(req, res){
	db.email.remove({emailName:req.params.email});
	res.end();
});

