import { defineComponent } from "vue";

import { getMsg } from "@/i18n/index";

const namespace = "$i18n";

export default defineComponent({
  computed: {
    [namespace]() {
      return { getMsg };
    },
  },
});
