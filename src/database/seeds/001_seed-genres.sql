-- Seed genres
INSERT INTO genres (name, slug) VALUES
  ('Action', 'action'),
  ('Comedy', 'comedy'),
  ('Drama', 'drama'),
  ('Horror', 'horror'),
  ('Science Fiction', 'science-fiction'),
  ('Thriller', 'thriller'),
  ('Romance', 'romance'),
  ('Animation', 'animation'),
  ('Documentary', 'documentary'),
  ('Fantasy', 'fantasy')
ON CONFLICT (slug) DO NOTHING;
