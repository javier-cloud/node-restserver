const uniqueValidator = require('mongoose-unique-validator');
const {Schema, model} = require('mongoose');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role válido'
};

let usuarioSchema = new Schema ({
    nombre: {
        type: String,
        // Es requerido (true), de faltar esta info, returnará un error con 'El nombre es necesario"
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,

        // Si el usuario no se crea con la propiedad de google, siempre será un unsuario normal y esa propiedad siempre estará en falso
        default: false
    }
});

// Eliminar la propiedad 'password' cuando se intente imprimir el usuario en formato Json
usuarioSchema.methods.toJSON = function () {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

// ingresar plugin 'uniqueValidator' al usuarioSchema para comprobar si hay un usuario ya existente.
// opcionalmente se agrega un mensaje. {PATH} ingresará el error cuando se intenta ingresar un dato que ya existe en la base de datos
usuarioSchema.plugin( uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = model('Usuario', usuarioSchema);