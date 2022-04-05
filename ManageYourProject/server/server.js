"use strict";

var cors = require("cors");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");


// Database
const mysql = require("mysql");
// Database connection info - used from environment variables
var dbInfo = {
	connectionLimit: 10,
	host: process.env.MYSQL_HOSTNAME,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
};

var dbInfo2 = {
	connectionLimit: 10,
	host: process.env.MYSQL_HOSTNAME2,
	user: process.env.MYSQL_USER2,
	password: process.env.MYSQL_PASSWORD2,
	database: process.env.MYSQL_DATABASE2,
};
var connection = mysql.createPool(dbInfo);
console.log("Conecting to database1");
// connection.connect(); <- connect not required in connection pool

 var connection2 = mysql.createPool(dbInfo2);
 console.log("Connecting to database2");

// SQL Database init.
// In this current demo, this is done by the "database.sql" file which is stored in the "db"-container (./db/).
// Alternative you could use the mariadb basic sample and do the following steps here:
/*
connection.query("CREATE TABLE IF NOT EXISTS table1 (task_id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)  ENGINE=INNODB;", function (error, results, fields) {
    if (error) throw error;
    console.log('Answer: ', results);
});
*/
// See readme.md for more information about that.

// Check the connection for connection
connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
	if (error) throw error; // <- this will throw the error and exit normally
	// check the solution - should be 2
	if (results[0].solution == 2) {
		// everything is fine with the database
		console.log("Database connected and works");
	} else {
		// connection is not fine - please check
		console.error("There is something wrong with your database connection! Please check");
		process.exit(5); // <- exit application with error code e.g. 5
	}
});

// Check the connection for connection2
connection2.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
	if (error) throw error; // <- this will throw the error and exit normally
	// check the solution - should be 2
	if (results[0].solution == 2) {
		// everything is fine with the database
		console.log("Database connected and works");
	} else {
		// connection is not fine - please check
		console.error("There is something wrong with your database connection! Please check");
		process.exit(5); // <- exit application with error code e.g. 5
	}
});

// Constants
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

// App
const app = express();
//session
app.use(session({
	secret: 'thisismysecretsession1223434',
	resave: true,
	saveUninitialized: true
}));
app.use(cors());
// Features for JSON Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Features for Session
// const path = require('path');
app.use(express.static(__dirname));


// Entrypoint - call it with: http://localhost:8080/ -> redirect you to http://localhost:8080/static
app.get("/", (req, res) => {
	console.log("Got a request and redirect it to the static page");
	// redirect will send the client to another path / route. In this case to the static route.
	res.redirect("/static");
});

// Another GET Path - call it with: http://localhost:8080/special_path
app.get("/special_path", (req, res) => {
	res.send("This is another path");
});

// Another GET Path that shows the actual Request (req) Headers - call it with: http://localhost:8080/request_info
app.get("/request_info", (req, res) => {
	console.log("Request content:", req);
	res.send("This is all I got from the request:" + JSON.stringify(req.headers));
});

// POST Path - call it with: POST http://localhost:8080/client_post
app.post("/client_post", (req, res) => {
	if (typeof req.body !== "undefined" && typeof req.body.post_content !== "undefined") {
		var post_content = req.body.post_content;
		console.log("Client send 'post_content' with content:", post_content);
		// Set HTTP Status -> 200 is okay -> and send message
		res.status(200).json({ message: "I got your message: " + post_content });
	} else {
		// There is no body and post_contend
		console.error("Client send no 'post_content'");
		// Set HTTP Status -> 400 is client error -> and send message
		res.status(400).json({ message: 'This function requries a body with "post_content"' });
	}
});

// ###################### BUTTON EXAMPLE ######################
// POST path for Button 1
app.post("/button1_name", (req, res) => {
	// Load the name from the formular. This is the ID of the input:
	const name = req.body.name;
	// Print it out in console:
	console.log("Client send the following name: " + name + " | Button1");
	// Send JSON message back - this could be also HTML instead.
	res.status(200).json({ message: "I got your message - Name is: " + name });
	// More information here: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms
});

