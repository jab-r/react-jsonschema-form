import { FormContextType, RegistryWidgetsType, RJSFSchema, StrictRJSFSchema, Widget } from '@rjsf/utils';
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
} from './native';

function widgets<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(): RegistryWidgetsType<T, S, F> {
  return {
    TextWidget: TextWidget as unknown as Widget<T, S, F>,
    SelectWidget: SelectWidget as unknown as Widget<T, S, F>,
    CheckboxWidget: CheckboxWidget as unknown as Widget<T, S, F>,
    TextareaWidget: TextareaWidget as unknown as Widget<T, S, F>,
    RadioWidget: RadioWidget as unknown as Widget<T, S, F>,
    DateTimeWidget: DateTimeWidget as unknown as Widget<T, S, F>,
    RangeWidget: RangeWidget as unknown as Widget<T, S, F>,
    EmailWidget: EmailWidget as unknown as Widget<T, S, F>,
    URLWidget: URLWidget as unknown as Widget<T, S, F>,
    PasswordWidget: PasswordWidget as unknown as Widget<T, S, F>,
  };
}

export default widgets;
