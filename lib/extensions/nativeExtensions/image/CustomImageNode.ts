import {
  Image as ImageOriginal,
  type ImageOptions,
} from "@tiptap/extension-image";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { VueNodeViewRenderer } from "@tiptap/vue-2";
import { EditorView } from "prosemirror-view";
import { Editor } from "@tiptap/vue-2";

import { filterFiles } from "@/extensions/helper/FileSelector";
import ImageView from "./ImageView.vue";
import { VueConstructor } from "vue";
import UploadOverlay from "@/extensions/helper/UploadOverlay.vue";
import { createAndMountComponent } from "@/extensions/helper/ComponentFactory";
import type { UploadSelectOptions } from "@/extensions/helper/UploadSelect";

export interface ImageUploadResult {
  id: number;
  label: string;
  src: string;
  alt?: string;
}

export interface ImageSelectItem {
  id: number;
  label: string;
  src: string;
  alt?: string;
}

export interface ExtendedImageOptions
  extends Partial<ImageOptions>,
    UploadSelectOptions<ImageUploadResult, ImageSelectItem> {
  /**
   * Allows to add custom attributes to the image node (tag).
   * @example {"data-high-res-src": null}
   */
  customAttributes?: Record<string, any>;

  /**
   * A function which is called when an image node is clicked.
   * @param attrs Attributes of the clicked image node
   */
  onClick?: (attrs: Record<string, any>) => void;
}

export const CustomImageNode = ImageOriginal.extend<ExtendedImageOptions>({
  name: "customImage",
  addOptions() {
    return {
      ...this.parent?.(),
      includedFileTypes: ["image/png", "image/jpeg", "image/gif"],
      excludedFileTypes: undefined,
      maxFileSize: undefined,
      filterErrorFunc: undefined,
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("f-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            "f-id": attributes.id,
          };
        },
      },
      ...(this.options.customAttributes ?? {}),
    };
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageView as unknown as VueConstructor);
  },
  addProseMirrorPlugins() {
    const options = this.options;
    const editor: Editor = this.editor as Editor;

    const handleImageEvent = function (
      view: EditorView,
      event: Event,
      files: FileList | undefined,
      coordinates: any,
    ) {
      if (!(files && files.length > 0) || !options.upload) {
        return false;
      }

      const images = filterFiles(
        Array.from(files),
        options.includedFileTypes,
        options.excludedFileTypes,
        options.maxFileSize,
      );
      if (images.length === 0) {
        return false;
      }

      // If not all files are filtered, we want to trigger the callbacks of the file extensions
      if (images.length === Array.from(files).length) {
        event.preventDefault();
      }

      createAndMountComponent(UploadOverlay, editor, {
        propsData: {
          files: images,
          upload: options.upload,
          cancel: options.cancelRemainingUploads ?? (() => {}),
          insert: (result: ImageUploadResult) => {
            const node = view.state.schema.nodes.customImage.create({
              id: result.id,
              src: result.src,
              alt: result.alt ?? null,
            });
            const transaction = coordinates
              ? view.state.tr.insert(coordinates.pos, node)
              : view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          },
        },
        onClose: () => editor.commands.focus(),
      });

      return true;
    };

    const plugin = new Plugin({
      key: new PluginKey("customImage"),
      props: {
        handleDOMEvents: {
          drop(view, event) {
            handleImageEvent(
              view,
              event,
              event.dataTransfer?.files,
              view.posAtCoords({ left: event.clientX, top: event.clientY }),
            );
          },
          paste(view, event) {
            handleImageEvent(view, event, event.clipboardData?.files, null);
          },
        },
      },
    });

    return [plugin];
  },
});
