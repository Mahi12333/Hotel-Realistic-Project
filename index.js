import  express  from "express";
import path from "path"
import dotenv from "dotenv"
import cors from "cors"
import {connectDB, sequelize} from "./config/db.js";
import userRoutes from './routes/userRoutes.js';
import ramRoutes from './routes/ramRoutes.js';
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";



dotenv.config()




const port = process.env.PORT || 5000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
connectDB()

app.use(cookieParser());

// app.use(cors((
//     {
//         origin:[""],
//         credentials:true,
//         methods:["POST","GET","PUT"]
//     }
// )))


const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://hotel-realistic-project.vercel.app','http://localhost:3000','http://127.0.0.1:5500','http://127.0.0.1:5501','http://localhost:5000', 'http://localhost:3001', 'http://localhost:3002']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002','http://127.0.0.1:5500','http://127.0.0.1:5501'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use('/api/users', userRoutes);
app.use('/api/users', ramRoutes);


const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if ('production' === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
    app.get('*' , (req, res) => res.sendFile(path.resolve(__dirname, 'frontend' , 'dist', 'index.html')));
}
else{
    app.get('*', (res,req) => res.send('Server is ready'));
}


app.use(notFound);
app.use(errorHandler);

// sequelize.sync()

app.listen(port , () => console.log(`Server started on port ${port}`));

// /zassj
