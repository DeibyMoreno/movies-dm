import cors from 'cors';
import express, { type Express, type RequestHandler, Router } from 'express';
import helmet from 'helmet';

import { createGraphQLServer } from './config/graphql.js';
import { schema } from './graphql/schema.js';
import { createDIContainer, type Dependencies } from './lib/di/container.js';
import { registerDependencies } from './lib/di/register.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { authLimiter, graphqlLimiter } from './middlewares/rateLimiter.middleware.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';

export function createApp(): Express {
  const app = express();

  const container = createDIContainer();
  registerDependencies(container);

  const yoga = createGraphQLServer(schema, {
    context: async (initialContext) => {
      const ctx = initialContext as { req?: { user?: { id: string; role: string } } };

      return {
        user: ctx.req?.user ?? null,
        di: {
          authService: container.resolve<Dependencies>('authService'),
          episodeService: container.resolve<Dependencies>('episodeService'),
          favoriteService: container.resolve<Dependencies>('favoriteService'),
          genreService: container.resolve<Dependencies>('genreService'),
          movieService: container.resolve<Dependencies>('movieService'),
          reviewService: container.resolve<Dependencies>('reviewService'),
          roleService: container.resolve<Dependencies>('roleService'),
          seasonService: container.resolve<Dependencies>('seasonService'),
          serieService: container.resolve<Dependencies>('serieService'),
          userService: container.resolve<Dependencies>('userService'),
        },
      };
    },
  });

  const yogaRouter = Router();
  yogaRouter.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'style-src': ["'self'", 'unpkg.com'],
          'script-src': ["'self'", 'unpkg.com', "'unsafe-inline'"],
          'img-src': ["'self'", 'raw.githubusercontent.com'],
        },
      },
    }),
  );
  yogaRouter.use(graphqlLimiter);
  yogaRouter.use(authLimiter);
  yogaRouter.use(yoga as unknown as RequestHandler);
  app.use(yoga.graphqlEndpoint, yogaRouter);

  app.use('/docs', express.static('docs/public'));

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use(authMiddleware);
  app.use(errorHandler);

  return app;
}
