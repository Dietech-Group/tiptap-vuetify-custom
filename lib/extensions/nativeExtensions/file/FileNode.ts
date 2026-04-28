import { mergeAttributes, Node } from "@tiptap/core";
import { Editor } from "@tiptap/vue-2";
import { EditorView } from "prosemirror-view";

import { Plugin, PluginKey } from "@tiptap/pm/state";
import { VueNodeViewRenderer } from "@tiptap/vue-2";

import { filterFiles } from "@/extensions/helper/FileSelector";
import FileView from "./FileView.vue";
import { VueConstructor } from "vue";
import UploadOverlay from "@/extensions/helper/UploadOverlay.vue";
import { createAndMountComponent } from "@/extensions/helper/ComponentFactory";
import type { UploadSelectOptions } from "@/extensions/helper/UploadSelect";

export interface FileUploadResult {
  id: number;
  label: string;
}

export interface FileSelectItem {
  id: number;
  label: string;
}

export interface ExtendedFileOptions
  extends UploadSelectOptions<FileUploadResult, FileSelectItem> {
  /**
   * A function which is called when a file node is clicked.
   * @param attrs Attributes of the clicked image node
   */
  onClick?: (attrs: Record<string, any>) => void;
}

export const FileNode = Node.create<ExtendedFileOptions>({
  name: "fileNode",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,

  addOptions() {
    return {
      ...this.parent?.(),
      includedFileTypes: undefined,
      excludedFileTypes: ["image/png", "image/jpeg", "image/gif"],
      maxFileSize: undefined,
      filterErrorFunc: undefined,
    };
  },
  addAttributes() {
    return {
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

      label: {
        default: null,
        parseHTML: (element) => element.innerText,
        renderHTML: () => {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "file",
      },
    ];
  },

  renderHTML({
    node,
    HTMLAttributes,
  }: {
    node: any;
    HTMLAttributes: Record<string, any>;
  }) {
    return ["file", mergeAttributes(HTMLAttributes), node.attrs.label];
  },
  addNodeView() {
    return VueNodeViewRenderer(FileView as unknown as VueConstructor);
  },
  addProseMirrorPlugins() {
    const options = this.options;
    const editor: Editor = this.editor as Editor;

    const handleFileEvent = function (
      editor: Editor,
      view: EditorView,
      event: Event,
      files: FileList | undefined,

      coordinates: any,
    ) {
      if (!(files && files.length > 0) || !options.upload) {
        return false;
      }

      const filteredFiles = filterFiles(
        Array.from(files),
        options.includedFileTypes,
        options.excludedFileTypes,
        options.maxFileSize,
      );
      if (filteredFiles.length === 0) {
        return false;
      }

      event.preventDefault();

      createAndMountComponent(UploadOverlay, editor, {
        propsData: {
          files: filteredFiles,
          upload: options.upload,
          cancel: options.cancelRemainingUploads,
          insert: (item: { id: number; label: string }) => {
            const node = view.state.schema.nodes.fileNode.create({
              id: item.id,
              label: item.label,
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
      key: new PluginKey("fileNode"),
      props: {
        handleDOMEvents: {
          drop(view, event) {
            handleFileEvent(
              editor,
              view,
              event,
              event.dataTransfer?.files,
              view.posAtCoords({ left: event.clientX, top: event.clientY }),
            );
          },
          paste(view, event) {
            handleFileEvent(
              editor,
              view,
              event,
              event.clipboardData?.files,
              null,
            );
          },
        },
      },
    });

    return [plugin];
  },
});
