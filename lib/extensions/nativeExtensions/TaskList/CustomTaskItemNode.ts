import { type VueConstructor } from "vue";
import { VueNodeViewRenderer } from "@tiptap/vue-2";

import { TaskItem as TaskItemOriginal } from "@tiptap/extension-list";
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { mergeAttributes } from '@tiptap/core'

import CustomTaskItemComponent from "./CustomTaskItemComponent.vue";

export default TaskItemOriginal.extend({
  draggable: true,

  // Override original from @tiptap/extension-list/src/task-item/task-item.ts
  renderHTML({ node, HTMLAttributes }: { node: ProseMirrorNode; HTMLAttributes: Record<string, any> }) {
    return [
        'li',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          'data-type': this.name,
        }),    
        ['div', 0],
      ]
  },

  addNodeView() {
    return VueNodeViewRenderer(
      CustomTaskItemComponent as unknown as VueConstructor,
    );
  },
});
