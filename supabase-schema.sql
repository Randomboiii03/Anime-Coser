-- Create tables
CREATE TABLE IF NOT EXISTS cosplayers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  character TEXT NOT NULL,
  series TEXT NOT NULL,
  bio TEXT,
  profile_image TEXT,
  banner_image TEXT,
  tags TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  popularity INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  cosplayer_id INTEGER REFERENCES cosplayers(id) ON DELETE CASCADE,
  image_path TEXT,
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  image_path TEXT,
  tags TEXT[] DEFAULT '{}',
  event_type TEXT DEFAULT 'convention',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
-- Sample Cosplayers
INSERT INTO cosplayers (name, character, series, bio, profile_image, tags, social_links, popularity, featured, location)
VALUES
  ('Sakura Cosplay', 'Nezuko', 'Demon Slayer', 'Professional cosplayer specializing in anime characters', '/placeholder.svg?height=600&width=400&text=Sakura%20as%20Nezuko', ARRAY['Demon Slayer', 'Anime', 'Horror'], '{"instagram": "https://instagram.com/sakuracosplay", "twitter": "https://twitter.com/sakuracosplay"}', 120, true, 'Tokyo, Japan'),
  ('Hiroshi Designs', 'Deku', 'My Hero Academia', 'Costume designer and cosplayer focusing on superhero anime', '/placeholder.svg?height=600&width=400&text=Hiroshi%20as%20Deku', ARRAY['My Hero Academia', 'Superhero', 'Action'], '{"instagram": "https://instagram.com/hiroshidesigns", "twitter": "https://twitter.com/hiroshidesigns"}', 95, true, 'Osaka, Japan'),
  ('Anime Artisan', 'Mikasa', 'Attack on Titan', 'Specializing in detailed prop work and action poses', '/placeholder.svg?height=600&width=400&text=Artisan%20as%20Mikasa', ARRAY['Attack on Titan', 'Action', 'Dark Fantasy'], '{"instagram": "https://instagram.com/animeartisan", "twitter": "https://twitter.com/animeartisan"}', 110, true, 'Los Angeles, USA');

-- Sample Gallery Items
INSERT INTO gallery (title, cosplayer_id, image_path, tags, likes, featured, description)
VALUES
  ('Nezuko in the Forest', 1, '/placeholder.svg?height=800&width=600&text=Nezuko%20Forest', ARRAY['Demon Slayer', 'Nezuko', 'Forest'], 45, true, 'Nezuko character from Demon Slayer in a forest setting'),
  ('Deku Hero Pose', 2, '/placeholder.svg?height=800&width=600&text=Deku%20Hero%20Pose', ARRAY['My Hero Academia', 'Deku', 'Action'], 38, true, 'Deku in his iconic hero pose from My Hero Academia'),
  ('Mikasa Battle Ready', 3, '/placeholder.svg?height=800&width=600&text=Mikasa%20Battle', ARRAY['Attack on Titan', 'Mikasa', 'Action'], 52, true, 'Mikasa ready for battle with her ODM gear');

-- Sample Events
INSERT INTO events (title, location, date, end_date, description, image_path, tags, event_type, featured)
VALUES
  ('Anime Expo 2023', 'Los Angeles Convention Center', '2023-07-04', '2023-07-07', 'The largest anime convention in North America', '/placeholder.svg?height=400&width=800&text=Anime%20Expo', ARRAY['Convention', 'Competition', 'Panels'], 'convention', true),
  ('Cosplay Craftsmanship Workshop', 'Tokyo Creative Space', '2023-08-12', '2023-08-12', 'Learn advanced techniques for cosplay creation', '/placeholder.svg?height=400&width=800&text=Cosplay%20Workshop', ARRAY['Workshop', 'Beginner Friendly', 'Crafting'], 'workshop', true),
  ('Anime Fest', 'New York Comic Center', '2023-09-23', '2023-09-25', 'Celebration of anime culture with special guests', '/placeholder.svg?height=400&width=800&text=Anime%20Fest', ARRAY['Festival', 'Panels', 'Meetups'], 'convention', true);

-- Sample Pages
INSERT INTO pages (title, slug, content, published)
VALUES
  ('About Us', 'about', '<h1>About Anime Cosplay Universe</h1><p>Welcome to the premier destination for anime cosplay enthusiasts! Our mission is to celebrate the creativity, craftsmanship, and passion that goes into creating amazing cosplay costumes and performances.</p><p>Founded in 2020, our community has grown to include thousands of cosplayers from around the world. We provide resources, tutorials, and a platform for cosplayers to showcase their work and connect with fellow enthusiasts.</p>', true),
  ('Privacy Policy', 'privacy-policy', '<h1>Privacy Policy</h1><p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit our website.</p><p>We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>', true),
  ('Terms of Service', 'terms-of-service', '<h1>Terms of Service</h1><p>By accessing our website, you agree to be bound by these terms of service and to comply with all applicable laws and regulations.</p><p>We may revise these terms of service at any time without notice. By continuing to use our website after any changes, you agree to be bound by the revised terms.</p>', true);

-- Set up Row Level Security (RLS)
ALTER TABLE cosplayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view published cosplayers" ON cosplayers FOR SELECT USING (true);
CREATE POLICY "Public can view published gallery items" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can view published pages" ON pages FOR SELECT USING (published = true);

-- Create policies for admin access
CREATE POLICY "Admins can do everything with cosplayers" ON cosplayers USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything with gallery" ON gallery USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything with events" ON events USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything with pages" ON pages USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything with messages" ON messages USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Public can create messages" ON messages FOR INSERT WITH CHECK (true);

-- Create function to increment gallery likes
CREATE OR REPLACE FUNCTION increment_gallery_likes(item_id INT)
RETURNS VOID AS $$
BEGIN
  UPDATE gallery SET likes = likes + 1 WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment cosplayer popularity
CREATE OR REPLACE FUNCTION increment_cosplayer_popularity(cosplayer_id INT)
RETURNS VOID AS $$
BEGIN
  UPDATE cosplayers SET popularity = popularity + 1 WHERE id = cosplayer_id;
END;
$$ LANGUAGE plpgsql;