// GET path for Button 2
app.get("/button2", (req, res) => {
	// This will generate a random number and send it back:
	const random_number = Math.random();
	// Print it out in console:
	console.log("Send the following random number to the client: " + random_number + " | Button2");
	// Send it to the client / webbrowser:
	res.send("Antwort: " + random_number);
	// Instead of plain TXT - the answer could be a JSON
	// More information here: https://www.w3schools.com/xml/ajax_intro.asp
});
// ###################### BUTTON EXAMPLE END ######################

//checking function if session is running
// const validateSession = (req,res,next) =>{
// 	if(!req.session.userid){
// 		res.redirect("/static/login.html");
// 		console.log("Redirected zu Login")
// 	}else{
// 		next();
// 	}
// }

//login
app.post("/login", (req, res) => {
	console.log("You are on the login Page");
	// it will be added to the database with a query.
	if (!req.body && !req.body.email && !req.body.passwort) {
		// There is nobody with correct data
		console.error("Client send no correct data!");
		// Set HTTP Status -> 400 is client error -> and send message
		res.status(400).json({
			message: "This function requries a body with all fields filled out",
		});
	}
	// Capture the input fields
	var email = req.body.email;
	var passwort = req.body.passwort;
	console.log(email, passwort);
	
	// Ensure the input fields exists and are not empty
	if (email && passwort) {
		//TODO bcryp hash
		connection.query("SELECT * FROM user WHERE email = '" + email + "'", (error, result) => {
			if (error) {
				// we got an errror - inform the client
				console.error(error); // <- log error in server
				res.status(500).json(error); // <- send to client
			}
			console.log("query wurde ausgeführt");
			if (!result.length) {
				res.send("Email oder Passwort sind falsch");
			}else{
				bcrypt.compare(passwort, result[0]["passwort"], (bErr, bResult)=>{
					if(bErr){
						throw bErr;
					}
					if(bResult){ //passwordsMatch
						console.log("Passwörter stimmen überein");
						// Authenticate the user
						req.session.userid = email;
						console.log(req.session.userid);
						//Redirect to uebersicht page
						res.redirect("/static/uebersicht.html");
					}else{
						res.send("Email oder Passwort sind falsch");
						
					}
					res.end();
				});
			}
		});  
	}else{
		res.send("Bitte geben sie ihre Email und ihr Passwort ein");
		res.end();
	}
}); 		 


