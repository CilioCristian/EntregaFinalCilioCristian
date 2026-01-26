import multer from 'multer';

// Configuramos dónde y cómo se van a guardar los archivos subidos.
const storage = multer.diskStorage({
  // Carpeta de destino: todos los archivos van a parar a "public/img".
  destination: function (req, file, cb) {
    cb(null, 'public/img');
  },
  // Nombre del archivo: se guarda con el mismo nombre original.
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Exportamos el uploader para usarlo en las rutas.
// Ejemplo: router.post('/upload', uploader.single('archivo'), (req, res) => {...})
export const uploader = multer({ storage });