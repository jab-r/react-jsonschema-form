import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { SelectWidgetProps, SelectOption } from './types';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        backgroundColor: '#fff',
      },
      android: {
        elevation: 1,
      },
    }),
  },
  error: {
    borderColor: '#dc3545',
  },
});

const SelectWidget: React.FC<SelectWidgetProps> = ({
  id = '',
  options,
  value,
  required = false,
  disabled = false,
  readonly = false,
  onChange,
  onBlur,
  onFocus,
  style,
  rawErrors = [],
  label,
  testID,
}) => {
  const { enumOptions = [], enumDisabled = [] } = options;
  const hasError = rawErrors && rawErrors.length > 0;

  const handleValueChange = React.useCallback(
    (itemValue: string | number | boolean) => {
      onChange(itemValue);
      if (onBlur && id) {
        onBlur(id, itemValue);
      }
    },
    [onChange, onBlur, id]
  );

  const handleFocus = React.useCallback(() => {
    if (onFocus && id) {
      onFocus(id, value);
    }
  }, [onFocus, id, value]);

  return (
    <View style={[styles.container, hasError && styles.error, style]}>
      <Picker
        enabled={!disabled && !readonly}
        selectedValue={value}
        onValueChange={handleValueChange}
        onFocus={handleFocus}
        testID={testID}
        accessibilityLabel={label || `Select ${id}`}
        accessibilityHint={`Select an option${required ? ' (required)' : ''}`}
        accessibilityRole='combobox'
        accessibilityState={{
          disabled: disabled || readonly,
        }}
      >
        {!required && <Picker.Item label='' value='' />}
        {enumOptions.map((option: SelectOption, index: number) => (
          <Picker.Item
            key={index}
            label={String(option.label)}
            value={option.value}
            enabled={!enumDisabled.includes(option.value)}
          />
        ))}
      </Picker>
    </View>
  );
};

export default SelectWidget;
