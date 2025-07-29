import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { EmailDocument } from '../types';

interface TextVersionViewProps {
  document: EmailDocument;
}

export const TextVersionView: React.FC<TextVersionViewProps> = ({ document }) => {
  // Mock text extraction from the email document
  const generateTextVersion = () => {
    const lines: string[] = [];
    
    // Email header
    lines.push(document.name.toUpperCase());
    lines.push('');
    
    // Mock content based on document name and sections
    const docName = document.name.toLowerCase();
    
    if (docName.includes('newsletter') || docName.includes('weekly')) {
      lines.push('WEEKLY NEWSLETTER');
      lines.push('================');
      lines.push('');
      lines.push('Dear Subscriber,');
      lines.push('');
      lines.push('Welcome to this week\'s edition of our newsletter. Here are the highlights:');
      lines.push('');
      lines.push('• New product features and updates');
      lines.push('• Industry insights and trends');
      lines.push('• Community spotlights');
      lines.push('• Upcoming events and webinars');
      lines.push('');
      lines.push('FEATURED ARTICLE');
      lines.push('----------------');
      lines.push('');
      lines.push('This week we\'re excited to share insights about the latest developments in our industry. Our team has been working hard to bring you the most relevant and actionable information.');
      lines.push('');
      lines.push('Read more: https://example.com/article');
      lines.push('');
    } else if (docName.includes('welcome')) {
      lines.push('WELCOME TO OUR COMMUNITY!');
      lines.push('==========================');
      lines.push('');
      lines.push('Hi there,');
      lines.push('');
      lines.push('Welcome aboard! We\'re thrilled to have you join our community.');
      lines.push('');
      lines.push('Here\'s what you can expect:');
      lines.push('• Regular updates about new features');
      lines.push('• Exclusive tips and best practices');
      lines.push('• Priority customer support');
      lines.push('');
      lines.push('GET STARTED');
      lines.push('------------');
      lines.push('');
      lines.push('Ready to dive in? Here are your next steps:');
      lines.push('');
      lines.push('1. Complete your profile setup');
      lines.push('2. Explore our getting started guide');
      lines.push('3. Join our community forum');
      lines.push('');
      lines.push('Get Started Now: https://example.com/start');
    } else if (docName.includes('promo') || docName.includes('sale')) {
      lines.push('SPECIAL OFFER - LIMITED TIME!');
      lines.push('==============================');
      lines.push('');
      lines.push('Don\'t miss out on our biggest sale of the year!');
      lines.push('');
      lines.push('SAVE UP TO 50% OFF');
      lines.push('-------------------');
      lines.push('');
      lines.push('Featured Products:');
      lines.push('• Premium Plan - Save 40%');
      lines.push('• Professional Tools - Save 50%');
      lines.push('• Enterprise Solutions - Save 35%');
      lines.push('');
      lines.push('Offer expires: December 31st, 2024');
      lines.push('');
      lines.push('Shop Now: https://example.com/sale');
      lines.push('Use code: SAVE50');
    } else {
      // Generic content
      lines.push('EMAIL CONTENT');
      lines.push('=============');
      lines.push('');
      lines.push('Thank you for your interest in our services.');
      lines.push('');
      lines.push('This email contains important information about:');
      lines.push('• Product updates and announcements');
      lines.push('• Service improvements');
      lines.push('• Account notifications');
      lines.push('');
      lines.push('MAIN CONTENT');
      lines.push('------------');
      lines.push('');
      lines.push('Here is the main content of your email message. This text version provides all the essential information without any formatting or images.');
      lines.push('');
      lines.push('For the full experience with images and formatting, please view this email in your email client or web browser.');
    }
    
    // Footer
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('Best regards,');
    lines.push('The Team');
    lines.push('');
    lines.push('CONTACT INFO');
    lines.push('------------');
    lines.push('Email: hello@example.com');
    lines.push('Website: https://example.com');
    lines.push('');
    lines.push('UNSUBSCRIBE');
    lines.push('------------');
    lines.push('If you no longer wish to receive these emails, you can unsubscribe at:');
    lines.push('https://example.com/unsubscribe');
    lines.push('');
    lines.push(`Sections in this email: ${document.sections?.length || 0}`);
    
    return lines.join('\n');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Text Version</Text>
        <Text style={styles.headerSubtitle}>
          Plain text version for email clients that don't support HTML
        </Text>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.textContent}>
          {generateTextVersion()}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  textContent: {
    fontFamily: 'Courier New, monospace',
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    backgroundColor: '#fafafa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});