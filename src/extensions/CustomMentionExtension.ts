import { VueConstructor } from "vue";

import { Mention as MentionOriginal } from "@tiptap/extension-mention";
import { VueNodeViewRenderer } from "@tiptap/vue-2";

import CustomMentionNodeComponent from "../Components/CustomMentionNodeComponent.vue";

function mentionType2Char(type: string | null) {
  switch (type) {
    case "user":
      return "@";
    default:
      return null;
  }
}

export default MentionOriginal.extend({
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("m-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            "m-id": attributes.id,
          };
        },
      },

      type: {
        default: "user",
        parseHTML: (element) => {
          return element.getAttribute("m-type");
        },
        renderHTML: (attributes) => {
          return {
            "m-type": attributes.type,
          };
        },
      },

      label: {
        default: null,
        parseHTML: (element) => element.innerText,
        renderHTML: () => {},
      },

      // When there are multiple types of mentions, this attribute helps distinguish them
      mentionSuggestionChar: {
        default: "@",
        parseHTML: (element) =>
          mentionType2Char(element.getAttribute("m-type")),
        renderHTML: () => {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "mention",
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
    return ["mention", HTMLAttributes, node.attrs.label];
  },

  addNodeView() {
    return VueNodeViewRenderer(
      CustomMentionNodeComponent as unknown as VueConstructor,
    );
  },
});
