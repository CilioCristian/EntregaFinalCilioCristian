import { Router } from 'express';
import authController from '../controllers/auth.Controller.js';

const router = Router();

// Ruta para registrar un usuario nuevo.
// Cuando se hace POST a /register, se ejecuta el método registerUser del controlador.
router.post('/register', authController.registerUser);

// Ruta para iniciar sesión.
// Cuando se hace POST a /login, se ejecuta el método loginUser del controlador.
router.post('/login', authController.loginUser);

export default router;