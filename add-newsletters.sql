-- SQL script to add new newsletter templates to Supabase documents table
-- Run this in your Supabase SQL Editor

-- Insert Tech Weekly Newsletter
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
  'doc-tech-newsletter',
  'Tech Weekly Newsletter',
  '[
    {
      "id": "section-header",
      "name": "Header",
      "layouts": [
        {
          "id": "layout-header",
          "backgroundColor": "#1976d2",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-header",
              "width": 100,
              "blocks": [
                {
                  "id": "text-logo",
                  "type": "text",
                  "props": {
                    "content": "TECH WEEKLY",
                    "fontSize": 32,
                    "color": "#ffffff",
                    "fontWeight": "bold",
                    "textAlign": "center"
                  }
                },
                {
                  "id": "text-tagline",
                  "type": "text",
                  "props": {
                    "content": "Your Source for Tech Innovation",
                    "fontSize": 16,
                    "color": "#e3f2fd",
                    "fontWeight": "normal",
                    "textAlign": "center"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "section-hero",
      "name": "Featured Story",
      "layouts": [
        {
          "id": "layout-hero",
          "backgroundColor": "#ffffff",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-hero-main",
              "width": 70,
              "blocks": [
                {
                  "id": "text-hero-title",
                  "type": "text",
                  "props": {
                    "content": "AI Revolution: GPT-5 Changes Everything",
                    "fontSize": 28,
                    "color": "#1a1a1a",
                    "fontWeight": "bold",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-hero-excerpt",
                  "type": "text",
                  "props": {
                    "content": "OpenAI''s latest breakthrough promises to transform how we work, create, and communicate. Here''s what you need to know about the most significant AI advancement of 2024.",
                    "fontSize": 16,
                    "color": "#555555",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "button-read-more",
                  "type": "button",
                  "props": {
                    "text": "Read Full Story →",
                    "backgroundColor": "#1976d2",
                    "textColor": "#ffffff",
                    "borderRadius": 6,
                    "padding": "12px 24px",
                    "url": "#"
                  }
                }
              ]
            },
            {
              "id": "column-hero-image",
              "width": 30,
              "blocks": [
                {
                  "id": "image-hero",
                  "type": "image",
                  "props": {
                    "src": "https://via.placeholder.com/300x200/1976d2/ffffff?text=AI+GPT-5",
                    "alt": "AI GPT-5 Illustration",
                    "width": "100%",
                    "height": "auto"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "section-news",
      "name": "Weekly Highlights",
      "layouts": [
        {
          "id": "layout-news",
          "backgroundColor": "#f8f9fa",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-news-1",
              "width": 33,
              "blocks": [
                {
                  "id": "image-news-1",
                  "type": "image",
                  "props": {
                    "src": "https://via.placeholder.com/250x150/28a745/ffffff?text=Mobile+5G",
                    "alt": "5G Technology",
                    "width": "100%",
                    "height": "auto"
                  }
                },
                {
                  "id": "text-news-1-title",
                  "type": "text",
                  "props": {
                    "content": "5G Rollout Accelerates",
                    "fontSize": 18,
                    "color": "#1a1a1a",
                    "fontWeight": "bold",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-news-1-content",
                  "type": "text",
                  "props": {
                    "content": "Major carriers expand 5G coverage to rural areas, bringing ultra-fast connectivity to millions.",
                    "fontSize": 14,
                    "color": "#555555",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                }
              ]
            },
            {
              "id": "column-news-2",
              "width": 33,
              "blocks": [
                {
                  "id": "image-news-2",
                  "type": "image",
                  "props": {
                    "src": "https://via.placeholder.com/250x150/ff5722/ffffff?text=Quantum+Computing",
                    "alt": "Quantum Computing",
                    "width": "100%",
                    "height": "auto"
                  }
                },
                {
                  "id": "text-news-2-title",
                  "type": "text",
                  "props": {
                    "content": "Quantum Breakthrough",
                    "fontSize": 18,
                    "color": "#1a1a1a",
                    "fontWeight": "bold",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-news-2-content",
                  "type": "text",
                  "props": {
                    "content": "IBM''s new quantum processor achieves 1000+ qubit milestone, opening new possibilities for computing.",
                    "fontSize": 14,
                    "color": "#555555",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                }
              ]
            },
            {
              "id": "column-news-3",
              "width": 33,
              "blocks": [
                {
                  "id": "image-news-3",
                  "type": "image",
                  "props": {
                    "src": "https://via.placeholder.com/250x150/9c27b0/ffffff?text=AR+VR",
                    "alt": "AR/VR Technology",
                    "width": "100%",
                    "height": "auto"
                  }
                },
                {
                  "id": "text-news-3-title",
                  "type": "text",
                  "props": {
                    "content": "Meta''s AR Glasses",
                    "fontSize": 18,
                    "color": "#1a1a1a",
                    "fontWeight": "bold",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-news-3-content",
                  "type": "text",
                  "props": {
                    "content": "First-generation AR glasses promise to revolutionize how we interact with digital content.",
                    "fontSize": 14,
                    "color": "#555555",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "section-footer",
      "name": "Footer",
      "layouts": [
        {
          "id": "layout-footer",
          "backgroundColor": "#263238",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-footer-left",
              "width": 50,
              "blocks": [
                {
                  "id": "text-footer-company",
                  "type": "text",
                  "props": {
                    "content": "Tech Weekly Newsletter",
                    "fontSize": 16,
                    "color": "#ffffff",
                    "fontWeight": "bold",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-footer-address",
                  "type": "text",
                  "props": {
                    "content": "123 Innovation Drive\\nSan Francisco, CA 94105",
                    "fontSize": 14,
                    "color": "#b0bec5",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                }
              ]
            },
            {
              "id": "column-footer-right",
              "width": 50,
              "blocks": [
                {
                  "id": "text-footer-social",
                  "type": "text",
                  "props": {
                    "content": "Follow Us",
                    "fontSize": 16,
                    "color": "#ffffff",
                    "fontWeight": "bold",
                    "textAlign": "right"
                  }
                },
                {
                  "id": "text-footer-links",
                  "type": "text",
                  "props": {
                    "content": "Twitter | LinkedIn | Newsletter",
                    "fontSize": 14,
                    "color": "#b0bec5",
                    "fontWeight": "normal",
                    "textAlign": "right"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]'::jsonb,
  'Tech Weekly',
  'newsletter@techweekly.com',
  'newsletter@techweekly.com',
  '🚀 This Week in Tech: AI Breakthroughs & Mobile Trends',
  'Your weekly dose of the latest tech innovations and industry insights',
  '{
    "bodyBackgroundColor": "#f8f9fa",
    "fontFamily": "Arial, sans-serif",
    "fontSize": 16,
    "textColor": "#333333",
    "linkColor": "#1976d2",
    "headingColor": "#1a1a1a"
  }'::jsonb,
  '2024-01-20T10:30:00Z',
  '2024-01-20T10:30:00Z'
);

-- Insert Fashion Forward Newsletter
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
  'doc-ecommerce-newsletter',
  'Fashion Forward Newsletter',
  '[
    {
      "id": "section-brand-header",
      "name": "Brand Header",
      "layouts": [
        {
          "id": "layout-brand",
          "backgroundColor": "#f8f9fa",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-brand",
              "width": 100,
              "blocks": [
                {
                  "id": "text-brand-logo",
                  "type": "text",
                  "props": {
                    "content": "FASHION FORWARD",
                    "fontSize": 28,
                    "color": "#d63384",
                    "fontWeight": "bold",
                    "textAlign": "center"
                  }
                },
                {
                  "id": "text-brand-tagline",
                  "type": "text",
                  "props": {
                    "content": "Elevate Your Style",
                    "fontSize": 14,
                    "color": "#6c757d",
                    "fontWeight": "normal",
                    "textAlign": "center"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "section-announcement",
      "name": "Special Announcement",
      "layouts": [
        {
          "id": "layout-announcement",
          "backgroundColor": "#d63384",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-announcement",
              "width": 100,
              "blocks": [
                {
                  "id": "text-announcement",
                  "type": "text",
                  "props": {
                    "content": "🌸 SPRING COLLECTION LAUNCH 🌸",
                    "fontSize": 20,
                    "color": "#ffffff",
                    "fontWeight": "bold",
                    "textAlign": "center"
                  }
                },
                {
                  "id": "text-announcement-sub",
                  "type": "text",
                  "props": {
                    "content": "30% OFF Everything | Free Shipping Over $75",
                    "fontSize": 16,
                    "color": "#fff3f8",
                    "fontWeight": "normal",
                    "textAlign": "center"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "section-hero-product",
      "name": "Featured Collection",
      "layouts": [
        {
          "id": "layout-hero-product",
          "backgroundColor": "#ffffff",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-hero-image",
              "width": 60,
              "blocks": [
                {
                  "id": "image-hero-collection",
                  "type": "image",
                  "props": {
                    "src": "https://via.placeholder.com/400x300/ffc0cb/ffffff?text=Spring+Collection",
                    "alt": "Spring Collection Hero",
                    "width": "100%",
                    "height": "auto"
                  }
                }
              ]
            },
            {
              "id": "column-hero-content",
              "width": 40,
              "blocks": [
                {
                  "id": "text-hero-title",
                  "type": "text",
                  "props": {
                    "content": "Bloom Into Spring",
                    "fontSize": 32,
                    "color": "#1a1a1a",
                    "fontWeight": "bold",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-hero-description",
                  "type": "text",
                  "props": {
                    "content": "Discover our carefully curated spring collection featuring vibrant florals, flowing silhouettes, and sustainable fabrics that celebrate the season of renewal.",
                    "fontSize": 16,
                    "color": "#495057",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "button-shop-collection",
                  "type": "button",
                  "props": {
                    "text": "Shop Collection",
                    "backgroundColor": "#d63384",
                    "textColor": "#ffffff",
                    "borderRadius": 25,
                    "padding": "15px 30px",
                    "url": "#"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "section-featured-products",
      "name": "Trending Now",
      "layouts": [
        {
          "id": "layout-products",
          "backgroundColor": "#f8f9fa",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-product-1",
              "width": 33,
              "blocks": [
                {
                  "id": "product-1",
                  "type": "product",
                  "props": {
                    "name": "Floral Midi Dress",
                    "image": "https://via.placeholder.com/250x300/98d982/ffffff?text=Floral+Dress",
                    "price": "$89.99",
                    "description": "Elegant floral print midi dress perfect for spring occasions",
                    "buyUrl": "#",
                    "layout": "vertical"
                  }
                }
              ]
            },
            {
              "id": "column-product-2",
              "width": 33,
              "blocks": [
                {
                  "id": "product-2",
                  "type": "product",
                  "props": {
                    "name": "Sustainable Denim Jacket",
                    "image": "https://via.placeholder.com/250x300/87ceeb/ffffff?text=Denim+Jacket",
                    "price": "$124.99",
                    "description": "Eco-friendly denim jacket made from recycled materials",
                    "buyUrl": "#",
                    "layout": "vertical"
                  }
                }
              ]
            },
            {
              "id": "column-product-3",
              "width": 33,
              "blocks": [
                {
                  "id": "product-3",
                  "type": "product",
                  "props": {
                    "name": "Statement Earrings",
                    "image": "https://via.placeholder.com/250x300/dda0dd/ffffff?text=Earrings",
                    "price": "$34.99",
                    "description": "Bold geometric earrings to complete any outfit",
                    "buyUrl": "#",
                    "layout": "vertical"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "section-footer-info",
      "name": "Footer Information",
      "layouts": [
        {
          "id": "layout-footer-info",
          "backgroundColor": "#212529",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-footer-contact",
              "width": 33,
              "blocks": [
                {
                  "id": "text-footer-contact-title",
                  "type": "text",
                  "props": {
                    "content": "Contact Us",
                    "fontSize": 16,
                    "color": "#ffffff",
                    "fontWeight": "bold",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-footer-contact-info",
                  "type": "text",
                  "props": {
                    "content": "hello@fashionforward.com\\n1-800-FASHION\\nMon-Fri 9AM-6PM EST",
                    "fontSize": 14,
                    "color": "#adb5bd",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                }
              ]
            },
            {
              "id": "column-footer-links",
              "width": 33,
              "blocks": [
                {
                  "id": "text-footer-links-title",
                  "type": "text",
                  "props": {
                    "content": "Quick Links",
                    "fontSize": 16,
                    "color": "#ffffff",
                    "fontWeight": "bold",
                    "textAlign": "center"
                  }
                },
                {
                  "id": "text-footer-links-list",
                  "type": "text",
                  "props": {
                    "content": "Size Guide | Returns | FAQ\\nShipping Info | Care Instructions",
                    "fontSize": 14,
                    "color": "#adb5bd",
                    "fontWeight": "normal",
                    "textAlign": "center"
                  }
                }
              ]
            },
            {
              "id": "column-footer-social",
              "width": 33,
              "blocks": [
                {
                  "id": "text-footer-social-title",
                  "type": "text",
                  "props": {
                    "content": "Follow Us",
                    "fontSize": 16,
                    "color": "#ffffff",
                    "fontWeight": "bold",
                    "textAlign": "right"
                  }
                },
                {
                  "id": "text-footer-social-links",
                  "type": "text",
                  "props": {
                    "content": "Instagram | Pinterest | TikTok\\nFacebook | YouTube",
                    "fontSize": 14,
                    "color": "#adb5bd",
                    "fontWeight": "normal",
                    "textAlign": "right"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]'::jsonb,
  'Fashion Forward',
  'hello@fashionforward.com',
  'hello@fashionforward.com',
  '✨ New Spring Collection + Exclusive 30% Off Inside!',
  'Don''t miss our limited-time spring collection launch with exclusive subscriber discounts',
  '{
    "bodyBackgroundColor": "#ffffff",
    "fontFamily": "Helvetica, Arial, sans-serif",
    "fontSize": 16,
    "textColor": "#2c2c2c",
    "linkColor": "#d63384",
    "headingColor": "#1a1a1a"
  }'::jsonb,
  '2024-01-21T14:15:00Z',
  '2024-01-21T14:15:00Z'
);