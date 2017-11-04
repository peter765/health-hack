/*
 * Messenger Platform Quick Start Tutorial
 *
 * This is the completed code for the Messenger Platform quick start tutorial
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 * To run this code, you must do the following:
 *
 * 1. Deploy this code to a server running Node.js
 * 2. Run `npm install`
 * 3. Update the VERIFY_TOKEN
 * 4. Add your PAGE_ACCESS_TOKEN to your environment vars
 *
 */

'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
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

    body.entry.forEach(function(entry) {

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
var findPrescriptions = function(db, callback) {
  db.collection('Prescriptions',function (err,collection) {
    collection.find({"Name":"Peter","LastName":"John"},{"Date":1,"Prescription":1}).toArray(function(err, results) {
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

var findProfile = function(db, callback) {
  db.collection('Patients',function (err,collection) {
    collection.find({"Name":"Peter","LastName":"John"},{"Name":1, "LastName":1,"DateOfBirth":1,"Ethnicity":1,"Address":1, "Allergies":1, "FamilyHistory":1, "PhoneNumber":1, "Height":1, "Weight":1}).toArray(function(err, results) {
      assert.equal(err, null);
      let ret = results[0].Name + " " + results[0].LastName + "\n" + results[0].DateOfBirth + "\n" + results[0].Ethnicity + "\n" + results[0].Address+ "\n" + results[0].Allergies + "\n" + results[0].FamilyHistory + "\n" + results[0].PhoneNumber + "\n" + results[0].Height + "\n" + results[0].Weight;
      let response;
        response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "list",
            "top_element_style": "compact",
            "elements": [{
              "title": results[0].LastName + ", " + results[0].Name
              // "subtitle": "Date Of Birth: " + results[0].DateOfBirth + "\n" +
              //             "Ethnicity: " + results[0].Ethnicity + "\n" +
              //             "Address: " + results[0].Address + "\n" +
              //             "Phone Number: " + results[0].PhoneNumber + "\n" +
              //             "Height: " + results[0].Height + "\n" +
              //             "Weight:" + results[0].Weight;
            },
            {
                "title": "Allergies",
                "subtitle": results[0].Allergies
            },
            {
                "title": "Family History",
                "subtitle": results[0].FamilyHistory
            },
            {
                "title": "Past Medications",
                "subtitle": results[0].DateOfBirth
            },
            {
                "title": "Past Procedures",
                "subtitle": results[0].DateOfBirth
            }]
          }
        }
      }


      console.log("Successful Profile");
      console.log(response);
      callback(response);
    });
  });
}

function handleMessage(sender_psid, received_message) {
  let response;

  /**
   * Handle All Incoming Message Intents here, using NLP intent('nlp' key in incoming message)
   */


  // Checks if the message contains text
  if (received_message.text) {


    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
      let text = JSON.stringify(received_message.nlp);
      console.log(text);
      response = {
        "text": `You sent the message: "${received_message.text}". ` + text
      }
    //Setting up the connection to MongoDB
    var url = 'mongodb://health-hack:hackgt2017@ds061355.mlab.com:61355/heroku_sn3clbg8';
    MongoDB.connect(url, function(err,db) {
      console.log("Connected Successfully");

      //calling different handler functions
      findProfile(db,function(results){
        findPrescriptions(db,function(results){
         callSendAPI(sender_psid,{text: results});

        })
        callSendAPI(sender_psid,results);
        db.close();
      })


      //findPrescriptions(db,function(results){
          //callSendAPI(sender_psid,{text: results});
        // db.close();
        //})


    });

  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  }

  // Send the response message
  callSendAPI(sender_psid, response);
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
