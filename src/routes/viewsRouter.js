import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';

const router = Router();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

// Renderiza la vista principal con la lista de productos.
// Incluye paginación y links para navegar entre páginas.
router.get('/products', async (req, res) => {
  const products = await ProductService.getAllProducts(req.query);

  res.render(
    'index',
    {
      title: 'Productos',
      style: 'index.css',
      products: JSON.parse(JSON.stringify(products.docs)), // Pasamos los productos como objetos planos.
      prevLink: {
        exist: products.prevLink ? true : false,
        link: products.prevLink
      },
      nextLink: {
        exist: products.nextLink ? true : false,
        link: products.nextLink
      }
    }
  );
});

// Renderiza la vista en tiempo real de productos.
// Ideal para usar con websockets y ver cambios al instante.
router.get('/realtimeproducts', async (req, res) => {
  const products = await ProductService.getAllProducts(req.query);
  res.render(
    'realTimeProducts',
    {
      title: 'Productos',
      style: 'index.css',
      products: JSON.parse(JSON.stringify(products.docs))
    }
  );
});

// Renderiza la vista del carrito según su ID.
// Si el carrito no existe, muestra una página de "Not Found".
router.get('/cart/:cid', async (req, res) => {
  const response = await CartService.getProductsFromCartByID(req.params.cid);

  if (response.status === 'error') {
    return res.render(
      'notFound',
      {
        title: 'Not Found',
        style: 'index.css'
      }
    );
  }

  res.render(
    'cart',
    {
      title: 'Carrito',
      style: 'index.css',
      products: JSON.parse(JSON.stringify(response.products))
    }
  );
});

export default router;