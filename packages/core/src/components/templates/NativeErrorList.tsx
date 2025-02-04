import { StyleSheet } from 'react-native';
import type { ErrorListProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff3f3',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 8,
  },
  errorItem: {
    fontSize: 14,
    color: '#dc3545',
    marginBottom: 4,
  },
});

export function NativeErrorList<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: ErrorListProps<T, S, F> & NativeTemplateBaseProps
) {
  const { errors, testID } = props;

  if (errors.length === 0) {
    return null;
  }

  return nativeBridge.createView({
    testID,
    style: styles.container,
    accessible: true,
    accessibilityRole: 'alert',
    children: [
      nativeBridge.createText({
        testID: `${testID}-title`,
        style: styles.title,
        children: 'Errors',
      }),
      ...errors.map((error, index) =>
        nativeBridge.createText({
          key: `error-${index}`,
          testID: `${testID}-error-${index}`,
          style: styles.errorItem,
          children: error.stack,
        })
      ),
    ],
  });
}

export default NativeErrorList;
