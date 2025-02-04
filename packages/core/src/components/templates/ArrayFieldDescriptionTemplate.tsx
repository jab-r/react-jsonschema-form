import { View, Text, StyleSheet } from 'react-native';
import type { ArrayFieldDescriptionProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
  },
});

export default function NativeArrayFieldDescriptionTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: ArrayFieldDescriptionProps<T, S, F>) {
  const { description } = props;

  if (!description) {
    return null;
  }

  return (
    <View style={styles.container} accessible={true} accessibilityRole="text">
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}
