var express = require("express");

//Middlewares
var mdAutenticacion = require("../middlewares/autenticacion");

var app = express();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico");

//Routes

///===============================================
/// Obtener todos los usuarios
///===============================================
app.get("/todo/:buscar", (request, response, next) => {
    var busqueda = request.query.buscar;

    //Regular Expression, case insensitive
    var regex = new RegExp(busqueda, "i");

    buscarHospitales(busqueda, regex).then((hospitales) => {
        return response.status(200).json({
            ok: true,
            hospitales: hospitales,
        });
    });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex }, (err, hospitales) => {
            if (err) {
                reject("Error al buscar hospitales!", err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

module.exports = app;