import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { uploader } from '../utils/multerUtil.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.Middlewares.js';

const router = Router();
const ProductService = new productDBManager();

// Trae todos los productos
router.get('/', async (req, res) => {
  const result = await ProductService.getAllProducts(req.query);
  res.send({ status: 'success', payload: result });
});

// Trae un producto puntual
router.get('/:pid', async (req, res) => {
  try {
    const result = await ProductService.getProductByID(req.params.pid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// Crear producto → solo admin
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  uploader.array('thumbnails', 3),
  async (req, res) => {
    if (req.files) {
      req.body.thumbnails = req.files.map(file => file.path);
    }
    try {
      const result = await ProductService.createProduct(req.body);
      res.send({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
);

// Actualizar producto → solo admin
router.put(
  '/:pid',
  authenticateToken,
  authorizeRole('admin'),
  uploader.array('thumbnails', 3),
  async (req, res) => {
    if (req.files) {
      req.body.thumbnails = req.files.map(file => file.filename);
    }
    try {
      const result = await ProductService.updateProduct(req.params.pid, req.body);
      res.send({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
);

// Eliminar producto → solo admin
router.delete('/:pid', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const result = await ProductService.deleteProduct(req.params.pid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

export default router;