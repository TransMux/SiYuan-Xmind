<script setup lang="ts">
import { ref } from "vue";
import { listDocsByPath } from "./lib/SiYuan"


const response = ref(null);

listDocsByPath("20220222113553-y8m8883", "20220222081442-8yacijq").then(
  (attrs) => {
    console.log(attrs);
  }
)

</script>

<template>
  <div>Hello</div>
</template>

<style>
</style>
