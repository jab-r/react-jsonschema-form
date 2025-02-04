import { View, StyleSheet } from 'react-native';
import type { ArrayFieldTemplateItemType, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

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
>(props: ArrayFieldTemplateItemType<T, S, F>) {
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
  } = props;

  const {
    ButtonTemplates: { RemoveButton, MoveUpButton, MoveDownButton },
  } = registry.templates;

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={`Array item ${index + 1}`}
    >
      {children}
      {hasToolbar && (
        <View style={styles.toolbar}>
          {hasMoveUp && (
            <MoveUpButton
              disabled={disabled || readonly}
              onClick={onReorderClick(index, index - 1)}
              registry={registry}
            />
          )}
          {hasMoveDown && (
            <MoveDownButton
              disabled={disabled || readonly}
              onClick={onReorderClick(index, index + 1)}
              registry={registry}
            />
          )}
          {hasRemove && (
            <RemoveButton
              disabled={disabled || readonly}
              onClick={onDropIndexClick(index)}
              registry={registry}
            />
          )}
        </View>
      )}
    </View>
  );
}
