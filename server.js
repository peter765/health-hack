
/* Messenger Platform Quick Start Tutorial
*
* This is the completed code for the Messenger Platform quick start tutorial
*
* https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
*
* To run this code, you must do the following:
*
* 1. Deploy this code to a server running Node.js
* 2. Run npm install
* 3. Update the VERIFY_TOKEN
* 4. Add your PAGE_ACCESS_TOKEN to your environment vars
*
*/

'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const url = 'mongodb://health-hack:hackgt2017@ds061355.mlab.com:61355/heroku_sn3clbg8';

// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  https = require("https"),
  MongoDB = require('mongodb').MongoClient,
  assert = require('assert'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is READY!!! ' + PAGE_ACCESS_TOKEN));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function (entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function

      //TODO: Any messenger actions needed to function, send appropriate content to to the action handler
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);

      } else if (webhook_event.postback) {

        handlePostback(sender_psid, webhook_event.postback);
      }

    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {

  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "Health-Hack";

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {

    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});


/**
 * Action Handler for Messages
 * @param {*} sender_psid
 * @param {*} received_message
 */





//Finds the patient Profile
var findPrescriptions = function (db, callback, firstName, lastName) {
  db.collection('Prescriptions', function (err, collection) {
    collection.find({ "Name": firstName, "LastName": lastName }, { "Date": 1, "Prescription": 1 }).toArray(function (err, results) {
      assert.equal(err, null);
      let date;
      let pres;
      let total;
      let ret;
      for (var i = 0; i < results.length; i++) {
        date = results[i].Date;
        pres = results[i].Prescription;
        total = date + " - " + pres;
        ret += total + "\n";
      }
      console.log("Successful Prescription");
      console.log(ret);
      callback(ret);
    });
  });
}

var findTest = function(db, callback, firstName, lastName) {
  db.collection('Tests',function (err,collection, firstName, lastName) {
    collection.find({"Name":firstName, "LastName" : lastName}, {"Date":1,"Type":1, "Value":1}).toArray(function(err, results) {
      let ret = "";
      for(var i = 0; i < results.length; i++) {
        ret += results[i].Date + "\n" + results[i].Type + "\n" + results[i].Value;
      }

      let response;
      response = {
         "message":{
          "text": "You have taken the following tests. Which results would you like to see?",
            //provide automatic reply suggestions:
          "quick_replies":[
            {
              "content_type":"text",
              "title":"MRI Scans",
              "payload":"MRI",
            },
            {
              "content_type":"text",
              "title":"Insulin Levels",
              "payload":"Insulin"
            }
          ]
        }
      }

    //let sender_psid = webhook_event.sender_psid;
    //handlePostback(sender_psid,webhook_event.postback)
    callback(ret);
    });
  });

}


var findDOB = function(db, callback, firstName, lastName) {
  db.collection('Patients',function (err,collection) {
    collection.find({"Name":firstName, "LastName" : lastName}, {"DateOfBirth":1}).toArray(function(err, results) {
      let ret = results[0].DateOfBirth;
      callback(ret);
    });
  });

}

var findProfile = function (db, callback, firstName, lastName) {
  db.collection('Patients', function (err, collection) {
    collection.find({ "Name": firstName, "LastName": lastName }, { "Name": 1, "LastName": 1, "DateOfBirth": 1, "Ethnicity": 1, "Address": 1, "Allergies": 1, "FamilyHistory": 1, "PhoneNumber": 1, "Height": 1, "Weight": 1 }).toArray(function (err, results) {
      assert.equal(err, null);
      let ret = results[0].Name + " " + results[0].LastName + "\n Date of Birth: " + results[0].DateOfBirth + "\n Ethnicity: " + results[0].Ethnicity + "\n Address: " + results[0].Address + "\n Phone Number: " + results[0].PhoneNumber + "\n Allergies: " + results[0].Allergies + "\n Family History" + results[0].FamilyHistory + "\n Height: " + results[0].Height + "\n Weight: " + results[0].Weight;

      let response;
      let asdf = "";
      let names = "";

      console.log("Successful Profile");
      console.log(ret);
      callback(ret);
    });
  });
}

