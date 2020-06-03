var express = require("express");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

var app = express();

var Usuario = require("../models/usuarios");

//Routes

///===============================================
/// Obtener todos los usuarios
///===============================================
app.post("/", (request, response) => {
    var body = request.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return response.status(500).json({
                ok: true,
                message: "Error al buscar usuario!",
                errors: err,
            });
        }

        if (!usuarioBD) {
            return response.status(400).json({
                ok: true,
                message: "Credenciales incorrectas!",
                errors: err,
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return response.status(400).json({
                ok: true,
                message: "Credenciales incorrectas!",
                errors: err,
            });
        }

        //Crear token
        usuarioBD.password = ":)";
        var token = jwt.sign({ usuario: usuarioBD }, SEED, {
            expiresIn: 1800,
        }); //30 mins

        //el token se puede validar en jwt.io
        return response.status(200).json({
            ok: true,
            message: "Desde login",
            usuario: usuarioBD,
            token: token,
        });
    });
});

module.exports = app;