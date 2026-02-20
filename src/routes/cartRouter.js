import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.Middlewares.js';

const router = Router();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

// Trae los productos de un carrito según su ID.
router.get('/:cid', async (req, res) => {
  try {
    const result = await CartService.getProductsFromCartByID(req.params.cid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// Crea un carrito nuevo vacío.
router.post('/', async (req, res) => {
  try {
    const result = await CartService.createCart();
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// Agrega un producto a un carrito → solo usuarios autenticados
router.post('/:cid/product/:pid',
  authenticateToken,
  authorizeRole('user'),
  async (req, res) => {
    try {
      const result = await CartService.addProductByID(req.params.cid, req.params.pid);
      res.send({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
);

// Elimina un producto puntual de un carrito.
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const result = await CartService.deleteProductByID(req.params.cid, req.params.pid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// Reemplaza todos los productos de un carrito.
router.put('/:cid', async (req, res) => {
  try {
    const result = await CartService.updateAllProducts(req.params.cid, req.body.products);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// Actualiza la cantidad de un producto específico.
router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const result = await CartService.updateProductByID(req.params.cid, req.params.pid, req.body.quantity);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// Vacía por completo un carrito.
router.delete('/:cid', async (req, res) => {
  try {
    const result = await CartService.deleteAllProducts(req.params.cid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

export default router;