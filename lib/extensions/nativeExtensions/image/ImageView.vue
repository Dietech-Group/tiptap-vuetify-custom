<template>
  <node-view-wrapper as="span">
    <img
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :title="node.attrs.title"
      :class="{
        'tiptap-vuetify__custom-image--clickable': !!extension.options.onClick,
      }"
      v-on="
        extension.options.onClick
          ? { click: () => extension.options.onClick(node.attrs) }
          : {}
      "
    />
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Node } from "@tiptap/pm/model";
import { Extension, NodeViewWrapper } from "@tiptap/vue-2";

export default defineComponent({
  components: {
    NodeViewWrapper,
  },
  props: {
    node: {
      type: Object as PropType<Node>,
      required: true,
    },
    extension: {
      type: Object as PropType<Extension>,
      required: true,
    },
  },
});
</script>

<style>
.tiptap-vuetify__custom-image--clickable:hover {
  cursor: pointer;
}
</style>
