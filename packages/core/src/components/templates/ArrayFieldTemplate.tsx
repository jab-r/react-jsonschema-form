import { View, StyleSheet, type AccessibilityRole } from 'react-native';
import {
  getTemplate,
  getUiOptions,
  ArrayFieldTemplateProps,
  ArrayFieldTemplateItemType,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  itemList: {
    marginBottom: 8,
  },
  addButton: {
    marginTop: 8,
  },
});

export default function NativeArrayFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: ArrayFieldTemplateProps<T, S, F>) {
  const { canAdd, disabled, idSchema, uiSchema, items, onAddClick, readonly, registry, required, schema, title } = props;

  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const ArrayFieldDescriptionTemplate = getTemplate<'ArrayFieldDescriptionTemplate', T, S, F>(
    'ArrayFieldDescriptionTemplate',
    registry,
    uiOptions
  );
  const ArrayFieldItemTemplate = getTemplate<'ArrayFieldItemTemplate', T, S, F>(
    'ArrayFieldItemTemplate',
    registry,
    uiOptions
  );
  const ArrayFieldTitleTemplate = getTemplate<'ArrayFieldTitleTemplate', T, S, F>(
    'ArrayFieldTitleTemplate',
    registry,
    uiOptions
  );

  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole={'adjustable' as AccessibilityRole}
      accessibilityLabel={title || schema.title || schema.description || 'Array field group'}
    >
      <ArrayFieldTitleTemplate
        idSchema={idSchema}
        title={uiOptions.title || title}
        required={required}
        schema={schema}
        uiSchema={uiSchema}
        registry={registry}
      />
      <ArrayFieldDescriptionTemplate
        idSchema={idSchema}
        description={uiOptions.description || schema.description}
        schema={schema}
        uiSchema={uiSchema}
        registry={registry}
      />
      <View style={styles.itemList}>
        {items &&
          items.map(({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => (
            <ArrayFieldItemTemplate key={key} {...itemProps} />
          ))}
      </View>
      {canAdd && (
        <View style={styles.addButton}>
          <AddButton onClick={onAddClick} disabled={disabled || readonly} uiSchema={uiSchema} registry={registry} />
        </View>
      )}
    </View>
  );
}