var findAllergies = function(db, callback, firstName, lastName) {
  db.collection('Patients',function (err,collection) {
    collection.find({"Name":firstName, "LastName":lastName}, {"Allergies":1}).toArray(function(err, results) {
      let ret = results[0].Allergies;
      callback(ret);
    });
  });
}

var findEthnicity = function(db, callback, firstName, lastName) {
  db.collection('Patients',function (err,collection) {
    collection.find({"Name":firstName, "LastName":lastName}, {"Ethnicity":1}).toArray(function(err, results) {
      let ret = results[0].Ethnicity;
      callback(ret);
    });
  });
}

var findHeight = function(db, callback, firstName, lastName) {
  db.collection('Patients',function (err,collection) {
    collection.find({"Name":firstName, "LastName":lastName}, {"Height":1}).toArray(function(err, results) {
      let ret = results[0].Height;
      callback(ret);
    });
  });
}

var findPhone = function(db, callback, firstName, lastName) {
  db.collection('Patients',function (err,collection) {
    collection.find({"Name":firstName, "LastName":lastName}, {"PhoneNumber":1}).toArray(function(err, results) {
      let ret = results[0].PhoneNumber;
      callback(ret);
    });
  });
}

var findAddress = function(db, callback, firstName, lastName) {
  db.collection('Patients',function (err,collection) {
    collection.find({"Name":firstName, "LastName":lastName}, {"Address":1}).toArray(function(err, results) {
      assert.equal(err, null);
      let ret = results[0].Address;
      callback(ret);
    });
  });
}

var findWeight = function(db, callback, firstName, lastName) {
  db.collection('Patients',function (err,collection) {
    collection.find({"Name":firstName, "LastName":lastName}, {"Weight":1}).toArray(function(err, results) {
      let ret = results[0].Weight;
      callback(ret);
    });
  });
}

var findNotes = function(db, callback, firstName, lastName) {
  db.collection('Notes',function (err,collection) {
    collection.find({"Name":firstName, "LastName":lastName}, {"Value": 1}).toArray(function(err, results) {
      assert.equal(err, null);
      let date;
      let pres;
      let total;
      let ret;
      for (var i = 0; i < results.length; i++) {
          date = results[i].Date;
          pres = results[i].Value;
          total = date + " - " + pres;
          ret += total + "\n";
      }
      callback(ret);
    });
  });
}

var findFam = function(db, callback, firstName, lastName) {
  db.collection('Patients',function (err,collection) {
    collection.find({"Name":firstName, "LastName":lastName}, {"FamilyHistory":1}).toArray(function(err, results) {
      assert.equal(err, null);
      let ret = results[0].FamilyHistory;
      callback(ret);
    });
  });
}

var findProcedures = function(db, callback, firstName, lastName) {
  db.collection('Procedures',function (err,collection) {
    collection.find({"Name":firstName, "LastName":lastName}, {"Value":1}).toArray(function(err, results) {
      assert.equal(err, null);
      let date;
      let pres;
      let total;
      let ret;
      for (var i = 0; i < results.length; i++) {
          date = results[i].Date;
          pres = results[i].Value;
          total = date + " - " + pres;
          ret += total + "\n";
      }
      callback(ret);
    });
  });
}

var findSymptoms = function(db, callback, firstName, lastName) {
  db.collection('Symptoms', function (err,collection){
    collection.find({"Name":firstName, "LastName":lastName}, {"Type":1}).toArray(function(err,result) {
      assert.equal(ee,null);
      let date;
      let symp;
      let bleh;
      let ret;
      for (var i = 0; i < results.length; i++) {
        date = results[i].Date;
        symp = results[i].Type;
        bleh= date + " - " + symp;
        ret += bleh + "\n";
      }
    callback(ret);
    });
  });
}

