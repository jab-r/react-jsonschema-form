import React from 'react';
import type { ComponentType } from 'react';
import NativeArrayFieldTemplate from './ArrayFieldTemplate';
import NativeArrayFieldDescriptionTemplate from './ArrayFieldDescriptionTemplate';
import NativeArrayFieldItemTemplate from './ArrayFieldItemTemplate';
import NativeArrayFieldTitleTemplate from './ArrayFieldTitleTemplate';
import { NativeFieldTemplate } from '../NativeFieldTemplate';
import { NativeErrorList } from '../NativeErrorList';
import {
  TextWidget,
  SelectWidget,
  CheckboxWidget,
  TextareaWidget,
  RadioWidget,
  DateTimeWidget,
  RangeWidget,
  EmailWidget,
  URLWidget,
  PasswordWidget,
} from '../../widgets/native';
import type {
  Widget,
  Registry,
  TemplatesType,
  IconButtonProps,
  SubmitButtonProps,
  DescriptionFieldProps,
  TitleFieldProps,
  UnsupportedFieldProps,
  WrapIfAdditionalTemplateProps,
  FieldHelpProps,
  FieldErrorProps,
  ObjectFieldTemplateProps,
  RJSFSchema,
  ObjectFieldTemplatePropertyType,
} from '@rjsf/utils';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  PressableProps,
  GestureResponderEvent,
} from 'react-native';

const buttonStyles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  } as ViewStyle,
  buttonText: {
    textAlign: 'center',
  } as TextStyle,
  errorText: {
    color: '#dc3545',
  } as TextStyle,
});

type ButtonProps = PressableProps & {
  label: string;
};

const NativeButton: ComponentType<ButtonProps> = ({ label, onPress, disabled }) =>
  React.createElement(
    Pressable,
    { onPress, disabled, style: buttonStyles.button },
    React.createElement(Text, { style: buttonStyles.buttonText }, label)
  );

const AddButton: ComponentType<IconButtonProps> = ({ onClick, disabled }) =>
  React.createElement(NativeButton, {
    label: 'Add',
    onPress: (e: GestureResponderEvent) => onClick?.({ preventDefault: () => {} } as any),
    disabled,
  });

const RemoveButton: ComponentType<IconButtonProps> = ({ onClick, disabled }) =>
  React.createElement(NativeButton, {
    label: 'Remove',
    onPress: (e: GestureResponderEvent) => onClick?.({ preventDefault: () => {} } as any),
    disabled,
  });

const MoveUpButton: ComponentType<IconButtonProps> = ({ onClick, disabled }) =>
  React.createElement(NativeButton, {
    label: 'Move Up',
    onPress: (e: GestureResponderEvent) => onClick?.({ preventDefault: () => {} } as any),
    disabled,
  });

const MoveDownButton: ComponentType<IconButtonProps> = ({ onClick, disabled }) =>
  React.createElement(NativeButton, {
    label: 'Move Down',
    onPress: (e: GestureResponderEvent) => onClick?.({ preventDefault: () => {} } as any),
    disabled,
  });

const CopyButton: ComponentType<IconButtonProps> = ({ onClick, disabled }) =>
  React.createElement(NativeButton, {
    label: 'Copy',
    onPress: (e: GestureResponderEvent) => onClick?.({ preventDefault: () => {} } as any),
    disabled,
  });

const SubmitButton: ComponentType<SubmitButtonProps> = ({ uiSchema = {} }) => {
  const submitButtonOptions = uiSchema?.['ui:submitButtonOptions'] ?? {};
  const submitButtonProps = submitButtonOptions.props ?? {};
  const submitText = submitButtonOptions.submitText ?? 'Submit';
  const isDisabled = submitButtonProps.disabled ?? false;

  return React.createElement(NativeButton, {
    label: submitText,
    onPress: () => submitButtonProps.onClick?.({ preventDefault: () => {} } as any),
    disabled: isDisabled,
  });
};

const DescriptionField: ComponentType<DescriptionFieldProps<any, RJSFSchema>> = ({ description }) =>
  React.createElement(View, null, React.createElement(Text, null, String(description)));

const TitleField: ComponentType<TitleFieldProps<any, RJSFSchema>> = ({ title }) =>
  React.createElement(View, null, React.createElement(Text, null, title));

const UnsupportedField: ComponentType<UnsupportedFieldProps<any, RJSFSchema>> = () =>
  React.createElement(View, null, React.createElement(Text, null, 'Unsupported field'));

const WrapIfAdditional: ComponentType<WrapIfAdditionalTemplateProps<any, RJSFSchema>> = ({ children }) =>
  React.createElement(View, null, children);

const FieldError: ComponentType<FieldErrorProps<any, RJSFSchema>> = ({ errors }) =>
  React.createElement(
    View,
    null,
    errors?.map((error, index) =>
      React.createElement(Text, { key: index, style: buttonStyles.errorText }, String(error))
    )
  );

const FieldHelp: ComponentType<FieldHelpProps<any, RJSFSchema>> = ({ help }) =>
  React.createElement(View, null, React.createElement(Text, null, String(help)));

const ObjectField: ComponentType<ObjectFieldTemplateProps<any, RJSFSchema>> = ({ properties }) =>
  React.createElement(
    View,
    null,
    properties.map((prop: ObjectFieldTemplatePropertyType) =>
      React.createElement(View, { key: prop.name }, prop.content)
    )
  );

const nativeWidgets = {
  TextWidget: TextWidget as Widget,
  SelectWidget: SelectWidget as Widget,
  CheckboxWidget: CheckboxWidget as Widget,
  TextareaWidget: TextareaWidget as Widget,
  RadioWidget: RadioWidget as Widget,
  DateTimeWidget: DateTimeWidget as Widget,
  RangeWidget: RangeWidget as Widget,
  EmailWidget: EmailWidget as Widget,
  URLWidget: URLWidget as Widget,
  PasswordWidget: PasswordWidget as Widget,
};

export const nativeTemplates: TemplatesType = {
  ArrayFieldTemplate: NativeArrayFieldTemplate,
  ArrayFieldItemTemplate: NativeArrayFieldItemTemplate,
  ArrayFieldDescriptionTemplate: NativeArrayFieldDescriptionTemplate,
  ArrayFieldTitleTemplate: NativeArrayFieldTitleTemplate,
  BaseInputTemplate: TextWidget as any,
  ButtonTemplates: {
    AddButton,
    CopyButton,
    MoveDownButton,
    MoveUpButton,
    RemoveButton,
    SubmitButton,
  },
  DescriptionFieldTemplate: DescriptionField,
  ErrorListTemplate: NativeErrorList,
  FieldTemplate: NativeFieldTemplate,
  FieldErrorTemplate: FieldError,
  FieldHelpTemplate: FieldHelp,
  TitleFieldTemplate: TitleField,
  UnsupportedFieldTemplate: UnsupportedField,
  WrapIfAdditionalTemplate: WrapIfAdditional,
  ObjectFieldTemplate: ObjectField,
};

export const nativeDefaultRegistry: Partial<Registry> = {
  fields: {},
  widgets: nativeWidgets,
  templates: nativeTemplates,
  rootSchema: {},
  formContext: {},
};
