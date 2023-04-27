const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res = response) => {


    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    //validar el tipo
    if(!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok:false,
            msg: 'No es médico, usuario ni hospital'
        })
    }

    //validar si hay imagen
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    //procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.'); //wolverine.1.3.jpg
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    //validar extension
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if (!extensionesValidas.includes(extensionArchivo)){
        return res.status(400).json({
            ok:false,
            msg: 'No es una extensión permitida: png/jpg/jpeg/gif'
        });
    }

    //Generar nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    //Path para guardar la imagen
    const uploadPath = path.join(__dirname , '../uploads/', tipo, nombreArchivo);

    // Mover la imagen
    file.mv(uploadPath, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //Actualizar la DB
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });
}

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${tipo}/${foto}` );

    //imagen por defecto
    if (fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join( __dirname, `../uploads/noimage.jpg` );
        res.sendFile(pathImg);
    }
}

module.exports = {
    fileUpload,
    retornaImagen
}