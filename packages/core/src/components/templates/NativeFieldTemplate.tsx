import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { FieldTemplateProps } from '@rjsf/utils';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  error: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
  },
  required: {
    color: '#dc3545',
    marginLeft: 4,
  },
});

export const NativeFieldTemplate: React.FC<FieldTemplateProps> = ({
  id,
  label,
  children,
  errors,
  help,
  description,
  hidden,
  required,
  displayLabel = true,
}) => {
  if (hidden) {
    return null;
  }

  return (
    <View style={styles.container}>
      {displayLabel && label && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      {description && <Text style={styles.description}>{description}</Text>}
      {children}
      {errors && <Text style={styles.error}>{errors}</Text>}
      {help && <Text style={styles.description}>{help}</Text>}
    </View>
  );
};

export default NativeFieldTemplate;
