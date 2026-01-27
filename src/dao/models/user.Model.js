import mongoose from 'mongoose';

const userCollection = 'users';

// Este esquema define cómo se guarda un usuario en la base.
// Básicamente: nombre, apellido, email único, edad, contraseña en hash,
// carrito referenciado y rol con valor por defecto.
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true // El nombre es obligatorio.
  },
  last_name: {
    type: String,
    required: true // El apellido también.
  },
  email: {
    type: String,
    unique: true, // No puede repetirse, cada usuario tiene su propio email.
    required: true
  },
  age: {
    type: Number,
    required: true // La edad también es obligatoria.
  },
  password: {
    type: String,
    required: true // La contraseña siempre es necesaria (se guarda en formato hash).
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts' // Referencia al modelo de carritos.
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Solo puede ser "user" o "admin".
    default: 'user' // Si no se aclara, arranca como "user".
  }
}, {
  // Esto agrega automáticamente las fechas de creación y actualización.
  timestamps: true
});

// Exportamos el modelo para usarlo en controladores y servicios.
const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;