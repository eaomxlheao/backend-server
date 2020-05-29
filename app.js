//Requires
var express = require("express");
var mongoose = require("mongoose");

//Init variables
var app = express();

//DB Connection
mongoose.connection.openUri(
    "mongodb://localhost:27017/hospitalDB",
    (err, resp) => {
        if (err) {
            throw err;
        } else {
            console.log("Bases de datos online");
        }
    }
);

//Routes
app.get("/", (request, response, next) => {
    response.status(200).json({
        ok: true,
        message: "Peticion realizada correctamente",
    });
});

//listening for requestst
app.listen(3000, function() {
    console.log("Express server, puerto 3000");
});