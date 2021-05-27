const express = require("express");
const fileUpload = require("express-fileupload");
const Usuario = require("../models/usuario");
const Producto = require('../models/producto');

const fs = require("fs");
const path = require("path");

const app = express();

app.use(fileUpload());

app.put("/upload/:tipo/:id", function (req, res) {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: "No se ha seleccionado ningún archivo",
    });
  }

  // Validar tipo
  let tiposValidos = ["productos", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Los tipos permitidos son: ${tiposValidos.join(", ")}`,
      },
    });
  }

  // En el front, el campo del nombre del input
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split(".");
  let extension = nombreCortado[nombreCortado.length - 1];

  // Extensiones permitidas
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      ext: extension,
      err: {
        message:
          "Las extensiones permitidas son: " + extensionesValidas.join(", "),
      },
    });
  }

  // Cambiar nombre del archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if ( tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }
    
  });
});

//=============================================================================

//=============================================================================

function imagenUsuario(id, res, nombreArchivo) {

  Usuario.findById(id, (err, usuarioDB) => {

    if (err) {

      // Elimina archivo recién creado
      eliminaArchivo (nombreArchivo, 'usuarios');

      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      eliminaArchivo (nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no existe",
        },
      });
    }

    // Elimina archivo viejo
    eliminaArchivo (usuarioDB.img, "usuarios");
    // Asigna el nombre del nuevo archivo a la propiedad img del usuario
    usuarioDB.img = nombreArchivo;

    usuarioDB.save( (err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: usuarioDB.img,
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo) {

  Producto.findById(id, (err, productoDB) => {

    if (err) {
      eliminaArchivo (nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      eliminaArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          message: "El producto no existe",
        },
      });
    }

    eliminaArchivo(productoDB.img, 'productos');
    productoDB.img = nombreArchivo;

    productoDB.save( (err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: productoGuardado.img
      });
    });
  });

}

function eliminaArchivo (nombreImagen, tipo) {
  let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

  if ( fs.existsSync( pathImagen ) ) {
    fs.unlinkSync( pathImagen );
  }
}

module.exports = app;
