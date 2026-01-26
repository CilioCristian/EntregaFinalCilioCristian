import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';
import { initializePassport } from './config/passport.config.js';
import authRouter from './routes/auth.Routes.js';
import SessionRoutes from './routes/session.Routes.js';
import UserRoutes from './routes/user.Routes.js';
import { authenticateToken, authorizeRole } from './Middlewares/auth.Middlewares.js';
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

// Ruta protegida: devuelve el usuario logueado.
app.get('/current', authenticateToken, (req, res) => {
  res.json({ user: req.user });
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