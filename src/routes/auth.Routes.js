import { Router } from 'express';
import authController from '../controllers/auth.Controller.js';

const router = Router();

// Ruta para registrar un usuario nuevo.
router.post('/register', authController.registerUser);

// Ruta para iniciar sesión.
router.post('/login', authController.loginUser);

// Ruta para solicitar recuperación de contraseña.
router.post('/forgot-password', authController.forgotPassword);

// Ruta para resetear contraseña con token.
router.post('/reset-password/:token', authController.resetPassword);

export default router;