// registration
app.post("/registrierung", (req, res) => {
	// it will be added to the database with a query.
	if (!req.body && !req.body.vname && !req.body.nname && !req.body.email && !req.body.passwort && !req.body.passwortWiederholen) {
		// There is nobody with correct data
		console.error("Client send no correct data!");
		// Set HTTP Status -> 400 is client error -> and send message
		res.status(400).json({
			message: "This function requries a body with all fields filled out",
		});
	}
	// The content looks good, so move on
	// Get the content to local variables:
	var nname = req.body.nname;
	var vname = req.body.vname;
	var email = req.body.email;
	var passwort = req.body.passwort;
	var passwortWiederholen = req.body.passwortWiederholen;

	//TODO Antworten an Client senden
	connection.query("SELECT * FROM user WHERE email = '" + email + "'", (error, result) => {
		if (error) {
			// we got an errror - inform the client
			console.error(error); // <- log error in server
			res.status(500).json(error); // <- send to client
		}

		if (result.length > 0) {
			//check if email already exists
			console.log("Es gibt bereits einen Nutzer mit der Email Adresse: " + email);
			// Send it to the client / webbrowser:
			var message = "Die Email Adresse ist bereits vergeben.";
			res.send(message);
		} else if (passwort.length < 8) {
			//check if password has the right length
			console.log("Das eingegebenen passswort ist nur " + passwort.length + " Zeichen lang");
			// Send it to the client / webbrowser:
			var message = "Das Passwort muss mindestens 8 Zeichen lang sein.";
			res.send(message);
		} else if (passwort !== passwortWiederholen) {
			//check if password matches with the repeated password
			console.log("Die eingegebenen Passwörter " + passwort + " und " + passwortWiederholen + " stimmen nicht überein.");
			// Send it to the client / webbrowser:
			var message = "Die Passwörter stimmen nicht überein.";
			res.send(message);
		} else {
			//hash password
			bcrypt.hash(passwort, 10, (err, hash) => {
				if (err) {
					throw err;
				}
				console.log("Your hash: ", hash);
				connection.query(
					//fill hashed password into database
					"INSERT INTO user (`nname`, `vname`, `email`, `passwort`) VALUES ('" + nname + "', '" + vname + "', '" + email + "', '" + hash + "')",
					(error, result) => {
						if (error) {
							// we got an errror - inform the client
							console.error(error); // <- log error in server
							res.status(500).json(error); // <- send to client
						}
						console.log("Das anlegen des Nutzers " + vname + " " + nname + " war erfolgreich.");
						res.redirect("/static/login.html");
					}
				);
			});
		}
	});
});
// var authenticate = function (req, res, next) {
// 	// your validation code goes here. 
// 	if (req.session.userid) {
// 	  next();
// 	  console.log("authenticate was true");
// 	}
// 	else {
// 	  res.redirect("/static/login.html");
// 	  console.log("authenticate redirected to login")
// 	}
//   }

  app.use('/abmelden', (req, res, next) =>{
	console.log("bin in app.use");
	console.log(req.session.userid);
	//add your code to run every time route is hit
	if (req.session.userid) {
		next();
		console.log("authenticate was true");
	  }
	  else {
		res.redirect("/static/login.html");
		console.log("authenticate redirected to login");
	  }
  });
  app.use('/uebersicht', (req, res, next) =>{
	console.log("bin in app.use");
	console.log(req.session.userid);
	//add your code to run every time route is hit
	if (req.session.userid) {
		next();
		console.log("authenticate was true");
	  }
	  else {
		res.redirect("/static/login.html");
		console.log("authenticate redirected to login");
	  }
  });
  //TODO testen ob login funktioniert
//   app.use('/meineEvents', (req, res, next) =>{
// 	console.log("bin in app.use");
// 	console.log(req.session.userid);
// 	//add your code to run every time route is hit
// 	if (req.session.userid) {
// 		next();
// 		console.log("authenticate was true");
// 	  }
// 	  else {
// 		res.redirect("/static/login.html");
// 		console.log("authenticate redirected to login");
// 	  }
//   });
//   app.use('/eventErstellen', (req, res, next) =>{
// 	console.log("bin in app.use");
// 	console.log(req.session.userid);
// 	//add your code to run every time route is hit
// 	if (req.session.userid) {
// 		next();
// 		console.log("authenticate was true");
// 	  }
// 	  else {
// 		res.redirect("/static/login.html");
// 		console.log("authenticate redirected to login");
// 	  }
//   });
//logout
app.get("/abmelden", (req, res, next) => {
		
		// end session and redirect to /static
		req.session.destroy();
		console.log("session got destroyed");
		res.redirect('/static'); 
	 
  })

// POST path for database
app.post("/eventErstellen", (req, res) => {
	console.log(req.session.userid);
	if (req.session.userid) {
		// Output username
		console.log("wir sind in der Session");
	} else {
		// Not logged in
		res.send('Please login to view this page!');
	}
	res.end();
	// it will be added to the database with a query.
	if (!req.body && !req.body.titel && !req.body.beschreibung && !req.body.uhrzeit && !req.body.datum && !req.body.teilnehmerAnzahl && !req.body.userid) {
		// There is nobody with correct data
		console.error("Client send no correct data!");
		// Set HTTP Status -> 400 is client error -> and send message
		res.status(400).json({
			message: "This function requries a body with all fields filled out",
		});
	}
	// The content looks good, so move on
	// Get the content to local variables:
	var titel = req.body.titel;
	var beschreibung = req.body.beschreibung;
	var datum = req.body.datum;
	var uhrzeit = req.body.uhrzeit;
	var teilnehmerAnzahl = req.body.teilnehmerAnzahl;
	var userid = req.body.userid;
	connection.query(
		"INSERT INTO event (`titel`, `beschreibung`, `adminid`, `geplantes_datum`, `geplante_uhrzeit`, `teilnehmer_anzahl`) VALUES ('" +
			titel +
			"', '" +
			beschreibung +
			"', '" +
			userid +
			"', '" +
			datum +
			"', '" +
			uhrzeit +
			"', " +
			teilnehmerAnzahl +
			")",
		(error, result) => {
			if (error) {
				// we got an errror - inform the client
				console.error(error); // <- log error in server
				res.status(500).json(error); // <- send to client
			}
			console.log("Event mit der ID: " + result.insertId + " wurde erfolgreich von user " + userid + "erstellt.");
			zusagen(userid, result.insertId, "Eventersteller", 1, () => res.status(200).send());
		}
	);
});

