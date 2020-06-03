var express = require("express");
var bcrypt = require("bcrypt");

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
/// Actualizar usuario
///===============================================
app.put("/:id", (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return response.status(500).json({
                ok: true,
                message: "Error al buscar usuario!",
                errors: err,
            });
        }

        if (!usuario) {
            return response.status(401).json({
                ok: true,
                message: "El usuario con el id: " + id + " no existe!",
                errors: { message: "No existe usuario con ese ID" },
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return response.status(400).json({
                    ok: true,
                    message: "Error al actualizar usuario!",
                    errors: err,
                });
            }

            usuarioGuardado.password = ":)";

            //201=>Created
            return response.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
            });
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
        password: bcrypt.hashSync(body.password, 10),
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