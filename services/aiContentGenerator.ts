import { EmailDocument } from '../types';

export interface AIContentData {
  businessName: string;
  businessInitials: string;
  headline: string;
  tagline: string;
  bodyText: string;
  ctaText: string;
  ctaAction: string;
  contactInfo: string;
  heroImage?: string;
  logo?: string;
}

export interface BrandData {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    personality: string;
  };
}

export type BusinessType = 'restaurant' | 'tech' | 'retail' | 'service' | 'fitness' | 'beauty' | 'professional';
export type MarketingGoal = 'promote_product' | 'welcome_customers' | 'share_news' | 'collect_feedback' | 'announce_event';

// Pre-built brand palettes for different business types
const brandPalettes: Record<BusinessType, BrandData['colors']> = {
  restaurant: {
    primary: '#E74C3C',
    secondary: '#F39C12', 
    accent: '#27AE60',
    text: '#2C3E50',
    background: '#FFFFFF'
  },
  tech: {
    primary: '#3498DB',
    secondary: '#9B59B6',
    accent: '#1ABC9C',
    text: '#2C3E50',
    background: '#FFFFFF'
  },
  retail: {
    primary: '#E91E63',
    secondary: '#FF9800',
    accent: '#607D8B',
    text: '#37474F',
    background: '#FFFFFF'
  },
  service: {
    primary: '#34495E',
    secondary: '#3498DB',
    accent: '#E67E22',
    text: '#2C3E50',
    background: '#FFFFFF'
  },
  fitness: {
    primary: '#E74C3C',
    secondary: '#F39C12',
    accent: '#27AE60',
    text: '#2C3E50',
    background: '#FFFFFF'
  },
  beauty: {
    primary: '#E91E63',
    secondary: '#9B59B6',
    accent: '#F39C12',
    text: '#37474F',
    background: '#FFFFFF'
  },
  professional: {
    primary: '#34495E',
    secondary: '#3498DB',
    accent: '#95A5A6',
    text: '#2C3E50',
    background: '#FFFFFF'
  }
};

// Typography styles by business personality
const typographyStyles: Record<string, BrandData['typography']> = {
  casual: {
    headingFont: 'Poppins',
    bodyFont: 'Open Sans',
    personality: 'friendly, approachable'
  },
  professional: {
    headingFont: 'Montserrat',
    bodyFont: 'Source Sans Pro',
    personality: 'clean, trustworthy'
  },
  elegant: {
    headingFont: 'Playfair Display',
    bodyFont: 'Lora',
    personality: 'sophisticated, premium'
  },
  modern: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    personality: 'minimalist, tech-forward'
  }
};

