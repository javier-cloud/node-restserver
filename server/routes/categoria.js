const express = require("express");
const Categoria = require("../models/categoria");
const { verificaToken, verificaAdmin_Role } = require("../middlewares/authentication");

let app = express();

//======================================
// Mostrar todas las categorias
//======================================
app.get("/categoria", verificaToken, (req, res) => {

  Categoria.find({})
    .sort('description')
    .populate('usuario', 'nombre email')
    .exec( (err, categoriaDB) => {

        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
    
        if ( !categoriaDB ) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No existe categorias en la base de datos'  
                }
            });
        }
        
    
        res.json({
            ok: true,
            categorias: categoriaDB,
        });
    });
});

//======================================
// Mostrar una categoria por ID
//======================================
app.get("/categoria/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
       
        if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es válido'               
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//======================================
// Crear nueva categoria
//======================================
app.post("/categoria", verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria ({
        description: body.description,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) => {
        
        if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
              ok: false,
              err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//======================================
// Actualizar categoria
//======================================
app.put("/categoria/:id", verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
              ok: false,
              err: {
                  message: 'El id no existe'
              }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//======================================
// Eliminar categoria
//======================================
app.delete("/categoria/:id", [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        
        if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
              ok: false,
              err:{
                  message: 'El id no existe'
              }
            });
        }

        return res.json({
            ok: true,
            message: 'Categoria Elminada'
        });
    });
});

module.exports = app;
