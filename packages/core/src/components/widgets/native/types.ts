import { WidgetProps as BaseWidgetProps } from '@rjsf/utils';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface NativeWidgetProps extends Omit<BaseWidgetProps, 'options'> {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  id?: string;
  value?: any;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  placeholder?: string;
  onChange: (value: any) => void;
  onBlur?: (id: string, value: any) => void;
  onFocus?: (id: string, value: any) => void;
}

export interface SelectOption {
  label: string;
  value: any;
}

export interface SelectWidgetOptions {
  enumOptions?: SelectOption[];
  enumDisabled?: any[];
}

export interface SelectWidgetProps extends NativeWidgetProps {
  options: SelectWidgetOptions;
}
