require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use(require('./routes/usuario'));

// Connect to mongoDB
mongoose.connect( process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('Database Connected'))
    .catch( e => console.log(e));

// Start Server
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});