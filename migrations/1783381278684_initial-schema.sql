-- Initial schema for Movies & Series Platform

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE serie_status AS ENUM ('ONGOING', 'FINISHED', 'CANCELED', 'UPCOMING');

-- ============================================
-- ROLES
-- ============================================
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roles_name ON roles (name);

INSERT INTO roles (name, description) VALUES
  ('USER', 'Regular user with basic access'),
  ('ADMIN', 'Administrator with full access');

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role_id UUID NOT NULL REFERENCES roles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role_id ON users (role_id);

-- ============================================
-- GENRES
-- ============================================
CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_genres_slug ON genres (slug);

-- ============================================
-- MOVIES
-- ============================================
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(300) NOT NULL UNIQUE,
  synopsis TEXT,
  release_year INTEGER,
  duration_min INTEGER,
  poster_url TEXT,
  backdrop_url TEXT,
  rating NUMERIC(3, 1) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movies_slug ON movies (slug);
CREATE INDEX idx_movies_rating ON movies (rating DESC);

-- ============================================
-- MOVIES - GENRES (M:N)
-- ============================================
CREATE TABLE movies_genres (
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

CREATE INDEX idx_movies_genres_genre_id ON movies_genres (genre_id);

-- ============================================
-- SERIES
-- ============================================
CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(300) NOT NULL UNIQUE,
  synopsis TEXT,
  release_year INTEGER,
  poster_url TEXT,
  backdrop_url TEXT,
  rating NUMERIC(3, 1) DEFAULT 0,
  status serie_status NOT NULL DEFAULT 'ONGOING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_series_slug ON series (slug);
CREATE INDEX idx_series_status ON series (status);

-- ============================================
-- SERIES - GENRES (M:N)
-- ============================================
CREATE TABLE series_genres (
  serie_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (serie_id, genre_id)
);

CREATE INDEX idx_series_genres_genre_id ON series_genres (genre_id);

-- ============================================
-- SEASONS
-- ============================================
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serie_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title VARCHAR(255),
  release_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(serie_id, number)
);

CREATE INDEX idx_seasons_serie_id ON seasons (serie_id);

-- ============================================
-- EPISODES
-- ============================================
CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  synopsis TEXT,
  duration_min INTEGER,
  release_date DATE,
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(season_id, number)
);

CREATE INDEX idx_episodes_season_id ON episodes (season_id);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  serie_id UUID REFERENCES series(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT review_target_check CHECK (
    (movie_id IS NOT NULL AND serie_id IS NULL) OR
    (movie_id IS NULL AND serie_id IS NOT NULL)
  )
);

CREATE INDEX idx_reviews_movie_id ON reviews (movie_id);
CREATE INDEX idx_reviews_serie_id ON reviews (serie_id);
CREATE INDEX idx_reviews_user_id ON reviews (user_id);

-- ============================================
-- FAVORITES
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  serie_id UUID REFERENCES series(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT favorite_target_check CHECK (
    (movie_id IS NOT NULL AND serie_id IS NULL) OR
    (movie_id IS NULL AND serie_id IS NOT NULL)
  ),
  UNIQUE(user_id, movie_id),
  UNIQUE(user_id, serie_id)
);

CREATE INDEX idx_favorites_user_id ON favorites (user_id);

-- ============================================
-- TRIGGER: auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_movies_updated_at
  BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_series_updated_at
  BEFORE UPDATE ON series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
