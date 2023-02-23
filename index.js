import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import storyRoutes from './routes/stories.js';
import mesengerRoutes from './routes/messengers.js';
import commentRoutes from './routes/comments.js';
import notificationRoutes from './routes/notification.js';
import { createPost } from './controllers/posts.js';
import { register } from './controllers/auth.js';
import { verifyToken } from './middlewares/auth.js';
import { storiesCtrl } from './controllers/stories.js';
import SocketServer from './socketServer.js';
import { createServer } from "http";
import { Server } from "socket.io";
// import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // config to using ES6 module
dotenv.config();

const app = express();

app.use(express.json());
// app.use(cookieParser())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
//ROUTE WITH FILES
app.post('/api/auth/register', upload.single('picture'), register);
app.post('/api/posts', verifyToken, upload.single('source'), createPost);
app.post('/api/stories', verifyToken, upload.single('source'), storiesCtrl.createStory);

//ROUTES
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', storyRoutes);
app.use('/api', mesengerRoutes);
app.use('/api', commentRoutes);
app.use('/api', notificationRoutes);

//#region // !Socket
const httpServer = createServer(app);
// const io = new Server(httpServer);

const io = socket(httpServer, {
  cors: {
      origin: ["http://localhost:3000", "https://facebook-socket.netlify.app"],
  },
});

io.on('connection', socket => {
  console.log("connection")
  SocketServer(socket);
})


//MONGO SETUP
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}, err => {
    if(err) throw err;
    console.log("Database Connected!!")
})

httpServer.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
})
  