import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ErrorListProps } from '@rjsf/utils';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff3f3',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 8,
  },
  errorItem: {
    fontSize: 14,
    color: '#dc3545',
    marginBottom: 4,
  },
});

export const NativeErrorList: React.FC<ErrorListProps> = ({ errors }) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Errors</Text>
      {errors.map((error, index) => (
        <Text key={index} style={styles.errorItem}>
          {error.stack}
        </Text>
      ))}
    </View>
  );
};

export default NativeErrorList;
