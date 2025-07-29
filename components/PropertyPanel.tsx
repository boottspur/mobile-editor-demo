import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { BlockNode, ContainerProps, TextProps, ImageProps } from '../types';

interface PropertyPanelProps {
  block: BlockNode;
  onUpdate: (props: any) => void;
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ block, onUpdate, onClose }) => {
  const [props, setProps] = useState(block.props);

  const handleSave = () => {
    onUpdate(props);
    onClose();
  };

  const updateProp = (key: string, value: any) => {
    setProps({ ...props, [key]: value });
  };

  const renderContainerProperties = () => {
    const containerProps = props as ContainerProps;
    return (
      <>
        <PropertyInput
          label="Padding"
          value={containerProps.padding?.toString() || '20'}
          onChangeText={(value) => updateProp('padding', parseInt(value) || 20)}
          keyboardType="numeric"
        />
        <PropertyInput
          label="Background Color"
          value={containerProps.backgroundColor || '#ffffff'}
          onChangeText={(value) => updateProp('backgroundColor', value)}
          placeholder="#ffffff"
        />
        <PropertyInput
          label="Width"
          value={containerProps.width || '100%'}
          onChangeText={(value) => updateProp('width', value)}
          placeholder="100%"
        />
      </>
    );
  };

  const renderTextProperties = () => {
    const textProps = props as TextProps;
    return (
      <>
        <PropertyInput
          label="Content"
          value={textProps.content}
          onChangeText={(value) => updateProp('content', value)}
          multiline
          numberOfLines={3}
        />
        <PropertyInput
          label="Font Size"
          value={textProps.fontSize?.toString() || '16'}
          onChangeText={(value) => updateProp('fontSize', parseInt(value) || 16)}
          keyboardType="numeric"
        />
        <PropertyInput
          label="Color"
          value={textProps.color || '#333333'}
          onChangeText={(value) => updateProp('color', value)}
          placeholder="#333333"
        />
        <PropertySelect
          label="Font Weight"
          value={textProps.fontWeight || 'normal'}
          options={['normal', 'bold', '600', '700', '800']}
          onSelect={(value) => updateProp('fontWeight', value)}
        />
        <PropertySelect
          label="Text Align"
          value={textProps.textAlign || 'left'}
          options={['left', 'center', 'right', 'justify']}
          onSelect={(value) => updateProp('textAlign', value)}
        />
      </>
    );
  };

  const renderImageProperties = () => {
    const imageProps = props as ImageProps;
    return (
      <>
        <PropertyInput
          label="Image URL"
          value={imageProps.src}
          onChangeText={(value) => updateProp('src', value)}
          placeholder="https://..."
        />
        <PropertyInput
          label="Alt Text"
          value={imageProps.alt || ''}
          onChangeText={(value) => updateProp('alt', value)}
          placeholder="Image description"
        />
        <PropertyInput
          label="Width"
          value={imageProps.width || '100%'}
          onChangeText={(value) => updateProp('width', value)}
          placeholder="100% or 300px"
        />
        <PropertyInput
          label="Height"
          value={imageProps.height || 'auto'}
          onChangeText={(value) => updateProp('height', value)}
          placeholder="auto or 200px"
        />
      </>
    );
  };

  return (
    <View style={styles.fullScreenOverlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        onPress={onClose} 
        activeOpacity={1}
      />
      
      <KeyboardAvoidingView 
        style={styles.panelContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.panel}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.title}>
                {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Properties
              </Text>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {block.type === 'container' && renderContainerProperties()}
              {block.type === 'text' && renderTextProperties()}
              {block.type === 'image' && renderImageProperties()}
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

interface PropertyInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  </View>
);

interface PropertySelectProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

const PropertySelect: React.FC<PropertySelectProps> = ({ label, value, options, onSelect }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.selectContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.selectOption, value === option && styles.selectOptionActive]}
          onPress={() => onSelect(option)}
        >
          <Text style={[styles.selectOptionText, value === option && styles.selectOptionTextActive]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panelContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: screenHeight * 0.75,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  panel: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
  },
  content: {
    maxHeight: screenHeight * 0.5,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  inputGroup: {
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
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    margin: 4,
    backgroundColor: '#fff',
  },
  selectOptionActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  selectOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectOptionTextActive: {
    color: '#fff',
  },
});