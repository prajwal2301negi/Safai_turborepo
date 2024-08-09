import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnection } from './database/dbConnection.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cloudinary from "cloudinary";
import { errorMiddleware } from './utils/errorMiddleware.js'
import ErrorHandler from './utils/errorMiddleware.js';
import userRouter from './routes/user.routes.js';
import ContactUsRouter from './routes/contactUs.routes.js';
import FeedBackRouter from './routes/feedback.routes.js';
import { generateUniqueId } from './middlewares/generateUniqueId.js';
import asyncErrorHandler from './utils/asyncErrorHandler.js';


import cluster from 'cluster';
import os from 'os';
import helmet from 'helmet';
import sanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';


  
const totalCPUs = 4;

if (cluster.isPrimary) {
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
});

}
else {

  
const app = express();

app.use(helmet());
app.use(express.json({ limit: '5kb' }));
app.use(sanitize());
app.use(xss());
app.use(hpp());

app.use(express.urlencoded({ extended: true, limit: '5kb' }));
app.use(compression({
  level: 6,
  threshold: 10 * 1000,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));

dotenv.config();

app.use(cors({
    origin: [process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods: ["GET","POST","PUT","DELETE"],
    credentials:true
}));

app.use(cookieParser());

app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );




app.use(generateUniqueId);

dbConnection();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(errorMiddleware);


  const PORT = process.env.PORT || 8000;

  app.use('/api/v1/user',userRouter);
  app.use('/api/v1/feedback',FeedBackRouter);
  app.use('/api/v1/contact',ContactUsRouter);
  app.all('*', asyncErrorHandler(async (req, res, next) => {
    return next(new ErrorHandler("Page does not exist", 404));
  }));



  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}, ${process.pid}`);
  })

}
