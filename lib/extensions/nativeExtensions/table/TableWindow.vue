<template>
  <v-dialog :value="value" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ $i18n.getMsg("extensions.Table.window.title") }}
        </span>

        <v-spacer />

        <v-btn icon @click="close">
          <v-icon>{{ COMMON_ICONS.close[$tiptapVuetify.iconsGroup] }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="form.rowsCount"
          :label="$i18n.getMsg('extensions.Table.window.form.rowsCount')"
        />
        <v-text-field
          v-model="form.colsCount"
          :label="$i18n.getMsg('extensions.Table.window.form.colsCount')"
        />
        <v-checkbox
          v-model="form.withHeaderRow"
          :label="$i18n.getMsg('extensions.Table.window.form.withHeaderRow')"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="close">
          {{ $i18n.getMsg("extensions.Table.window.buttons.close") }}
        </v-btn>

        <v-btn text @click="apply">
          {{ $i18n.getMsg("extensions.Table.window.buttons.apply") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import {
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
  VSpacer,
  VIcon,
  VTextField,
  VCheckbox,
} from "vuetify/lib";

import { COMMON_ICONS } from "@/configs/theme";
import I18nMixin from "@/mixins/I18nMixin";

export const PROPS = {
  VALUE: "value" as const,
  EDITOR: "editor" as const,
  IMAGE_SOURCES: "imageSources" as const,
  IMAGE_SOURCES_OVERRIDE: "imageSourcesOverride" as const,
  NATIVE_EXTENSION_NAME: "nativeExtensionName" as const,
};

export default defineComponent({
  components: {
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VBtn,
    VSpacer,
    VIcon,
    VTextField,
    VCheckbox,
  },
  mixins: [I18nMixin],
  props: {
    [PROPS.VALUE]: {
      type: Boolean,
      default: false,
    },
    [PROPS.NATIVE_EXTENSION_NAME]: {
      type: String,
      required: true,
    },
    [PROPS.EDITOR]: {
      type: Object,
      required: true,
    },
    [PROPS.IMAGE_SOURCES_OVERRIDE]: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      form: {
        rowsCount: 2,
        colsCount: 3,
        withHeaderRow: false,
      },
    };
  },
  computed: {
    COMMON_ICONS() {
      return COMMON_ICONS;
    },
  },
  methods: {
    apply() {
      this[PROPS.EDITOR]
        .chain()
        .focus()
        .insertTable({
          rows: this.form.rowsCount,
          cols: this.form.colsCount,
          withHeaderRow: this.form.withHeaderRow,
        })
        .run();

      this.close();
    },
    close() {
      this.$destroy();
      this.$el.parentNode!.removeChild(this.$el);
    },
  },
});
</script>
