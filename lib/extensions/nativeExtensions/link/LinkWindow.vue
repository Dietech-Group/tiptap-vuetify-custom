<template>
  <v-dialog :value="value" max-width="500px" width="100%">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ $i18n.getMsg("extensions.Link.window.title") }}
        </span>

        <v-spacer />

        <v-btn icon @click="close">
          <v-icon>{{ COMMON_ICONS.close[$tiptapVuetify.iconsGroup] }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="form.href"
          :label="$i18n.getMsg('extensions.Link.window.form.hrefLabel')"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="close">
          {{ $i18n.getMsg("extensions.Link.window.buttons.close") }}
        </v-btn>

        <v-btn
          :disabled="isDisabled"
          :color="isRemove ? 'error' : 'primary'"
          text
          @click="apply"
        >
          {{
            $i18n.getMsg(
              "extensions.Link.window.buttons." +
                (isRemove ? "remove" : "apply"),
            )
          }}
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
} from "vuetify/lib";

import { COMMON_ICONS } from "@/configs/theme";
import I18nMixin from "@/mixins/I18nMixin";

export const PROPS = {
  VALUE: "value" as const,
  CONTEXT: "context" as const,
  EDITOR: "editor" as const,
  NATIVE_EXTENSION_NAME: "nativeExtensionName" as const,
  HREF: "href" as const,
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
    [PROPS.HREF]: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        href: this[PROPS.HREF],
        blank: false,
      },
    };
  },
  computed: {
    COMMON_ICONS() {
      return COMMON_ICONS;
    },
    isRemove() {
      return this[PROPS.HREF] && !this.form.href;
    },
    isDisabled() {
      return (
        this[PROPS.HREF] === this.form.href ||
        (!this[PROPS.HREF] && !this.form.href)
      );
    },
  },
  methods: {
    apply() {
      if (this.isRemove) {
        this[PROPS.EDITOR].chain().focus().unsetLink().run();
      } else {
        const URL_SCHEME_REGEXP = /^((?:f|ht)tps?:)?\/\//;
        const scheme = "http";

        let url = this.form.href;
        if (url?.length && !URL_SCHEME_REGEXP.test(url)) {
          url = scheme ? scheme + "://" + url : "//" + url;
        }

        this[PROPS.EDITOR]
          .chain()
          .focus()
          .setLink({
            href: url,
          })
          .run();
      }

      this.close();
    },

    close() {
      this.$destroy();
      this.$el.parentNode!.removeChild(this.$el);
    },
  },
});
</script>
