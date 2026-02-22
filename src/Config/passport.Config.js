import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userRepository from '../repositories/user.Repository.js';
import config from './config.js';

// Acá definimos la clave secreta que se usa para firmar y validar los tokens.
// Ahora la tomamos directamente desde config.js (que lee el .env).
// En una arquitectura profesional no deberíamos tener una clave hardcodeada.
const JWT_SECRET = config.JWT_SECRET;

// Estas opciones le dicen a Passport cómo sacar el token del header
// y cuál es la clave que debe usar para verificarlo.
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

// Esta función arranca la configuración de Passport con la estrategia JWT.
// Básicamente: cada vez que llega un token, lo decodifica y busca el usuario en la base.
export const initializePassport = () => {
  passport.use(
    // Cambiamos el nombre de la estrategia a "current"
    // porque la consigna pide trabajar con la estrategia "current".
    'current',
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        // Buscamos al usuario usando el Repository (no el Model directamente).
        // Esto respeta la arquitectura en capas:
        // Passport, Repository, DAO/Model, Base de Datos
        const user = await userRepository.getById(jwt_payload.id);

        // Si no existe, devolvemos false para que no pase la autenticación.
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Si existe, lo mandamos de vuelta y queda disponible en req.user.
        return done(null, user);
      } catch (error) {
        // Si algo falla (ej: error de base de datos), devolvemos el error.
        return done(error, false);
      }
    })
  );
};