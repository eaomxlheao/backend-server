var express = require("express");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

var app = express();

var Usuario = require("../models/usuario");

//Google
var CLIENT_ID = require("../config/config").CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

//Routes
///===============================================
/// Autenticacion google
///===============================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload["sub"];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        imagen: payload.picture,
        google: true,
    };
}

app.post("/google", async(request, response) => {
    var token = request.body.token;
    var googleUser = await verify(token).catch((e) => {
        return response.status(403).json({
            ok: false,
            message: "token no valido",
        });
    });

    return response.status(200).json({
        ok: true,
        message: "Peticion realizada correctamente",
        googleUser: googleUser,
    });
});

///===============================================
/// Autenticacion normal
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