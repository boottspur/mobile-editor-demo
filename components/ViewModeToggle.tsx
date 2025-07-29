import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

export type ViewMode = 'mobile' | 'desktop' | 'text';

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.leftButton,
            currentMode === 'mobile' && styles.activeButton,
          ]}
          onPress={() => onModeChange('mobile')}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleIcon}>📱</Text>
          <Text style={[
            styles.toggleText,
            currentMode === 'mobile' && styles.activeText,
          ]}>
            Mobile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.rightButton,
            currentMode === 'desktop' && styles.activeButton,
          ]}
          onPress={() => onModeChange('desktop')}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleIcon}>🖥️</Text>
          <Text style={[
            styles.toggleText,
            currentMode === 'desktop' && styles.activeText,
          ]}>
            Desktop
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {currentMode === 'mobile' 
            ? 'Editing in mobile view - columns stack vertically'
            : 'Editing in desktop view - columns display side by side'
          }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignSelf: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 100,
    justifyContent: 'center',
  },
  leftButton: {
    marginRight: 2,
  },
  rightButton: {
    marginLeft: 2,
  },
  activeButton: {
    backgroundColor: '#1976d2',
  },
  toggleIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeText: {
    color: '#fff',
  },
  infoContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});