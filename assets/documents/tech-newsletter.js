export default {
  "id": "doc-tech-newsletter",
  "name": "Tech Weekly Newsletter",
  "from": "newsletter@techweekly.com",
  "subject": "🚀 This Week in Tech: AI Breakthroughs & Mobile Trends",
  "preheader": "Your weekly dose of the latest tech innovations and industry insights",
  "lastModified": "2024-01-20T10:30:00Z",
  "created": "2024-01-20T10:30:00Z",
  "globalStyles": {
    "bodyBackgroundColor": "#f8f9fa",
    "fontFamily": "Arial, sans-serif",
    "fontSize": 16,
    "textColor": "#333333",
    "linkColor": "#1976d2",
    "headingColor": "#1a1a1a"
  },
  "sections": [
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
                    "content": "OpenAI's latest breakthrough promises to transform how we work, create, and communicate. Here's what you need to know about the most significant AI advancement of 2024.",
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
                    "content": "IBM's new quantum processor achieves 1000+ qubit milestone, opening new possibilities for computing.",
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
                    "content": "Meta's AR Glasses",
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
      "id": "section-spotlight",
      "name": "Developer Spotlight",
      "layouts": [
        {
          "id": "layout-spotlight",
          "backgroundColor": "#ffffff",
          "isDynamic": false,
          "columns": [
            {
              "id": "column-spotlight-content",
              "width": 75,
              "blocks": [
                {
                  "id": "text-spotlight-title",
                  "type": "text",
                  "props": {
                    "content": "Developer Spotlight: Sarah Chen",
                    "fontSize": 24,
                    "color": "#1a1a1a",
                    "fontWeight": "bold",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-spotlight-content",
                  "type": "text",
                  "props": {
                    "content": "Meet Sarah Chen, the lead developer behind the revolutionary new SwiftUI framework enhancements. Her innovative approach to declarative UI has inspired thousands of iOS developers worldwide.",
                    "fontSize": 16,
                    "color": "#555555",
                    "fontWeight": "normal",
                    "textAlign": "left"
                  }
                },
                {
                  "id": "text-spotlight-quote",
                  "type": "text",
                  "props": {
                    "content": "\"The future of mobile development is about making complex interactions feel effortless and intuitive.\"",
                    "fontSize": 18,
                    "color": "#1976d2",
                    "fontWeight": "italic",
                    "textAlign": "left"
                  }
                }
              ]
            },
            {
              "id": "column-spotlight-sidebar",
              "width": 25,
              "blocks": [
                {
                  "id": "image-spotlight",
                  "type": "image",
                  "props": {
                    "src": "https://via.placeholder.com/200x200/607d8b/ffffff?text=Sarah+Chen",
                    "alt": "Sarah Chen Profile",
                    "width": "100%",
                    "height": "auto"
                  }
                },
                {
                  "id": "text-spotlight-role",
                  "type": "text",
                  "props": {
                    "content": "Senior iOS Developer\nApple Inc.",
                    "fontSize": 14,
                    "color": "#777777",
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
                    "content": "123 Innovation Drive\nSan Francisco, CA 94105",
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
  ]
};