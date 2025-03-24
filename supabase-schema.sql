-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables for the cosplay website

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    social_links JSONB,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cosplayers table
CREATE TABLE IF NOT EXISTS public.cosplayers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    bio TEXT,
    profile_image TEXT,
    gallery_images TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    popularity INTEGER DEFAULT 0,
    social_links JSONB,
    anime_characters JSONB[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Gallery items table
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    cosplayer_id INTEGER REFERENCES public.cosplayers(id) ON DELETE CASCADE,
    anime TEXT,
    character TEXT,
    likes INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    website TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pages table (for custom pages)
CREATE TABLE IF NOT EXISTS public.pages (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    meta_description TEXT,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Messages table (for contact form)
CREATE TABLE IF NOT EXISTS public.messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies

-- Profiles table policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Cosplayers table policies
ALTER TABLE public.cosplayers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cosplayers are viewable by everyone"
    ON public.cosplayers
    FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert cosplayers"
    ON public.cosplayers
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can update cosplayers"
    ON public.cosplayers
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can delete cosplayers"
    ON public.cosplayers
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Gallery items table policies
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery items are viewable by everyone"
    ON public.gallery_items
    FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert gallery items"
    ON public.gallery_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can update gallery items"
    ON public.gallery_items
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can delete gallery items"
    ON public.gallery_items
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Events table policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
    ON public.events
    FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert events"
    ON public.events
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can update events"
    ON public.events
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can delete events"
    ON public.events
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Pages table policies
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published pages are viewable by everyone"
    ON public.pages
    FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can view all pages"
    ON public.pages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can insert pages"
    ON public.pages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can update pages"
    ON public.pages
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can delete pages"
    ON public.pages
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Messages table policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages"
    ON public.messages
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only admins can view messages"
    ON public.messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can update messages"
    ON public.messages
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

CREATE POLICY "Only admins can delete messages"
    ON public.messages
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Create sample data

-- Insert a sample admin user (you'll need to create this user in Auth first)
INSERT INTO public.profiles (id, username, display_name, is_admin)
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'admin', 'Admin User', true);

-- Insert sample cosplayers
INSERT INTO public.cosplayers (name, slug, bio, profile_image, featured, popularity)
VALUES
    ('Misa Amane', 'misa-amane', 'Professional cosplayer specializing in anime characters', 'cosplayers/misa-amane.jpg', true, 100),
    ('Rei Ayanami', 'rei-ayanami', 'Cosplayer focusing on Evangelion characters', 'cosplayers/rei-ayanami.jpg', true, 95),
    ('Naruto Uzumaki', 'naruto-uzumaki', 'Specializes in Naruto and other shonen anime cosplays', 'cosplayers/naruto-uzumaki.jpg', false, 90);

-- Insert sample gallery items
INSERT INTO public.gallery_items (title, description, image_url, cosplayer_id, anime, character, featured)
VALUES
    ('Death Note Cosplay', 'Misa Amane from Death Note', 'gallery/death-note-misa.jpg', 1, 'Death Note', 'Misa Amane', true),
    ('Evangelion Cosplay', 'Rei Ayanami from Neon Genesis Evangelion', 'gallery/evangelion-rei.jpg', 2, 'Neon Genesis Evangelion', 'Rei Ayanami', true),
    ('Naruto Sage Mode', 'Naruto in Sage Mode', 'gallery/naruto-sage.jpg', 3, 'Naruto Shippuden', 'Naruto Uzumaki', false);

-- Insert sample events
INSERT INTO public.events (title, description, location, start_date, end_date, image_url, featured)
VALUES
    ('Anime Expo 2023', 'The largest anime convention in North America', 'Los Angeles Convention Center', '2023-07-01 09:00:00', '2023-07-04 18:00:00', 'events/anime-expo.jpg', true),
    ('Comic Con 2023', 'International comic convention with anime section', 'San Diego Convention Center', '2023-07-20 09:00:00', '2023-07-23 18:00:00', 'events/comic-con.jpg', true);

-- Insert sample pages
INSERT INTO public.pages (title, slug, content, published)
VALUES
    ('About Us', 'about', '<h1>About AnimeCosu</h1><p>AnimeCosu is the ultimate destination for anime cosplay enthusiasts.</p>', true),
    ('Privacy Policy', 'privacy-policy', '<h1>Privacy Policy</h1><p>This privacy policy explains how we use your personal data.</p>', true),
    ('Terms of Service', 'terms-of-service', '<h1>Terms of Service</h1><p>By using our website, you agree to these terms of service.</p>', true);

-- Create functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables to update the updated_at column
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cosplayers_updated_at
BEFORE UPDATE ON public.cosplayers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

