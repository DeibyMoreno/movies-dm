import { dateScalar } from './scalars/date.scalar.js';
import { authResolvers } from './schemas/auth/auth.resolver.js';
import { episodeResolvers } from './schemas/episode/episode.resolver.js';
import { favoriteResolvers } from './schemas/favorite/favorite.resolver.js';
import { genreResolvers } from './schemas/genre/genre.resolver.js';
import { movieResolvers } from './schemas/movie/movie.resolver.js';
import { reviewResolvers } from './schemas/review/review.resolver.js';
import { roleResolvers } from './schemas/role/role.resolver.js';
import { seasonResolvers } from './schemas/season/season.resolver.js';
import { serieResolvers } from './schemas/serie/serie.resolver.js';
import { userResolvers } from './schemas/user/user.resolver.js';

export const resolvers = {
  DateTime: dateScalar,
  Query: {
    ...genreResolvers.Query,
    ...movieResolvers.Query,
    ...serieResolvers.Query,
    ...seasonResolvers.Query,
    ...episodeResolvers.Query,
    ...userResolvers.Query,
    ...reviewResolvers.Query,
    ...roleResolvers.Query,
    ...favoriteResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...genreResolvers.Mutation,
  },
  Genre: genreResolvers.Genre,
  Movie: movieResolvers.Movie,
  Serie: serieResolvers.Serie,
  Season: seasonResolvers.Season,

  User: userResolvers.User,
  Review: reviewResolvers.Review,
  Favorite: favoriteResolvers.Favorite,
};
