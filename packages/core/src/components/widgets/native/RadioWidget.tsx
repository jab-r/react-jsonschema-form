import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { SelectWidgetProps, SelectOption } from './types';
import RadioButton from './RadioButton';

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});

const RadioWidget: React.FC<SelectWidgetProps> = ({
  id = '',
  options,
  value,
  disabled = false,
  readonly = false,
  onChange,
  onBlur,
  onFocus,
  style,
}) => {
  const { enumOptions = [], enumDisabled = [] } = options;

  const handleSelect = React.useCallback(
    (selectedValue: any) => {
      onChange(selectedValue);
      if (onBlur && id) {
        onBlur(id, selectedValue);
      }
    },
    [onChange, onBlur, id]
  );

  const handleFocus = React.useCallback(() => {
    if (onFocus && id) {
      onFocus(id, value);
    }
  }, [onFocus, id, value]);

  return (
    <View style={[styles.container, style]} onTouchStart={handleFocus}>
      {enumOptions.map((option: SelectOption, index: number) => {
        const isDisabled = disabled || readonly || enumDisabled.includes(option.value);
        return (
          <RadioButton
            key={index}
            label={String(option.label)}
            selected={value === option.value}
            disabled={isDisabled}
            onPress={() => handleSelect(option.value)}
          />
        );
      })}
    </View>
  );
};

export default RadioWidget;
