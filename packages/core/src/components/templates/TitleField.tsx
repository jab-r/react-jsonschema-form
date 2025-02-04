import { StyleSheet } from 'react-native';
import { FormContextType, TitleFieldProps, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

const REQUIRED_FIELD_SYMBOL = '*';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  required: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
  },
});

export default function TitleField<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: TitleFieldProps<T, S, F> & NativeTemplateBaseProps
) {
  const { id, title, required, testID } = props;

  return nativeBridge.createView({
    testID,
    id,
    style: styles.container,
    accessible: true,
    accessibilityRole: 'header',
    children: [
      nativeBridge.createText({
        testID: `${testID}-title`,
        style: styles.title,
        children: title,
      }),
      required &&
        nativeBridge.createText({
          testID: `${testID}-required`,
          style: styles.required,
          children: REQUIRED_FIELD_SYMBOL,
        }),
    ].filter(Boolean),
  });
}
