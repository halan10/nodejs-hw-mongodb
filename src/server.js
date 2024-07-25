import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import swaggerDocs from './middlewares/swaggerDocs.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import env from './utils/env.js';
import { PUBLIC_DIR } from './constants/index.js';

const port = env('PORT', '3000');

const setupServer = () => {
  const app = express();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(logger);

  const corsMiddleware = cors();
  app.use(corsMiddleware);
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(PUBLIC_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
export default setupServer;
