import mongoose from 'mongoose';

const userCollection = 'users';

// Este esquema define cómo se guarda un usuario en la base.
// Básicamente: nombre, apellido, email único, contraseña y rol.
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
  password: {
    type: String,
    required: true // La contraseña siempre es necesaria.
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