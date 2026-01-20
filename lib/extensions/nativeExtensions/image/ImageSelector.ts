import {
  type FileTypesType,
  type MaxFileSizeType,
  type FilterErrorFuncType,
  filterImages,
} from "./ImageHelper";

import type ImageSource from "./ImageSource";

class CancelFileInputError extends Error {}

export default class ImageSelector {
  private readonly editor: any;
  private readonly fileTypes: FileTypesType;
  private readonly maxFileSize: MaxFileSizeType;
  private readonly filterErrorFunc: FilterErrorFuncType;
  constructor(
    editor: any,
    fileTypes: FileTypesType,
    maxFileSize: MaxFileSizeType,
    filterErrorFunc: FilterErrorFuncType,
  ) {
    this.editor = editor;
    this.fileTypes = fileTypes;
    this.maxFileSize = maxFileSize;
    this.filterErrorFunc = filterErrorFunc;
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
      input.classList.add("tiptap-vuetify-custom-image__input-file");
      input.setAttribute("accept", "image/*");
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
            filterImages(
              Array.from(files),
              this.fileTypes,
              this.maxFileSize,
              this.filterErrorFunc,
            ),
          )
            .then((sources) => {
              if (Array.isArray(sources) && sources.length > 0) {
                this.editor
                  .chain()
                  .focus()
                  .insertContent(
                    sources.map((source) => {
                      return { type: "customImage", attrs: source };
                    }),
                  )
                  .run();
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

  async readFiles(files: File[]): Promise<ImageSource[]> {
    const filePromises = files.map(async (file) => {
      // Return a promise per file
      return await new Promise<ImageSource>((resolve, reject) => {
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

    const imageSources = await Promise.all(filePromises);
    return imageSources;
  }
}
