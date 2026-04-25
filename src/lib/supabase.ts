import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  created_at: string;
};

export type Provider = {
  id: string;
  name: string;
  category_id: string;
  city: string;
  description: string;
  price: number;
  rating: number;
  review_count: number;
  phone: string;
  image_url: string;
  available: boolean;
  created_at: string;
  category?: Category;
};

export type Booking = {
  id: string;
  provider_id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  service_date: string;
  service_time: string;
  address: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  created_at: string;
  provider?: Provider;
};

export const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
] as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};
