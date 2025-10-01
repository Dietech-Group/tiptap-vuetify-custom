<template>
  <node-view-wrapper as="span">
    <img
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :title="node.attrs.title"
      :class="{
        'tiptap-vuetify__custom-image-with-high-res-src':
          !!node.attrs['data-high-res-src'],
      }"
      @click="onClick"
    />
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Node } from "@tiptap/pm/model";
import { NodeViewWrapper } from "@tiptap/vue-2";

export default defineComponent({
  components: {
    NodeViewWrapper,
  },
  props: {
    node: {
      type: Object as PropType<Node>,
      required: true,
    },
  },
  computed: {
    highResSrc(): string | null {
      return this.node.attrs["data-high-res-src"];
    },
  },
  methods: {
    onClick() {
      if (this.highResSrc) window.open(this.highResSrc, "_blank");
    },
  },
});
</script>

<style>
.tiptap-vuetify__custom-image-with-high-res-src:hover {
  cursor: pointer;
}
</style>
