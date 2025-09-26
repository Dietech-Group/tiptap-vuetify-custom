import { VueConstructor } from "vue";

import {
  Mention as MentionOriginal,
  type MentionOptions,
} from "@tiptap/extension-mention";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import type { SuggestionOptions } from "@tiptap/suggestion";
import { mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-2";

import CustomMentionNodeComponent from "../Components/CustomMentionNodeComponent.vue";

export default MentionOriginal.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      renderHTML({
        options,
        node,
        suggestion,
      }: {
        options: MentionOptions;
        node: ProseMirrorNode;
        suggestion: SuggestionOptions | null;
      }) {
        return [
          "mention",
          mergeAttributes(this.HTMLAttributes ?? {}, options.HTMLAttributes),
          `${suggestion?.char ?? "@"}${node.attrs.label ?? node.attrs.id}`,
        ];
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `mention[data-type="${this.name}"]`,
      },
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(
      CustomMentionNodeComponent as unknown as VueConstructor,
    );
  },
});
