var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

///===============================================
/// Verificar token
///===============================================
exports.verificaToken = function(request, response, next) {
    var token = request.headers.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return response.status(401).json({
                ok: true,
                message: "Token incorrecto!",
                errors: err,
            });
        }

        request.usuario = decoded.usuario;
        next();
    });
};