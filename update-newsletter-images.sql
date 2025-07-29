-- SQL script to update existing newsletter images with working Unsplash URLs
-- Run this in your Supabase SQL Editor

-- Update Tech Weekly Newsletter images
UPDATE documents
SET sections = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        sections::jsonb,
        '{0,layouts,0,columns,0,blocks,1,props,src}',
        '"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop"'
      ),
      '{1,layouts,0,columns,0,blocks,1,props,src}',
      '"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=250&h=150&fit=crop"'
    ),
    '{1,layouts,0,columns,1,blocks,1,props,src}',
    '"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=250&h=150&fit=crop"'
  ),
  '{1,layouts,0,columns,2,blocks,1,props,src}',
  '"https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=250&h=150&fit=crop"'
)
WHERE id = 'doc-tech-newsletter';

-- Update Spring Fashion Newsletter images
UPDATE documents
SET sections = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        sections::jsonb,
        '{0,layouts,0,columns,0,blocks,1,props,src}',
        '"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"'
      ),
      '{1,layouts,0,columns,0,blocks,0,props,image}',
      '"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=250&h=300&fit=crop"'
    ),
    '{1,layouts,0,columns,1,blocks,0,props,image}',
    '"https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=250&h=300&fit=crop"'
  ),
  '{1,layouts,0,columns,2,blocks,0,props,image}',
  '"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=250&h=300&fit=crop"'
)
WHERE id = 'doc-ecommerce-newsletter';

-- Verify the updates
SELECT id, name FROM documents WHERE id IN ('doc-tech-newsletter', 'doc-ecommerce-newsletter');