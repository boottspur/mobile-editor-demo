-- SQL script to add newsletters one at a time for debugging
-- Run each statement separately in your Supabase SQL Editor

-- First, verify the table structure
SELECT COUNT(*) FROM documents;

-- Insert Tech Newsletter with minimal data first
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
  'doc-tech-newsletter-v2',
  'Tech Weekly Newsletter',
  '[]'::jsonb,
  'Tech Weekly Team',
  'news@techweekly.com',
  'news@techweekly.com',
  '🚀 This Week in Tech: AI Breakthroughs & Mobile Innovations',
  'GPT-5 rumors, 5G expansion, quantum computing advances, and AR/VR updates',
  '{
    "bodyBackgroundColor": "#f5f5f5",
    "fontFamily": "Arial, sans-serif",
    "fontSize": 16,
    "textColor": "#333333",
    "linkColor": "#1976d2",
    "headingColor": "#000000"
  }'::jsonb,
  NOW(),
  NOW()
);

-- Check if it worked
SELECT id, name FROM documents WHERE id LIKE '%tech%';

-- If the above worked, you can then update it with the full sections data
-- Or we can try inserting with the full data in the original add-newsletters.sql