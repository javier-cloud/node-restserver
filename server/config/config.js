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
// Vencimiento del Token
//==========================
process.env.CADUCIDAD_TOKEN = '48h';

//==========================
// Seed de autenticación
//==========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';


//==========================
// Base de Datos
//==========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//==========================
// Google Client ID
//==========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '311891595087-he88q7c7vthtbqea62f8vbjuqajt6u5l.apps.googleusercontent.com';