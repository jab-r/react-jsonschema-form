import { View, Text, StyleSheet } from 'react-native';
import type { ArrayFieldTitleProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  required: {
    color: '#dc3545',
    marginLeft: 4,
  },
});

export default function NativeArrayFieldTitleTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: ArrayFieldTitleProps<T, S, F>) {
  const { title, required } = props;

  if (!title) {
    return null;
  }

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityRole="header"
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
    </View>
  );
}
