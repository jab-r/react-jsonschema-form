import { StyleSheet } from 'react-native';
import { errorId, FieldErrorProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fff3f3',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginBottom: 4,
  },
  lastError: {
    marginBottom: 0,
  },
});

export default function FieldErrorTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: FieldErrorProps<T, S, F> & NativeTemplateBaseProps) {
  const { errors = [], idSchema, testID } = props;

  if (errors.length === 0) {
    return null;
  }

  const id = errorId<T>(idSchema);
  const filteredErrors = errors.filter((elem) => !!elem);

  return nativeBridge.createView({
    testID,
    id,
    style: styles.container,
    accessible: true,
    accessibilityRole: 'alert',
    children: filteredErrors.map((error, index) =>
      nativeBridge.createText({
        key: `error-${index}`,
        testID: `${testID}-error-${index}`,
        style: [styles.errorText, index === filteredErrors.length - 1 && styles.lastError],
        children: error,
      })
    ),
  });
}
