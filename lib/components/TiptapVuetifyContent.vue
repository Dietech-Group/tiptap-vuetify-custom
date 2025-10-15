<template>
  <editor-content
    v-if="editor"
    :editor="editor"
    :style="contentDynamicStyles"
    class="tiptap-vuetify-editor__content"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { EditorContent } from "@tiptap/vue-2";

import { PROPS } from "@/const";
import EditorMixin from "@/mixins/EditorMixin";
import "./TiptapVuetifyContent.scss";

export default defineComponent({
  components: {
    EditorContent,
  },
  mixins: [EditorMixin],
  computed: {
    PROPS() {
      return PROPS;
    },
  },
});
</script>

<style lang="scss">
.tiptap-vuetify-editor {
  position: relative;

  .ProseMirror {
    outline: none !important;
    margin: 20px !important;
  }

  &--disabled {
    cursor: not-allowed;
  }
}
</style>