//GET path for for open events where you can still participate
app.get("/offeneEvents/:userId", (req, res) => {
	connection.query(
		"SELECT * FROM event WHERE event.teilnehmer_anzahl > (SELECT COUNT(*) FROM eventzusage WHERE eventzusage.eventid = event.eventid AND eventzusage.zusage = 1)",
		(eventError, events) => {
			if (eventError) {
				// we got an errror - inform the client
				console.error(eventError); // <- log error in server
				res.status(500).json(eventError); // <- send to client
			}
			connection.query("SELECT * FROM eventzusage WHERE userid=" + req.params.userId, async (zusagenError, zusagen) => {
				if (zusagenError) {
					// we got an errror - inform the client
					console.error(zusagenError); // <- log error in server
					res.status(500).json(zusagenError); // <- send to client
				}

				for (let i = 0; i < events.length; i++) {
					for (let j = 0; j < zusagen.length; j++) {
						if (events[i].eventid == zusagen[j].eventid) {
							events.splice(i, 1); // delete element on position i (Event has already been accepted/cancelled by user)
							i--;
							break;
						}
					}
				}
				/*for (let i = 0; i < events.length; i++) {
				connection.query("SELECT COUNT(*) as teilnehmerAnzahl FROM eventzusage WHERE eventzusage.eventid = " + events[i].eventid, (zusagenAnzahlError, zusagenAnzahl) => {
					if (zusagenAnzahlError) {
						// we got an errror - inform the client
						console.error(zusagenAnzahlError); // <- log error in server
						res.status(500).json(zusagenAnzahlError); // <- send to client
					}
					if (zusagenAnzahl[0].teilnehmerAnzahl >= events[i]["teilnehmer_anzahl"]) {
						events.splice(i, 1); // delete element on position i (Event already has maximum number of participants)
						i--;
					}
				});
				await sleep(100);
			}*/
				console.log("Events for user: " + req.params.userId + " has been successfully loaded and will be returned.");
				// Everything is fine with the query
				res.status(200).json(events); // <- send it to client
			});
		}
	);
});

//function assigns the correct id/user to the event acceptance
function zusagen(userid, eventid, kommentar, zusage, callback) {
	connection.query("INSERT INTO eventzusage (`userid`, `eventid`, `kommentar`, `zusage`) VALUES (" + userid + ", " + eventid + ", '" + kommentar + "', " + zusage + ")", (ezError, ezResult) => {
		if (ezError) {
			// we got an errror - inform the client
			console.error(ezError); // <- log error in server
			res.status(500).json(ezError); // <- send to client
		}
		console.log("Eventzusage mit der ID: " + ezResult.insertId + " wurde erfolgreich von user " + userid + "erstellt.");
		callback();
	});
}

//POST path for an event acceptance
app.post("/eventzusage/", (req, res) => {
	if (!req.body && req.body.userid && req.body.eventid && req.body.kommentar && req.body.zusage) {
		console.error("Client send no correct data!");
		// Set HTTP Status -> 400 is client error -> and send message
		res.status(400).json({
			message: "Invalid data passed to server. Eventzusage could not be created.",
		});
	}
	//use the function zusagen from above
	zusagen(req.body.userid, req.body.eventid, req.body.kommentar, req.body.zusage, () => res.status(200).send());
});

