# AI-Guided Template Design Specification

## 🎯 Template Purpose
A streamlined, mobile-first email template specifically designed to be populated by AI during the onboarding conversation. Clean, modern, and flexible enough to work for any business type.

---

## 📱 Template Structure: "Smart Builder"

### Visual Layout
```
┌─────────────────┐
│     [LOGO]      │ ← AI populates from business name/upload
│   Business Name │
├─────────────────┤
│                 │
│   [HERO IMAGE]  │ ← AI suggests based on business type
│                 │
├─────────────────┤
│   AI HEADLINE   │ ← Generated during chat
│   Brief tagline  │ ← AI creates supporting text
├─────────────────┤
│ Main message    │ ← AI writes based on goal + business
│ content that    │
│ flows naturally │
│ and looks       │
│ professional    │
├─────────────────┤
│  [CALL TO       │ ← AI suggests action based on goal
│   ACTION]       │
├─────────────────┤
│ Footer text     │ ← AI adds business info
│ Contact info    │
└─────────────────┘
```

---

## 🧱 Component Breakdown

### 1. Dynamic Header Section
**AI Populates**:
- Business logo (generated from initials if none provided)
- Business name (from user input)
- Brand colors (AI suggests based on business type)

**Structure**:
```jsx
<HeaderBlock>
  <LogoContainer brandColor={ai.suggestedColors.primary}>
    {ai.businessLogo || <GeneratedLogo text={ai.businessInitials} />}
  </LogoContainer>
  <BusinessName color={ai.suggestedColors.text}>
    {ai.businessName}
  </BusinessName>
</HeaderBlock>
```

### 2. Hero Image Section
**AI Logic**:
- Restaurant → Food/dining imagery
- Tech/SaaS → Clean tech graphics
- Retail → Product showcase
- Service → Professional/people imagery

**Fallback Options**:
- Abstract geometric patterns with brand colors
- Gradient backgrounds
- Simple icon representations

### 3. AI-Generated Content Block
**Dynamic Elements**:
- Headline (based on goal + business type)
- Supporting tagline
- Main body content
- Tone matches business personality

**Content Templates by Goal**:
```javascript
const contentTemplates = {
  "promote_product": {
    headline: "{business} - {seasonal_hook}",
    tagline: "Discover what makes us special",
    body: "We're excited to share {product_focus} with {audience_type}..."
  },
  "welcome_customers": {
    headline: "Welcome to the {business} family!",
    tagline: "Thank you for joining us",
    body: "Here's what you can expect from {business}..."
  },
  "share_news": {
    headline: "Big news from {business}!",
    tagline: "We couldn't wait to tell you",
    body: "We're thrilled to announce {news_type}..."
  }
}
```

### 4. Smart Call-to-Action
**AI Determines**:
- Button text based on goal
- Button color from brand palette
- Link destination (mock for demo)

**CTA Options by Goal**:
- Promote → "Shop Now" / "Learn More" / "Get Offer"
- Welcome → "Get Started" / "Explore" / "Complete Setup"
- News → "Read More" / "See Details" / "Tell Me More"

---

## 🎨 Brand Intelligence System

### Color Palette Generation
```javascript
const brandPalettes = {
  restaurant: {
    primary: "#E74C3C",    // Appetizing red
    secondary: "#F39C12",   // Warm orange
    accent: "#27AE60",      // Fresh green
    text: "#2C3E50"
  },
  tech: {
    primary: "#3498DB",     // Professional blue
    secondary: "#9B59B6",   // Innovation purple
    accent: "#1ABC9C",      // Modern teal
    text: "#2C3E50"
  },
  retail: {
    primary: "#E91E63",     // Retail pink
    secondary: "#FF9800",   // Shopping orange
    accent: "#607D8B",      // Neutral gray
    text: "#37474F"
  },
  service: {
    primary: "#34495E",     // Professional dark
    secondary: "#3498DB",   // Trust blue
    accent: "#E67E22",      // Warm accent
    text: "#2C3E50"
  }
}
```

### Typography System
```javascript
const typographyStyles = {
  casual: {
    headingFont: "Poppins",
    bodyFont: "Open Sans",
    personality: "friendly, approachable"
  },
  professional: {
    headingFont: "Montserrat",
    bodyFont: "Source Sans Pro",
    personality: "clean, trustworthy"
  },
  elegant: {
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    personality: "sophisticated, premium"
  }
}
```

---

## 🤖 AI Population Flow

### Step 1: Business Analysis
```
AI: "What's your business name?"
User: [Types "Luna's Bakery"]

AI Processes:
- Business type: Restaurant/Food
- Personality: Artisanal, warm, local
- Suggested palette: Warm browns, cream, gold
- Typography: Casual/elegant hybrid
```

### Step 2: Goal-Based Content
```
AI: "What's your main goal for this email?"
User: [Selects "Promote Special Offer"]

AI Generates:
- Headline: "🥐 Fresh Pastries Daily at Luna's Bakery"
- Tagline: "Handcrafted with love every morning"
- Body: "Start your day with our artisanal pastries, made fresh daily with locally-sourced ingredients..."
- CTA: "Order Fresh Today"
```

