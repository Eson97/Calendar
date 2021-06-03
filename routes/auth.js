/**
 * ? Rutas de usuarios / auth
 * * [host] + /api/auth
 */
const { Router } = require('express');
const { check } = require('express-validator');

const { crearUsuario, loginUsuario, renovarToken } = require('../controllers/auth');
const { validatorJWT } = require('../middlewares/JWT-validator');
const { validarCampos } = require('../middlewares/validator');

const router = Router();

router.post('/register', [
    //? - middlewares
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 }),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], crearUsuario);

router.post('/', [
    check('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 }),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], loginUsuario);

router.get('/renew', validatorJWT, renovarToken);

module.exports = router;