import { Router } from 'express';
import { authenticateToken } from '../Middlewares/auth.Middlewares.js';

const router = Router();

// Esta ruta devuelve la sesión actual del usuario logueado.
// Solo funciona si el token es válido gracias al middleware authenticateToken.
router.get('/current', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    user: req.user // El usuario viene del token decodificado.
  });
});

export default router;
