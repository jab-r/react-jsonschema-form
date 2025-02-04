import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  UiSchema,
  ValidatorType,
  CustomValidator,
  ErrorTransformer,
  ValidationData,
  ErrorSchema,
} from '@rjsf/utils';

export type FormValidatorType<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> = {
  validator: ValidatorType<T, S, F>;
  schema: S;
  uiSchema?: UiSchema<T, S, F>;
  customValidate?: CustomValidator<T, S, F>;
  transformErrors?: ErrorTransformer<T, S, F>;
  extraErrors?: ErrorSchema<T>;
};

export type FormDataType<T = any> = T | undefined;

export type FormValidationResult<T = any> = ValidationData<T>;

export const ensureFormData = <T>(data: unknown): T | undefined => {
  if (data === undefined || data === null) {
    return undefined;
  }
  return data as T;
};

export const ensureValidationResult = <T>(result: ValidationData<T>): ValidationData<T> => {
  return {
    errors: result.errors || [],
    errorSchema: result.errorSchema || {},
  };
};
