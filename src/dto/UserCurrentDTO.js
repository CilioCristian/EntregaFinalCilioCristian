export default class UserCurrentDTO {
  constructor(user) {
    // Solo guardamos lo que nos interesa mostrar del usuario
    this.id = user._id;           // el ID de Mongo
    this.first_name = user.first_name; // nombre
    this.last_name = user.last_name;   // apellido
    this.email = user.email;           // correo
    this.role = user.role;             // rol (user/admin)
  }
}