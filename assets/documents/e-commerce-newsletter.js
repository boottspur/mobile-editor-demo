export default {
  "id": "doc-ecommerce-newsletter",
  "name": "Fashion Forward Newsletter",
  "from": "hello@fashionforward.com",
  "subject": "✨ New Spring Collection + Exclusive 30% Off Inside!",
  "preheader": "Don't miss our limited-time spring collection launch with exclusive subscriber discounts",
  "lastModified": "2024-01-21T14:15:00Z",
  "created": "2024-01-21T14:15:00Z",
  "globalStyles": {
    "bodyBackgroundColor": "#ffffff",
    "fontFamily": "Helvetica, Arial, sans-serif",
    "fontSize": 16,
    "textColor": "#2c2c2c",
    "linkColor": "#d63384",
    "headingColor": "#1a1a1a"
  },
  "sections": [
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
      "id": "section-style-tips",
      "name": "Style Guide",
      "layouts": [
        {
          "id": "layout-style-tips",
          "backgroundColor": "#ffffff",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-style-content",
              "width": 70,
              "blocks": [
                {
                  "id": "text-style-title",
                  "type": "text",
                  "props": {
                    "content": "Spring Styling Tips from Our Experts",
                    "fontSize": 24,
                    "color": "#1a1a1a",
                    "fontWeight": "bold",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-style-tip-1",
                  "type": "text",
                  "props": {
                    "content": "• Layer lightweight pieces for unpredictable spring weather",
                    "fontSize": 16,
                    "color": "#495057",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-style-tip-2",
                  "type": "text",
                  "props": {
                    "content": "• Mix florals with neutrals for a balanced, sophisticated look",
                    "fontSize": 16,
                    "color": "#495057",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-style-tip-3",
                  "type": "text",
                  "props": {
                    "content": "• Invest in versatile pieces that transition from day to night",
                    "fontSize": 16,
                    "color": "#495057",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                }
              ]
            },
            {
              "id": "column-style-image",
              "width": 30,
              "blocks": [
                {
                  "id": "image-style-guide",
                  "type": "image",
                  "props": {
                    "src": "https://via.placeholder.com/200x250/f0ad4e/ffffff?text=Style+Guide",
                    "alt": "Spring Style Guide",
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
      "id": "section-social-proof",
      "name": "Customer Love",
      "layouts": [
        {
          "id": "layout-testimonials",
          "backgroundColor": "#f8f9fa",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-testimonial-1",
              "width": 50,
              "blocks": [
                {
                  "id": "text-testimonial-1",
                  "type": "text",
                  "props": {
                    "content": "\"Amazing quality and the fit is perfect! I've gotten so many compliments on my new dress.\"",
                    "fontSize": 16,
                    "color": "#495057",
                    "fontWeight": "italic",
                    "textAlign": "center"
                  }
                },
                {
                  "id": "text-customer-1",
                  "type": "text",
                  "props": {
                    "content": "- Emma S., Verified Buyer",
                    "fontSize": 14,
                    "color": "#6c757d",
                    "fontWeight": "normal",
                    "textAlign": "center"
                  }
                }
              ]
            },
            {
              "id": "column-testimonial-2",
              "width": 50,
              "blocks": [
                {
                  "id": "text-testimonial-2",
                  "type": "text",
                  "props": {
                    "content": "\"Fast shipping and excellent customer service. Fashion Forward is now my go-to for trendy pieces!\"",
                    "fontSize": 16,
                    "color": "#495057",
                    "fontWeight": "italic",
                    "textAlign": "center"
                  }
                },
                {
                  "id": "text-customer-2",
                  "type": "text",
                  "props": {
                    "content": "- Maria L., Loyal Customer",
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
      "id": "section-footer-cta",
      "name": "Footer CTA",
      "layouts": [
        {
          "id": "layout-footer-cta",
          "backgroundColor": "#d63384",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-footer-cta",
              "width": 100,
              "blocks": [
                {
                  "id": "text-footer-cta-title",
                  "type": "text",
                  "props": {
                    "content": "Don't Miss Out!",
                    "fontSize": 24,
                    "color": "#ffffff",
                    "fontWeight": "bold",
                    "textAlign": "center"
                  }
                },
                {
                  "id": "text-footer-cta-urgency",
                  "type": "text",
                  "props": {
                    "content": "Spring Sale ends in 3 days. Use code SPRING30 for 30% off.",
                    "fontSize": 16,
                    "color": "#fff3f8",
                    "fontWeight": "normal",
                    "textAlign": "center"
                  }
                },
                {
                  "id": "button-footer-cta",
                  "type": "button",
                  "props": {
                    "text": "Shop Now & Save",
                    "backgroundColor": "#ffffff",
                    "textColor": "#d63384",
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
                    "content": "hello@fashionforward.com\n1-800-FASHION\nMon-Fri 9AM-6PM EST",
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
                    "content": "Size Guide | Returns | FAQ\nShipping Info | Care Instructions",
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
                    "content": "Instagram | Pinterest | TikTok\nFacebook | YouTube",
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
  ]
};