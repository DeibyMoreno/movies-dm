import cors from 'cors';
import express, { type Express, type RequestHandler } from 'express';
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

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use(authMiddleware);
  app.use(yoga.graphqlEndpoint, graphqlLimiter);
  app.use(yoga.graphqlEndpoint, authLimiter);
  app.use(yoga.graphqlEndpoint, yoga as unknown as RequestHandler);

  app.use(errorHandler);

  return app;
}
