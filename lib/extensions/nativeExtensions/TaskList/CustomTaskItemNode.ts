import { VueNodeViewRenderer } from "@tiptap/vue-2";

import { TaskItem as TaskItemOriginal } from "@tiptap/extension-list";

import CustomTaskItemComponent from "./CustomTaskItemComponent.vue";
import { type VueConstructor } from "vue";

export default TaskItemOriginal.extend({
  draggable: true,

  addNodeView() {
    return VueNodeViewRenderer(
      CustomTaskItemComponent as unknown as VueConstructor,
    );
  },
});
