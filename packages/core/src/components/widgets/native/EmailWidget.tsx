import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { NativeWidgetProps } from './types';

const styles = StyleSheet.create({
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    minHeight: 40,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
});

const EmailWidget: React.FC<NativeWidgetProps> = ({
  id = '',
  value,
  disabled = false,
  readonly = false,
  onChange,
  onBlur,
  onFocus,
  placeholder = 'email@example.com',
  style,
  textStyle,
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
      style={[styles.input, (disabled || readonly) && styles.disabledInput, style, textStyle]}
      value={value ? String(value) : ''}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
      onFocus={handleFocus}
      editable={!disabled && !readonly}
      placeholder={placeholder}
      keyboardType='email-address'
      autoCapitalize='none'
      autoCorrect={false}
      spellCheck={false}
      textContentType='emailAddress'
      autoComplete='email'
    />
  );
};

export default EmailWidget;
