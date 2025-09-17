<script setup lang="ts">
defineProps<{
  msg: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="wrapper">
    <h1>Hello World!</h1>
    <h2>{{ msg }}</h2>
    <h3>{{ subtitle }}</h3>
  </div>
</template>

<style scoped>
.wrapper {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px 20px;
}
</style>
