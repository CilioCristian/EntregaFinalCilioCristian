import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { uploader } from '../utils/multerUtil.js';

const router = Router();
const ProductService = new productDBManager();

// Trae todos los productos con soporte de paginación y filtros.
router.get('/', async (req, res) => {
  const result = await ProductService.getAllProducts(req.query);

  res.send({
    status: 'success',
    payload: result
  });
});

// Trae un producto puntual por su ID.
router.get('/:pid', async (req, res) => {
  try {
    const result = await ProductService.getProductByID(req.params.pid);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

// Crea un producto nuevo. Permite subir hasta 3 imágenes (thumbnails).
router.post('/', uploader.array('thumbnails', 3), async (req, res) => {
  if (req.files) {
    req.body.thumbnails = [];
    req.files.forEach((file) => {
      req.body.thumbnails.push(file.path); // Guardamos la ruta de cada archivo subido.
    });
  }

  try {
    const result = await ProductService.createProduct(req.body);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

// Actualiza un producto existente. También permite subir hasta 3 imágenes nuevas.
router.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => {
  if (req.files) {
    req.body.thumbnails = [];
    req.files.forEach((file) => {
      req.body.thumbnails.push(file.filename); // Guardamos solo el nombre del archivo.
    });
  }

  try {
    const result = await ProductService.updateProduct(req.params.pid, req.body);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

// Elimina un producto por su ID.
router.delete('/:pid', async (req, res) => {
  try {
    const result = await ProductService.deleteProduct(req.params.pid);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

export default router;