<script setup lang="ts">
import { ref } from "vue";
import { listDocsByPath, FilesUnderPath } from "./lib/SiYuan"


const response = ref<FilesUnderPath | null>(null);

await listDocsByPath("20220222113553-y8m8883", "20220222081442-8yacijq").then(
  (res) => {
    response.value = res
  }
)

console.log(response.value);

</script>

<template>
  <div>Hello</div>
  <div>{{ response }}</div>
</template>

<style>
</style>
