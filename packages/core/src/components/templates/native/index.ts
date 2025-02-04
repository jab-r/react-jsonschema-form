import { nativeWidgets } from '../../widgets/native';
import NativeFieldTemplate from '../NativeFieldTemplate';
import NativeErrorList from '../NativeErrorList';
import NativeSubmitButton from '../NativeSubmitButton';

export const nativeTemplates = {
  FieldTemplate: NativeFieldTemplate,
  ErrorListTemplate: NativeErrorList,
  ButtonTemplates: {
    SubmitButton: NativeSubmitButton,
  },
};

export const nativeDefaultRegistry = {
  fields: {},
  widgets: nativeWidgets,
  templates: nativeTemplates,
};

export * from '../../widgets/native';
export * from '../NativeFieldTemplate';
export * from '../NativeErrorList';
export * from '../NativeSubmitButton';
