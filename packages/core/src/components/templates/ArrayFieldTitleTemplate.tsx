import { StyleSheet } from 'react-native';
import type { ArrayFieldTitleProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  required: {
    color: '#dc3545',
    marginLeft: 4,
  },
});

export default function NativeArrayFieldTitleTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: ArrayFieldTitleProps<T, S, F> & NativeTemplateBaseProps) {
  const { title, required, testID } = props;

  if (!title) {
    return null;
  }

  return nativeBridge.createView({
    testID,
    style: styles.container,
    accessible: true,
    accessibilityRole: 'header',
    children: nativeBridge.createView({
      testID: `${testID}-title-container`,
      style: styles.titleContainer,
      children: [
        nativeBridge.createText({
          testID: `${testID}-title-text`,
          style: styles.title,
          children: title,
        }),
        required &&
          nativeBridge.createText({
            testID: `${testID}-required-indicator`,
            style: styles.required,
            children: '*',
          }),
      ].filter(Boolean),
    }),
  });
}
