/**
 * ? Rutas de events
 * * [host] + /api/events
 */
const { Router } = require('express');
const { check } = require('express-validator');

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const isDate = require('../helpers/isDate');
const { validatorJWT } = require('../middlewares/JWT-validator');
const { validarCampos } = require('../middlewares/validator');

const router = Router();

//Se agrega el middleware <validatorJWT> a todas las peticiones
router.use(validatorJWT);

//get events
router.get('/', getEvents);

//create event
router.post('/', [
    check('title', 'titulo es obligatorio').notEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos
], createEvent);

//update event
router.put('/:id', [
    check('title', 'titulo es obligatorio').notEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos
], updateEvent);

//delete event
router.delete('/:id', deleteEvent);

module.exports = router