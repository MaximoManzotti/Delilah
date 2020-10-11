const JWT = require('jsonwebtoken')

module.exports = (req, res, next) =>{
    try {
        let token = req.cookies["token"];

        if (!token) {
            return res.status(401).send("Tenes que iniciar sesion para acceder a este contenido");
        }
        let verificarToken = JWT.verify(token, process.env.SECRET);

        if (verificarToken) {
            req.usuario = verificarToken;
            next();
        }
    } catch (error) {
        res.status(400).send("Error al validar usuario" + error);
    } 
}

