import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import productRouter from '../src/routes/productRouter.js';
import cartRouter from '../src/routes/cartRouter.js';
import viewsRouter from '../src/routes/viewsRouter.js';
import __dirname from '../src/utils/constantsUtil.js';
import websocket from '../src/websocket.js';
import { initializePassport } from './config/passport.Config.js';
import authRouter from '../src/routes/auth.Routes.js';
import SessionRoutes from '../src/routes/session.Routes.js';
import UserRoutes from '../src/routes/user.Routes.js';
import { authenticateToken, authorizeRole } from './middlewares/auth.Middlewares.js';
import nodemailer from 'nodemailer';
import UserDTO from '../src/dto/UserCurrentDTO.js'; 
import UserRepository from './repositories/user.Repository.js' ;

dotenv.config();

const app = express();

// Conexión a MongoDB Atlas usando la URI de las variables de entorno.
const uri = process.env.MONGO_URL;
mongoose.connect(uri)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Configuración del motor de plantillas Handlebars.
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

// Middlewares básicos para parsear JSON, formularios y servir archivos estáticos.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Inicialización de Passport para autenticación.
initializePassport();
app.use(passport.initialize());

// Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);
app.use('/api/users', UserRoutes);
app.use('/api/auth', authRouter);
app.use('/api/sessions', SessionRoutes);

// Instancia del repositorio
const userRepository = new UserRepository();

// Ruta protegida: devuelve el usuario logueado con DTO
app.get('/current', authenticateToken, async (req, res) => {
  try {
    const user = await userRepository.getById(req.user.id); // buscar en DB
    const safeUser = new UserDTO(user); // aplicar DTO
    res.json({ status: 'success', payload: safeUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta protegida: solo accesible para admins.
app.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Bienvenido administrador', user: req.user });
});

// Inicialización del servidor HTTP.
const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});

// Configuración de Socket.io para tiempo real.
const io = new Server(httpServer);
websocket(io);

export default app;