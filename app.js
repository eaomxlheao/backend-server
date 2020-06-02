//Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Init variables
var app = express();

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Importing routes
var appRoutes = require("./routes/app");
var usuarioRoutes = require("./routes/usuario");

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
app.use("/", appRoutes);
app.use("/usuario", usuarioRoutes);

//listening for requestst
app.listen(3000, function() {
    console.log("Express server, puerto 3000");
});