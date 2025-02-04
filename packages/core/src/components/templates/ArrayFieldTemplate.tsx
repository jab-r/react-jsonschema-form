import { StyleSheet } from 'react-native';
import type { AccessibilityRole } from 'react-native';
import {
  getTemplate,
  getUiOptions,
  ArrayFieldTemplateProps,
  ArrayFieldTemplateItemType,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateBaseProps } from './NativeTemplateBridge';

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
>(props: ArrayFieldTemplateProps<T, S, F> & NativeTemplateBaseProps) {
  const {
    canAdd,
    disabled,
    idSchema,
    uiSchema,
    items,
    onAddClick,
    readonly,
    registry,
    required,
    schema,
    title,
    testID,
  } = props;

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

  return nativeBridge.createView({
    testID,
    style: styles.container,
    accessible: true,
    accessibilityRole: 'adjustable' as AccessibilityRole,
    accessibilityLabel: title || schema.title || schema.description || 'Array field group',
    children: [
      <ArrayFieldTitleTemplate
        key='title'
        idSchema={idSchema}
        title={uiOptions.title || title}
        required={required}
        schema={schema}
        uiSchema={uiSchema}
        registry={registry}
      />,
      <ArrayFieldDescriptionTemplate
        key='description'
        idSchema={idSchema}
        description={uiOptions.description || schema.description}
        schema={schema}
        uiSchema={uiSchema}
        registry={registry}
      />,
      nativeBridge.createView({
        key: 'items',
        style: styles.itemList,
        children: items?.map(({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => (
          <ArrayFieldItemTemplate key={key} {...itemProps} />
        )),
      }),
      canAdd &&
        nativeBridge.createView({
          key: 'add-button',
          style: styles.addButton,
          children: (
            <AddButton onClick={onAddClick} disabled={disabled || readonly} uiSchema={uiSchema} registry={registry} />
          ),
        }),
    ].filter(Boolean),
  });
}
