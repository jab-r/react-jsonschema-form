import { useCallback, useMemo } from 'react';
import {
  FormContextType,
  getTemplate,
  Registry,
  RJSFSchema,
  StrictRJSFSchema,
  TranslatableString,
  UIOptionsType,
  WidgetProps,
} from '@rjsf/utils';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

type FileInfo = {
  uri: string;
  name: string;
  type: string;
};

function ImagePreview<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  uri,
}: {
  uri: string;
}) {
  return (
    <Image 
      source={{ uri }} 
      style={styles.previewImage} 
      resizeMode="contain"
    />
  );
}

function FileDisplay<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  fileInfo,
  registry,
  onRemove,
  options,
}: {
  fileInfo: FileInfo;
  registry: Registry<T, S, F>;
  onRemove: () => void;
  options: UIOptionsType<T, S, F>;
}) {
  const { translateString } = registry;
  const { RemoveButton } = getTemplate<'ButtonTemplates', T, S, F>('ButtonTemplates', registry, options);

  return (
    <View style={styles.fileContainer}>
      <Text style={styles.fileName}>
        {fileInfo.name}
      </Text>
      <ImagePreview uri={fileInfo.uri} />
      <RemoveButton onClick={onRemove} registry={registry} />
    </View>
  );
}

function extractFileInfo(uri: string | undefined): FileInfo | null {
  if (!uri) return null;
  
  // Extract filename from uri
  const name = uri.substring(uri.lastIndexOf('/') + 1);
  return {
    uri,
    name,
    type: 'image/jpeg', // Default to JPEG for simplicity
  };
}

function FileWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>
) {
  const { disabled, readonly, onChange, value, options, registry } = props;
  const { translateString } = registry;

  const handleImagePick = useCallback(async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.uri) {
          onChange(asset.uri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  }, [onChange]);

  const fileInfo = useMemo(() => extractFileInfo(value), [value]);
  
  const handleRemove = useCallback(() => {
    onChange(undefined);
  }, [onChange]);

  return (
    <View style={styles.container}>
      {!fileInfo && (
        <TouchableOpacity 
          style={[
            styles.button,
            disabled || readonly ? styles.buttonDisabled : null
          ]}
          onPress={handleImagePick}
          disabled={disabled || readonly}
        >
          <Text style={styles.buttonText}>
            {translateString(TranslatableString.SelectLabel)}
          </Text>
        </TouchableOpacity>
      )}
      {fileInfo && (
        <FileDisplay<T, S, F>
          fileInfo={fileInfo}
          registry={registry}
          onRemove={handleRemove}
          options={options}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fileContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  fileName: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default FileWidget;
