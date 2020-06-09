var express = require("express");

var app = express();

const path = require("path");
const fs = require("fs");

//Routes
app.get("/:tipo/:imagen", (request, response, next) => {
    var tipo = request.params.tipo;
    var imagen = request.params.imagen;
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${imagen}`);

    if (fs.existsSync(pathImagen)) {
        response.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, "../assets/no-image.jpeg");
        response.sendFile(pathNoImage);
    }
});

module.exports = app;