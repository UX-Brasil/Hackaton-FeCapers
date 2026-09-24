import {renderShareImage, shareImageAlt, shareImageSize} from '@/lib/og/share-image';

export const alt = shareImageAlt;
export const size = shareImageSize;
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return renderShareImage();
}
