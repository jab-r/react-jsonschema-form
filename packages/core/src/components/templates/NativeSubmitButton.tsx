import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { SubmitButtonProps } from '@rjsf/utils';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export const NativeSubmitButton: React.FC<SubmitButtonProps> = ({
  uiSchema = {},
  disabled = false,
}) => {
  const {
    'ui:submitButtonOptions': {
      props: submitButtonProps = {},
      submitText = 'Submit',
      norender = false,
    } = {},
  } = uiSchema;

  if (norender) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={() => {
        if (!disabled && submitButtonProps.onClick) {
          submitButtonProps.onClick();
        }
      }}
      disabled={disabled}
      {...submitButtonProps}
    >
      <Text style={styles.text}>{submitText}</Text>
    </TouchableOpacity>
  );
};

export default NativeSubmitButton;
