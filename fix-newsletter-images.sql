-- SQL script to fix newsletter images by deleting and re-inserting documents
-- Run this in your Supabase SQL Editor

-- First, delete the existing newsletter documents
DELETE FROM documents 
WHERE id IN ('doc-tech-newsletter', 'doc-ecommerce-newsletter');

-- Now run the add-newsletters.sql script to re-insert with correct image URLs
-- The add-newsletters.sql file has been updated with working Unsplash URLs