var addMRI = function(db, callback, firstName, lastName, type, date, value) {
   db.collection('Tests').insertOne(
      {
         "Name" : firstName,
         "LastName" : lastName,
         "Type" : type,
         "Date" : date,
         "Value" : value
      }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted an MRI into the restaurants collection.");
    callback();
  });
};

var addNote = function(db, callback, firstName, lastName, date, value) {
   db.collection('Tests').insertOne(
      {
         "Name" : firstName,
         "LastName" : lastName,
         "Date" : date,
         "Value" : value
      }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted an MRI into the restaurants collection.");
    callback();
  });
};


var addStep = function(db, callback, firstName, lastName, date, value) {
   db.collection('Tests').insertOne(
      {
         "Name" : firstName,
         "LastName" : lastName,
         "Date" : date,
         "Value" : value
      }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted an MRI into the restaurants collection.");
    callback();
  });
};


var addSymptom = function(db, callback, firstName, lastName, date, value) {
   db.collection('Tests').insertOne(
      {
         "Name" : firstName,
         "LastName" : lastName,
         "Date" : date,
         "Type" : value
      }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted an MRI into the restaurants collection.");
    callback();
  });
};

var addPresc = function(db, callback, firstName, lastName, date, value) {
   db.collection('Tests').insertOne(
      {
         "Name" : firstName,
         "LastName" : lastName,
         "Date" : date,
         "Prescription" : value
      }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted an MRI into the restaurants collection.");
    callback();
  });
};



