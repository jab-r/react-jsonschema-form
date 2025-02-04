import React from 'react';
import { View, Text, type ViewProps, type TextProps } from 'react-native';
import type { NativeTemplateBridge, ViewBridgeProps, TextBridgeProps } from './NativeTemplateBridge';

/**
 * Implementation of the Native Template Bridge
 * Provides concrete implementations of View and Text components
 */
const createView = (props: ViewBridgeProps): React.ReactElement => {
  const { testID, style, children, ...rest } = props;
  const viewProps: ViewProps = {
    testID,
    style,
    ...rest
  };
  return React.createElement(View, viewProps, children);
};

const createText = (props: TextBridgeProps): React.ReactElement => {
  const { testID, style, children, ...rest } = props;
  const textProps: TextProps = {
    testID,
    style,
    ...rest
  };
  return React.createElement(Text, textProps, children);
};

/**
 * Native bridge implementation using React Native components
 */
export const nativeBridge: NativeTemplateBridge = {
  createView,
  createText,
};

export default nativeBridge;
