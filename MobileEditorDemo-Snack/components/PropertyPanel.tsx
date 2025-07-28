import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
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
          value={textProps.content || ''}
          onChangeText={(value) => updateProp('content', value)}
          multiline
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
          options={['normal', 'bold']}
          onSelect={(value) => updateProp('fontWeight', value)}
        />
        <PropertySelect
          label="Text Align"
          value={textProps.textAlign || 'left'}
          options={['left', 'center', 'right']}
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
          value={imageProps.src || ''}
          onChangeText={(value) => updateProp('src', value)}
          placeholder="https://example.com/image.jpg"
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
          placeholder="100%"
        />
        <PropertyInput
          label="Height"
          value={imageProps.height || 'auto'}
          onChangeText={(value) => updateProp('height', value)}
          placeholder="auto or 200"
        />
      </>
    );
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>{block.type.charAt(0).toUpperCase() + block.type.slice(1)} Properties</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            {block.type === 'container' && renderContainerProperties()}
            {block.type === 'text' && renderTextProperties()}
            {block.type === 'image' && renderImageProperties()}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

interface PropertyInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
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
          style={[
            styles.selectOption,
            value === option && styles.selectedOption,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text style={[
            styles.selectOptionText,
            value === option && styles.selectedOptionText,
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  selectOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
});