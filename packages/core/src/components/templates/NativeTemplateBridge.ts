import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { ReactElement, ReactNode } from 'react';

/**
 * Props for View-based bridge components
 */
export interface ViewBridgeProps {
  /** Optional test ID for the component */
  testID?: string;
  /** Style object for the View */
  style?: StyleProp<ViewStyle>;
  /** Child elements */
  children?: ReactNode;
  /** Additional View props */
  [key: string]: any;
}

/**
 * Props for Text-based bridge components
 */
export interface TextBridgeProps {
  /** Optional test ID for the component */
  testID?: string;
  /** Style object for the Text */
  style?: StyleProp<TextStyle>;
  /** Text content or child elements */
  children?: ReactNode;
  /** Additional Text props */
  [key: string]: any;
}

/**
 * Bridge interface for React Native template components
 * Provides a layer of abstraction between RJSF and React Native
 */
export interface NativeTemplateBridge {
  /**
   * Create a View component
   * @param props ViewBridgeProps for the component
   * @returns React element representing a View
   */
  createView: (props: ViewBridgeProps) => ReactElement;

  /**
   * Create a Text component
   * @param props TextBridgeProps for the component
   * @returns React element representing a Text
   */
  createText: (props: TextBridgeProps) => ReactElement;
}

/**
 * Default styles for template components
 */
export interface NativeTemplateStyles {
  container: StyleProp<ViewStyle>;
  text: StyleProp<TextStyle>;
  errorText: StyleProp<TextStyle>;
  title: StyleProp<TextStyle>;
  description: StyleProp<TextStyle>;
  helpText: StyleProp<TextStyle>;
}

/**
 * Base props for all native template components
 */
export interface NativeTemplateBaseProps {
  styles?: NativeTemplateStyles;
  testID?: string;
}
