const express = require('express');
const Usuario = require('../models/usuario');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');

app.get("/usuario", verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let perPage = Number(req.query.limite) || 5;

    // Selecciona todos los usuarios y muestra los campos nombre y email
    Usuario.find({estado: true}, 'nombre email role estado google img')
      .skip(desde)
      .limit(perPage)
      .exec( async (err, usuarios) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        let countUsers = await Usuario.countDocuments({ estado: true });

        res.json({
          ok: true,
          countUsers,
          usuarios,
        });

      });

});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // password ni google se desean poder actualizar
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    /* o también, en vez de utilizar el _.pick, se implementar:
        delete body.password;
        delete body.google;
    */

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, usuarioDB) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            usuario: userDeleted
        });
    });

});

app.delete('/disable/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, userDisable) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDisable) {
            return res.status(400).json({
                ok: false,
                mesaage: 'User not found'
            });
        }

        res.json({
            ok: true,
            usuario: userDisable
        });
    });
});

module.exports = app;