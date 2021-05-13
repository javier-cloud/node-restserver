//==========================
// Puerto
//==========================
process.env.PORT = process.env.PORT || 3000;

//==========================
// Entorno
//==========================

// Esto es para saber si estoy en producción o en desarrollo
// La variable NODE_ENV lo establece heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================
// Base de Datos
//==========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else{
    urlDB = 'mongodb+srv://cafe:javierpassword.95@cluster0.z47v7.mongodb.net/cafedb?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;