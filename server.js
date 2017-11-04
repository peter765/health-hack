var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();

 var testVariable;

 var input;
 var inputNameSplit;
 var inputName;
 var inputQuery;
 var inputAction;
 var queries;

 var done;
 var counter = 0;
 var insertCounter = 0;
 var modifyCounter = 0;
 var deleteCounter = 0;


var findDocuments = function(db, callback) {           //CODE FOR FINDING DOCUMENTS
	console.log("Entering");
  // Find some documents
  for (i = 0; i < queries.length; i++) {
        if (queries[i] == "age"){

            db.collection('main',function (err,collection) {
            collection.find({"name":inputName},{"age":1}).toArray(function(err, results) {
            assert.equal(err, null);
            testVariable += "age: "+results[0].age+ "\n";
            counter++;
            callback(testVariable);
          });
        });

            
        }
        if (queries[i] == "injury"){

            db.collection('injury',function (err,collection) {
            collection.find({"name":inputName},{"injury":1, "injurydate":1}).toArray(function(err, results) {
            assert.equal(err, null);
            

            testVariable += "injury: " + results[0].injury	 + "\n"+ "Date: "+results[0].injurydate + "\n";
            counter++;
            callback(testVariable);
          });
        });
            
        }
        if (queries[i] == "immu"){

            db.collection('immunization',function (err,collection) {
            collection.find({"name":inputName},{"immudate":1,"shots":1}).toArray(function(err, results) {
            assert.equal(err, null);
            testVariable += "Shots: "+results[0].shots + "\n" + "Immudate: "+results[0].immudate + "\n";
            counter++;
            callback(testVariable);
            });
        });
            
        }
    }
 
}



var insertDocuments = function(db, callback) {          //CODE FOR INSERTING DOCUMENTS
    // insert some documents
 db.collection('main').insertOne( {
      "name" : inputName,
      "age" : queries[0]
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document in main collection.");
    insertCounter++;
    callback(result);
  });

 db.collection('injury').insertOne( {
      "name" : inputName,
      "injury" : queries[1],
      "injurydate": queries[2]
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document in injury collection.");
    insertCounter++;
    callback(result);
  });

 db.collection('immunization').insertOne( {
      "name" : inputName,
      "shots" : queries[3],
      "immudate": queries[4]
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document in immu collection.");
    insertCounter++;
    callback(result);
  });
 
}


var updateDocuments = function(db, callback) {              //CODE FOR UPDATING DOCUMENTS

	    db.collection('main',function (err,collection) {
	    collection.update({"name":inputName},
	    	{$set:{"age":queries[0]}},
	    	function(err, results) {
			    assert.equal(err, null);
			    modifyCounter++
			    callback(results);
			});
		});

	    db.collection('injury',function (err,collection) {
	    collection.update({"name":inputName},
	    	{$set:{"injury":queries[1],"injurydate":queries[2]}},
	    	function(err, results) {
			    assert.equal(err, null);
			    modifyCounter++
			    callback(results);
			});
		});

		db.collection('immunization',function (err,collection) {
	    collection.update({"name":inputName},
	    	{$set:{"immu":queries[3],"immudate":queries[4]}},
	    	function(err, results) {
			    assert.equal(err, null);
			    modifyCounter++
			    callback(results);
			});
		});

}

var deleteDocuments = function(db, callback) {              //CODE FOR DELETING DOCUMENTS
		console.log(inputName);
	    db.collection('main',function (err,collection) {
	    collection.deleteOne({"name":inputName},function(err, results) {
	    assert.equal(err, null);
	    deleteCounter++
	    callback(results);
			});
		});

		db.collection('injury',function (err,collection) {
	    collection.deleteOne({"name":inputName},function(err, results) {
	    assert.equal(err, null);
	    deleteCounter++
	    callback(results);
			});
		});

		db.collection('immunization',function (err,collection) {
	    collection.deleteOne({"name":inputName},function(err, results) {
	    assert.equal(err, null);
	    deleteCounter++
	    callback(results);
			});
		});
}


function openConnection(param,senderID){        //OPENING CONNECTION TO MONGODB
     testVariable = "";
     input = "";
     inputName = "";
     inputNameSplit = "";
     inputQuery = "";
     queries = "";

	input = param.toLowerCase().trim();
    inputNameSplit = input.split(":");

    inputAction = inputNameSplit[0];
    inputAction = inputAction.trim();

    inputQuery = inputNameSplit[1]; //query : name
    inputQuery = inputQuery.trim()

    inputName = inputNameSplit[2];
    inputName = inputName.trim();

    queries = inputQuery.split(",");
    for(i = 0; i < queries.length;i++){
        queries[i] = queries[i].trim();
    } 
    var urlDB = 'mongodb://heroku_sn3clbg8:l10b5u38ob63d2grp8vi0dllph@ds061355.mlab.com:61355/heroku_sn3clbg8';
    MongoClient.connect(urlDB, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    console.log(inputAction);
    if (inputAction == "find"){                         
        counter = 0;

        findDocuments(db,function(results){
	        if (counter	== queries.length){
	        sendMessage(senderID, {text: testVariable});
	        db.close();	
	        }
        })
    } else if (inputAction == "insert") {
        insertCounter = 0;

        insertDocuments(db,function(results){
            if (insertCounter == 3) {
                sendMessage(senderID, {text: "Inserted: " + queries[0] + ", "+ queries[1] + ", " + queries[2] + ", " + queries[3] + ", " + queries[4] + " for " + inputName});
                db.close();
            }
        })
    } else if (inputAction == "update"){
        modifyCounter = 0;
         updateDocuments(db,function(results){
            if (modifyCounter == 3){
            sendMessage(senderID, {text: "Updated for " + inputName});
            db.close(); 
            }
        })
    } else if (inputAction == "delete"){
        modifyCounter = 0;
         deleteDocuments(db,function(results){
            if (deleteCounter == 3){
            sendMessage(senderID, {text: "deleted: " + inputName});
            db.close(); 
            }
        })
    }  
    });

}




function sendMessage(recipientId, message) {                //SEND MESSAGE FUNCTION
		
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};


function sendImage(recipientId, inText) {                   //SEND IMAGE FUNCTION
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: {
    attachment:{
      type:"image",
      payload:{
        url:"https://farm5.staticflickr.com/4135/4932622210_1c633c395f_z.jpg"
      }
    }
  },
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};


app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 8080));


app.get('/', function (req, res) {                          // Server frontpage
    res.send('This is TestBot Server');
});

app.get('/webhook', function (req, res) {                       // Facebook Webhook

    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token calculate: str init');
    }
});


app.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            console.log(event.message.text.split(":")[2]);
        	if (event.message.text.split(":")[2]==undefined){
        		sendImage(event.sender.id, "Peter John");
        	}
        	else{
 				openConnection(event.message.text,event.sender.id);//im running a query here

				
//console.log(testVariable);
            	
        	}
        }
    }
    res.sendStatus(200);
});
