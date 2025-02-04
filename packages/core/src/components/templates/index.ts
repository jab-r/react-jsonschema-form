import React from 'react';
import { StyleSheet } from 'react-native';
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TemplatesType,
  ObjectFieldTemplateProps,
  TitleFieldProps,
  DescriptionFieldProps,
  FieldErrorProps,
  FieldHelpProps,
  ObjectFieldTemplatePropertyType,
  ArrayFieldTemplateProps,
  ArrayFieldTemplateItemType,
  ArrayFieldDescriptionProps,
  ArrayFieldTitleProps,
  BaseInputTemplateProps,
  FieldTemplateProps,
  SubmitButtonProps,
} from '@rjsf/utils';

import { TextWidget } from '../widgets/native';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateStyles, NativeTemplateBaseProps } from './NativeTemplateBridge';
import { NativeSubmitButton } from './NativeSubmitButton';

import ArrayFieldDescriptionTemplate from './ArrayFieldDescriptionTemplate';
import ArrayFieldItemTemplate from './ArrayFieldItemTemplate';
import ArrayFieldTemplate from './ArrayFieldTemplate';
import ArrayFieldTitleTemplate from './ArrayFieldTitleTemplate';
import { NativeFieldTemplate } from './NativeFieldTemplate';
import { NativeErrorList } from './NativeErrorList';
import * as ButtonTemplates from './ButtonTemplates';

const defaultStyles: NativeTemplateStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  text: {
    fontSize: 14,
    color: '#000000',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
});

function ObjectFieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: ObjectFieldTemplateProps<T, S, F> & NativeTemplateBaseProps
): React.ReactElement {
  const { properties, title, description, styles = defaultStyles, testID } = props;

  const titleElement = title
    ? nativeBridge.createText({
        key: 'title',
        testID: `${testID}-title`,
        style: styles.title,
        children: title,
      })
    : null;

  const descriptionElement = description
    ? nativeBridge.createText({
        key: 'description',
        testID: `${testID}-description`,
        style: styles.description,
        children: description,
      })
    : null;

  const propertyElements = properties.map((prop: ObjectFieldTemplatePropertyType) =>
    nativeBridge.createView({
      key: prop.name,
      testID: `${testID}-property-${prop.name}`,
      style: [styles.container, prop.hidden && { display: 'none' }],
      children: prop.content,
    })
  );

  return nativeBridge.createView({
    testID,
    style: styles.container,
    children: [titleElement, descriptionElement, ...propertyElements].filter(Boolean),
  });
}

function TitleFieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: TitleFieldProps<T, S, F> & NativeTemplateBaseProps
): React.ReactElement {
  const { title, styles = defaultStyles, testID } = props;
  return nativeBridge.createText({
    testID,
    style: styles.title,
    children: title,
  });
}

function DescriptionFieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: DescriptionFieldProps<T, S, F> & NativeTemplateBaseProps
): React.ReactElement | null {
  const { description, styles = defaultStyles, testID } = props;
  if (!description) {
    return null;
  }
  return nativeBridge.createText({
    testID,
    style: styles.description,
    children: description,
  });
}

function FieldHelpTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: FieldHelpProps<T, S, F> & NativeTemplateBaseProps
): React.ReactElement | null {
  const { help, styles = defaultStyles, testID } = props;
  if (!help) {
    return null;
  }
  return nativeBridge.createText({
    testID,
    style: styles.helpText,
    children: help,
  });
}

function FieldErrorTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: FieldErrorProps<T, S, F> & NativeTemplateBaseProps
): React.ReactElement | null {
  const { errors = [], styles = defaultStyles, testID } = props;
  if (!errors?.length) {
    return null;
  }
  const errorElements = errors.map((error: string | React.ReactElement, index: number) => 
    nativeBridge.createText({
      key: `error-${index}`,
      testID: `${testID}-error-${index}`,
      style: styles.errorText,
      children: error,
    })
  );

  return nativeBridge.createView({
    testID,
    style: styles.container,
    children: errorElements,
  });
}

function templates<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(): TemplatesType<
  T,
  S,
  F
> {
  return {
    ArrayFieldDescriptionTemplate: ArrayFieldDescriptionTemplate as React.ComponentType<
      ArrayFieldDescriptionProps<T, S, F>
    >,
    ArrayFieldItemTemplate: ArrayFieldItemTemplate as React.ComponentType<ArrayFieldTemplateItemType<T, S, F>>,
    ArrayFieldTemplate: ArrayFieldTemplate as React.ComponentType<ArrayFieldTemplateProps<T, S, F>>,
    ArrayFieldTitleTemplate: ArrayFieldTitleTemplate as React.ComponentType<ArrayFieldTitleProps<T, S, F>>,
    BaseInputTemplate: TextWidget as unknown as React.ComponentType<BaseInputTemplateProps<T, S, F>>,
    ButtonTemplates: {
      AddButton: ButtonTemplates.AddButton,
      CopyButton: ButtonTemplates.CopyButton,
      MoveDownButton: ButtonTemplates.MoveDownButton,
      MoveUpButton: ButtonTemplates.MoveUpButton,
      RemoveButton: ButtonTemplates.RemoveButton,
      SubmitButton: NativeSubmitButton as unknown as React.ComponentType<SubmitButtonProps<T, S, F>>,
    },
    DescriptionFieldTemplate: DescriptionFieldTemplate as React.ComponentType<DescriptionFieldProps<T, S, F>>,
    ErrorListTemplate: NativeErrorList,
    FieldTemplate: NativeFieldTemplate as unknown as React.ComponentType<FieldTemplateProps<T, S, F>>,
    FieldErrorTemplate: FieldErrorTemplate as React.ComponentType<FieldErrorProps<T, S, F>>,
    FieldHelpTemplate: FieldHelpTemplate as React.ComponentType<FieldHelpProps<T, S, F>>,
    ObjectFieldTemplate: ObjectFieldTemplate as React.ComponentType<ObjectFieldTemplateProps<T, S, F>>,
    TitleFieldTemplate: TitleFieldTemplate as React.ComponentType<TitleFieldProps<T, S, F>>,
    UnsupportedFieldTemplate: () => null,
    WrapIfAdditionalTemplate: ({ children }: { children: React.ReactNode }) => children,
  };
}

export default templates;
