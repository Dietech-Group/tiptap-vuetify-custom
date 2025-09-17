import { Editor, Extension } from "@tiptap/vue-2";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

export default interface AbstractExtensionInterface {
  availableActions: ExtensionActionInterface[];

  nativeExtensionInstance: Extension | null;

  onEditorInit?: (editor: Editor) => void;
}
