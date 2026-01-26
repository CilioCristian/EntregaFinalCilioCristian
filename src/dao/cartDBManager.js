import { cartModel } from "./models/cartModel.js";

class cartDBManager {

  constructor(productDBManager) {
    // Guardamos la referencia al gestor de productos para poder validar IDs.
    this.productDBManager = productDBManager;
  }

  // Devuelve todos los carritos de la base.
  async getAllCarts() {
    return cartModel.find();
  }

  // Busca un carrito por su ID y trae los productos con populate.
  async getProductsFromCartByID(cid) {
    const cart = await cartModel.findOne({ _id: cid }).populate('products.product');

    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    return cart;
  }

  // Crea un carrito vacío.
  async createCart() {
    return await cartModel.create({ products: [] });
  }

  // Agrega un producto al carrito. Si ya está, suma la cantidad.
  async addProductByID(cid, pid) {
    // Primero validamos que el producto exista.
    await this.productDBManager.getProductByID(pid);

    const cart = await cartModel.findOne({ _id: cid });

    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    let i = null;
    const result = cart.products.filter(
      (item, index) => {
        if (item.product.toString() === pid) i = index;
        return item.product.toString() === pid;
      }
    );

    // Si el producto ya estaba en el carrito, aumentamos la cantidad.
    if (result.length > 0) {
      cart.products[i].quantity += 1;
    } else {
      // Si no estaba, lo agregamos con cantidad 1.
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    await cartModel.updateOne({ _id: cid }, { products: cart.products });

    return await this.getProductsFromCartByID(cid);
  }

  // Elimina un producto puntual del carrito.
  async deleteProductByID(cid, pid) {
    await this.productDBManager.getProductByID(pid);

    const cart = await cartModel.findOne({ _id: cid });

    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    const newProducts = cart.products.filter(item => item.product.toString() !== pid);

    await cartModel.updateOne({ _id: cid }, { products: newProducts });

    return await this.getProductsFromCartByID(cid);
  }

  // Reemplaza todos los productos del carrito por una nueva lista.
  async updateAllProducts(cid, products) {
    // Validamos que cada producto exista antes de actualizar.
    for (let key in products) {
      await this.productDBManager.getProductByID(products[key].product);
    }

    await cartModel.updateOne({ _id: cid }, { products: products });

    return await this.getProductsFromCartByID(cid);
  }

  // Actualiza la cantidad de un producto específico en el carrito.
  async updateProductByID(cid, pid, quantity) {
    if (!quantity || isNaN(parseInt(quantity))) throw new Error(`La cantidad ingresada no es válida!`);

    await this.productDBManager.getProductByID(pid);

    const cart = await cartModel.findOne({ _id: cid });

    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    let i = null;
    const result = cart.products.filter(
      (item, index) => {
        if (item.product.toString() === pid) i = index;
        return item.product.toString() === pid;
      }
    );

    if (result.length === 0) throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);

    // Actualizamos la cantidad con el valor nuevo.
    cart.products[i].quantity = parseInt(quantity);

    await cartModel.updateOne({ _id: cid }, { products: cart.products });

    return await this.getProductsFromCartByID(cid);
  }

  // Vacía el carrito por completo.
  async deleteAllProducts(cid) {
    await cartModel.updateOne({ _id: cid }, { products: [] });

    return await this.getProductsFromCartByID(cid);
  }
}

export { cartDBManager };
