import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

// Este esquema define cómo se guarda un producto en la base.
// Básicamente: título, descripción, código, precio, stock, categoría y fotos.
const productSchema = mongoose.Schema({
  title: {
    type: String,
    require: true // El nombre del producto es obligatorio.
  },
  description: {
    type: String,
    require: true // Una breve descripción también es obligatoria.
  },
  code: {
    type: String,
    require: true // Código único para identificar el producto.
  },
  price: {
    type: Number,
    require: true // El precio no puede faltar.
  },
  stock: {
    type: Number,
    require: true // Cantidad disponible en inventario.
  },
  category: {
    type: String,
    require: true // Categoría a la que pertenece el producto.
  },
  thumbnails: {
    type: Array,
    require: false, // Las imágenes son opcionales.
    default: [] // Si no hay, se guarda como array vacío.
  }
});

// Este plugin agrega la posibilidad de paginar resultados fácilmente.
productSchema.plugin(mongoosePaginate);

// Exportamos el modelo para usarlo en el resto del proyecto.
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
