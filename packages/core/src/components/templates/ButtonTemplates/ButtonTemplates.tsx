import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import type { IconButtonProps, SubmitButtonProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

interface NativeButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const NativeButton: React.FC<NativeButtonProps> = ({ label, onPress, disabled }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={[styles.button, { backgroundColor: disabled ? '#ccc' : '#007bff' }]}
  >
    <Text style={styles.buttonText}>{label}</Text>
  </Pressable>
);

export const AddButton = <T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  onClick,
  disabled,
}: IconButtonProps<T, S, F>): JSX.Element => (
  <NativeButton label='Add' onPress={() => onClick?.({ preventDefault: () => {} } as any)} disabled={disabled} />
);

export const RemoveButton = <T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  onClick,
  disabled,
}: IconButtonProps<T, S, F>): JSX.Element => (
  <NativeButton label='Remove' onPress={() => onClick?.({ preventDefault: () => {} } as any)} disabled={disabled} />
);

export const MoveUpButton = <T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  onClick,
  disabled,
}: IconButtonProps<T, S, F>): JSX.Element => (
  <NativeButton label='Move Up' onPress={() => onClick?.({ preventDefault: () => {} } as any)} disabled={disabled} />
);

export const MoveDownButton = <T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  onClick,
  disabled,
}: IconButtonProps<T, S, F>): JSX.Element => (
  <NativeButton label='Move Down' onPress={() => onClick?.({ preventDefault: () => {} } as any)} disabled={disabled} />
);

export const CopyButton = <T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  onClick,
  disabled,
}: IconButtonProps<T, S, F>): JSX.Element => (
  <NativeButton label='Copy' onPress={() => onClick?.({ preventDefault: () => {} } as any)} disabled={disabled} />
);

export const SubmitButton = <T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  uiSchema = {},
}: SubmitButtonProps<T, S, F>): JSX.Element => {
  const submitButtonOptions = uiSchema?.['ui:submitButtonOptions'] ?? {};
  const submitButtonProps = submitButtonOptions.props ?? {};
  const submitText = submitButtonOptions.submitText ?? 'Submit';
  const isDisabled = submitButtonProps.disabled ?? false;

  return <NativeButton label={submitText} onPress={() => submitButtonProps.onClick?.()} disabled={isDisabled} />;
};
