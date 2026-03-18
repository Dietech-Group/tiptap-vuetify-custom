<template>
  <node-view-wrapper as="span" class="file mx-1">
    <v-chip
      small
      class="tiptap-vuetify__file"
      color="primary lighten-2"
      text-color="white"
      v-on="
        extension.options.onClick
          ? { click: () => extension.options.onClick(node.attrs.id) }
          : {}
      "
    >
      <v-icon small class="mr-1">mdi-file</v-icon>
      {{ node.attrs.label }}
    </v-chip>
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
a.tiptap-vuetify__file {
  pointer-events: inherit;
}
</style>