// Content templates organized by goal and business type
const contentTemplates = {
  promote_product: {
    restaurant: {
      headlines: [
        '🍽️ {businessName} - Fresh Daily Specials',
        '🥘 New Menu Items at {businessName}',
        '🌟 Special Offer from {businessName}'
      ],
      taglines: [
        'Handcrafted with love every day',
        'Fresh ingredients, amazing flavors',
        'Where every meal is memorable'
      ],
      bodies: [
        'Join us for an unforgettable dining experience with our fresh daily specials, made with locally-sourced ingredients and crafted by our passionate chefs.',
        'Discover our new menu items that showcase the best of seasonal flavors. Each dish is carefully prepared to bring you the perfect combination of taste and quality.',
        'We\'re excited to share our latest culinary creations with you. From appetizers to desserts, every item on our menu tells a story of flavor and tradition.'
      ],
      ctas: ['Order Now', 'View Menu', 'Make Reservation', 'Visit Today']
    },
    tech: {
      headlines: [
        '🚀 Introducing {businessName}\'s Latest Innovation',
        '⚡ Streamline Your Workflow with {businessName}',
        '🔧 New Features from {businessName}'
      ],
      taglines: [
        'Efficiency meets innovation',
        'Built for the modern workplace',
        'Technology that works for you'
      ],
      bodies: [
        'Discover how our latest features can transform your business operations. With cutting-edge automation and intuitive design, we\'re making it easier than ever to achieve your goals.',
        'Experience the future of productivity with our newest release. Designed by experts and tested by professionals, our tools help you work smarter, not harder.',
        'Join thousands of businesses who trust {businessName} to power their success. Our innovative solutions are built to scale with your growing needs.'
      ],
      ctas: ['Get Started', 'Learn More', 'Try Free', 'Schedule Demo']
    },
    retail: {
      headlines: [
        '🛍️ New Arrivals at {businessName}',
        '✨ Exclusive Collection from {businessName}',
        '🎁 Special Offer - {businessName}'
      ],
      taglines: [
        'Style that speaks to you',
        'Quality you can trust',
        'Discover something special'
      ],
      bodies: [
        'Explore our newest collection featuring carefully curated pieces that blend style, quality, and affordability. Each item is selected with our customers\' diverse tastes in mind.',
        'We\'re thrilled to introduce our exclusive new line, designed to elevate your everyday style. From classic pieces to trendy finds, discover your next favorite.',
        'Don\'t miss our special promotion on select items. Whether you\'re treating yourself or finding the perfect gift, we have something special waiting for you.'
      ],
      ctas: ['Shop Now', 'View Collection', 'Get Offer', 'Browse Sale']
    }
  },
  
  welcome_customers: {
    restaurant: {
      headlines: [
        '🌟 Welcome to the {businessName} Family!',
        '🍽️ Your Table is Ready at {businessName}',
        '👋 Welcome to {businessName}!'
      ],
      taglines: [
        'We can\'t wait to serve you',
        'Where every guest is family',
        'Your culinary journey begins here'
      ],
      bodies: [
        'Thank you for choosing {businessName}! We\'re excited to welcome you to our family of food lovers. Get ready to experience fresh flavors, warm hospitality, and unforgettable moments.',
        'We\'re delighted you\'ve joined us! Our team is passionate about creating exceptional dining experiences, and we can\'t wait to share our love of great food with you.',
        'Welcome to {businessName}, where every meal is a celebration. We\'re committed to providing you with outstanding food, service, and atmosphere that keeps you coming back.'
      ],
      ctas: ['View Menu', 'Make Reservation', 'Visit Us', 'Learn More']
    },
    tech: {
      headlines: [
        '🚀 Welcome to {businessName}!',
        '⚡ Your Journey Starts Here',
        '🌟 Welcome to the Future'
      ],
      taglines: [
        'Let\'s build something amazing together',
        'Your success is our mission',
        'Innovation starts now'
      ],
      bodies: [
        'Welcome to {businessName}! We\'re thrilled to have you on board. Our platform is designed to help you achieve more, work smarter, and unlock new possibilities for your business.',
        'Thank you for choosing {businessName} as your technology partner. We\'re here to support your journey with powerful tools, expert guidance, and innovative solutions.',
        'You\'ve just joined a community of forward-thinking professionals who trust {businessName} to power their success. Let\'s explore what we can accomplish together.'
      ],
      ctas: ['Get Started', 'Explore Features', 'Setup Account', 'Contact Support']
    }
  },
  
  share_news: {
    restaurant: {
      headlines: [
        '📢 Big News from {businessName}!',
        '🎉 Exciting Updates at {businessName}',
        '✨ Something Special is Happening'
      ],
      taglines: [
        'We couldn\'t wait to share this with you',
        'Great things are happening',
        'Our community deserves to know first'
      ],
      bodies: [
        'We have some exciting news to share with our valued customers! These updates reflect our commitment to serving you better and continuing to grow as your neighborhood favorite.',
        'Big changes are coming to {businessName}, and we wanted you to be the first to know. These developments will enhance your experience and bring you even more reasons to visit.',
        'We\'re thrilled to announce some major updates that we know you\'ll love. Thank you for being part of our journey and supporting our growth.'
      ],
      ctas: ['Read More', 'Learn Details', 'Visit Soon', 'Stay Updated']
    }
  }
};

// Demo business scenarios with complete profiles
export const demoBusinesses = {
  "luna's bakery": {
    type: 'restaurant' as BusinessType,
    personality: 'casual',
    specialties: ['pastries', 'coffee', 'artisanal bread'],
    targetAudience: 'local food lovers',
    contactInfo: 'Luna\'s Bakery • 123 Main St • (555) 123-4567'
  },
  "techflow solutions": {
    type: 'tech' as BusinessType,
    personality: 'professional',
    specialties: ['automation', 'workflow', 'productivity'],
    targetAudience: 'business professionals',
    contactInfo: 'TechFlow Solutions • hello@techflow.com • (555) 987-6543'
  },
  "fitness fusion": {
    type: 'fitness' as BusinessType,
    personality: 'modern',
    specialties: ['personal training', 'group classes', 'wellness'],
    targetAudience: 'health enthusiasts',
    contactInfo: 'Fitness Fusion • 456 Wellness Way • (555) 234-5678'
  },
  "urban boutique": {
    type: 'retail' as BusinessType,
    personality: 'elegant',
    specialties: ['fashion', 'accessories', 'lifestyle'],
    targetAudience: 'style-conscious shoppers',
    contactInfo: 'Urban Boutique • 789 Fashion Ave • (555) 345-6789'
  }
};

export class AIContentGenerator {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  detectBusinessType(businessName: string): BusinessType {
    const name = businessName.toLowerCase();
    
