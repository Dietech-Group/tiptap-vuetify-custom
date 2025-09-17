export type FileTypesType = string[] | undefined;
export type MaxFileSizeType = bigint | undefined;
export type FilterErrorFuncType =
  | ((type: string, file: File) => void)
  | undefined;

/**
 * Filter image files by type and size
 * @param images - Array image files.
 * @param fileTypes - Array of image file types (ex. ['png', 'jpg']).
 * @param maxFileSize - The max filesize in bytes.
 * @param filterErrorFunc - An callback which is called for every file which is filtered out.
 * @returns The filtered image files.
 */
export function filterImages(
  images: File[],
  fileTypes: FileTypesType,
  maxFileSize: MaxFileSizeType,
  filterErrorFunc: FilterErrorFuncType,
): File[] {
  const typeRegex =
    fileTypes && fileTypes.length > 0
      ? new RegExp(`^image\\/(${fileTypes.join("|")})$`, "i")
      : null;

  if (typeRegex ?? maxFileSize) {
    return images.filter((file) => {
      const hasCorrectType = typeRegex ? typeRegex.test(file.type) : true;
      const hasCorrectSize = maxFileSize ? file.size <= maxFileSize : true;
      if (filterErrorFunc) {
        if (!hasCorrectType) {
          filterErrorFunc("type", file);
        } else if (!hasCorrectSize) {
          filterErrorFunc("size", file);
        }
      }

      return hasCorrectType && hasCorrectSize;
    });
  }

  return images;
}
