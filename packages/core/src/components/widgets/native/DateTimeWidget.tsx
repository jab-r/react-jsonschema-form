import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { DateTimeWidgetProps } from './types';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    minHeight: 40,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
  },
  placeholderText: {
    color: '#999',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
});

const formatDate = (date: Date, mode: 'date' | 'time' | 'datetime' = 'datetime'): string => {
  if (!date) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
    ...(mode === 'date' || mode === 'datetime' ? { year: 'numeric', month: 'short', day: 'numeric' } : {}),
    ...(mode === 'time' || mode === 'datetime' ? { hour: '2-digit', minute: '2-digit' } : {}),
  };

  return date.toLocaleString(undefined, options);
};

const DateTimeWidget: React.FC<DateTimeWidgetProps> = ({
  id = '',
  value,
  disabled = false,
  readonly = false,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  mode = 'datetime',
  minimumDate,
  maximumDate,
  style,
  textStyle,
}) => {
  const [open, setOpen] = React.useState(false);
  const dateValue = value ? new Date(value) : undefined;

  const handleConfirm = React.useCallback(
    (date: Date) => {
      setOpen(false);
      onChange(date.toISOString());
      if (onBlur && id) {
        onBlur(id, date.toISOString());
      }
    },
    [onChange, onBlur, id]
  );

  const handlePress = React.useCallback(() => {
    if (!disabled && !readonly) {
      setOpen(true);
      if (onFocus && id) {
        onFocus(id, value);
      }
    }
  }, [disabled, readonly, onFocus, id, value]);

  const handleCancel = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handlePress} disabled={disabled || readonly}>
        <View style={[styles.input, disabled && styles.disabledInput, readonly && styles.disabledInput]}>
          <Text style={[styles.inputText, !dateValue && styles.placeholderText, textStyle]}>
            {dateValue ? formatDate(dateValue, mode) : placeholder || 'Select date/time'}
          </Text>
        </View>
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={dateValue || new Date()}
        mode={mode}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default DateTimeWidget;
