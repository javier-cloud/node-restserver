const { Schema, model} = require('mongoose');

let productoSchema = new Schema ({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio unitario es necesario'] },
    description: { type: String },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = model('Producto', productoSchema);