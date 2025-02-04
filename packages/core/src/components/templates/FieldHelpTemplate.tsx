import { StyleSheet } from 'react-native';
import { helpId, FieldHelpProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666666',
  },
});

export default function FieldHelpTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: FieldHelpProps<T, S, F> & NativeTemplateBaseProps) {
  const { idSchema, help, testID } = props;

  if (!help) {
    return null;
  }

  const id = helpId<T>(idSchema);

  return nativeBridge.createView({
    testID,
    id,
    style: styles.container,
    accessible: true,
    accessibilityRole: 'text',
    accessibilityLabel: typeof help === 'string' ? help : undefined,
    children:
      typeof help === 'string'
        ? nativeBridge.createText({
            testID: `${testID}-text`,
            style: styles.helpText,
            children: help,
          })
        : help,
  });
}
