import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../dao/models/user.Model.js';

// Acá definimos la clave secreta que se usa para firmar y validar los tokens.
// Si no está en las variables de entorno, usamos una por defecto.
const JWT_SECRET = process.env.JWT_SECRET || 'claveSecretaTP';

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
    'jwt',
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        // Buscamos al usuario en la base usando el id que venía en el token.
        const user = await UserModel.findById(jwt_payload.id);

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
