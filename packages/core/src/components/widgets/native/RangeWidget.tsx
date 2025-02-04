import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { RangeWidgetProps } from './types';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 14,
    color: '#666',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  disabledSlider: {
    opacity: 0.5,
  },
});

const RangeWidget: React.FC<RangeWidgetProps> = ({
  id = '',
  value,
  disabled = false,
  readonly = false,
  onChange,
  onBlur,
  onFocus,
  min = 0,
  max = 100,
  step = 1,
  style,
}) => {
  const handleValueChange = React.useCallback(
    (newValue: number) => {
      onChange(newValue);
    },
    [onChange]
  );

  const handleSlidingComplete = React.useCallback(() => {
    if (onBlur && id) {
      onBlur(id, value);
    }
  }, [onBlur, id, value]);

  const handleSlidingStart = React.useCallback(() => {
    if (onFocus && id) {
      onFocus(id, value);
    }
  }, [onFocus, id, value]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{min}</Text>
        <Text style={styles.valueText}>{value ?? min}</Text>
        <Text style={styles.valueText}>{max}</Text>
      </View>
      <Slider
        style={[styles.slider, (disabled || readonly) && styles.disabledSlider]}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value ?? min}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        onSlidingStart={handleSlidingStart}
        disabled={disabled || readonly}
        minimumTrackTintColor='#007AFF'
        maximumTrackTintColor='#CCCCCC'
      />
    </View>
  );
};

export default RangeWidget;
