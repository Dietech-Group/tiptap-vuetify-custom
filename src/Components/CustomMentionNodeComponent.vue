<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <node-view-wrapper as="span" class="mention">
    <mention :m-id="node.attrs.id" :m-type="node.attrs.type">
      {{ node.attrs.label }}
    </mention>
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { NodeViewWrapper } from "@tiptap/vue-2";
import { Node } from "@tiptap/pm/model";

import Mention from "./Mention.vue";

export default defineComponent({
  components: {
    NodeViewWrapper,
    Mention,
  },
  props: {
    node: {
      type: Object as PropType<Node>,
      required: true,
    },
  },
});
</script>
