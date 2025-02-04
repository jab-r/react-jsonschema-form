import React, { useRef } from 'react';
import { View, ScrollView } from 'react-native';
import {
  RJSFSchema,
  StrictRJSFSchema,
  FormContextType,
  getTemplate,
  getUiOptions,
  UI_GLOBAL_OPTIONS_KEY,
  UI_OPTIONS_KEY,
  SUBMIT_BTN_OPTIONS_KEY,
  Registry,
  TemplatesType,
} from '@rjsf/utils';
import { FormProps } from './types';
import { useForm } from './hooks/useForm';

export function FormNative<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  schema,
  validator,
  children,
  uiSchema = {},
  formData: initialFormData,
  formContext = {} as F,
  idPrefix,
  idSeparator,
  disabled = false,
  readonly = false,
  fields = {},
  templates = {},
  widgets = {},
  onChange,
  onError,
  onSubmit,
  onBlur,
  onFocus,
  customValidate,
  extraErrors,
  extraErrorsBlockSubmit = false,
  noValidate = false,
  liveValidate = false,
  liveOmit = false,
  omitExtraData = false,
  showErrorList = 'top',
  transformErrors,
  focusOnFirstError = false,
  translateString = (str: string) => str,
  experimental_defaultFormStateBehavior,
  experimental_customMergeAllOf,
  style,
}: FormProps<T, S, F>) {
  const formElement = useRef<ScrollView>(null);

  const {
    formData,
    schema: currentSchema,
    uiSchema: currentUiSchema,
    idSchema,
    errors,
    errorSchema,
    handleChange,
    handleSubmit,
    handleBlur,
    handleFocus,
    schemaUtils,
  } = useForm<T, S, F>({
    schema,
    validator,
    initialData: initialFormData,
    uiSchema,
    noValidate,
    liveValidate,
    customValidate,
    transformErrors,
    extraErrors,
    extraErrorsBlockSubmit,
    omitExtraData,
    onError,
    onSubmit,
    onBlur,
    onFocus,
    experimental_defaultFormStateBehavior,
    experimental_customMergeAllOf,
  });

  const registry: Registry<T, S, F> = React.useMemo(
    () => ({
      fields: { ...fields },
      templates: {
        ...templates,
        ArrayFieldTemplate: templates.ArrayFieldTemplate || (() => null),
        ArrayFieldDescriptionTemplate: templates.ArrayFieldDescriptionTemplate || (() => null),
        ArrayFieldItemTemplate: templates.ArrayFieldItemTemplate || (() => null),
        ArrayFieldTitleTemplate: templates.ArrayFieldTitleTemplate || (() => null),
        BaseInputTemplate: templates.BaseInputTemplate || (() => null),
        ButtonTemplates: templates.ButtonTemplates || {},
        DescriptionFieldTemplate: templates.DescriptionFieldTemplate || (() => null),
        ErrorListTemplate: templates.ErrorListTemplate || (() => null),
        FieldErrorTemplate: templates.FieldErrorTemplate || (() => null),
        FieldHelpTemplate: templates.FieldHelpTemplate || (() => null),
        FieldTemplate: templates.FieldTemplate || (() => null),
        ObjectFieldTemplate: templates.ObjectFieldTemplate || (() => null),
        TitleFieldTemplate: templates.TitleFieldTemplate || (() => null),
        UnsupportedFieldTemplate: templates.UnsupportedFieldTemplate || (() => null),
        WrapIfAdditionalTemplate: templates.WrapIfAdditionalTemplate || (() => null),
      } as TemplatesType<T, S, F>,
      widgets: { ...widgets },
      rootSchema: schema,
      formContext,
      schemaUtils,
      translateString,
      globalUiOptions: uiSchema[UI_GLOBAL_OPTIONS_KEY],
    }),
    [fields, templates, widgets, schema, formContext, schemaUtils, translateString, uiSchema]
  );

  const renderErrors = () => {
    const options = getUiOptions<T, S, F>(uiSchema);
    const ErrorListTemplate = getTemplate<'ErrorListTemplate', T, S, F>('ErrorListTemplate', registry, options);

    if (errors && errors.length) {
      return (
        <ErrorListTemplate
          errors={errors}
          errorSchema={errorSchema}
          schema={currentSchema}
          uiSchema={currentUiSchema}
          formContext={formContext}
          registry={registry}
        />
      );
    }
    return null;
  };

  const { SchemaField } = registry.fields;
  const { SubmitButton } = registry.templates.ButtonTemplates || {};

  const submitOptions = {
    ...getUiOptions<T, S, F>(uiSchema)[SUBMIT_BTN_OPTIONS_KEY],
    props: {
      ...getUiOptions<T, S, F>(uiSchema)[SUBMIT_BTN_OPTIONS_KEY]?.props,
      disabled,
      onClick: handleSubmit,
    },
  };
  const submitUiSchema = { [UI_OPTIONS_KEY]: { [SUBMIT_BTN_OPTIONS_KEY]: submitOptions } };

  return (
    <ScrollView ref={formElement} style={style}>
      <View>
        {showErrorList === 'top' && renderErrors()}
        <SchemaField
          name=''
          schema={currentSchema}
          uiSchema={currentUiSchema}
          errorSchema={errorSchema}
          idSchema={idSchema}
          idPrefix={idPrefix}
          idSeparator={idSeparator}
          formContext={formContext}
          formData={formData}
          onChange={(formData, errorSchema) => handleChange(formData as T, errorSchema)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          registry={registry}
          disabled={disabled}
          readonly={readonly}
        />
        {children ? children : SubmitButton && <SubmitButton uiSchema={submitUiSchema} registry={registry} />}
        {showErrorList === 'bottom' && renderErrors()}
      </View>
    </ScrollView>
  );
}

export default FormNative;
