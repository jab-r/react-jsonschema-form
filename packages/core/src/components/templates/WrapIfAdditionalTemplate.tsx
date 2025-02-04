import { StyleSheet, TextInput } from 'react-native';
import {
  ADDITIONAL_PROPERTY_FLAG,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TranslatableString,
  WrapIfAdditionalTemplateProps,
} from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  keyColumn: {
    flex: 5,
    marginRight: 8,
  },
  contentColumn: {
    flex: 5,
    marginRight: 8,
  },
  buttonColumn: {
    flex: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  inputDisabled: {
    backgroundColor: '#e9ecef',
  },
});

export default function WrapIfAdditionalTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: WrapIfAdditionalTemplateProps<T, S, F> & NativeTemplateBaseProps) {
  const { disabled, label, onKeyChange, onDropPropertyClick, readonly, schema, children, uiSchema, registry, testID } = props;

  const { templates, translateString } = registry;
  const { RemoveButton } = templates.ButtonTemplates;
  const keyLabel = translateString(TranslatableString.KeyLabel, [label]);
  const additional = ADDITIONAL_PROPERTY_FLAG in schema;

  if (!additional) {
    return nativeBridge.createView({
      testID,
      style: styles.container,
      children,
    });
  }

  return nativeBridge.createView({
    testID,
    style: styles.container,
    children: nativeBridge.createView({
      testID: `${testID}-row`,
      style: styles.row,
      children: [
        nativeBridge.createView({
          testID: `${testID}-key-column`,
          style: styles.keyColumn,
          children: [
            nativeBridge.createText({
              testID: `${testID}-key-label`,
              style: styles.label,
              children: keyLabel,
            }),
            nativeBridge.createView({
              testID: `${testID}-key-input-container`,
              style: [styles.input, (disabled || readonly) && styles.inputDisabled],
              children: (
                <TextInput
                  testID={`${testID}-key-input`}
                  defaultValue={label}
                  onBlur={(event) => onKeyChange(event.nativeEvent.text)}
                  editable={!disabled && !readonly}
                  accessibilityLabel={keyLabel}
                />
              ),
            }),
          ],
        }),
        nativeBridge.createView({
          testID: `${testID}-content-column`,
          style: styles.contentColumn,
          children,
        }),
        nativeBridge.createView({
          testID: `${testID}-button-column`,
          style: styles.buttonColumn,
          children: (
            <RemoveButton
              disabled={disabled || readonly}
              onClick={onDropPropertyClick(label)}
              uiSchema={uiSchema}
              registry={registry}
            />
          ),
        }),
      ],
    }),
  });
}
