const {Schema, model} = require('mongoose');

let categoriaSchema = new Schema ({
    description: {
        type: String,
        unique: true,
        required: [true, 'La descripción es requerida']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

module.exports = model('Categoria', categoriaSchema);