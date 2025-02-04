import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface RadioButtonProps {
  selected: boolean;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  nativeID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  error?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    minHeight: 44, // Minimum touch target size
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDisabled: {
    borderColor: '#ccc',
  },
  radioError: {
    borderColor: '#dc3545',
  },
  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  selectedDisabled: {
    backgroundColor: '#ccc',
  },
  selectedError: {
    backgroundColor: '#dc3545',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  labelDisabled: {
    color: '#ccc',
  },
  labelError: {
    color: '#dc3545',
  },
});

export const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  disabled = false,
  label,
  onPress,
  nativeID,
  accessibilityLabel,
  accessibilityHint,
  error = false,
}) => {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      nativeID={nativeID}
      accessible={true}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityRole='radio'
      accessibilityState={{
        checked: selected,
        disabled: disabled,
      }}
      importantForAccessibility='yes'
    >
      <View
        style={[
          styles.radio,
          disabled && styles.radioDisabled,
          error && styles.radioError,
        ]}
      >
        {selected && (
          <View
            style={[
              styles.selected,
              disabled && styles.selectedDisabled,
              error && styles.selectedError,
            ]}
          />
        )}
      </View>
      <Text
        style={[
          styles.label,
          disabled && styles.labelDisabled,
          error && styles.labelError,
        ]}
        numberOfLines={2}
        accessible={false} // Hide from accessibility since parent Pressable handles it
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default RadioButton;
