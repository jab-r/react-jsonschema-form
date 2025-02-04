import { StyleSheet } from 'react-native';
import { nativeBridge } from '../NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from '../NativeTemplateBridge';

const REQUIRED_FIELD_SYMBOL = '*';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  required: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#dc3545',
  },
});

export type LabelProps = {
  /** The label for the field */
  label?: string;
  /** A boolean value stating if the field is required */
  required?: boolean;
} & NativeTemplateBaseProps;

/** Renders a label for a field
 *
 * @param props - The `LabelProps` for this component
 */
export default function Label(props: LabelProps) {
  const { label, required, testID } = props;

  if (!label) {
    return null;
  }

  return nativeBridge.createView({
    testID,
    style: styles.container,
    accessible: true,
    accessibilityRole: 'text',
    children: [
      nativeBridge.createText({
        testID: `${testID}-text`,
        style: styles.label,
        children: label,
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
