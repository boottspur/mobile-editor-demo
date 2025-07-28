export default {
  "id": "doc-3",
  "name": "Newsletter Template",
  "lastModified": "2024-01-15T12:00:00Z",
  "created": "2024-01-15T12:00:00Z",
  "content": [
    {
      "id": "container-header",
      "type": "container",
      "props": {
        "padding": 20,
        "backgroundColor": "#1976d2",
        "width": "100%"
      },
      "children": [
        {
          "id": "text-header",
          "type": "text",
          "props": {
            "content": "Monthly Newsletter",
            "fontSize": 36,
            "color": "#ffffff",
            "fontWeight": "bold",
            "fontStyle": "normal",
            "textAlign": "center"
          }
        }
      ]
    },
    {
      "id": "container-hero",
      "type": "container",
      "props": {
        "padding": 0,
        "backgroundColor": "#ffffff",
        "width": "100%"
      },
      "children": [
        {
          "id": "image-hero",
          "type": "image",
          "props": {
            "src": "https://via.placeholder.com/600x300",
            "alt": "Hero Image",
            "width": "100%",
            "height": "auto"
          }
        }
      ]
    },
    {
      "id": "container-content",
      "type": "container",
      "props": {
        "padding": 30,
        "backgroundColor": "#ffffff",
        "width": "100%"
      },
      "children": [
        {
          "id": "text-title",
          "type": "text",
          "props": {
            "content": "This Month's Highlights",
            "fontSize": 24,
            "color": "#333333",
            "fontWeight": "bold",
            "fontStyle": "normal",
            "textAlign": "left"
          }
        },
        {
          "id": "text-content",
          "type": "text",
          "props": {
            "content": "Discover the latest features and improvements we've made to help you create better email campaigns.",
            "fontSize": 16,
            "color": "#666666",
            "fontWeight": "normal",
            "fontStyle": "normal",
            "textAlign": "left"
          }
        }
      ]
    },
    {
      "id": "container-cta",
      "type": "container",
      "props": {
        "padding": 20,
        "backgroundColor": "#f5f5f5",
        "width": "100%"
      },
      "children": [
        {
          "id": "text-cta",
          "type": "text",
          "props": {
            "content": "Get Started Today",
            "fontSize": 20,
            "color": "#1976d2",
            "fontWeight": "bold",
            "fontStyle": "normal",
            "textAlign": "center"
          }
        }
      ]
    }
  ]
};