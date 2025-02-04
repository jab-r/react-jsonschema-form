import { useCallback, useReducer, useMemo } from 'react';
import { createSchemaUtils, validationDataMerge, toErrorList, mergeObjects } from '@rjsf/utils';
import type {
  ErrorSchema,
  FormContextType,
  RJSFSchema,
  RJSFValidationError,
  StrictRJSFSchema,
  ValidationData,
  IdSchema,
} from '@rjsf/utils';
import type { NativeSyntheticEvent, NativeTouchEvent } from 'react-native';
import { UseFormProps, UseFormReturn, FormState } from '../types';

type FormAction<T = any, S extends StrictRJSFSchema = RJSFSchema> =
  | { type: 'UPDATE_FORM_DATA'; payload: { formData?: T } }
  | { type: 'UPDATE_ERRORS'; payload: { errors: RJSFValidationError[]; errorSchema: ErrorSchema<T> } }
  | { type: 'UPDATE_SCHEMA'; payload: { schema: S; retrievedSchema: S } }
  | { type: 'RESET_VALIDATION' }
  | { type: 'UPDATE_ID_SCHEMA'; payload: { idSchema: IdSchema<T> } };

function formReducer<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  state: FormState<T, S, F>,
  action: FormAction<T, S>
): FormState<T, S, F> {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: action.payload.formData,
      };
    case 'UPDATE_ERRORS':
      return {
        ...state,
        errors: action.payload.errors,
        errorSchema: action.payload.errorSchema,
      };
    case 'UPDATE_SCHEMA':
      return {
        ...state,
        schema: action.payload.schema,
        retrievedSchema: action.payload.retrievedSchema,
      };
    case 'RESET_VALIDATION':
      return {
        ...state,
        errors: [],
        errorSchema: {},
        schemaValidationErrors: [],
        schemaValidationErrorSchema: {},
      };
    case 'UPDATE_ID_SCHEMA':
      return {
        ...state,
        idSchema: action.payload.idSchema,
      };
    default:
      return state;
  }
}

export function useForm<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  schema,
  validator,
  initialData,
  uiSchema = {},
  noValidate = false,
  liveValidate = false,
  customValidate,
  transformErrors,
  extraErrors,
  extraErrorsBlockSubmit = false,
  omitExtraData = false,
  onError,
  onSubmit,
  onBlur,
  onFocus,
  experimental_defaultFormStateBehavior,
  experimental_customMergeAllOf,
}: UseFormProps<T, S, F>): UseFormReturn<T, S, F> {
  const schemaUtils = useMemo(
    () =>
      createSchemaUtils<T, S, F>(
        validator,
        schema,
        experimental_defaultFormStateBehavior,
        experimental_customMergeAllOf
      ),
    [validator, schema, experimental_defaultFormStateBehavior, experimental_customMergeAllOf]
  );

  const initialState: FormState<T, S, F> = useMemo(() => {
    const formData = schemaUtils.getDefaultFormState(schema, initialData) as T;
    const retrievedSchema = schemaUtils.retrieveSchema(schema, formData);
    const idSchema = schemaUtils.toIdSchema(retrievedSchema, uiSchema['ui:rootFieldId'], formData);

    return {
      formData,
      schema,
      uiSchema,
      idSchema,
      errors: [],
      errorSchema: {},
      schemaValidationErrors: [],
      schemaValidationErrorSchema: {},
      retrievedSchema,
      edit: typeof formData !== 'undefined',
      schemaUtils,
    };
  }, [schema, initialData, uiSchema, schemaUtils]);

  const [state, dispatch] = useReducer<(state: FormState<T, S, F>, action: FormAction<T, S>) => FormState<T, S, F>>(
    formReducer,
    initialState
  );

  const validateData = useCallback(
    (data: T | undefined): ValidationData<T> => {
      if (noValidate) {
        return { errors: [], errorSchema: {} };
      }

      const result = validator.validateFormData(data, schema, customValidate, transformErrors, uiSchema);

      if (extraErrors) {
        return validationDataMerge(result, extraErrors);
      }

      return result;
    },
    [noValidate, schema, uiSchema, validator, customValidate, transformErrors, extraErrors]
  );

  const updateFormData = useCallback((formData?: T) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { formData } });
  }, []);

  const updateErrors = useCallback((errors: RJSFValidationError[], errorSchema: ErrorSchema<T>) => {
    dispatch({ type: 'UPDATE_ERRORS', payload: { errors, errorSchema } });
  }, []);

  const handleChange = useCallback(
    (data: T, newErrorSchema?: ErrorSchema<T>) => {
      updateFormData(data);

      if (liveValidate) {
        const result = validateData(data);
        updateErrors(result.errors, result.errorSchema);
      } else if (newErrorSchema) {
        const errorSchema = extraErrors
          ? (mergeObjects(newErrorSchema, extraErrors, 'preventDuplicates') as ErrorSchema<T>)
          : newErrorSchema;
        updateErrors(toErrorList(errorSchema), errorSchema);
      }
    },
    [liveValidate, validateData, updateFormData, updateErrors, extraErrors]
  );

  const handleBlur = useCallback(
    (id: string, value: any) => {
      if (onBlur) {
        onBlur(id, value);
      }
    },
    [onBlur]
  );

  const handleFocus = useCallback(
    (id: string, value: any) => {
      if (onFocus) {
        onFocus(id, value);
      }
    },
    [onFocus]
  );

  const handleSubmit = useCallback(
    (event: NativeSyntheticEvent<NativeTouchEvent>) => {
      event.preventDefault();

      if (!noValidate) {
        const validationResult = validateData(state.formData);
        const hasError = validationResult.errors.length > 0 || (extraErrors && extraErrorsBlockSubmit);

        if (hasError) {
          updateErrors(validationResult.errors, validationResult.errorSchema);
          if (onError) {
            onError(validationResult.errors);
          } else {
            console.error('Form validation failed', validationResult.errors);
          }
          return;
        }
      }

      const submitFormData = state.formData;
      if (omitExtraData) {
        // Implement omitExtraData logic here if needed
        // This would filter out data not defined in the schema
      }

      if (onSubmit) {
        onSubmit(
          {
            ...state,
            formData: submitFormData,
            status: 'submitted',
          },
          event
        );
      }
    },
    [
      state,
      noValidate,
      validateData,
      extraErrors,
      extraErrorsBlockSubmit,
      omitExtraData,
      onError,
      onSubmit,
      updateErrors,
    ]
  );

  return {
    ...state,
    handleChange,
    handleSubmit,
    handleBlur,
    handleFocus,
    schemaUtils,
  };
}
