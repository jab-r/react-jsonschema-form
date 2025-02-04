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

const URLWidget: React.FC<NativeWidgetProps> = ({
  id = '',
  value,
  disabled = false,
  readonly = false,
  onChange,
  onBlur,
  onFocus,
  placeholder = 'https://example.com',
  style,
  textStyle,
  label,
  schema,
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

  const accessibilityLabel = label || schema?.title || 'URL input field';
  const accessibilityHint = schema?.description || 'Enter a valid URL starting with http:// or https://';

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
      keyboardType='url'
      autoCapitalize='none'
      autoCorrect={false}
      spellCheck={false}
      textContentType='URL'
      autoComplete='url'
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole='text'
      accessibilityState={{
        disabled: disabled || readonly,
      }}
      importantForAccessibility='yes'
    />
  );
};

export default URLWidget;
