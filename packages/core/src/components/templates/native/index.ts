import { NativeFieldTemplate } from '../NativeFieldTemplate';
import { NativeSubmitButton } from '../NativeSubmitButton';
import { NativeErrorList } from '../NativeErrorList';
import { nativeWidgets } from '../../widgets/native';

export const nativeTemplates = {
  FieldTemplate: NativeFieldTemplate,
  ButtonTemplates: {
    SubmitButton: NativeSubmitButton,
  },
  ErrorListTemplate: NativeErrorList,
} as const;

export const nativeDefaultRegistry = {
  fields: {},
  widgets: nativeWidgets,
  templates: nativeTemplates,
} as const;
