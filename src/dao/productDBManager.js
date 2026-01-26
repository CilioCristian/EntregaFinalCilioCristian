import productModel from "./models/productModel.js";

class productDBManager {

  // Devuelve todos los productos con paginación, orden y links para navegar.
  async getAllProducts(params) {
    const paginate = {
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 10,
    };

    // Si se pide orden por precio (asc o desc), lo agregamos.
    if (params.sort && (params.sort === 'asc' || params.sort === 'desc')) {
      paginate.sort = { price: params.sort };
    }

    // Usamos el plugin de paginación de Mongoose.
    const products = await productModel.paginate({}, paginate);

    // Armamos los links para navegar entre páginas.
    products.prevLink = products.hasPrevPage
      ? `http://localhost:8080/products?page=${products.prevPage}`
      : null;
    products.nextLink = products.hasNextPage
      ? `http://localhost:8080/products?page=${products.nextPage}`
      : null;

    // Si el límite no es el default (10), lo agregamos al link.
    if (products.prevLink && paginate.limit !== 10) products.prevLink += `&limit=${paginate.limit}`;
    if (products.nextLink && paginate.limit !== 10) products.nextLink += `&limit=${paginate.limit}`;

    // Si hay orden, también lo agregamos al link.
    if (products.prevLink && paginate.sort) products.prevLink += `&sort=${params.sort}`;
    if (products.nextLink && paginate.sort) products.nextLink += `&sort=${params.sort}`;

    return products;
  }

  // Busca un producto por su ID.
  async getProductByID(pid) {
    const product = await productModel.findOne({ _id: pid });

    if (!product) throw new Error(`El producto ${pid} no existe!`);

    return product;
  }

  // Crea un producto nuevo validando que tenga todos los campos obligatorios.
  async createProduct(product) {
    const { title, description, code, price, stock, category, thumbnails } = product;

    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error('Error al crear el producto');
    }

    return await productModel.create({ title, description, code, price, stock, category, thumbnails });
  }

  // Actualiza un producto existente con los datos nuevos.
  async updateProduct(pid, productUpdate) {
    return await productModel.updateOne({ _id: pid }, productUpdate);
  }

  // Elimina un producto por su ID.
  async deleteProduct(pid) {
    const result = await productModel.deleteOne({ _id: pid });

    if (result.deletedCount === 0) throw new Error(`El producto ${pid} no existe!`);

    return result;
  }
}

export { productDBManager };
