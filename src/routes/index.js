const { Router } = require('express');
const router = Router();
const fs = require('fs-extra');
const Foto = require('../models/foto');
const cloudinary = require('cloudinary');
//mis rutas
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

router.get('/', async (req, res) => {
  const fotos = await Foto.find().lean();
  res.render('image', { fotos })
});

router.get('/images/add', async (req, res) => {
  const fotos = await Foto.find().lean();
  res.render('image_form', {fotos});
});

router.post('/images/add', async (req, res) => {
  console.log('BODY: ' ,req.body);
  console.log('REQUEST: ' ,req.file);
  //subir a cloudinary
  const result = await cloudinary.v2.uploader.upload(req.file.path, {folder: "subir-foto/","quality":90,"width":"500","crop":"fill","height":"500","format":"jpg"});
  console.log('RESULT: ' ,result)

  const { title,descripcion, } = req.body;
  const newFoto = new Foto({
    title,
    descripcion,
    imagenURL: result.url,
    public_id: result.public_id
  });
  console.log('FOTO: ' ,newFoto)
  await newFoto.save();
  //una vez q se subio a cloud, borrar de mi carpeta
  await fs.unlink(req.file.path);
  res.redirect('/');
});

router.get('/images/delete/:id', async(req, res) => {
  const { id } = req.params;
  //eliminarla foto de la db
  const foto = await Foto.findByIdAndDelete(id);
  console.log('foto: ' ,foto);
  //eliminar de cloudinary
  const result = await cloudinary.v2.uploader.destroy(foto.public_id);
  console.log('result: ' ,result);
  res.redirect('/images/add');
})

module.exports = router;