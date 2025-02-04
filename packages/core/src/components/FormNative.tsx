import { Component, RefObject, createRef } from 'react';
import { View, ScrollView, NativeSyntheticEvent, NativeTouchEvent } from 'react-native';
import {
  createSchemaUtils,
  deepEquals,
  ErrorSchema,
  FormContextType,
  GenericObjectType,
  getChangedFields,
  getTemplate,
  getUiOptions,
  isObject,
  mergeObjects,
  NAME_KEY,
  PathSchema,
  StrictRJSFSchema,
  Registry,
  RJSFSchema,
  RJSFValidationError,
  RJSF_ADDITIONAL_PROPERTIES_FLAG,
  SchemaUtilsType,
  shouldRender,
  SUBMIT_BTN_OPTIONS_KEY,
  toErrorList,
  UiSchema,
  UI_GLOBAL_OPTIONS_KEY,
  UI_OPTIONS_KEY,
  ValidationData,
  validationDataMerge,
} from '@rjsf/utils';
import _pick from 'lodash/pick';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { FormProps, FormState } from './types';

/** The `FormNative` component renders the outer form and all the fields defined in the `schema` */
export default class FormNative<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
> extends Component<FormProps<T, S, F>, FormState<T, S, F>> {
  formElement: RefObject<ScrollView>;

  constructor(props: FormProps<T, S, F>) {
    super(props);

    if (!props.validator) {
      throw new Error('A validator is required for Form functionality to work');
    }

    this.state = this.getStateFromProps(props, props.formData);
    if (this.props.onChange && !deepEquals(this.state.formData, this.props.formData)) {
      this.props.onChange(this.state);
    }
    this.formElement = createRef();
  }

  componentDidUpdate(prevProps: FormProps<T, S, F>, prevState: FormState<T, S, F>) {
    if (!deepEquals(this.props, prevProps)) {
      const formDataChangedFields = getChangedFields(this.props.formData, prevProps.formData);
      const isSchemaChanged = !deepEquals(prevProps.schema, this.props.schema);
      const isFormDataChanged =
        formDataChangedFields.length > 0 || !deepEquals(prevProps.formData, this.props.formData);

      const nextState = this.getStateFromProps(
        this.props,
        this.props.formData,
        isSchemaChanged || isFormDataChanged ? undefined : this.state.retrievedSchema,
        isSchemaChanged,
        formDataChangedFields
      );

      if (!deepEquals(nextState, prevState)) {
        if (
          !deepEquals(nextState.formData, this.props.formData) &&
          !deepEquals(nextState.formData, prevState.formData) &&
          this.props.onChange
        ) {
          this.props.onChange(nextState);
        }
        this.setState(nextState);
      }
    }
  }

  shouldComponentUpdate(nextProps: FormProps<T, S, F>, nextState: FormState<T, S, F>) {
    return shouldRender(this, nextProps, nextState);
  }

  validate(
    formData: T | undefined,
    schema = this.props.schema,
    altSchemaUtils?: SchemaUtilsType<T, S, F>,
    retrievedSchema?: S
  ): ValidationData<T> {
    const schemaUtils = altSchemaUtils ? altSchemaUtils : this.state.schemaUtils;
    const { customValidate, transformErrors, uiSchema } = this.props;
    const resolvedSchema = retrievedSchema ?? schemaUtils.retrieveSchema(schema, formData);
    return schemaUtils
      .getValidator()
      .validateFormData(formData, resolvedSchema, customValidate, transformErrors, uiSchema);
  }

  renderErrors(registry: Registry<T, S, F>) {
    const { errors, errorSchema, schema, uiSchema } = this.state;
    const { formContext } = this.props;
    const options = getUiOptions<T, S, F>(uiSchema);
    const ErrorListTemplate = getTemplate<'ErrorListTemplate', T, S, F>('ErrorListTemplate', registry, options);

    if (errors && errors.length) {
      return (
        <ErrorListTemplate
          errors={errors}
          errorSchema={errorSchema || {}}
          schema={schema}
          uiSchema={uiSchema}
          formContext={formContext}
          registry={registry}
        />
      );
    }
    return null;
  }

  getUsedFormData = (formData: T | undefined, fields: string[][]): T | undefined => {
    if (fields.length === 0 && typeof formData !== 'object') {
      return formData;
    }

    const data: GenericObjectType = _pick(formData, fields as unknown as string[]);
    if (Array.isArray(formData)) {
      return Object.keys(data).map((key: string) => data[key]) as unknown as T;
    }

    return data as T;
  };

  getFieldNames = (pathSchema: PathSchema<T>, formData?: T): string[][] => {
    const getAllPaths = (_obj: GenericObjectType, acc: string[][] = [], paths: string[][] = [[]]) => {
      Object.keys(_obj).forEach((key: string) => {
        if (typeof _obj[key] === 'object') {
          const newPaths = paths.map((path) => [...path, key]);
          if (_obj[key][RJSF_ADDITIONAL_PROPERTIES_FLAG] && _obj[key][NAME_KEY] !== '') {
            acc.push(_obj[key][NAME_KEY]);
          } else {
            getAllPaths(_obj[key], acc, newPaths);
          }
        } else if (key === NAME_KEY && _obj[key] !== '') {
          paths.forEach((path) => {
            const formValue = _get(formData, path);
            if (
              typeof formValue !== 'object' ||
              _isEmpty(formValue) ||
              (Array.isArray(formValue) && formValue.every((val) => typeof val !== 'object'))
            ) {
              acc.push(path);
            }
          });
        }
      });
      return acc;
    };

    return getAllPaths(pathSchema);
  };

  omitExtraData = (formData?: T): T | undefined => {
    const { schema, schemaUtils } = this.state;
    const retrievedSchema = schemaUtils.retrieveSchema(schema, formData);
    const pathSchema = schemaUtils.toPathSchema(retrievedSchema, '', formData);
    const fieldNames = this.getFieldNames(pathSchema, formData);
    return this.getUsedFormData(formData, fieldNames);
  };

  getStateFromProps(
    props: FormProps<T, S, F>,
    inputFormData?: T,
    retrievedSchema?: S,
    isSchemaChanged = false,
    formDataChangedFields: string[] = []
  ): FormState<T, S, F> {
    const state: FormState<T, S, F> = this.state || {};
    const schema = 'schema' in props ? props.schema : this.props.schema;
    const uiSchema: UiSchema<T, S, F> = ('uiSchema' in props ? props.uiSchema! : this.props.uiSchema!) || {};
    const edit = typeof inputFormData !== 'undefined';
    const liveValidate = 'liveValidate' in props ? props.liveValidate : this.props.liveValidate;
    const mustValidate = edit && !props.noValidate && liveValidate;
    const rootSchema = schema;
    const experimental_defaultFormStateBehavior =
      'experimental_defaultFormStateBehavior' in props
        ? props.experimental_defaultFormStateBehavior
        : this.props.experimental_defaultFormStateBehavior;
    const experimental_customMergeAllOf =
      'experimental_customMergeAllOf' in props
        ? props.experimental_customMergeAllOf
        : this.props.experimental_customMergeAllOf;
    let schemaUtils: SchemaUtilsType<T, S, F> = state.schemaUtils;
    if (
      !schemaUtils ||
      schemaUtils.doesSchemaUtilsDiffer(
        props.validator,
        rootSchema,
        experimental_defaultFormStateBehavior,
        experimental_customMergeAllOf
      )
    ) {
      schemaUtils = createSchemaUtils<T, S, F>(
        props.validator,
        rootSchema,
        experimental_defaultFormStateBehavior,
        experimental_customMergeAllOf
      );
    }
    const formData: T = schemaUtils.getDefaultFormState(schema, inputFormData) as T;
    const _retrievedSchema = retrievedSchema ?? schemaUtils.retrieveSchema(schema, formData);

    const getCurrentErrors = (): ValidationData<T> => {
      if (props.noValidate || isSchemaChanged) {
        return { errors: [], errorSchema: {} };
      } else if (!props.liveValidate) {
        return {
          errors: state.schemaValidationErrors || [],
          errorSchema: state.schemaValidationErrorSchema || {},
        };
      }
      return {
        errors: state.errors || [],
        errorSchema: state.errorSchema || {},
      };
    };

    let errors: RJSFValidationError[];
    let errorSchema: ErrorSchema<T> | undefined;
    let schemaValidationErrors: RJSFValidationError[] = state.schemaValidationErrors;
    let schemaValidationErrorSchema: ErrorSchema<T> = state.schemaValidationErrorSchema;
    if (mustValidate) {
      const schemaValidation = this.validate(formData, schema, schemaUtils, _retrievedSchema);
      errors = schemaValidation.errors;
      if (retrievedSchema === undefined) {
        errorSchema = schemaValidation.errorSchema;
      } else {
        errorSchema = mergeObjects(
          this.state?.errorSchema,
          schemaValidation.errorSchema,
          'preventDuplicates'
        ) as ErrorSchema<T>;
      }
      schemaValidationErrors = errors;
      schemaValidationErrorSchema = errorSchema;
    } else {
      const currentErrors = getCurrentErrors();
      errors = currentErrors.errors;
      errorSchema = currentErrors.errorSchema;
      if (formDataChangedFields.length > 0) {
        const newErrorSchema = formDataChangedFields.reduce((acc, key) => {
          acc[key] = undefined;
          return acc;
        }, {} as Record<string, undefined>);
        errorSchema = schemaValidationErrorSchema = mergeObjects(
          currentErrors.errorSchema,
          newErrorSchema,
          'preventDuplicates'
        ) as ErrorSchema<T>;
      }
    }

    if (props.extraErrors) {
      const merged = validationDataMerge({ errorSchema, errors }, props.extraErrors);
      errorSchema = merged.errorSchema;
      errors = merged.errors;
    }
    const idSchema = schemaUtils.toIdSchema(
      _retrievedSchema,
      uiSchema['ui:rootFieldId'],
      formData,
      props.idPrefix,
      props.idSeparator
    );

    return {
      schemaUtils,
      schema,
      uiSchema,
      idSchema,
      formData,
      edit,
      errors,
      errorSchema,
      schemaValidationErrors,
      schemaValidationErrorSchema,
      retrievedSchema: _retrievedSchema,
    };
  }

  onChange = (formData: T | undefined, newErrorSchema?: ErrorSchema<T>, id?: string) => {
    const { extraErrors, omitExtraData, liveOmit, noValidate, liveValidate, onChange } = this.props;
    const { schemaUtils, schema } = this.state;

    let retrievedSchema = this.state.retrievedSchema;
    if (isObject(formData) || Array.isArray(formData)) {
      const newState = this.getStateFromProps(this.props, formData);
      formData = newState.formData;
      retrievedSchema = newState.retrievedSchema;
    }

    const mustValidate = !noValidate && liveValidate;
    let state: Partial<FormState<T, S, F>> = { formData, schema };
    let newFormData = formData;

    if (omitExtraData === true && liveOmit === true) {
      newFormData = this.omitExtraData(formData);
      state = {
        formData: newFormData,
      };
    }

    if (mustValidate) {
      const schemaValidation = this.validate(newFormData, schema, schemaUtils, retrievedSchema);
      let errors = schemaValidation.errors;
      let errorSchema = schemaValidation.errorSchema;
      const schemaValidationErrors = errors;
      const schemaValidationErrorSchema = errorSchema;
      if (extraErrors) {
        const merged = validationDataMerge(schemaValidation, extraErrors);
        errorSchema = merged.errorSchema;
        errors = merged.errors;
      }
      if (newErrorSchema) {
        errorSchema = mergeObjects(errorSchema, newErrorSchema, 'preventDuplicates') as ErrorSchema<T>;
      }
      state = {
        formData: newFormData,
        errors,
        errorSchema,
        schemaValidationErrors,
        schemaValidationErrorSchema,
      };
    } else if (!noValidate && newErrorSchema) {
      const errorSchema = extraErrors
        ? (mergeObjects(newErrorSchema, extraErrors, 'preventDuplicates') as ErrorSchema<T>)
        : newErrorSchema;
      state = {
        formData: newFormData,
        errorSchema: errorSchema,
        errors: toErrorList(errorSchema),
      };
    }
    this.setState(state as FormState<T, S, F>, () => onChange && onChange({ ...this.state, ...state }, id));
  };

  onSubmit = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    event.preventDefault();
    const { omitExtraData, extraErrors, onSubmit } = this.props;
    let { formData: newFormData } = this.state;

    if (omitExtraData === true) {
      newFormData = this.omitExtraData(newFormData);
    }

    if (this.validateFormWithFormData(newFormData)) {
      const errorSchema = extraErrors || {};
      const errors = extraErrors ? toErrorList(extraErrors) : [];
      this.setState(
        {
          formData: newFormData,
          errors,
          errorSchema,
          schemaValidationErrors: [],
          schemaValidationErrorSchema: {},
        },
        () => {
          if (onSubmit) {
            onSubmit({ ...this.state, formData: newFormData, status: 'submitted' }, event);
          }
        }
      );
    }
  };

  onBlur = (id: string, data: any) => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(id, data);
    }
  };

  onFocus = (id: string, data: any) => {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus(id, data);
    }
  };

  validateFormWithFormData = (formData?: T): boolean => {
    const { extraErrors, extraErrorsBlockSubmit, focusOnFirstError, onError } = this.props;
    const { errors: prevErrors } = this.state;
    const schemaValidation = this.validate(formData);
    let errors = schemaValidation.errors;
    let errorSchema = schemaValidation.errorSchema;
    const schemaValidationErrors = errors;
    const schemaValidationErrorSchema = errorSchema;
    const hasError = errors.length > 0 || (extraErrors && extraErrorsBlockSubmit);
    if (hasError) {
      if (extraErrors) {
        const merged = validationDataMerge(schemaValidation, extraErrors);
        errorSchema = merged.errorSchema;
        errors = merged.errors;
      }
      if (focusOnFirstError) {
        if (typeof focusOnFirstError === 'function') {
          focusOnFirstError(errors[0]);
        } else {
          // In React Native, we'll scroll to the first error
          if (this.formElement.current) {
            this.formElement.current.scrollTo({ y: 0, animated: true });
          }
        }
      }
      this.setState(
        {
          errors,
          errorSchema,
          schemaValidationErrors,
          schemaValidationErrorSchema,
        },
        () => {
          if (onError) {
            onError(errors);
          } else {
            console.error('Form validation failed', errors);
          }
        }
      );
    } else if (prevErrors.length > 0) {
      this.setState({
        errors: [],
        errorSchema: {},
        schemaValidationErrors: [],
        schemaValidationErrorSchema: {},
      });
    }
    return !hasError;
  };

  getRegistry(): Registry<T, S, F> {
    const { translateString: customTranslateString, uiSchema = {} } = this.props;
    const { schemaUtils } = this.state;
    return {
      fields: { ...this.props.fields },
      templates: { ...this.props.templates },
      widgets: { ...this.props.widgets },
      rootSchema: this.props.schema,
      formContext: this.props.formContext || ({} as F),
      schemaUtils,
      translateString: customTranslateString || ((str: string) => str),
      globalUiOptions: uiSchema[UI_GLOBAL_OPTIONS_KEY],
    };
  }

  submit = () => {
    if (this.formElement.current) {
      const submitEvent = {
        preventDefault: () => {},
        nativeEvent: {},
      } as NativeSyntheticEvent<NativeTouchEvent>;
      this.onSubmit(submitEvent);
    }
  };

  render() {
    const {
      children,
      idPrefix,
      idSeparator,
      style,
      disabled,
      readonly,
      formContext,
      showErrorList = 'top',
    } = this.props;

    const { schema, uiSchema, formData, errorSchema, idSchema } = this.state;
    const registry = this.getRegistry();
    const { SchemaField: _SchemaField } = registry.fields;
    const { SubmitButton } = registry.templates.ButtonTemplates;

    let { [SUBMIT_BTN_OPTIONS_KEY]: submitOptions = {} } = getUiOptions<T, S, F>(uiSchema);
    if (disabled) {
      submitOptions = { ...submitOptions, props: { ...submitOptions.props, disabled: true } };
    }
    const submitUiSchema = { [UI_OPTIONS_KEY]: { [SUBMIT_BTN_OPTIONS_KEY]: submitOptions } };

    return (
      <ScrollView ref={this.formElement} style={style}>
        <View>
          {showErrorList === 'top' && this.renderErrors(registry)}
          <_SchemaField
            name=''
            schema={schema}
            uiSchema={uiSchema}
            errorSchema={errorSchema}
            idSchema={idSchema}
            idPrefix={idPrefix}
            idSeparator={idSeparator}
            formContext={formContext}
            formData={formData}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            registry={registry}
            disabled={disabled}
            readonly={readonly}
          />
          {children ? children : <SubmitButton uiSchema={submitUiSchema} registry={registry} />}
          {showErrorList === 'bottom' && this.renderErrors(registry)}
        </View>
      </ScrollView>
    );
  }
}
