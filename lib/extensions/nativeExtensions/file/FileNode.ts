import { mergeAttributes, Node } from "@tiptap/core";
import { Editor } from "@tiptap/vue-2";
import { EditorView } from "prosemirror-view";

import { Plugin, PluginKey } from "@tiptap/pm/state";
import { VueNodeViewRenderer } from "@tiptap/vue-2";

import {
  type FileTypesType,
  type MaxFileSizeType,
  type FilterErrorFuncType,
  filterFiles,
} from "@/extensions/helper/FileSelector";
import FileView from "./FileView.vue";
import { VueConstructor } from "vue";
import FileLoadingOverlay from "./FileLoadingOverlay.vue";
import { createAndMountComponent } from "@/extensions/helper/ComponentFactory";

export type Action = "upload" | "addExisting";
type Actions = Action | Action[];

export interface ExtendedFileOptions {
  /**
   * Controls which file types are allowed to drop.
   * @param fileTypes - Defaults to: null
   * @example ['application/pdf']
   */
  fileTypes: FileTypesType;

  /**
   * Controls the allowed max file size of dropped files.
   * @param maxFileSize - Defaults to: null
   * @example 1073741824
   */
  maxFileSize: MaxFileSizeType;

  /**
   * Callback function which is called for every dropped file which is rejected because of file type or size.
   * @param filterErrorFunc - Defaults to: null
   * @example (type, file) => { console.log(type, file) }
   */
  filterErrorFunc: FilterErrorFuncType;

  /**
   * Any combination of 'upload' | 'addExisting' which disabled these actions.
   */
  disableActions?: Actions;

  /**
   * A function to upload a file to a server.
   * @param file - File object
   * @param onSucess callback for a successful upload
   * @param onError Error callback when the upload fails
   * @param onProgress Progresds callback which is called with the upload progress in percent (0-100)
   */
  upload: (
    file: File,
    onSuccess: ({ id, title }: { id: number; title: string }) => void,
    onError: (error: string) => void,
    onProgress: (progress: number) => void,
  ) => void;

  /**
   * A function to cancel all remaining uploads.
   */
  cancelRemainingUploads: () => void;

  select: {
    component: VueConstructor;
    load: (
      query: string,
      page: number,
      callback: (
        items: { label: string; value: string }[],
        page: number,
        allPagesLoaded: boolean,
      ) => void,
    ) => void;
  };

  /**
   * A function which is called when a file node is clicked.
   * @param id Id of the clicked file node
   */
  onClick: (id: number) => void;
}

export const FileNode = Node.create({
  name: "fileNode",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,

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
      if (!(files && files.length > 0)) {
        return false;
      }

      const filteredFiles = filterFiles(
        Array.from(files),
        options.fileTypes,
        options.maxFileSize,
      );
      if (filteredFiles.length === 0) {
        return false;
      }

      event.preventDefault();

      createAndMountComponent(FileLoadingOverlay, editor, {
        propsData: {
          files: filteredFiles,
          upload: options.upload,
          cancel: options.cancelRemainingUploads,
          insert: (fileNode: any) => {
            const node = view.state.schema.nodes.fileNode.create(fileNode);
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
