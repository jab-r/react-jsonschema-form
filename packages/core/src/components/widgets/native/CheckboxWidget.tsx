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
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 4,
    padding: 4,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  disabled: {
    opacity: 0.6,
  },
});

interface CheckboxWidgetProps extends NativeWidgetProps {
  label?: string;
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
  schema,
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

  const handlePress = React.useCallback(() => {
    if (!disabled && !readonly) {
      handleValueChange(!value);
      if (onFocus && id) {
        onFocus(id, value);
      }
    }
  }, [disabled, readonly, handleValueChange, value, onFocus, id]);

  const accessibilityLabel = label || schema?.title || `Checkbox ${id}`;
  const accessibilityHint =
    schema?.description || `Toggle checkbox${hasError ? '. Has validation errors' : ''}`;

  return (
    <View>
      <View style={[styles.container, hasError && styles.error, (disabled || readonly) && styles.disabled, style]}>
        <Pressable
          style={styles.pressable}
          onPress={handlePress}
          disabled={disabled || readonly}
          nativeID={id}
          accessible={true}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole='checkbox'
          accessibilityState={{
            checked: value,
            disabled: disabled || readonly,
          }}
          importantForAccessibility='yes'
        >
          <View style={styles.switchContainer}>
            <Switch
              value={value}
              onValueChange={handleValueChange}
              disabled={disabled || readonly}
              nativeID={`${id}-switch`}
              accessible={false}
            />
          </View>
          {label && (
            <Text style={styles.label} numberOfLines={2} accessible={false}>
              {label}
            </Text>
          )}
        </Pressable>
      </View>
      {hasError &&
        rawErrors.map((error: string, index: number) => (
          <Text
            key={index}
            style={styles.errorText}
            accessible={true}
            accessibilityRole='alert'
            accessibilityLabel={`Error: ${error}`}
          >
            {error}
          </Text>
        ))}
    </View>
  );
};

export default CheckboxWidget;
