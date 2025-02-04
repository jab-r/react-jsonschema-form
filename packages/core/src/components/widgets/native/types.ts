import { WidgetProps as BaseWidgetProps } from '@rjsf/utils';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * Base props interface for all native form widgets
 */
export interface NativeWidgetProps extends Omit<BaseWidgetProps, 'options'> {
  /** Custom style for the widget container */
  style?: StyleProp<ViewStyle>;
  /** Custom style for text elements within the widget */
  textStyle?: StyleProp<TextStyle>;
  /** Unique identifier for the widget */
  id?: string;
  /** Current value of the widget */
  value?: any;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the widget is disabled */
  disabled?: boolean;
  /** Whether the widget is read-only */
  readonly?: boolean;
  /** Whether the widget should automatically receive focus */
  autofocus?: boolean;
  /** Placeholder text for input widgets */
  placeholder?: string;
  /** Test ID for testing purposes */
  testID?: string;
  /** Array of validation errors */
  rawErrors?: string[];
  /** Callback when value changes */
  onChange: (value: any) => void;
  /** Callback when widget loses focus */
  onBlur?: (id: string, value: any) => void;
  /** Callback when widget receives focus */
  onFocus?: (id: string, value: any) => void;
}

/**
 * Option interface for select widgets
 */
export interface SelectOption {
  /** Display label for the option */
  label: string;
  /** Value of the option */
  value: string | number | boolean;
}

/**
 * Options interface for select widgets
 */
export interface SelectWidgetOptions {
  /** Array of available options */
  enumOptions?: SelectOption[];
  /** Array of disabled option values */
  enumDisabled?: Array<string | number | boolean>;
}

/**
 * Props interface for select widgets
 */
export interface SelectWidgetProps extends NativeWidgetProps {
  /** Select-specific options */
  options: SelectWidgetOptions;
}

/**
 * Props interface for date/time widgets
 */
export interface DateTimeWidgetProps extends NativeWidgetProps {
  /** Type of date/time picker to display */
  mode?: 'date' | 'time' | 'datetime';
  /** Date/time format string */
  format?: string;
  /** Minimum selectable date */
  minimumDate?: Date;
  /** Maximum selectable date */
  maximumDate?: Date;
}

/**
 * Props interface for range widgets
 */
export interface RangeWidgetProps extends NativeWidgetProps {
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
}
