import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { GlobalStyles } from '../types';

interface GlobalStylesEditorProps {
  visible: boolean;
  onClose: () => void;
  globalStyles: GlobalStyles;
  onUpdate: (styles: GlobalStyles) => void;
  isInline?: boolean;
  mobileDesignMode?: boolean;
}

export const GlobalStylesEditor: React.FC<GlobalStylesEditorProps> = ({
  visible,
  onClose,
  globalStyles,
  onUpdate,
  isInline = false,
  mobileDesignMode = false,
}) => {
  const [editedStyles, setEditedStyles] = useState<GlobalStyles>({
    ...globalStyles,
  });

  const handleSave = () => {
    onUpdate(editedStyles);
    onClose();
  };

  const handleReset = () => {
    setEditedStyles({
      bodyBackgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      textColor: '#333333',
      linkColor: '#1976d2',
      headingColor: '#000000',
    });
  };

  const updateStyle = (key: keyof GlobalStyles, value: any) => {
    setEditedStyles({
      ...editedStyles,
      [key]: value,
    });
  };

  const backgroundColors = [
    '#ffffff', '#f5f5f5', '#f0f0f0', '#e0e0e0',
    '#263238', '#37474f', '#455a64', '#546e7a',
    '#1976d2', '#1565c0', '#0d47a1', '#0277bd',
    '#dc3545', '#c62828', '#b71c1c', '#d32f2f',
    '#28a745', '#2e7d32', '#1b5e20', '#388e3c',
    '#ffc107', '#f57f17', '#ff8f00', '#ffa000',
  ];

  const textColors = [
    '#000000', '#333333', '#666666', '#999999',
    '#ffffff', '#f5f5f5', '#e0e0e0', '#bdbdbd',
    '#1976d2', '#dc3545', '#28a745', '#ffc107',
    '#9c27b0', '#ff5722', '#607d8b', '#795548',
  ];

  const fontFamilies = [
    'Arial, sans-serif',
    'Helvetica, Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Verdana, sans-serif',
    'Trebuchet MS, sans-serif',
    'Palatino, serif',
  ];

  const fontSizes = [12, 14, 16, 18, 20, 22, 24, 28, 32, 36];

  const ColorPicker: React.FC<{
    title: string;
    colors: string[];
    selectedColor: string;
    onSelect: (color: string) => void;
  }> = ({ title, colors, selectedColor, onSelect }) => (
    <View style={styles.colorSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.colorGrid}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor,
            ]}
            onPress={() => onSelect(color)}
          >
            {color === selectedColor && (
              <Text style={[
                styles.checkmark,
                { color: color === '#ffffff' || color === '#f5f5f5' ? '#333' : '#fff' }
              ]}>
                ✓
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const content = (
    <View style={[styles.container, isInline && styles.inlineContainer]}>
      {/* Header - hidden in inline mode */}
      {!isInline && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Global Styles</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.headerButton, styles.saveButton]}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {isInline && (
        <View style={styles.inlineHeader}>
          <Text style={styles.inlineTitle}>
            {mobileDesignMode ? '📱 Mobile Design' : '🎨 Design'}
          </Text>
          <Text style={styles.inlineSubtitle}>
            {mobileDesignMode 
              ? 'Customize mobile-specific styles and media queries'
              : 'Customize your email\'s global styles'
            }
          </Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Background Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Background</Text>
              <Text style={styles.sectionDescription}>
                Set the overall email background appearance
              </Text>
            </View>

            <ColorPicker
              title="Background Color"
              colors={backgroundColors}
              selectedColor={editedStyles.bodyBackgroundColor || '#f5f5f5'}
              onSelect={(color) => updateStyle('bodyBackgroundColor', color)}
            />
          </View>

          {/* Typography Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Typography</Text>
              <Text style={styles.sectionDescription}>
                Control text appearance across all content
              </Text>
            </View>

            {/* Font Family */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Font Family</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipContainer}>
                  {fontFamilies.map((font) => (
                    <TouchableOpacity
                      key={font}
                      style={[
                        styles.chip,
                        editedStyles.fontFamily === font && styles.activeChip,
                      ]}
                      onPress={() => updateStyle('fontFamily', font)}
                    >
                      <Text style={[
                        styles.chipText,
                        editedStyles.fontFamily === font && styles.activeChipText,
                      ]}>
                        {font.split(',')[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Font Size */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Base Font Size</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipContainer}>
                  {fontSizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeChip,
                        editedStyles.fontSize === size && styles.activeChip,
                      ]}
                      onPress={() => updateStyle('fontSize', size)}
                    >
                      <Text style={[
                        styles.chipText,
                        editedStyles.fontSize === size && styles.activeChipText,
                      ]}>
                        {size}px
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Text Colors */}
            <ColorPicker
              title="Text Color"
              colors={textColors}
              selectedColor={editedStyles.textColor || '#333333'}
              onSelect={(color) => updateStyle('textColor', color)}
            />

            <ColorPicker
              title="Link Color"
              colors={textColors}
              selectedColor={editedStyles.linkColor || '#1976d2'}
              onSelect={(color) => updateStyle('linkColor', color)}
            />

            <ColorPicker
              title="Heading Color"
              colors={textColors}
              selectedColor={editedStyles.headingColor || '#000000'}
              onSelect={(color) => updateStyle('headingColor', color)}
            />
          </View>

          {/* Mobile-Specific Section - only show in mobile design mode */}
          {mobileDesignMode && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📱 Mobile Optimizations</Text>
                <Text style={styles.sectionDescription}>
                  Mobile-specific styles and responsive adjustments
                </Text>
              </View>

              {/* Mobile Font Size Override */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Font Size</Text>
                <Text style={styles.inputDescription}>Override font size for mobile devices</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {[12, 14, 16, 18, 20, 22].map((size) => (
                      <TouchableOpacity
                        key={size}
                        style={[
                          styles.sizeChip,
                          editedStyles.mobileFontSize === size && styles.activeChip,
                        ]}
                        onPress={() => updateStyle('mobileFontSize', size)}
                      >
                        <Text style={[
                          styles.chipText,
                          editedStyles.mobileFontSize === size && styles.activeChipText,
                        ]}>
                          {size}px
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Mobile Padding */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Container Padding</Text>
                <Text style={styles.inputDescription}>Adjust spacing for mobile screens</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {[8, 12, 16, 20, 24].map((padding) => (
                      <TouchableOpacity
                        key={padding}
                        style={[
                          styles.sizeChip,
                          editedStyles.mobilePadding === padding && styles.activeChip,
                        ]}
                        onPress={() => updateStyle('mobilePadding', padding)}
                      >
                        <Text style={[
                          styles.chipText,
                          editedStyles.mobilePadding === padding && styles.activeChipText,
                        ]}>
                          {padding}px
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Mobile Button Sizes */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Button Height</Text>
                <Text style={styles.inputDescription}>Optimize button sizes for touch</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {[40, 44, 48, 52, 56].map((height) => (
                      <TouchableOpacity
                        key={height}
                        style={[
                          styles.sizeChip,
                          editedStyles.mobileButtonHeight === height && styles.activeChip,
                        ]}
                        onPress={() => updateStyle('mobileButtonHeight', height)}
                      >
                        <Text style={[
                          styles.chipText,
                          editedStyles.mobileButtonHeight === height && styles.activeChipText,
                        ]}>
                          {height}px
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

          {/* Reset Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>↻ Reset to Defaults</Text>
            </TouchableOpacity>
          </View>

          {/* Preview Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={[
              styles.preview,
              { backgroundColor: editedStyles.bodyBackgroundColor || '#f5f5f5' }
            ]}>
              <Text style={[
                styles.previewText,
                {
                  fontFamily: editedStyles.fontFamily?.split(',')[0] || 'Arial',
                  fontSize: editedStyles.fontSize || 16,
                  color: editedStyles.textColor || '#333333',
                }
              ]}>
                Sample body text with your chosen styles.
              </Text>
              <Text style={[
                styles.previewHeading,
                {
                  fontFamily: editedStyles.fontFamily?.split(',')[0] || 'Arial',
                  color: editedStyles.headingColor || '#000000',
                }
              ]}>
                Sample Heading
              </Text>
              <Text style={[
                styles.previewLink,
                {
                  fontFamily: editedStyles.fontFamily?.split(',')[0] || 'Arial',
                  fontSize: editedStyles.fontSize || 16,
                  color: editedStyles.linkColor || '#1976d2',
                }
              ]}>
                Sample Link Text
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
  );

  if (isInline) {
    return content;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      {content}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inlineContainer: {
    backgroundColor: '#f8f9fa',
  },
  inlineHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inlineTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  inlineSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    color: '#1976d2',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  colorSection: {
    marginVertical: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderColor: '#1976d2',
    borderWidth: 3,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginVertical: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  inputDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sizeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 60,
    alignItems: 'center',
  },
  activeChip: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeChipText: {
    color: '#fff',
  },
  resetButton: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  preview: {
    padding: 20,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewText: {
    marginBottom: 12,
    lineHeight: 24,
  },
  previewHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewLink: {
    textDecorationLine: 'underline',
  },
});