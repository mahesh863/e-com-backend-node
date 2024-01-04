import 'dotenv/config';
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

import initializeDb from './model';

// routes
import userRouter from './routes/user.route';
import adminRouter from './routes/admin.route';
import categoryRouter from './routes/category.route';
import companyRouter from './routes/company.route';
import productRouter from './routes/product.route';
import cartRouter from './routes/cart.route';
import homeRoute from './routes/home.route';
import collectionRoute from './routes/collection.route';
import widgetRoute from './routes/widget.route';
import bannerRoute from './routes/banner.route';
import categoryWidgetRoute from './routes/categoryWidget.route';
import razorpayRoute from './routes/razorpay.route';
import orderRoute from './routes/order.route';

// utils
import CustomError from './utils/customErrors';

// custom middlewares
import errorHandler from './middleware/error.middleware';
import authHandler from './middleware/auth.middleware';
import { redisConfig } from './config/redis.config';
import logger from './logger/index.logger';

const app: Express = express();
const port = process.env.PORT;
const env = process.env.NODE_ENV;
const rateLimitWindowMs: number = process.env.RATE_LIMIT_WINDOW_MS as unknown as number;

const maxRequestsPerWindow: number = process.env.MAX_REQUESTS_PER_WINDOW as unknown as number;

const corsOrigin = [process.env.CORS_ORIGIN_ADMIN as string, process.env.CORS_ORIGIN_CLIENT as string];

const limiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: maxRequestsPerWindow,
  standardHeaders: true,
  legacyHeaders: false,
  handler: () => {
    throw new CustomError('Too many requests, please try again later.', 429);
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
);

// middlewares
app.use(limiter);

app.route('/api/v1/health-check').get((req, res) => {
  res.status(200).send('OK');
});

app.use('/api/v1/razorpay', razorpayRoute);
app.use('/api/v1', userRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', companyRouter);
app.use('/api/v1', productRouter);
app.use('/api/v1', collectionRoute);
app.use('/api/v1', widgetRoute);
app.use('/api/v1', homeRoute);
app.use('/api/v1', bannerRoute);
app.use('/api/v1', categoryWidgetRoute);

app.use('/api/v1', authHandler, cartRouter);
app.use('/api/v1', authHandler, orderRoute);
// admin
app.use('/api/v1/admin', authHandler, adminRouter);

app.use(errorHandler);

if (env !== 'test') {
  (async () => {
    try {
      await initializeDb();
      await redisConfig();
    } catch (error) {
      console.error('Database synchronization error:', error);
    }
  })();

  app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
  });
}

export default app;
