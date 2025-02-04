import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeWidgetProps, SelectWidgetProps, SelectOption } from './types';

const styles = StyleSheet.create({
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
});

export const TextWidget: React.FC<NativeWidgetProps> = ({
  id = '',
  value,
  disabled = false,
  readonly = false,
  onChange,
  onBlur,
  onFocus,
  style,
  textStyle,
  placeholder,
}) => {
  const handleChangeText = React.useCallback(
    (text: string) => {
      onChange(text === '' ? undefined : text);
    },
    [onChange]
  );

  const handleBlur = React.useCallback(() => {
    if (onBlur && id) {
      onBlur(id, value);
    }
  }, [onBlur, id, value]);

  const handleFocus = React.useCallback(() => {
    if (onFocus && id) {
      onFocus(id, value);
    }
  }, [onFocus, id, value]);

  return (
    <TextInput
      nativeID={id}
      style={[styles.input, style, textStyle]}
      value={value ? String(value) : ''}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
      onFocus={handleFocus}
      editable={!disabled && !readonly}
      placeholder={placeholder}
    />
  );
};

export const SelectWidget: React.FC<SelectWidgetProps> = ({
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
}) => {
  const { enumOptions = [], enumDisabled = [] } = options;

  const handleValueChange = React.useCallback(
    (itemValue: any) => {
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
    <View style={[styles.pickerContainer, style]}>
      <Picker<any>
        enabled={!disabled && !readonly}
        selectedValue={value}
        onValueChange={handleValueChange}
        onFocus={handleFocus}
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

export const nativeWidgets = {
  TextWidget,
  SelectWidget,
} as const;
