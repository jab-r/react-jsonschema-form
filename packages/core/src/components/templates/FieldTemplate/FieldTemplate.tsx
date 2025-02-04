import { StyleSheet } from 'react-native';
import {
  FieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  getTemplate,
  getUiOptions,
} from '@rjsf/utils';
import { nativeBridge } from '../NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from '../NativeTemplateBridge';

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
});

export default function FieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: FieldTemplateProps<T, S, F> & NativeTemplateBaseProps) {
  const { label, children, errors, help, description, hidden, displayLabel, registry, uiSchema, testID } = props;

  const uiOptions = getUiOptions(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<'WrapIfAdditionalTemplate', T, S, F>(
    'WrapIfAdditionalTemplate',
    registry,
    uiOptions
  );

  if (hidden) {
    return nativeBridge.createView({
      testID: `${testID}-hidden`,
      style: styles.hidden,
      children,
    });
  }

  return (
    <WrapIfAdditionalTemplate {...props}>
      {nativeBridge.createView({
        testID: `${testID}-content`,
        style: styles.container,
        children: [
          displayLabel &&
            nativeBridge.createView({
              testID: `${testID}-label-container`,
              children: [
                nativeBridge.createText({
                  testID: `${testID}-label`,
                  style: styles.label,
                  children: label,
                }),
                displayLabel && description
                  ? nativeBridge.createText({
                      testID: `${testID}-description`,
                      style: styles.description,
                      children: description,
                    })
                  : null,
              ].filter(Boolean),
            }),
          children,
          errors,
          help,
        ].filter(Boolean),
      })}
    </WrapIfAdditionalTemplate>
  );
}
