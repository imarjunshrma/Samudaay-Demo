import type { ReactNode } from 'react';
import ImageViewing from 'react-native-image-viewing';

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

export function ImageViewer(props: ImageViewerProps) {
  return <ImageViewing {...props} />;
}

export default ImageViewer;
