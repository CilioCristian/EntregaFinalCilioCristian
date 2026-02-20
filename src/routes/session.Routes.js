import { Router } from 'express';
import { authenticateToken } from '../Middlewares/auth.Middlewares.js';
import UserCurrentDTO from '../dto/UserCurrentDTO.js';

const router = Router();

// Esta ruta devuelve la sesión actual del usuario logueado.
// Solo funciona si el token es válido gracias al middleware authenticateToken.
router.get('/current', authenticateToken, (req, res) => {

  const userDTO = new UserCurrentDTO(req.user);

  res.json({
    status: 'success',
    payload: userDTO
  });
});

export default router;
