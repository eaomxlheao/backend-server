//Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Init variables
var app = express();

//Enable Cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Token"
    );
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELTE, OPTIONS");
    next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Importing routes
var appRoutes = require("./routes/app");
var usuarioRoutes = require("./routes/usuario");
var loginRoutes = require("./routes/login");
var hospitalRoutes = require("./routes/hospital");
var medicoRoutes = require("./routes/medico");
var busquedaRoutes = require("./routes/busqueda");
var uploadRoutes = require("./routes/upload");
var imagenRoutes = require("./routes/imagen");

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

//Esto es por si se quiere ver el folder uploads por una peticion get
//Server Index Configuracion
//var serveIndex = require("serve-index");
//app.use(express.static(__dirname + "/"));
//app.use("/uploads", serveIndex(__dirname + "/uploads"));

//Routes
app.use("/", appRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/login", loginRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/medico", medicoRoutes);
app.use("/busqueda", busquedaRoutes);
app.use("/upload", uploadRoutes);
app.use("/imagen", imagenRoutes);

//listening for requestst
app.listen(3000, function() {
    console.log("Express server, puerto 3000");
});