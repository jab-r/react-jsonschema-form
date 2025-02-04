import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RadioButtonProps {
  selected: boolean;
  disabled?: boolean;
  label: string;
  onPress: () => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
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
  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  selectedDisabled: {
    backgroundColor: '#ccc',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  labelDisabled: {
    color: '#ccc',
  },
});

export const RadioButton: React.FC<RadioButtonProps> = ({ selected, disabled = false, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={disabled}>
      <View style={[styles.radio, disabled && styles.radioDisabled]}>
        {selected && <View style={[styles.selected, disabled && styles.selectedDisabled]} />}
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default RadioButton;
