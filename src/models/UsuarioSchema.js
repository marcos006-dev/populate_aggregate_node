import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  publicaciones: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publicacion',
    },
  ],
});

export const Usuario = mongoose.model('Usuario', usuarioSchema);
