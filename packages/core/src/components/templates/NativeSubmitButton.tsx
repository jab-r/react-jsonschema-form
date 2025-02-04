import { useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import type { SubmitButtonProps, UiSchema } from '@rjsf/utils';

/** Styles for the submit button component */
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

/**
 * The NativeSubmitButton component renders a submit button for the form
 * with proper styling and event handling based on the form's state.
 */
export const NativeSubmitButton = ({ uiSchema = {} as UiSchema }: SubmitButtonProps): JSX.Element | null => {
  const submitButtonOptions = uiSchema?.['ui:submitButtonOptions'] ?? {};
  const submitButtonProps = submitButtonOptions.props ?? {};
  const submitText = submitButtonOptions.submitText ?? 'Submit';
  const norender = submitButtonOptions.norender ?? false;
  const isDisabled = submitButtonProps.disabled ?? false;

  const handlePress = useCallback(() => {
    if (!isDisabled && submitButtonProps.onClick) {
      submitButtonProps.onClick();
    }
  }, [isDisabled, submitButtonProps.onClick]);

  if (norender) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={isDisabled}
      {...(submitButtonProps as { style?: StyleProp<ViewStyle> })}
    >
      <Text style={styles.text}>{submitText}</Text>
    </TouchableOpacity>
  );
};

export default NativeSubmitButton;
