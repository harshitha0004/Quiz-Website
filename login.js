const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();
const app = express();
const path = require('path');

app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'registrationform',
});

connection.connect(function(err) {
    if (err) throw err;
    else console.log("Connected to database Successfully!");
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", encoder, function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    connection.query("SELECT * FROM users WHERE username = ?", [username], function(error, results, fields) {
        if (error) {
            console.error(error);
            res.redirect("/?loginError=true"); // Redirect with login error query parameter
            return;
        }

        if (results.length === 0 || results[0].password !== password) {
            res.redirect("/?loginError=true"); // Redirect with login error query parameter
            return;
        }
        res.redirect("/home.html");
    });
});
app.post("/register", encoder, function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;

    if (password !== cpassword) {
        res.status(400).send("Passwords do not match");
        return;
    }
    connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, password], function(error, results, fields) {
        if (error) {
            console.error("Error inserting user:", error);
            res.status(500).send("Internal Server Error");
            return;
        }
        console.log("User registered successfully!");
        res.redirect("/index.html"); 
    });
});

app.get("/home.html", function(req, res) {
    res.sendFile(__dirname + "/home.html");
});

app.get("/index.html", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/signup.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.listen(3500);
