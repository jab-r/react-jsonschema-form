import { StyleSheet } from 'react-native';
import { FormContextType, RJSFSchema, StrictRJSFSchema, TranslatableString, UnsupportedFieldProps } from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#fff3f3',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  message: {
    fontSize: 14,
    color: '#dc3545',
    marginBottom: 8,
  },
  schema: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666666',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
  },
});

function UnsupportedField<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: UnsupportedFieldProps<T, S, F> & NativeTemplateBaseProps
) {
  const { schema, idSchema, reason, registry, testID } = props;
  const { translateString } = registry;

  let translateEnum: TranslatableString = TranslatableString.UnsupportedField;
  const translateParams: string[] = [];

  if (idSchema && idSchema.$id) {
    translateEnum = TranslatableString.UnsupportedFieldWithId;
    translateParams.push(idSchema.$id);
  }

  if (reason) {
    translateEnum =
      translateEnum === TranslatableString.UnsupportedField
        ? TranslatableString.UnsupportedFieldWithReason
        : TranslatableString.UnsupportedFieldWithIdAndReason;
    translateParams.push(reason);
  }

  const message = translateString(translateEnum, translateParams);
  // Remove any HTML tags from the message since we're in React Native
  const cleanMessage = message.replace(/<[^>]*>/g, '');

  return nativeBridge.createView({
    testID,
    style: styles.container,
    accessible: true,
    accessibilityRole: 'alert',
    children: [
      nativeBridge.createText({
        testID: `${testID}-message`,
        style: styles.message,
        children: cleanMessage,
      }),
      schema &&
        nativeBridge.createText({
          testID: `${testID}-schema`,
          style: styles.schema,
          children: JSON.stringify(schema, null, 2),
        }),
    ].filter(Boolean),
  });
}

export default UnsupportedField;
