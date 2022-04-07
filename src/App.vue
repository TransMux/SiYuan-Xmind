<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { listDocsByPath, FilesUnderPath } from "./lib/SiYuan"

const widget = ref<HTMLElement | null>(null)
let RootBlockId: string = ""

const fetchData = async () => {
  response.value = await listDocsByPath("20220222113553-y8m8883", "20220222193009-n206g51");
};

onMounted(() => {
  console.log(widget.value)
  RootBlockId = widget.value?.getAttribute("data-node-id") || ""
})

const response = ref<FilesUnderPath | null>(null)

fetchData()

</script>

<template>
  <div>Hello</div>

  <div>{{ response }}</div>

  <div ref="widget" data-node-id="20220331145025-5fhv9xi" id="query">Target Element</div>
</template>

<style>
</style>