//GET path for accepted events
app.get("/zugesagteEvents/:userId", (req, res) => {
	connection.query("SELECT * FROM event join eventzusage on event.eventid = eventzusage.eventid where eventzusage.userid = " + req.params.userId, (eventError, events) => {
		if (eventError) {
			// we got an errror - inform the client
			console.error(eventError); // <- log error in server
			res.status(500).json(eventError); // <- send to client
		}
		for (let i = 0; i < events.length; i++) {
			if (events[i].adminid == req.params.userId) {
				events.splice(i, 1); // delete events that you have created yourself, because here you are automatically a participant
				i--;
			}
		}
		console.log(events);
		// Everything is fine with the query
		res.status(200).json(events); // <- send it to client    }
	});
});

//GET path for Events created by yourself
app.get("/selbstErstellteEvents/:userId", (req, res) => {
	connection.query("SELECT * FROM event where event.adminid = " + req.params.userId, (eventError, events) => {
		if (eventError) {
			// we got an errror - inform the client
			console.error(eventError); // <- log error in server
			res.status(500).json(eventError); // <- send to client
		}
		res.status(200).json(events); // <- send it to client    }
	});
});

// ###################### DATABASE PART ######################
// GET path for database
app.get("/database", (req, res) => {
	console.log("Request to load all entries from table1");
	// Prepare the get query
	connection.query("SELECT * FROM `table1`;", function (error, results, fields) {
		if (error) {
			// we got an errror - inform the client
			console.error(error); // <- log error in server
			res.status(500).json(error); // <- send to client
		} else {
			// we got no error - send it to the client
			console.log("Success answer from DB: ", results); // <- log results in console
			// INFO: Here could be some code to modify the result
			res.status(200).json(results); // <- send it to client
		}
	});
});

// DELETE path for database
app.delete("/database/:id", (req, res) => {
	// This path will delete an entry. For example the path would look like DELETE '/database/5' -> This will delete number 5
	let id = req.params.id; // <- load the ID from the path
	console.log("Request to delete Item: " + id); // <- log for debugging

	// Actual executing the query to delete it from the server
	// Please keep in mind to secure this for SQL injection!
	connection.query("DELETE FROM `table1` WHERE `table1`.`task_id` = " + id + ";", function (error, results, fields) {
		if (error) {
			// we got an errror - inform the client
			console.error(error); // <- log error in server
			res.status(500).json(error); // <- send to client
		} else {
			// Everything is fine with the query
			console.log("Success answer: ", results); // <- log results in console
			// INFO: Here can be some checks of modification of the result
			res.status(200).json(results); // <- send it to client
		}
	});
});

// POST path for database
app.post("/database", (req, res) => {
	// This will add a new row. So we're getting a JSON from the webbrowser which needs to be checked for correctness and later
	// it will be added to the database with a query.
	if (typeof req.body !== "undefined" && typeof req.body.title !== "undefined" && typeof req.body.description !== "undefined") {
		// The content looks good, so move on
		// Get the content to local variables:
		var title = req.body.title;
		var description = req.body.description;
		console.log("Client send database insert request with 'title': " + title + " ; description: " + description); // <- log to server
		// Actual executing the query. Please keep in mind that this is for learning and education.
		// In real production environment, this has to be secure for SQL injection!
		connection.query(
			"INSERT INTO `table1` (`task_id`, `title`, `description`, `created_at`) VALUES (NULL, '" + title + "', '" + description + "', current_timestamp());",
			function (error, results, fields) {
				if (error) {
					// we got an errror - inform the client
					console.error(error); // <- log error in server
					res.status(500).json(error); // <- send to client
				} else {
					// Everything is fine with the query
					console.log("Success answer: ", results); // <- log results in console
					// INFO: Here can be some checks of modification of the result
					res.status(200).json(results); // <- send it to client
				}
			}
		);
	} else {
		// There is nobody with a title nor description
		console.error("Client send no correct data!");
		// Set HTTP Status -> 400 is client error -> and send message
		res.status(400).json({ message: 'This function requries a body with "title" and "description' });
	}
});
// ###################### DATABASE PART END ######################

// All requests to /static/... will be redirected to static files in the folder "public"
// call it with: http://localhost:8080/static
app.use("/static", express.static("public", { index: "startseite.html" }));



 
  

app.use(session())
// Start the actual server
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

// Start database connection
const sleep = (milliseconds) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
