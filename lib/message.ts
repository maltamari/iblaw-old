// types/message.ts

/**
 * Message type used across the application
 * Represents a contact form submission
 */
export interface Message {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject?: string; // Optional - may not always be provided
  subject_key?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

/**
 * Database message type with 'name' field (legacy schema)
 */
export interface DatabaseMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  subject_key?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NewsAward {
  id: string;
  title: string;
  excerpt: string;
  category: "Award" | "News";
  date: string;
  image_url: string;
  content: string;
  published: boolean;
  url: string;
}