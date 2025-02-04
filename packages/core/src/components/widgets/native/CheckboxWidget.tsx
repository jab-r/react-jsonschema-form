import React from 'react';
import { View, Text, Switch, StyleSheet, Platform, Pressable } from 'react-native';
import type { NativeWidgetProps } from './types';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    minHeight: 44, // Minimum touch target size
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    flex: 1,
  },
  switchContainer: {
    ...Platform.select({
      ios: {
        marginRight: 8,
      },
      android: {
        marginRight: 12,
      },
    }),
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
  error: {
    borderColor: '#dc3545',
  },
});

interface CheckboxWidgetProps extends NativeWidgetProps {
  label?: string;
  testID?: string;
}

const CheckboxWidget: React.FC<CheckboxWidgetProps> = ({
  id = '',
  value = false,
  disabled = false,
  readonly = false,
  onChange,
  onBlur,
  onFocus,
  label,
  style,
  rawErrors = [],
  testID,
}) => {
  const hasError = rawErrors && rawErrors.length > 0;

  const handleValueChange = React.useCallback(
    (newValue: boolean) => {
      onChange(newValue);
      if (onBlur && id) {
        onBlur(id, newValue);
      }
    },
    [onChange, onBlur, id]
  );

  return (
    <View style={[styles.container, hasError && styles.error, style]}>
      <Pressable
        style={styles.pressable}
        onPress={() => !disabled && !readonly && handleValueChange(!value)}
        disabled={disabled || readonly}
        testID={testID}
        accessibilityLabel={label || `Checkbox ${id}`}
        accessibilityRole='checkbox'
        accessibilityState={{
          checked: value,
          disabled: disabled || readonly,
        }}
      >
        <View style={styles.switchContainer}>
          <Switch
            value={value}
            onValueChange={handleValueChange}
            disabled={disabled || readonly}
            testID={`${testID}-switch`}
          />
        </View>
        {label && (
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default CheckboxWidget;
