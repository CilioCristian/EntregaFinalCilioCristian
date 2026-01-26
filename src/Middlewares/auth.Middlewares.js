import jwt from 'jsonwebtoken';

const JWT_SECRET = 'claveSecretaTP';

// Middleware que revisa si el token es válido.
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // El token viene en el header con formato: "Bearer <token>".
  const token = authHeader && authHeader.split(' ')[1];

  // Si no hay token, cortamos la request.
  if (!token) return res.status(401).json({ status: 'error', message: 'Token requerido' });

  // Verificamos el token con la clave secreta.
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ status: 'error', message: 'Token inválido o expirado' });
    // Si todo está bien, guardamos la info del usuario en la request.
    req.user = user;
    next();
  });
};

// Middleware que revisa si el usuario tiene el rol correcto.
export const authorizeRole = (role) => {
  return (req, res, next) => {
    // Si el rol del usuario no coincide, bloqueamos el acceso.
    if (req.user.role !== role) {
      return res.status(403).json({ status: 'error', message: 'Acceso denegado' });
    }
    // Si coincide, dejamos pasar.
    next();
  };
};
