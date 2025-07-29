-- Test SQL to verify basic insert works
-- Run this in your Supabase SQL Editor

-- First, let's check if the table exists and its structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'documents';

-- Try a simple insert
INSERT INTO documents (
  id,
  name,
  sections,
  from_name,
  from_email,
  reply_to_email,
  subject,
  preheader,
  global_styles,
  created,
  last_modified
) VALUES (
  'test-doc-1',
  'Test Document',
  '[]'::jsonb,
  'Test User',
  'test@example.com',
  'test@example.com',
  'Test Subject',
  'Test preheader',
  '{}'::jsonb,
  NOW(),
  NOW()
);

-- Check if it was inserted
SELECT id, name FROM documents WHERE id = 'test-doc-1';