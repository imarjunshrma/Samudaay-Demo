import type { ReactNode } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';

export type ImageViewerImage = {
  uri: string;
};

export type ImageViewerProps = {
  images: ImageViewerImage[];
  imageIndex: number;
  visible: boolean;
  backgroundColor?: string;
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  HeaderComponent?: () => ReactNode;
  onRequestClose: () => void;
};

export function ImageViewer({
  images,
  imageIndex,
  visible,
  backgroundColor = 'rgba(15,23,42,0.96)',
  HeaderComponent,
  onRequestClose,
}: ImageViewerProps) {
  const activeImage = images[imageIndex];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}>
      <View style={[styles.overlay, { backgroundColor }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close image preview"
          onPress={onRequestClose}
          style={StyleSheet.absoluteFill}
        />
        {HeaderComponent ? (
          <View style={styles.header}>
            {HeaderComponent()}
          </View>
        ) : null}
        {activeImage?.uri ? (
          <View style={styles.content}>
            <Image
              source={{ uri: activeImage.uri }}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    zIndex: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageViewer;
