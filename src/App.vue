<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { listDocsByPath, FilesUnderPath } from "./lib/SiYuan"

const WidgetElement = ref<HTMLElement | null>(null)
// 获取挂件块id
onMounted(() => {
  WidgetElement.value = document.getElementById("query")
})

watchEffect(
  () => {
    console.log(WidgetElement.value)
  }
)

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

  <div id="query"></div>
</template>

<style>
</style>
