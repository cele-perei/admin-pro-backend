const { response } = require('express');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital')
const Medico = require('../models/medico')


const getTodo = async (req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );


    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex })
    ]);

    try {
        res.json({
            ok: true,
            usuarios,
            medicos,
            hospitales
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...revisar logs.'
        });
    }
}

const getDocumentosColeccion = async (req, res = response) => {

    const busqueda = req.params.busqueda;
    const tabla = req.params.tabla;
    const regex = new RegExp( busqueda, 'i' );
    let data = []; 
    
    try {
        switch (tabla) {
            case 'medicos':
                data = await Medico.find({ nombre: regex })
                                    .populate('usuario','nombre  img')
                                    .populate('hospital','nombre  img');
            break;
    
            case 'hospitales':
                data = await Hospital.find({ nombre: regex })
                                    .populate('usuario','nombre  img');
    
            break;
    
            case 'usuarios':
                data = await Usuario.find({ nombre: regex })
            break;
        
            default:
                return res.status(400).json({
                    ok:false,
                    msg: 'La tabla debe ser usuarios/medicos/hospitales'
                });
        }
        res.json({
            ok: true,
            resultados: data
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...revisar logs.'
        });
    }
}

module.exports = {
    getTodo,
    getDocumentosColeccion 
}