import React from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { NativeWidgetProps } from './types';
import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    padding: 8,
    paddingRight: 40, // Space for the show/hide button
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    minHeight: 40,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  toggleButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 4,
  },
});

const PasswordWidget: React.FC<NativeWidgetProps> = ({
  id = '',
  value,
  disabled = false,
  readonly = false,
  onChange,
  onBlur,
  onFocus,
  placeholder = '••••••••',
  style,
  textStyle,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

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

  const toggleShowPassword = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        nativeID={id}
        style={[styles.input, (disabled || readonly) && styles.disabledInput, style, textStyle]}
        value={value ? String(value) : ''}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        onFocus={handleFocus}
        editable={!disabled && !readonly}
        placeholder={placeholder}
        secureTextEntry={!showPassword}
        autoCapitalize='none'
        autoCorrect={false}
        spellCheck={false}
        textContentType='password'
        autoComplete='password'
      />
      {!disabled && !readonly && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleShowPassword}
          accessibilityRole='button'
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <Text style={{ fontSize: 20, color: '#666' }}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PasswordWidget;
