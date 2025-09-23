import {
  type FileTypesType,
  type MaxFileSizeType,
  type FilterErrorFuncType,
  filterImages,
} from "./ImageHelper";

import type ImageSource from "./ImageSource";

class CancelFileInputError extends Error {};

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

  open() {
    void new Promise<FileList | null>((resolve, reject) => {
      let changeTriggered = false;
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("id", "tiptap-vuetify-custom-image__input-file");
      input.setAttribute("accept", "image/*");
      input.setAttribute("multiple", "");
      input.style.display = "none";
      document.querySelector("body")!.appendChild(input);

      input.addEventListener(
        "change",
        () => {
          changeTriggered = true;
          resolve(input.files);
          // remove dom
          const el = document.getElementById(input.id);
          if (el) document.body.removeChild(el);
        },
        { once: true },
      );

      // file blur
      window.addEventListener(
        "focus",
        () => {
          setTimeout(() => {
            if (!changeTriggered) {
              const el = document.getElementById(input.id);
              if (el) {
                reject(new CancelFileInputError());
                // remove dom
                document.body.removeChild(el);
              }
            }
          }, 300);
        },
        { once: true },
      );

      input.click();
    }).then((files) => {
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
            this.editor
              .chain()
              .focus()
              .insertContent(
                sources.map((source) => {
                  return { type: "customImage", attrs: source };
                }),
              )
              .run();
          })
          .catch((error) => console.error(error));
      }
    }).catch(error => {
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
