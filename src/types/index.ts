export type Category = "mobilier" | "vetements" | "nourriture" | "livres" | "electromenager" | "autre";
export type Urgency = "normal" | "urgent";
export type Status = "ouvert" | "en_cours" | "satisfait";

export interface User {
  id: string;
  name: string;
  alias: string;
  city: string;
  lat?: number;
  lng?: number;
  telegram_id?: string;
  created_at: string;
}

export interface Besoin {
  id: string;
  title: string;
  description: string;
  category: Category;
  urgency: Urgency;
  status: Status;
  city: string;
  lat: number;
  lng: number;
  alias: string;        // nom anonymisé affiché publiquement
  user_id: string;
  responses_count: number;
  created_at: string;
  expires_at: string;
}

export interface Conversation {
  id: string;
  besoin_id: string;
  besoin_title: string;
  donateur_id: string;
  beneficiaire_id: string;
  status: "active" | "terminee";
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_alias: string;
  content: string;
  created_at: string;
}
