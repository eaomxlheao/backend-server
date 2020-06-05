var express = require("express");

//Middlewares
var mdAutenticacion = require("../middlewares/autenticacion");
var app = express();

var Medico = require("../models/medico");

//Routes

///===============================================
/// Obtener todos los medicos
///===============================================
app.get("/", (request, response, next) => {
    Medico.find({})
        .populate("usuario", "nombre email")
        .populate("hospital")
        .exec((err, medicos) => {
            if (err) {
                return response.status(500).json({
                    ok: false,
                    message: "Error cargando medicos!",
                    errors: err,
                });
            }
            return response.status(200).json({
                ok: true,
                medicos: medicos,
            });
        });
});

///===============================================
/// Actualizar medico
///===============================================
app.put("/:id", mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;
    var body = request.body;
    Medico.findById(id, (err, medico) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                message: "Error al buscar medico!",
                errors: err,
            });
        }

        if (!medico) {
            return response.status(401).json({
                ok: false,
                message: "El medico con el id: " + id + " no existe!",
                errors: { message: "No existe medico con ese ID" },
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = request.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return response.status(401).json({
                    ok: false,
                    message: "Error al crear medico!",
                    errors: err,
                });
            }
            return response.status(201).json({
                ok: true,
                medico: medicoGuardado,
            });
        });
    });
});

///===============================================
/// Crear medico
///===============================================
app.post("/", mdAutenticacion.verificaToken, (request, response) => {
    var body = request.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: request.usuario._id,
        hospital: body.hospital,
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return response.status(401).json({
                ok: false,
                message: "Error al crear medico!",
                errors: err,
            });
        }
        return response.status(201).json({
            ok: true,
            medico: medicoGuardado,
        });
    });
});

///===============================================
/// Borrar medico
///===============================================
app.delete("/:id", mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;
    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                message: "Error al borrar el medico!",
                errors: err,
            });
        }
        return response.status(200).json({
            ok: ok,
            medico: medicoBorrado,
        });
    });
});

module.exports = app;