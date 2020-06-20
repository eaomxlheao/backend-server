var express = require("express");

//Middlewares
var mdAutenticacion = require("../middlewares/autenticacion");
var app = express();

var Hospital = require("../models/hospital");

//Routes

///===============================================
/// Obtener todos los hospitales
///===============================================
app.get("/", (request, response, next) => {
    var desde = request.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate("usuario", "nombre email imagen")
        .exec((err, hospitales) => {
            if (err) {
                return response.status(500).json({
                    ok: false,
                    message: "Error cargando hospitales!",
                    errors: err,
                });
            }

            Hospital.count({}, (err, conteo) => {
                return response.status(200).json({
                    ok: true,
                    total: conteo,
                    hospitales: hospitales,
                });
            });
        });
});

///===============================================
/// Actualizar hospital
///===============================================
app.put("/:id", mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;
    var body = request.body;
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                message: "Error al buscar hospital!",
                errors: err,
            });
        }

        if (!hospital) {
            return response.status(401).json({
                ok: false,
                message: "El hospital con el id: " + id + " no existe!",
                errors: { message: "No existe hospital con ese ID" },
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = request.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return response.status(401).json({
                    ok: false,
                    message: "Error al actualizar hospital!",
                    errors: err,
                });
            }
            return response.status(201).json({
                ok: true,
                hospital: hospitalGuardado,
            });
        });
    });
});

///===============================================
/// Crear hospital
///===============================================
app.post("/", mdAutenticacion.verificaToken, (request, response) => {
    var body = request.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: request.usuario._id,
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return response.status(401).json({
                ok: false,
                message: "Error al crear hospital!",
                errors: err,
            });
        }
        return response.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
        });
    });
});

///===============================================
/// Borrar hospital
///===============================================
app.delete("/:id", mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;
    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                message: "Error al borrar el hospital!",
                errors: err,
            });
        }
        return response.status(200).json({
            ok: true,
            hospital: hospitalBorrado,
        });
    });
});

///===============================================
/// Obetener hospital por Id
///===============================================
app.get("/:id", (request, response) => {
    let id = request.params.id;
    Hospital.findById(id)
        .populate("usuario", "nombre imagen email")
        .exec((err, hospitalDB) => {
            if (err) {
                return response.status(500).json({
                    ok: false,
                    message: "Error al obtenel el hospital!",
                    errres: err,
                });
            }

            if (!hospitalDB) {
                return response.status(401).json({
                    ok: false,
                    message: "No existe hospital con ese ID!",
                    errors: { message: "No existe usuario con ese ID" },
                });
            }

            return response.status(401).json({
                ok: false,
                hospital: hospitalDB,
            });
        });
});

module.exports = app;