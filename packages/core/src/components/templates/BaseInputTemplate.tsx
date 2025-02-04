import { useCallback } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import type { BaseInputTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  disabled: {
    backgroundColor: '#e9ecef',
  },
  error: {
    borderColor: '#dc3545',
  },
});

export default function BaseInputTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: BaseInputTemplateProps<T, S, F> & NativeTemplateBaseProps) {
  const {
    id,
    value,
    readonly,
    disabled,
    autofocus,
    onBlur,
    onFocus,
    onChange,
    options,
    schema,
    type,
    rawErrors,
    testID,
  } = props;

  const inputValue = value || value === 0 ? String(value) : '';

  const getKeyboardType = () => {
    switch (type) {
      case 'number':
      case 'integer':
        return 'numeric';
      case 'email':
        return 'email-address';
      case 'tel':
        return 'phone-pad';
      case 'url':
        return 'url';
      default:
        return 'default';
    }
  };

  const getTextContentType = () => {
    switch (type) {
      case 'email':
        return 'emailAddress';
      case 'tel':
        return 'telephoneNumber';
      case 'url':
        return 'URL';
      case 'password':
        return 'password';
      default:
        return 'none';
    }
  };

  const _onChange = useCallback(
    (text: string) => onChange(text === '' ? options.emptyValue : text),
    [onChange, options]
  );

  const _onBlur = useCallback(() => onBlur && onBlur(id, inputValue), [onBlur, id, inputValue]);

  const _onFocus = useCallback(() => onFocus && onFocus(id, inputValue), [onFocus, id, inputValue]);

  const inputStyle = [styles.input, disabled ? styles.disabled : null, rawErrors?.length ? styles.error : null].filter(
    Boolean
  );

  const placeholder =
    Array.isArray(schema.examples) && schema.examples.length > 0 ? String(schema.examples[0]) : undefined;

  return nativeBridge.createView({
    testID,
    accessible: true,
    accessibilityRole: 'textbox',
    accessibilityLabel: schema.title || schema.description || id,
    children: (
      <TextInput
        testID={`${testID}-input`}
        style={inputStyle}
        value={inputValue}
        onChangeText={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        editable={!readonly && !disabled}
        autoFocus={autofocus}
        keyboardType={getKeyboardType()}
        textContentType={getTextContentType()}
        secureTextEntry={type === 'password'}
        placeholder={placeholder}
        placeholderTextColor='#6c757d'
      />
    ),
  });
}
