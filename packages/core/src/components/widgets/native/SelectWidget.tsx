import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
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
  disabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
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
  schema,
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

  const accessibilityLabel = label || schema?.title || `Select ${id}`;
  const accessibilityHint =
    schema?.description ||
    `Select an option${required ? ' (required)' : ''}${hasError ? '. Has validation errors' : ''}`;

  return (
    <View>
      <View style={[styles.container, hasError && styles.error, (disabled || readonly) && styles.disabled, style]}>
        <Picker
          nativeID={id}
          enabled={!disabled && !readonly}
          selectedValue={value}
          onValueChange={handleValueChange}
          onFocus={handleFocus}
          accessible={true}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole='combobox'
          accessibilityState={{
            disabled: disabled || readonly,
            selected: value !== undefined && value !== '',
          }}
          importantForAccessibility='yes'
        >
          {!required && <Picker.Item label='' value='' enabled={!disabled && !readonly} />}
          {enumOptions.map((option: SelectOption, index: number) => (
            <Picker.Item
              key={index}
              label={String(option.label)}
              value={option.value}
              enabled={!enumDisabled.includes(option.value) && !disabled && !readonly}
            />
          ))}
        </Picker>
      </View>
      {hasError &&
        rawErrors.map((error: string, index: number) => (
          <Text
            key={index}
            style={styles.errorText}
            accessible={true}
            accessibilityRole='alert'
            accessibilityLabel={`Error: ${error}`}
          >
            {error}
          </Text>
        ))}
    </View>
  );
};

export default SelectWidget;
