<template>
  <v-overlay class="file-loading-overlay">
    <v-progress-circular v-if="remaining" :value="progress" size="64">
      <template v-if="remaining !== undefined">{{ remaining }}</template>
    </v-progress-circular>

    <v-alert v-if="errors && errors.length" type="error" class="mt-2">
      <h3 class="mb-2">
        {{ $i18n.getMsg("extensions.File.overlay.errorTitle") }}
      </h3>
      <p v-for="(error, index) in errors" :key="index" class="mb-1">
        {{ error }}
      </p>
    </v-alert>

    <v-btn color="secondary" class="mt-2" @click="close">
      <template v-if="remaining">{{
        $i18n.getMsg("extensions.File.overlay.buttons.cancel")
      }}</template>
      <template v-else>{{
        $i18n.getMsg("extensions.File.overlay.buttons.close")
      }}</template>
    </v-btn>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { VOverlay, VProgressCircular } from "vuetify/lib";

import I18nMixin from "@/mixins/I18nMixin";

export default defineComponent({
  components: {
    VOverlay,
    VProgressCircular,
  },
  mixins: [I18nMixin],
  props: {
    files: {
      type: Array,
      required: true,
    },
    upload: {
      type: Function,
      required: true,
    },
    cancel: {
      type: Function,
      required: true,
    },
    insert: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      progress: undefined as any,
      remaining: undefined as any,
      errors: [] as string[],
    };
  },
  mounted() {
    this.startUpload();
  },
  methods: {
    startUpload() {
      this.remaining = this.files.length;

      const totalSize = Array.from(this.files as File[]).reduce(
        (acc, file) => acc + file.size,
        0,
      );
      const uploadedSizes = new Array(this.files.length).fill(0);

      (this.files as File[]).map((file: File, index: number) => {
        this.upload(
          file,
          // onSuccess callback
          ({ id, title }: { id: number; title: string }) => {
            this.insert({ id, label: title });

            this.remaining = Math.max((this.remaining || 0) - 1, 0);
            if (this.remaining === 0) this.close();
          },
          // onError callback
          (error: string) => {
            this.errors = [...(this.errors || []), error];
            this.remaining = Math.max((this.remaining || 0) - 1, 0);
            if (this.remaining === 0 && !this.errors?.length) this.close();
          },
          // onProgress callback
          (progress: number) => {
            uploadedSizes[index] = progress * file.size;
            const uploadedTotal = uploadedSizes.reduce(
              (acc, size) => acc + size,
              0,
            );
            const combinedProgress = uploadedTotal / totalSize;

            this.progress = Math.min(combinedProgress * 100, 100);
          },
        );
      });
    },
    close() {
      this.cancel();
      this.$emit("close");
    },
  },
});
</script>

<style lang="scss" scoped>
.file-loading-overlay > :deep(.v-overlay__content) {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