    if (name.includes('bakery') || name.includes('restaurant') || name.includes('cafe') || name.includes('bistro') || name.includes('kitchen') || name.includes('grill')) {
      return 'restaurant';
    }
    if (name.includes('tech') || name.includes('software') || name.includes('solutions') || name.includes('digital') || name.includes('app')) {
      return 'tech';
    }
    if (name.includes('boutique') || name.includes('shop') || name.includes('store') || name.includes('retail') || name.includes('fashion')) {
      return 'retail';
    }
    if (name.includes('fitness') || name.includes('gym') || name.includes('wellness') || name.includes('health') || name.includes('yoga')) {
      return 'fitness';
    }
    if (name.includes('beauty') || name.includes('salon') || name.includes('spa') || name.includes('cosmetic')) {
      return 'beauty';
    }
    if (name.includes('consulting') || name.includes('services') || name.includes('professional') || name.includes('agency')) {
      return 'professional';
    }
    
    return 'service'; // Default fallback
  }

  generateBusinessInitials(businessName: string): string {
    return businessName
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  async generateBrandData(businessName: string, businessType?: BusinessType): Promise<BrandData> {
    // Simulate AI thinking time
    await this.delay(1000 + Math.random() * 1000);
    
    const detectedType = businessType || this.detectBusinessType(businessName);
    const personality = this.getPersonalityForType(detectedType);
    
    return {
      colors: brandPalettes[detectedType],
      typography: typographyStyles[personality]
    };
  }

  async generateContent(businessName: string, goal: MarketingGoal, businessType?: BusinessType): Promise<AIContentData> {
    // Simulate AI content creation time
    await this.delay(1500 + Math.random() * 1500);
    
    const detectedType = businessType || this.detectBusinessType(businessName);
    const goalTemplates = contentTemplates[goal];
    const templates = goalTemplates?.[detectedType] || goalTemplates?.service;
    
    if (!templates) {
      // Fallback to basic template
      return {
        businessName,
        businessInitials: this.generateBusinessInitials(businessName),
        headline: `Welcome to ${businessName}!`,
        tagline: 'We\'re excited to work with you',
        bodyText: 'Thank you for your interest in our services. We look forward to helping you achieve your goals.',
        ctaText: 'Get Started',
        ctaAction: this.generateCTAAction(goal),
        contactInfo: this.generateContactInfo(businessName, detectedType)
      };
    }

    // Get random content from templates
    const headline = this.getRandomItem(templates.headlines).replace('{businessName}', businessName);
    const tagline = this.getRandomItem(templates.taglines);
    const bodyText = this.getRandomItem(templates.bodies).replace('{businessName}', businessName);
    const ctaText = this.getRandomItem(templates.ctas);
    
    // Generate contact info
    const contactInfo = this.generateContactInfo(businessName, detectedType);
    
    return {
      businessName,
      businessInitials: this.generateBusinessInitials(businessName),
      headline,
      tagline,
      bodyText,
      ctaText,
      ctaAction: this.generateCTAAction(goal),
      contactInfo
    };
  }

  private getPersonalityForType(businessType: BusinessType): string {
    const personalityMap: Record<BusinessType, string> = {
      restaurant: 'casual',
      tech: 'professional',
      retail: 'elegant',
      service: 'professional',
      fitness: 'modern',
      beauty: 'elegant',
      professional: 'professional'
    };
    
    return personalityMap[businessType] || 'professional';
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private generateCTAAction(goal: MarketingGoal): string {
    const actionMap: Record<MarketingGoal, string> = {
      promote_product: 'view_product',
      welcome_customers: 'get_started',
      share_news: 'read_more',
      collect_feedback: 'give_feedback',
      announce_event: 'learn_more'
    };
    
    return actionMap[goal] || 'learn_more';
  }

  private generateContactInfo(businessName: string, businessType: BusinessType): string {
    const phoneNumbers = ['(555) 123-4567', '(555) 987-6543', '(555) 234-5678', '(555) 345-6789'];
    const addresses = ['123 Main St', '456 Business Ave', '789 Commerce Blvd', '321 Market Place'];
    
    const phone = this.getRandomItem(phoneNumbers);
    const address = this.getRandomItem(addresses);
    
    return `${businessName} • ${address} • ${phone}`;
  }

  // Method to get a complete business profile for demo scenarios
  getBusinessProfile(businessName: string) {
    const normalizedName = businessName.toLowerCase();
    return (demoBusinesses as any)[normalizedName] || null;
  }

  // Method to generate a complete email document from AI content
  async generateEmailDocument(businessName: string, goal: MarketingGoal): Promise<EmailDocument> {
    const content = await this.generateContent(businessName, goal);
    const brandData = await this.generateBrandData(businessName);
    
    // This would create a complete EmailDocument structure
    // For now, returning a basic structure - can be expanded
    return {
      id: `ai-generated-${Date.now()}`,
      name: `${businessName} - ${goal}`,
      subject: content.headline,
      fromName: businessName,
      fromEmail: `hello@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      preheader: content.tagline,
      sections: [],
      globalStyles: {
        bodyBackgroundColor: brandData.colors.background,
        textColor: brandData.colors.text
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}