<template>
  <node-view-wrapper
    as="li"
    :data-checked="node.attrs.checked"
    data-type="taskItem"
  >
    <v-checkbox
      class="mr-1"
      :class="{ 'task-item--readonly': !editor.isEditable }"
      hide-details
      :input-value="node.attrs.checked"
      :readonly="!editor.isEditable"
      :ripple="editor.isEditable"
      @change="onChange"
    />
    <node-view-content class="task-item-content" />
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from "@tiptap/vue-2";
import { VCheckbox } from "vuetify/lib";

export default defineComponent({
  name: "CustomTaskItemComponent",
  components: {
    NodeViewWrapper,
    NodeViewContent,
    VCheckbox,
  },
  props: nodeViewProps,
  methods: {
    onChange(value: boolean) {
      this.updateAttributes({ checked: value });
    },
  },
});
</script>
<style lang="scss">
.task-item--readonly {
  pointer-events: none;
}
</style>