### Step 3: Visual Selection
```
AI: "I'll choose images that match your bakery's warm, artisanal feel"

AI Selects:
- Hero: Warm bakery interior with pastries
- Color scheme: Warm browns (#8B4513), cream (#F5F5DC), gold accent (#DAA520)
- Logo: Generated "LB" monogram with wheat design
```

---

## 📋 Template Implementation Plan

### 1. Create Base Template Component
```jsx
// components/templates/AISmartTemplate.tsx
export const AISmartTemplate = ({ aiContent, brandData }) => {
  return (
    <EmailTemplate>
      <DynamicHeader 
        logo={aiContent.logo}
        businessName={aiContent.businessName}
        colors={brandData.colors}
      />
      <HeroSection 
        image={aiContent.heroImage}
        overlay={brandData.colors.primary}
      />
      <ContentSection>
        <AIHeadline>{aiContent.headline}</AIHeadline>
        <AITagline>{aiContent.tagline}</AITagline>
        <AIBody>{aiContent.bodyText}</AIBody>
      </ContentSection>
      <CTASection 
        text={aiContent.ctaText}
        color={brandData.colors.primary}
        action={aiContent.ctaAction}
      />
      <Footer colors={brandData.colors}>
        {aiContent.contactInfo}
      </Footer>
    </EmailTemplate>
  );
};
```

### 2. AI Content Generation Service
```javascript
// services/aiContentGenerator.ts
class AIContentGenerator {
  generateBusinessContent(businessName, businessType, goal) {
    const template = this.getTemplateForType(businessType, goal);
    
    return {
      headline: this.generateHeadline(businessName, goal),
      tagline: this.generateTagline(businessType),
      bodyText: this.generateBody(businessName, businessType, goal),
      ctaText: this.generateCTA(goal),
      heroImage: this.selectHeroImage(businessType),
      colors: this.generateColorPalette(businessType),
      typography: this.selectTypography(businessType)
    };
  }
}
```

### 3. Demo Business Scenarios
```javascript
// data/demoBusinesses.ts
export const demoBusinesses = {
  "luna's bakery": {
    type: "restaurant",
    personality: "artisanal",
    specialties: ["pastries", "coffee", "local ingredients"],
    targetAudience: "local food lovers",
    contentPacks: {
      promote: {
        headline: "🥐 Fresh Pastries Daily at Luna's Bakery",
        tagline: "Handcrafted with love every morning",
        body: "Start your day with our artisanal pastries...",
        heroImage: "bakery-interior.jpg"
      }
    }
  },
  
  "techflow solutions": {
    type: "tech",
    personality: "innovative",
    specialties: ["automation", "efficiency", "B2B"],
    targetAudience: "business owners",
    contentPacks: {
      welcome: {
        headline: "Welcome to the Future of Business Automation",
        tagline: "Your journey to efficiency starts now",
        body: "Thank you for choosing TechFlow Solutions...",
        heroImage: "tech-abstract.jpg"
      }
    }
  }
}
```

---

## 🎬 Demo Experience Flow

### Onboarding Conversation
```
AI: "Hi! Let's create your first email campaign. What's your business?"
User: [Types "Luna's Bakery"]

AI: [2s delay] "A bakery! I love helping food businesses connect with customers. 
     What's your main goal for this email?"

User: [Selects "Promote Special Offer"]

AI: [1s delay] "Perfect! I'll create a mouth-watering promotion for Luna's Bakery.
     Let me design something that showcases your artisanal approach..."

[Template appears with AI-populated content]

AI: "Here's your email! I used warm, inviting colors and focused on the 
     handcrafted quality of your pastries. Want to customize anything?"
```

### Content Customization
```
[User taps headline]

AI: "I can suggest other headlines for your bakery promotion:
     
     • 🥐 Fresh Pastries Daily at Luna's Bakery  [Current]
     • Artisanal Breads & Pastries - Made Today
     • Luna's Bakery: Where Every Bite Tells a Story
     
     Which feels most like your brand?"
```

---

## ✨ Key Demo Advantages

### 1. **Instant Professional Results**
- User types business name → Gets fully branded email in seconds
- No design skills needed
- Mobile-optimized automatically

### 2. **Contextually Intelligent**
- Content actually makes sense for the business
- Images and colors match industry expectations
- CTAs align with stated goals

### 3. **Highly Customizable**
- Every element can be edited after AI generation
- Maintains full editor functionality
- AI suggestions available throughout editing

### 4. **Demo Reliability**
- Pre-built scenarios ensure consistent experience
- Realistic but controlled AI responses
- Works offline, no API dependencies

---

## 🚀 Implementation Priority

### Week 1: Template Foundation
- Build AISmartTemplate component
- Create content generation system
- Implement 3 demo business scenarios

### Week 2: AI Integration
- Connect template to AI chat flow
- Add real-time content population
- Polish animations and transitions

**This streamlined template will make the AI demo incredibly compelling - users see their business transformed into a professional email in real-time during the conversation!**

Should I start implementing this AI-guided template system?