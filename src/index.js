import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/connection.js';
import { Usuario } from './models/UsuarioSchema.js';
import { Publicacion } from './models/PublicationSchema.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Ruta para probar el servidor
app.get('/ping', (req, res) => {
  res.json({ message: 'Pong' });
});

app.get('/populate', async (req, res) => {
  try {
    const publicaciones = await Publicacion.find().populate('autor');
    const usuarios = await Usuario.find().populate('publicaciones');
    res.status(200).json({
      message: 'Populate resultados',
      result: {
        publicaciones,
        usuarios,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al ejecutar el populate la base de datos' });
  }
});
app.get('/aggregate', async (req, res) => {
  try {
    const aggregate = await Publicacion.aggregate([
        {
          $match: {
            contenido: { $regex: /primera/i } // Buscar la palabra "primera" (insensible a mayúsculas/minúsculas)
          }
        }
      ]);

    res
      .status(200)
      .json({ message: 'Aggregate resultados', result: aggregate });
  } catch (error) {
    res.status(500).json({ message: 'Error al realizar la agregación' });
  }
});

app.get('/seed', async (req, res) => {
  try {
    // Crear un nuevo usuario
    const usuario1 = await Usuario.create({
      nombre: 'Juan',
      email: 'juan@gmail.com',
    });

    // Crear una primera publicación
    const publicacion1 = await Publicacion.create({
      titulo: 'Mi primera publicación',
      contenido: 'Este es el contenido de mi primera publicación',
      autor: usuario1._id,
    });

    // Crear una segunda publicación
    const publicacion2 = await Publicacion.create({
      titulo: 'Mi segunda publicación',
      contenido: 'Este es el contenido de mi segunda publicación',
      autor: usuario1._id,
    });

    // Agregar la publicación al usuario
    usuario1.publicaciones.push(publicacion1);
    usuario1.publicaciones.push(publicacion2);
    await usuario1.save();

    res.send('Usuario y publicación creados exitosamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear usuario y publicación');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
  connectMongoDB();
});
