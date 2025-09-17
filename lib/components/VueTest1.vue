<template>
  <div>
    <HelloWorld msg="VueTest1 - You did it!" :subtitle="message" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "./HelloWorld.vue";

export default defineComponent({
  components: {
    HelloWorld,
  },
  props: {
    message: {
      type: String,
      default: "",
    },
  },
});
</script>
