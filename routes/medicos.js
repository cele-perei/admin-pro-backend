/*
    Ruta: /api/medicos
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();

router.get( '/',
    validarJWT,
    getMedicos);

router.post('/',
    [
        validarJWT,
        check('nombre','El nombre del médico es obligatorio').not().isEmpty(),
        check('hospital','El ID del hospital es obligatorio').isMongoId(),
        validarCampos
    ],
    crearMedico);

router.put( '/:id', 
    [],
    actualizarMedico);

router.delete( '/:id', 
    borrarMedico);


module.exports = router;