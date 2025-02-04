import { StyleSheet } from 'react-native';
import type { ArrayFieldDescriptionProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
  },
});

export default function NativeArrayFieldDescriptionTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: ArrayFieldDescriptionProps<T, S, F> & NativeTemplateBaseProps) {
  const { description, testID } = props;

  if (!description) {
    return null;
  }

  return nativeBridge.createView({
    testID,
    style: styles.container,
    accessible: true,
    accessibilityRole: 'text',
    children: nativeBridge.createText({
      testID: `${testID}-text`,
      style: styles.description,
      children: description,
    }),
  });
}
