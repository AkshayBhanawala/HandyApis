import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';

import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';

import { openAPIRouter } from '@/api-docs/openAPIRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { userRouter } from '@/api/user/userRouter';
import { env } from '@/common/utils/envConfig';
import { pino } from 'pino';
import { read300StatusResponseRouter } from './api/proxy/read300StatusResponse';
import { PATHS } from './constants';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use(PATHS.healthCheck, healthCheckRouter);
app.use(PATHS.read300StatusResponse, read300StatusResponseRouter);
app.use(PATHS.users, userRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
