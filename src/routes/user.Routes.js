import { Router } from 'express';
import UserController from '../controllers/user.Controller.js';
import { authenticateToken, authorizeRole } from '../Middlewares/auth.Middlewares.js';

const router = Router();

// Trae todos los usuarios, solo accesible para admins.
router.get('/', authenticateToken, authorizeRole('admin'), UserController.getAllUsers);

// Trae un usuario puntual por su ID, accesible para cualquier usuario logueado.
router.get('/:uid', authenticateToken, UserController.getUserById);

// Crea un usuario nuevo, solo accesible para admins.
router.post('/', authenticateToken, authorizeRole('admin'), UserController.createUser);

// Actualiza un usuario existente, solo accesible para admins.
router.put('/:uid', authenticateToken, authorizeRole('admin'), UserController.updateUser);

// Elimina un usuario, solo accesible para admins.
router.delete('/:uid', authenticateToken, authorizeRole('admin'), UserController.deleteUser);

export default router;