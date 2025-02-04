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

export interface UseFormReturn<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> extends FormState<T, S, F> {
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
}

export interface IChangeEvent<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>
  extends Omit<FormState<T, S, F>, 'schemaValidationErrors' | 'schemaValidationErrorSchema'> {
  status?: 'submitted';
}

export interface RegistryProps<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> {
  fields: RegistryFieldsType<T, S, F>;
  templates: TemplatesType<T, S, F>;
  widgets: RegistryWidgetsType<T, S, F>;
  formContext: F;
  translateString: Registry<T, S, F>['translateString'];
}