function handleMessage(sender_psid, received_message) {
  let response;
  var date = new Date();
  var dd = date.getDate();
  var mm = date.getMonth()+1; //January is 0!
  var yyyy = date.getFullYear();

  if(dd<10) {
    dd = '0'+dd
  }

  if(mm<10) {
    mm = '0'+mm
  }

date = mm + '/' + dd + '/' + yyyy;

  /**
   * Handle All Incoming Message Intents here, using NLP intent('nlp' key in incoming message)
   */


  // Checks if the message contains text
  if (received_message.text) {

    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API


    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    let nlptxt = JSON.stringify(received_message.nlp.entities);
    console.log(nlptxt);

    response = {
      "text": `You sent the message: "${received_message.text}". ` + nlptxt
    }
    //Setting up the connection to MongoDB

    if (nlptxt) {
      let firstName;
      let lastName;
      let document;
      let field;
      let intent;
      var user_URL = "https://graph.facebook.com/v2.6/" + sender_psid + "?fields=first_name,last_name,profile_pic&access_token=EAACAGZCsviHoBAJIwkUL1bkaWnZAsmJepegUo4ZCOabkLR1erkONb9Rp11laQi6W9f6QdRY7RtdJ1ys60fRHYwzoLIZCkmauhQIz2m0y4Byum1VArODyuTutGr4HeCd6CNZA9OeP9E4bpJKZAJehYBqsP6eWSYdErPrJn4ddKqUgZDZD"
      var sendUser;
      https.get(user_URL, function(res){
        var body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            sendUser = JSON.parse(body);
            console.log("Got a response: ", sendUser.first_name);
            if (isDoctor(sendUser.first_name, sendUser.last_name)) { //call following methods for inquired user if a doctor
              if (nlptxt.given_name) {
                firstName = nlptxt.given_name.value;
                console.log(firstName)
              }
              if (nlptxt.family_name) {
                lastName = nlptxt.family_name.value;
                console.log(lastName)
              }
            } else {
              firstName = sendUser.first_name; //call following methods for sending user
              lastName = sendUser.last_name;
            }
      
            if (nlptxt.document) {
              document = nlptxt.document.value;
              console.log(document)
            }
            if (nlptxt.field) {
              field = nlptxt.field.value;
              console.log(field)
            }
          }
          if (nlptxt.intent) {
            intent = nlptxt.intent.value;
            console.log(intent)
            MongoDB.connect(url, function (err, db) {
              console.log("Connected Successfully");
      
              if (intent === "profile") { //shows patient information
                //calling different handler functions
                if (!document) { //default case for profile
                  if (firstName && lastName) {
                    findProfile(db, function (results) {
                      callSendAPI(sender_psid, results);
                      db.close();
                    }, firstName, lastName)
                  }
                } else if (document === "tests") {
      
                  //calling different handler functions
      
                  findTests(db,function(results){
                    callSendAPI(sender_psid,{text:results});
                    db.close();
                  })
      
                } else if (document === "prescriptions") {
                  findPrescriptions(db, function (results) {
                    callSendAPI(sender_psid, { text: results });
                  }, firstName, lastName);
                  db.close();
                }
              } else if (document === "symptoms") {
                findSymptoms(db, function (results) {
                  callSendAPI(sender_psid, { text: results });
                }, firstName, lastName);
                db.close();
      
              } else if (document === "next steps") {
                findNextSteps(db, function (results) {
                  callSendAPI(sender_psid, { text: results });
                }, firstName, lastName);
                db.close();
      
              } else if (document === "notes") {
                findNotes(db, function (results) {
                  callSendAPI(sender_psid, { text: results });
                }, firstName, lastName);
                db.close();
              } else if(intent === "update") { //updates patient information
              if (isDoctor(sendUser.first_name, sendUser.last_name)) {
                if(nlptxt.notes) {
                  let val = nlptxt.notes.value;
                  if (!field) {
                    //invalid field or default case
                  } else if (field === "height") {
                      callSendAPI(sender_psid, { text: "In Progress" });
                  } else if (field === "weight") {
                      callSendAPI(sender_psid, { text: "In Progress" });
                  } else if (field === "history") {
                    callSendAPI(sender_psid, { text: "In Progress" });
                  } else if (field === "notes") {
                      addNote(db, function (results) {
                        callSendAPI(sender_psid, { text: "DONE" });
                      }, firstName, lastName, date, val);
                  } else if (field === "next_steps") {
                      addStep(db, function (results) {
                        callSendAPI(sender_psid, { text: "DONE" });
                      }, firstName, lastName, date, val);
                  } else if (field === "symptoms") {
                      addSymptom(db, function (results) {
                        callSendAPI(sender_psid, { text: "DONE" });
                      }, firstName, lastName, date, val);
                  } else if (field === "meds") {
                      addPresc(db, function (results) {
                        callSendAPI(sender_psid, { text: "DONE" });
                      }, firstName, lastName, date, val);
                  }
                  //call update functions to database
                }
      
      
              }
            } else if (intent === "add") {
              if(isDoctor(sendUser.first_name, sendUser.last_name)) {
              //call add functions to database
              //addPatient();
              }
            }
        });
      
      } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        if(isDoctor(sendUser.first_name, sendUser.last_name)) {
          MongoDB.connect(url, function (err, db) {
      
            addMRIImage(db, function (results) {
              callSendAPI(sender_psid, { text: "DONE" });
            }, firstName, lastName, "MRI", date, attachment_url);
      
          });
        }
      }
      
      
      // Send the response message
      callSendAPI(sender_psid, response);
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
    
      
}

/**
 * Action Handler for Postbacks
 * @param {*} sender_psid
 * @param {*} received_postback
 */
function handlePostback(sender_psid, received_postback) {
  console.log('ok')
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}






///DO NOT TOUCH THIS FUNCTION
///RESPONSIBLE FOR SENDING MESSAGES
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

function callUserAPI(sender_psid) {
  //message body
  
  https.get(url, res=> {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      console.log(body.first_name);
      return body;
    });
  });
}

function isDoctor(firstName, lastName) {
  /**db.collection('Doctors',function (err,collection) {
    collection.find({"Name":firstName, "LastName" : lastName}, {"DateOfBirth":1}).toArray(function(err, results) {
      if(results) {

      }
      callback(ret);
    });
  }); we be hardcodin boiz **/
  if (firstName == "Rohit") {
    if (lastName == "Ganesan") {
      return True;
    }
  }
  return False;
}
}

function donothing() {
  
}