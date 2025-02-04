import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import type { NativeWidgetProps } from './types';

const styles = StyleSheet.create({
  textarea: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

const TextareaWidget: React.FC<NativeWidgetProps> = ({
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
      testID={id}
      style={[styles.textarea, style, textStyle]}
      value={value ? String(value) : ''}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
      onFocus={handleFocus}
      editable={!disabled && !readonly}
      placeholder={placeholder}
      multiline
      numberOfLines={4}
    />
  );
};

export default TextareaWidget;
