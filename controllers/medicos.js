const { response } = require('express');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getMedicos = async (req, res = response) => {
    const medicos = await Medico.find()
                                    .populate('usuario','nombre')
                                    .populate('hospital','nombre');

    res.json({
        ok: true,
        medicos
    });
}


const getMedicoById = async (req, res = response) => {

    const id = req.params.id;
    try {

    const medico = await Medico.findById(id)
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img');

    res.json({
        ok: true,
        medico
    });
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        });
        
    }

    
}

const crearMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medicoDB
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const actualizarMedico = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    const idHospital = req.body.hospital;

    try {
        const medicoDB = await Medico.findById( id );

        if (!medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por ID'
            });
        }

        const hospitalDB = await Hospital.findById( idHospital );

        if (!hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por ID'
            });
        }

        cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, {new: true} );


        res.json({
            ok: true,
            medico: medicoActualizado
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarMedico = async(req, res = response) => {
    const id = req.params.id;
    
    try {
        const medicoDB = await Medico.findById( id );

        if (!medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por ID'
            });
        }

        await Medico.findByIdAndDelete( id );


        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}