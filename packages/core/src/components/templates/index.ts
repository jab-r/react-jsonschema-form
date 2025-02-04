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
  IconButtonProps,
  SubmitButtonProps,
  ObjectFieldTemplatePropertyType,
} from '@rjsf/utils';

import { TextWidget } from '../widgets/native';
import { nativeBridge } from './NativeTemplateImplementation';
import type { NativeTemplateStyles, NativeTemplateBaseProps } from './NativeTemplateBridge';

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
  
  const titleElement = title ? nativeBridge.createText({
    key: 'title',
    testID: `${testID}-title`,
    style: styles.title,
    children: title,
  }) : null;

  const descriptionElement = description ? nativeBridge.createText({
    key: 'description',
    testID: `${testID}-description`,
    style: styles.description,
    children: description,
  }) : null;

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

function templates<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(): TemplatesType<T, S, F> {
  return {
    ArrayFieldDescriptionTemplate: ArrayFieldDescriptionTemplate as React.ComponentType<any>,
    ArrayFieldItemTemplate: ArrayFieldItemTemplate as React.ComponentType<any>,
    ArrayFieldTemplate: ArrayFieldTemplate as React.ComponentType<any>,
    ArrayFieldTitleTemplate: ArrayFieldTitleTemplate as React.ComponentType<any>,
    BaseInputTemplate: TextWidget as React.ComponentType<any>,
    ButtonTemplates: {
      AddButton: ButtonTemplates.AddButton as React.ComponentType<IconButtonProps<T, S, F>>,
      CopyButton: ButtonTemplates.CopyButton as React.ComponentType<IconButtonProps<T, S, F>>,
      MoveDownButton: ButtonTemplates.MoveDownButton as React.ComponentType<IconButtonProps<T, S, F>>,
      MoveUpButton: ButtonTemplates.MoveUpButton as React.ComponentType<IconButtonProps<T, S, F>>,
      RemoveButton: ButtonTemplates.RemoveButton as React.ComponentType<IconButtonProps<T, S, F>>,
      SubmitButton: ButtonTemplates.SubmitButton as React.ComponentType<SubmitButtonProps<T, S, F>>,
    },
    DescriptionFieldTemplate: DescriptionFieldTemplate as React.ComponentType<DescriptionFieldProps<T, S, F>>,
    ErrorListTemplate: NativeErrorList as React.ComponentType<any>,
    FieldTemplate: NativeFieldTemplate as React.ComponentType<any>,
    FieldErrorTemplate: FieldErrorTemplate as React.ComponentType<FieldErrorProps<T, S, F>>,
    FieldHelpTemplate: FieldHelpTemplate as React.ComponentType<FieldHelpProps<T, S, F>>,
    ObjectFieldTemplate: ObjectFieldTemplate as React.ComponentType<ObjectFieldTemplateProps<T, S, F>>,
    TitleFieldTemplate: TitleFieldTemplate as React.ComponentType<TitleFieldProps<T, S, F>>,
    UnsupportedFieldTemplate: () => null,
    WrapIfAdditionalTemplate: ({ children }: { children: React.ReactNode }) => children,
  };
}

export default templates;
