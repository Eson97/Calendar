const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            });
        }

        // - Guardamos el usuario en la DB
        usuario = new Usuario(req.body);

        // - Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // - Agregamos ususario a la DB
        await usuario.save();

        // - Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacte a un administrador'
        });
    }
}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese email'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        const token = await generarJWT(usuario.id, usuario.name);

        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacte a un administrador'
        });
    }
}

const renovarToken = async(req, res = response) => {

    const { uid, name } = req;

    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renovarToken
}