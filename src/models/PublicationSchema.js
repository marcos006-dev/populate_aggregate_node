import mongoose from 'mongoose';

const publicacionSchema = new mongoose.Schema({
  titulo: String,
  contenido: String,
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Referencia al modelo Usuario
  },
});

export const Publicacion = mongoose.model('Publicacion', publicacionSchema);
