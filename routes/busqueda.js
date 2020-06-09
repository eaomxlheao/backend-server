var express = require("express");

//Middlewares
var mdAutenticacion = require("../middlewares/autenticacion");

var app = express();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

//Routes
///===============================================
/// Busqueda por colleccion
///===============================================
app.get("/coleccion/:tabla/:buscar", (request, response) => {
    var tabla = request.params.tabla;
    var busqueda = request.params.buscar;
    var promesa;

    //Regular Expression, case insensitive
    var regex = new RegExp(busqueda, "i");
    switch (tabla) {
        case "usuarios":
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case "hospitales":
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case "medicos":
            promesa = buscarUsuarios(busqueda, regex);
            break;
        default:
            return response.status(400).json({
                ok: false,
                mensaje: "Solo se puede buscar en las colecciones usuarios, medicos y hospitales",
                error: { mensaje: "Tabla / coleccion no es valida" },
            });
    }
    promesa.then((data) => {
        return response.status(200).json({
            ok: true,
            [tabla]: data,
        });
    });
});

///===============================================
/// Busqueda General
///===============================================
app.get("/todo/:buscar", (request, response, next) => {
    var busqueda = request.query.buscar;

    //Regular Expression, case insensitive
    var regex = new RegExp(busqueda, "i");

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex),
    ]).then((respuestas) => {
        return response.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2],
        });
    });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate("usuario", "nombre email")
            .exec((err, hospitales) => {
                if (err) {
                    reject("Error al buscar hospitales!", err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate("usuario", "nombre email")
            .populate("hospital")
            .exec((err, medicos) => {
                if (err) {
                    reject("Error al buscar medicos!", err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, "nombre email role")
            .or([{ nombre: regex }, { email: regex }])
            .exec({}, (err, usuarios) => {
                if (err) {
                    reject("Error al buscar usuario!", err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}
module.exports = app;