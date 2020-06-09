var express = require("express");
var fileUpload = require("express-fileupload");

//File System
var fs = require("fs");

var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");

var app = express();

// default options
app.use(fileUpload());

//Routes
app.put("/:tipo/:id", (request, response, next) => {
    var tipo = request.params.tipo;
    var id = request.params.id;

    //Validacion del tipo
    var tiposValidos = ["hospitales", "medicos", "usuarios"];

    if (tiposValidos.indexOf(tipo) < 0) {
        return response.status(400).json({
            ok: false,
            message: "El tipo no es valido!",
            errors: {
                message: "Los tipos validos son: " + tiposValidos.join(", "),
            },
        });
    }

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            message: "No selecciono nada!",
            errors: { message: "Debe seleccionar una imagen!" },
        });
    }

    //Obetener nombre de la imagen
    var archivo = request.files.imagen;
    var nombrecortado = archivo.name.split(".");
    var extensionArchivo = nombrecortado[nombrecortado.length - 1];

    //Extensiones aceptadas
    var extensionesValidas = ["png", "jpg", "gif", "jpeg"];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return response.status(400).json({
            ok: false,
            message: "Extension no valida!",
            errors: {
                message: "Las extensiones validas son: " + extensionesValidas.join(", "),
            },
        });
    }

    //Nombre de archivo personalizado
    //id-random.extension
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover archivo al path en el server
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (err) => {
        if (err) {
            response.status(500).json({
                ok: false,
                message: "Error al mover el archivo",
                errors: err,
            });
        }
    });

    subirPorTipo(tipo, id, nombreArchivo, response);
});

function subirPorTipo(tipo, id, nombreArchivo, response) {
    if (tipo === "usuarios") {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return response.status(400).json({
                    ok: false,
                    message: "No existe usuario con ese ID!",
                    errors: err,
                });
            }

            var pathViejo = "./uploads/usuarios/" + usuario.imagen;
            if (fs.existsSync(pathViejo)) {
                //Eliminar imagen anterior
                fs.unlink(pathViejo, () => {});
            }
            usuario.imagen = nombreArchivo;

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return response.status(400).json({
                        ok: true,
                        message: "Error al gusradar imagen de usuario!",
                        errors: err,
                    });
                }

                usuarioGuardado.password = ":)";

                return response.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado,
                });
            });
        });
    }

    if (tipo === "medicos") {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return response.status(400).json({
                    ok: false,
                    message: "No existe medico con ese ID!",
                    errors: err,
                });
            }
            var pathViejo = "./uploads/medicos/" + medico.imagen;
            if (fs.existsSync(pathViejo)) {
                //Eliminar imagen anterior
                fs.unlink(pathViejo, () => {});
            }
            medico.imagen = nombreArchivo;

            medico.save((err, medicoGuardado) => {
                if (err) {
                    return response.status(400).json({
                        ok: true,
                        message: "Error al gusradar imagen de medico!",
                        errors: err,
                    });
                }

                return response.status(200).json({
                    ok: true,
                    medico: medicoGuardado,
                });
            });
        });
    }

    if (tipo === "hospitales") {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return response.status(400).json({
                    ok: false,
                    message: "No existe hospital con ese ID!",
                    errors: err,
                });
            }
            var pathViejo = "./uploads/hospitales/" + hospital.imagen;
            if (fs.existsSync(pathViejo)) {
                //Eliminar imagen anterior
                fs.unlink(pathViejo, () => {});
            }
            hospital.imagen = nombreArchivo;

            hospital.save((err, hospitalGuardado) => {
                if (err) {
                    return response.status(400).json({
                        ok: true,
                        message: "Error al gusradar imagen de hospital!",
                        errors: err,
                    });
                }

                return response.status(200).json({
                    ok: true,
                    hospital: hospitalGuardado,
                });
            });
        });
    }
}

module.exports = app;