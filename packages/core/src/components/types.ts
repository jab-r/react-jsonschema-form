import type {
  ErrorSchema,
  FormContextType,
  RJSFSchema,
  RJSFValidationError,
  StrictRJSFSchema,
  UiSchema,
  ValidatorType,
  ValidationData,
  Registry,
  RegistryFieldsType,
  RegistryWidgetsType,
  TemplatesType,
  CustomValidator,
  ErrorTransformer,
  IdSchema,
  Experimental_DefaultFormStateBehavior,
  Experimental_CustomMergeAllOf,
  SchemaUtilsType,
} from '@rjsf/utils';
import type { NativeSyntheticEvent, NativeTouchEvent, StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

export interface UseFormProps<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> {
  schema: S;
  validator: ValidatorType<T, S, F>;
  initialData?: T;
  uiSchema?: UiSchema<T, S, F>;
  noValidate?: boolean;
  liveValidate?: boolean;
  customValidate?: CustomValidator<T, S, F>;
  transformErrors?: ErrorTransformer<T, S, F>;
  extraErrors?: ErrorSchema<T>;
  extraErrorsBlockSubmit?: boolean;
  omitExtraData?: boolean;
  onError?: (errors: RJSFValidationError[]) => void;
  onSubmit?: (
    data: ValidationData<T> & { formData?: T; status?: 'submitted' },
    event: NativeSyntheticEvent<NativeTouchEvent>
  ) => void;
  onBlur?: (id: string, data: any) => void;
  onFocus?: (id: string, data: any) => void;
  experimental_defaultFormStateBehavior?: Experimental_DefaultFormStateBehavior;
  experimental_customMergeAllOf?: Experimental_CustomMergeAllOf<S>;
}

export interface UseFormReturn<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>
  extends FormState<T, S, F> {
  handleChange: (data: T, newErrorSchema?: ErrorSchema<T>) => void;
  handleSubmit: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
  handleBlur: (id: string, value: any) => void;
  handleFocus: (id: string, value: any) => void;
  schemaUtils: SchemaUtilsType<T, S, F>;
}

export interface FormProps<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> {
  schema: S;
  validator: ValidatorType<T, S, F>;
  children?: ReactNode;
  uiSchema?: UiSchema<T, S, F>;
  formData?: T;
  formContext?: F;
  idPrefix?: string;
  idSeparator?: string;
  disabled?: boolean;
  readonly?: boolean;
  fields?: RegistryFieldsType<T, S, F>;
  templates?: Partial<Omit<TemplatesType<T, S, F>, 'ButtonTemplates'>> & {
    ButtonTemplates?: Partial<TemplatesType<T, S, F>['ButtonTemplates']>;
  };
  widgets?: RegistryWidgetsType<T, S, F>;
  onChange?: (data: ValidationData<T> & { formData?: T }, id?: string) => void;
  onError?: (errors: RJSFValidationError[]) => void;
  onSubmit?: (
    data: ValidationData<T> & { formData?: T; status?: 'submitted' },
    event: NativeSyntheticEvent<NativeTouchEvent>
  ) => void;
  onBlur?: (id: string, data: any) => void;
  onFocus?: (id: string, data: any) => void;
  customValidate?: CustomValidator<T, S, F>;
  extraErrors?: ErrorSchema<T>;
  extraErrorsBlockSubmit?: boolean;
  noValidate?: boolean;
  liveValidate?: boolean;
  liveOmit?: boolean;
  omitExtraData?: boolean;
  showErrorList?: false | 'top' | 'bottom';
  transformErrors?: ErrorTransformer<T, S, F>;
  focusOnFirstError?: boolean | ((error: RJSFValidationError) => void);
  translateString?: Registry<T, S, F>['translateString'];
  experimental_defaultFormStateBehavior?: Experimental_DefaultFormStateBehavior;
  experimental_customMergeAllOf?: Experimental_CustomMergeAllOf<S>;
  style?: StyleProp<ViewStyle>;
}

export interface FormState<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> {
  formData?: T;
  schema: S;
  uiSchema: UiSchema<T, S, F>;
  idSchema: IdSchema<T>;
  errors: RJSFValidationError[];
  errorSchema: ErrorSchema<T>;
  schemaValidationErrors: RJSFValidationError[];
  schemaValidationErrorSchema: ErrorSchema<T>;
  retrievedSchema: S;
  edit: boolean;
  schemaUtils: SchemaUtilsType<T, S, F>;
  /** Indicates if the form is currently validating */
  isValidating?: boolean;
  /** Indicates if the form has been touched/modified */
  isDirty?: boolean;
  /** Timestamp of the last validation */
  lastValidation?: number;
  /** Current form status */
  status?: FormStatus;
}

/** Type guard to check if a value matches the FormState interface */
export function isFormState<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  value: any
): value is FormState<T, S, F> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'schema' in value &&
    'uiSchema' in value &&
    'idSchema' in value &&
    Array.isArray(value.errors) &&
    typeof value.edit === 'boolean'
  );
}

export type FormStatus = 'initial' | 'editing' | 'submitting' | 'submitted' | 'error';

export interface IChangeEvent<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>
  extends Omit<FormState<T, S, F>, 'schemaValidationErrors' | 'schemaValidationErrorSchema'> {
  status?: FormStatus;
  timestamp: number;
}

/** Type guard to check if a value matches the IChangeEvent interface */
export function isChangeEvent<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  value: any
): value is IChangeEvent<T, S, F> {
  return isFormState(value) && 'timestamp' in value;
}

export interface RegistryProps<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> {
  fields: RegistryFieldsType<T, S, F>;
  templates: TemplatesType<T, S, F>;
  widgets: RegistryWidgetsType<T, S, F>;
  formContext: F;
  translateString: Registry<T, S, F>['translateString'];
  /** Optional validation mode - 'onSubmit' | 'onBlur' | 'onChange' */
  validationMode?: 'onSubmit' | 'onBlur' | 'onChange';
  /** Optional error handling strategy */
  errorHandlingStrategy?: 'fallback' | 'throw' | 'silent';
}

/** Type guard to check if a value matches the RegistryProps interface */
export function isRegistryProps<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  value: any
): value is RegistryProps<T, S, F> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'fields' in value &&
    'templates' in value &&
    'widgets' in value &&
    'formContext' in value &&
    typeof value.translateString === 'function'
  );
}
