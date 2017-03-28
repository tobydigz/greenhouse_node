/**
 * Created by Digz on 28/03/2017.
 */

var express = require('express');
var app = express();
const path = require('path');
var port = process.env.PORT || 8080;

var commands;
function Commands(automatic, bulb, coolingFan, exhaustFan, light, plantData, pump) {
    this.automatic = automatic;
    this.bulb = bulb;
    this.coolingFan = coolingFan;
    this.exhaustFan = exhaustFan;
    this.light = light;
    this.plantData = plantData;
    this.pump = pump;
}

app.get('/plant', function (req, res) {
    res.end(commands.plantData());
});

app.get('/auto', function (req, res) {
    res.end(commands.automatic());
});

app.get('/com', function (req, res) {
    res.end(commands);
});

var admin = require("firebase-admin");

var serviceAccount = require('./json/adminsdk');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://greenhouse-d556f.firebaseio.com"
    /*databaseAuthVariableOverride:{
     uid : "digz"
     }*/
});


var db = admin.database();
var ref = db.ref("/commands");

function readData() {
    console.log("Digz here");
    ref.on("value", function (snapshot) {
        console.log("Digz, got data");
        console.log(snapshot.val());
        commands = new Object();
        commands.automatic = snapshot.child("automatic").val();
        commands.bulb = snapshot.child("bulb").val();
        commands.coolingFan = snapshot.child("coolingFan").val();
        commands.exhaustFan = snapshot.child("exhaustFan").val();
        commands.light = snapshot.child("light").val();
        commands.plantData = snapshot.child("plantData").val();
        commands.pump = snapshot.child("pump").val();
        // commands = new Commands(automatic, bulb, coolingFan, exhaustFan, light, plantData, pump);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

app.listen(port, function () {
    readData();
});


// app.listen(port);
console.log('Server started! At http://localhost:' + port);