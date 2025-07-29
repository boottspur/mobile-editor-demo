import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { EmailDocument } from '../types';

interface EmailHeaderProps {
  document: EmailDocument;
  onUpdate: (updates: Partial<EmailDocument>) => void;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({ document, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fromName: document.fromName || '',
    fromEmail: document.fromEmail || '',
    replyToEmail: document.replyToEmail || '',
    subject: document.subject || '',
    preheader: document.preheader || '',
  });

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fromName: document.fromName || '',
      fromEmail: document.fromEmail || '',
      replyToEmail: document.replyToEmail || '',
      subject: document.subject || '',
      preheader: document.preheader || '',
    });
    setIsEditing(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsEditing(true)}
        activeOpacity={0.7}
      >
        <View style={styles.fromRow}>
          <Text style={styles.fromName}>{document.fromName || 'Your Name'}</Text>
          <Text style={styles.fromEmail}>&lt;{document.fromEmail || 'hello@example.com'}&gt;</Text>
        </View>
        <Text style={styles.subject} numberOfLines={1}>
          {document.subject || 'Email Subject'}
        </Text>
        <Text style={styles.preheader} numberOfLines={1}>
          {document.preheader || 'Email preview text...'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={handleCancel}
          activeOpacity={1}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View 
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Email Settings</Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={handleCancel}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveButton}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView style={styles.form}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>From Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.fromName}
                    onChangeText={(text) => setFormData({ ...formData, fromName: text })}
                    placeholder="John Doe"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>From Email</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.fromEmail}
                    onChangeText={(text) => setFormData({ ...formData, fromEmail: text })}
                    placeholder="john@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Reply-To Email</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.replyToEmail}
                    onChangeText={(text) => setFormData({ ...formData, replyToEmail: text })}
                    placeholder="reply@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Subject Line</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.subject}
                    onChangeText={(text) => setFormData({ ...formData, subject: text })}
                    placeholder="Your email subject"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Preheader Text</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.preheader}
                    onChangeText={(text) => setFormData({ ...formData, preheader: text })}
                    placeholder="Preview text that appears in inbox..."
                    multiline
                    numberOfLines={3}
                  />
                  <Text style={styles.helpText}>
                    This text appears after the subject line in most email clients
                  </Text>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  fromRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fromName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  fromEmail: {
    fontSize: 14,
    color: '#666',
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  preheader: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 20,
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});