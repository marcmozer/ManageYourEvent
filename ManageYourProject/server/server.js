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

var connection = mysql.createPool(dbInfo);
console.log("Conecting to database1");

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

// Constants
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

// App
const app = express();
//session
app.use(
	session({
		secret: "thisismysecretsession1223434",
		resave: true,
		saveUninitialized: true,
	})
);
app.use(cors());
// Features for JSON Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Entrypoint - call it with: http://localhost:8080/ -> redirect you to http://localhost:8080/static
app.get("/", (req, res) => {
	console.log("Got a request and redirect it to the static page");
	// redirect will send the client to another path / route. In this case to the static route.
	res.redirect("/static");
});

//###################### Login PART ######################
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
		connection.query("SELECT * FROM user WHERE email = '" + email + "'", (error, result) => {
			if (error) {
				// we got an errror - inform the client
				console.error(error); // <- log error in server
				res.status(500).json(error); // <- send to client
			}
			console.log("query wurde ausgeführt");
			if (!result.length) {
				res.send("Email oder Passwort sind falsch");
			} else {
				//compares input password with password in db
				bcrypt.compare(passwort, result[0]["passwort"], (bErr, bResult) => {
					if (bErr) {
						throw bErr;
					}
					if (bResult) {
						//passwordsMatch
						console.log("Passwörter stimmen überein");
						// Authenticate the user
						req.session.userid = result[0]["userid"];
						console.log(req.session.userid);
						//Redirect to uebersicht page
						res.redirect("/private/uebersicht.html");
					} else {
						res.send("Email oder Passwort sind falsch");
					}
					res.end();
				});
			}
		});
	} else {
		res.send("Bitte geben sie ihre Email und ihr Passwort ein");
		res.end();
	}
});

// checks for private pages if session is started and user logged in
app.use("/private/*", (req, res, next) => {
	console.log("bin in app.use");
	console.log(req.session.userid);
	//add your code to run every time route is hit
	if (req.session.userid) {
		console.log("authenticate was true");
		app.use(express.static("private/"));
	} else {
		//app.use(express.static('pubilc/login'));
		res.redirect("/static/login.html");
		console.log("authenticate redirected to login");
	}
	next();
});
// ###################### Login PART END ######################

// ###################### Registration PART ######################
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

	//sends answers to client
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
// ###################### Registration PART END ######################

// ###################### Logout PART ######################
app.post("/abmelden", (req, res) => {
	// end session and redirect to /static
	req.session.destroy();
	console.log("session got destroyed");
	res.redirect("/static");
});
// ###################### Logout PART END ######################

// ###################### EventErstellen PART ######################
// POST path for database
app.post("/eventErstellen", (req, res) => {
	console.log(req.session.userid);
	if (req.session.userid) {
		// Output username
		console.log("wir sind in der Session");
	} else {
		// Not logged in
		res.send("Please login to view this page!");
	}
	res.end();
	// it will be added to the database with a query.
	if (!req.body && !req.body.titel && !req.body.beschreibung && !req.body.uhrzeit && !req.body.datum && !req.body.teilnehmerAnzahl) {
		// There is nobody with correct data
		console.error("Client send no correct data!");
		// Set HTTP Status -> 400 is client error -> and send message
		res.status(400).json({
			message: "This function requries a body with all fields filled out",
		});
	}
	// The content looks good, so move on
	// Get the content to local variables:
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
			console.log("Event mit der ID: " + result.insertId + " wurde erfolgreich von user " + userid + " erstellt.");
			zusagen(userid, result.insertId, "Eventersteller", 1, () => res.status(200).send());
		}
	);
});
// ###################### EventErstellen PART END ######################

// ###################### Übersicht-Offene Events PART ######################
//GET path for for open events where you can still participate
app.get("/offeneEvents", (req, res) => {
	console.log(req.session);
	connection.query(
		"SELECT * FROM event WHERE event.teilnehmer_anzahl > (SELECT COUNT(*) FROM eventzusage WHERE eventzusage.eventid = event.eventid AND eventzusage.zusage = 1)",
		(eventError, events) => {
			if (eventError) {
				// we got an errror - inform the client
				console.error(eventError); // <- log error in server
				res.status(500).json(eventError); // <- send to client
			}
			connection.query("SELECT * FROM eventzusage WHERE userid=" + req.session.userid, async (zusagenError, zusagen) => {
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
				console.log("Events for user: " + req.session.userid + " has been successfully loaded and will be returned.");
				// Everything is fine with the query
				res.status(200).json(events); // <- send it to client
			});
		}
	);
});
// ###################### Übersicht-Offene Events PART END ######################

// ###################### Übersicht-Event zusagen PART ######################
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
	if (!req.body && req.body.eventid && req.body.kommentar && req.body.zusage) {
		console.error("Client send no correct data!");
		// Set HTTP Status -> 400 is client error -> and send message
		res.status(400).json({
			message: "Invalid data passed to server. Eventzusage could not be created.",
		});
	}
	//use the function zusagen from above
	zusagen(req.session.userid, req.body.eventid, req.body.kommentar, req.body.zusage, () => res.status(200).send());
});
// ###################### Übersicht-Event zusagen PART END ######################

// ###################### MeineEvents PART ######################
//GET path for accepted events
app.get("/zugesagteEvents", (req, res) => {
	connection.query("SELECT * FROM event join eventzusage on event.eventid = eventzusage.eventid where eventzusage.userid = " + req.session.userid, (eventError, events) => {
		if (eventError) {
			// we got an errror - inform the client
			console.error(eventError); // <- log error in server
			res.status(500).json(eventError); // <- send to client
		}
		for (let i = 0; i < events.length; i++) {
			if (events[i].adminid == req.session.userid) {
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
app.get("/selbstErstellteEvents", (req, res) => {
	connection.query("SELECT * FROM event where event.adminid = " + req.session.userid, (eventError, events) => {
		if (eventError) {
			// we got an errror - inform the client
			console.error(eventError); // <- log error in server
			res.status(500).json(eventError); // <- send to client
		}
		res.status(200).json(events); // <- send it to client    }
	});
});
// ###################### MeineEvents PART END ######################

// All requests to /static/... will be redirected to static files in the folder "public"
// call it with: http://localhost:8080/static
app.use("/static", express.static("public", { index: "startseite.html" }));

app.use("/private", express.static("private"));

// add public files. List all "private" paths (file)
// app.use(secureStatic(['uebersicht.html']));

app.use(session());
// Start the actual server
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
