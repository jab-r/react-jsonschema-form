import { StyleSheet } from 'react-native';
import type { ArrayFieldTemplateItemType, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 4,
    padding: 12,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
});

export default function NativeArrayFieldItemTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: ArrayFieldTemplateItemType<T, S, F> & NativeTemplateBaseProps) {
  const {
    children,
    disabled,
    hasToolbar,
    hasMoveDown,
    hasMoveUp,
    hasRemove,
    index,
    onDropIndexClick,
    onReorderClick,
    readonly,
    registry,
    testID,
  } = props;

  const {
    ButtonTemplates: { RemoveButton, MoveUpButton, MoveDownButton },
  } = registry.templates;

  return nativeBridge.createView({
    testID,
    style: styles.container,
    accessible: true,
    accessibilityRole: 'none',
    accessibilityLabel: `Array item ${index + 1}`,
    children: [
      children,
      hasToolbar &&
        nativeBridge.createView({
          testID: `${testID}-toolbar`,
          style: styles.toolbar,
          children: [
            hasMoveUp && (
              <MoveUpButton
                key='move-up'
                disabled={disabled || readonly}
                onClick={onReorderClick(index, index - 1)}
                registry={registry}
              />
            ),
            hasMoveDown && (
              <MoveDownButton
                key='move-down'
                disabled={disabled || readonly}
                onClick={onReorderClick(index, index + 1)}
                registry={registry}
              />
            ),
            hasRemove && (
              <RemoveButton
                key='remove'
                disabled={disabled || readonly}
                onClick={onDropIndexClick(index)}
                registry={registry}
              />
            ),
          ].filter(Boolean),
        }),
    ].filter(Boolean),
  });
}
