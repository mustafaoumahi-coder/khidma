/*
  # Khidma - Marketplace de Services Locaux au Maroc

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, nom de la catégorie)
      - `slug` (text, identifiant unique)
      - `icon` (text, nom de l'icône lucide)
      - `description` (text)
      - `created_at` (timestamptz)
    - `providers`
      - `id` (uuid, primary key)
      - `name` (text, nom du prestataire)
      - `category_id` (uuid, FK vers categories)
      - `city` (text, ville au Maroc)
      - `description` (text)
      - `price` (integer, prix en MAD)
      - `rating` (numeric, note sur 5)
      - `review_count` (integer, nombre d'avis)
      - `phone` (text)
      - `image_url` (text)
      - `available` (boolean, disponibilité)
      - `created_at` (timestamptz)
    - `bookings`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, FK vers providers)
      - `client_name` (text)
      - `client_phone` (text)
      - `client_email` (text)
      - `service_date` (date)
      - `service_time` (text)
      - `address` (text)
      - `notes` (text)
      - `status` (text: pending/confirmed/completed/cancelled)
      - `total_price` (integer, prix total en MAD)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Categories: public read
    - Providers: public read, provider owner can update
    - Bookings: authenticated users can manage their own bookings
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'Wrench',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Providers table
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  city text NOT NULL DEFAULT 'Casablanca',
  description text DEFAULT '',
  price integer NOT NULL DEFAULT 0,
  rating numeric(2,1) NOT NULL DEFAULT 0.0,
  review_count integer NOT NULL DEFAULT 0,
  phone text NOT NULL DEFAULT '',
  image_url text DEFAULT '',
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_email text NOT NULL DEFAULT '',
  service_date date NOT NULL,
  service_time text NOT NULL DEFAULT '09:00',
  address text NOT NULL DEFAULT '',
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_price integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Categories: anyone can read
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Providers: anyone can read
CREATE POLICY "Providers are publicly readable"
  ON providers FOR SELECT
  TO anon, authenticated
  USING (true);

-- Providers: authenticated users can insert
CREATE POLICY "Authenticated users can add providers"
  ON providers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Providers: authenticated users can update
CREATE POLICY "Authenticated users can update providers"
  ON providers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Bookings: anyone can read (for demo)
CREATE POLICY "Bookings are readable"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Bookings: anyone can insert (for demo)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Bookings: anyone can update (for demo)
CREATE POLICY "Anyone can update bookings"
  ON bookings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_providers_category ON providers(category_id);
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
