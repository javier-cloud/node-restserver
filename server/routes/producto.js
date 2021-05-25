const express = require('express');
const { verificaToken } =require('../middlewares/authentication');
const Producto = require('../models/producto');

let app = express();

//====================================
// Obtener Productos
//====================================
app.get('/productos', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'description')
        .exec( (err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if ( !productos ) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'No existe productos en la base de datos'
                    }
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

//====================================
// Obtener un producto por ID
//====================================
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'description')
        .exec( (err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if ( !producto ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe en la ase de datos'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });
        });
});

//====================================
// Buscar Productos
//====================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    
    Producto.find({nombre: regex})
        .populate('categoria', 'description')
        .exec( (err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});



//====================================
// Crear un nuevo producto
//====================================
app.post('/productos', verificaToken, async (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        description: body.description,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productos
        });
    });
});

//====================================
// Actualizar un producto
//====================================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'description')
        .exec( (err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if ( !productos ) {
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'ID no existe en la base de datos'
                    }
                });
            }

            res.status(201).json({
                ok: true,
                producto: productos
            });
        });
});


//====================================
// Eliminar un producto ==> sólo pasar valor disponible a falso
//====================================
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'ID no existe en la base de datos'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save( (err, productoEliminado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                message: 'Producto Eliminado',
                producto: productoEliminado
            });
        });
    });
});


module.exports = app;