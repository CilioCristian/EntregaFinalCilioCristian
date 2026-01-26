import mongoose from 'mongoose';

const cartCollection = 'carts';

// Este esquema define cómo se guarda un carrito en la base.
// Básicamente: una lista de productos con su cantidad.
const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        // Cada producto se referencia por su ID en la colección "products".
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products"
        },
        // La cantidad de ese producto en el carrito. Por defecto es 1.
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    // Si el carrito arranca vacío, se guarda como un array vacío.
    default: []
  }
});

// Exportamos el modelo para poder usarlo en el resto del proyecto.
export const cartModel = mongoose.model(cartCollection, cartSchema);