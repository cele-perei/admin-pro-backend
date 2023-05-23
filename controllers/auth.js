const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        //Verificar email

        const usuarioDB = await Usuario.findOne({email});
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(404).json({
                ok: false,
                msg: 'La contraseña no es válida'
            });
        }

        //Generar el token
        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        });
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {
        const {email, name, picture} = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne( {email} );
        let usuario;

        if (!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        //guardar usuario
        await usuario.save();

        //Generar el token
        const token = await generarJWT(usuario.id);        


        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd( usuario.role )
        });
        
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        });
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    //Generar el token
    const token = await generarJWT( uid);

    //obtener el usuario por id

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd( usuario.role )
    });


}

module.exports = {
    login,
    googleSignIn,
    renewToken
}