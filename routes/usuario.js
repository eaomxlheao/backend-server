var express = require("express");

var app = express();

var Usuario = require("../models/usuarios");

//Routes

///===============================================
/// Obtener todos los usuarios
///===============================================
app.get("/", (request, response, next) => {
    Usuario.find({}, "nombre email imagen role").exec((err, usuarios) => {
        if (err) {
            return response.status(500).json({
                ok: true,
                message: "Error cargando usuarios!",
                errors: err,
            });
        }
        return response.status(200).json({
            ok: true,
            usuarios: usuarios,
        });
    });
});

///===============================================
/// Crear usuario
///===============================================
app.post("/", (request, response) => {
    var body = request.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        imagen: body.imagen,
        role: body.role,
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return response.status(400).json({
                ok: true,
                message: "Error al crear usuario!",
                errors: err,
            });
        }

        //201=>Created
        return response.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
        });
    });
});

module.exports = app;