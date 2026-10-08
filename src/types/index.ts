export type DietaryTag = 
  | 'none'
  | 'gluten_free'
  | 'lactose_free'
  | 'vegetarian'
  | 'vegan'
  | 'no_nuts'
  | 'no_shellfish'
  | 'kosher_halal';

export interface Guest {
  id: string;
  cluster_id: string;
  first_name: string;
  last_name: string;
  is_attending: boolean | null;
  is_child: boolean;
  dietary_tags: DietaryTag[];
  dietary_notes: string;
  song_request: string;
  bus_seat_reserved: boolean;
  updated_at?: string;
}

export interface Cluster {
  id: string;
  family_name: string;
  invite_code: string;
  notes?: string;
  guests: Guest[];
}

export interface CarpoolingPost {
  id: string;
  guest_id?: string;
  driver_name: string;
  phone_number: string;
  departure_location: string;
  departure_time: string;
  total_seats: number;
  available_seats: number;
  created_at: string;
}

export type FoodType = 'colazione' | 'pizza' | 'cena' | 'pub';

export interface PlacePOI {
  id: string;
  name: string;
  category: 'ceremony' | 'reception' | 'hotel' | 'beauty' | 'food' | 'sightseeing';
  food_type?: FoodType;
  icon?: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  website_url?: string;
  sposi_note?: string;
  photo_url?: string;
  is_primary?: boolean;
}

export interface PlaceCategory {
  id: string;
  label: string;
  marker_icon: string;
  marker_color: string;
  parent_id: string | null;
  sort_order: number;
}

export interface RegistryStage {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  collected_amount: number;
  image_url: string;
  location: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'locations' | 'info' | 'gifts';
}
