import { Photo } from '@/types';

export function displayImage(
  selectedVariationImage: Photo | undefined,
  gallery: Photo[] | undefined | null,
  image: Photo | undefined
) {
  if (selectedVariationImage) {
    return [selectedVariationImage];
  }
  if (gallery?.length) {
    return gallery;
  }
  if (image) {
    return [image];
  }
  return [];
}
