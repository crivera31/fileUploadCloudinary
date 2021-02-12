const { Schema, model} = require('mongoose');
//modelo FOTO
const FotoSchema = Schema({
    title: String,
    descripcion: String,
    imagenURL: String,
    public_id: String
});

module.exports = model('Foto', FotoSchema)