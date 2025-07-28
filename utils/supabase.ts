import { createClient } from '@supabase/supabase-js';

// These are public keys - safe to expose in client-side code
const supabaseUrl = 'https://fipvcxvlaewfseypuxly.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcHZjeHZsYWV3ZnNleXB1eGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NDM4NTksImV4cCI6MjA2OTMxOTg1OX0.j3nQHy__MuFh1pTdvYm790b450EelVNsMNBZoSeG0jU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema for our documents table:
/*
CREATE TABLE documents (
  id text PRIMARY KEY,
  name text NOT NULL,
  content jsonb NOT NULL,
  created timestamptz DEFAULT now(),
  last_modified timestamptz DEFAULT now()
);

-- Enable Row Level Security (optional for demo)
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for demo purposes
-- CREATE POLICY "Allow anonymous access" ON documents FOR ALL USING (true);
*/

export type SupabaseDocument = {
  id: string;
  name: string;
  content: any[]; // BlockNode[]
  created: string;
  last_modified: string;
};