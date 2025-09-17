<template>
  <node-view-wrapper>
    <img
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :title="node.attrs.title"
      :class="{
        'tiptap-vuetify__custom-image': !!node.attrs['data-high-res-src'],
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
      if (typeof this.node.attrs["data-high-res-src"] === "string")
        window.open(this.node.attrs["data-high-res-src"], "_blank");
    },
  },
});
</script>

<style>
.tiptap-vuetify__custom-image:hover {
  cursor: pointer;
}
</style>
