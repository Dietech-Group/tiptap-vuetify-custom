export type FileTypesType = string[] | undefined;
export type MaxFileSizeType = bigint | undefined;
export type FilterErrorFuncType =
  | ((type: string, file: File) => void)
  | undefined;

/**
 * Filter files by type and size
 * @param files - Array of files.
 * @param fileTypes - Array of file types (ex. ['pdf', 'txt', 'png']).
 * @param maxFileSize - The max filesize in bytes.
 * @param filterErrorFunc - An callback which is called for every file which is filtered out.
 * @returns The filtered files.
 */
export function filterFiles(
  files: File[],
  fileTypes: FileTypesType,
  maxFileSize: MaxFileSizeType,
  filterErrorFunc: FilterErrorFuncType,
): File[] {
  if ((maxFileSize && maxFileSize > 0) || (fileTypes && fileTypes.length > 0)) {
    return files.filter((file) => {
      const hasCorrectType = fileTypes ? fileTypes.includes(file.type) : true;
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

  return files;
}

class CancelFileInputError extends Error {}

export interface FileSource {
  src: null | string;
  alt: null | string;
}
export type OnFilesSelectFuncType = (files: FileSource[]) => void;

/**
 * Creates a html file selector dialog.
 * @param editor - TipTap editor instance.
 * @param fileTypes - Array of file types (ex. ['pdf', 'txt', 'png']).
 * @param maxFileSize - The max filesize in bytes.
 * @param filterErrorFunc - An callback which is called for every file which is filtered out.
 * @param onFilesSelectFunc - Callback which is called with the selected files.
 */
export class FileSelector {
  private readonly editor: any;
  private readonly fileTypes: FileTypesType;
  private readonly maxFileSize: MaxFileSizeType;
  private readonly filterErrorFunc: FilterErrorFuncType;
  private readonly onFilesSelectFunc: OnFilesSelectFuncType;
  constructor(
    editor: any,
    fileTypes: FileTypesType,
    maxFileSize: MaxFileSizeType,
    filterErrorFunc: FilterErrorFuncType,
    onFilesSelectFunc: OnFilesSelectFuncType,
  ) {
    this.editor = editor;
    this.fileTypes = fileTypes;
    this.maxFileSize = maxFileSize;
    this.filterErrorFunc = filterErrorFunc;
    this.onFilesSelectFunc = onFilesSelectFunc;
  }

  private editorInstanceElement(): HTMLElement | null {
    const uid = (this.editor.options as any)?.editorInstanceUId;
    return document.querySelector(`[data-editor-instance-uid="${uid}"]`);
  }

  open() {
    void new Promise<FileList | null>((resolve, reject) => {
      let changeTriggered = false;
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.classList.add("tiptap-vuetify-custom__input-file");
      if (this.fileTypes && this.fileTypes.length > 0) {
        input.setAttribute("accept", this.fileTypes.join(","));
      }
      input.setAttribute("multiple", "");
      input.style.display = "none";
      this.editorInstanceElement()!.appendChild(input);

      input.addEventListener(
        "change",
        () => {
          changeTriggered = true;
          resolve(input.files);
          // remove dom
          if (input) input.parentNode?.removeChild(input);
        },
        { once: true },
      );

      // file blur
      window.addEventListener(
        "focus",
        () => {
          setTimeout(() => {
            if (!changeTriggered) {
              if (input) {
                reject(new CancelFileInputError());
                // remove dom
                input.parentNode?.removeChild(input);
              }
            }
          }, 300);
        },
        { once: true },
      );

      input.click();
    })
      .then((files) => {
        if (files) {
          this.readFiles(
            filterFiles(
              Array.from(files),
              this.fileTypes,
              this.maxFileSize,
              this.filterErrorFunc,
            ),
          )
            .then((sources) => {
              if (Array.isArray(sources) && sources.length > 0) {
                this.onFilesSelectFunc(sources);
              }
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => {
        // ignore CancelFileInputError
        if (!(error instanceof CancelFileInputError)) throw error;
      });
  }

  async readFiles(files: File[]): Promise<FileSource[]> {
    const filePromises = files.map(async (file) => {
      // Return a promise per file
      return await new Promise<FileSource>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          resolve({
            src: reader.result?.toString() ?? "",
            alt: file.name,
          });
        };

        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    const fileSources = await Promise.all(filePromises);
    return fileSources;
  }
}
