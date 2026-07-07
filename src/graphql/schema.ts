import path from 'path';
import { fileURLToPath } from 'url';

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { authDirectiveTransformer } from './directives/auth.directive.js';
import { resolvers } from './resolvers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const typesArray = loadFilesSync(path.join(__dirname, 'schemas', '**/*.graphql'));

const typeDefs = mergeTypeDefs(typesArray);
const mergedResolvers = mergeResolvers([resolvers]);

let schema = makeExecutableSchema({
  typeDefs,
  resolvers: mergedResolvers,
});

schema = authDirectiveTransformer(schema);

export { schema };
