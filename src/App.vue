<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { listDocsByPath, FilesUnderPath, lsNotebooks, NoteBookData } from "./lib/SiYuan"

const OpeningFileEl = ref<Element | null>(null)
let DataPath: string = ""
let Notebooks: NoteBookData[]

const fetchDocsList = async (path: string, notebook: string) => {
  response.value = await listDocsByPath(path, notebook);
};
const response = ref<FilesUnderPath | null>(null)

const fetchNoteBookList = async () => {
  // @ts-ignore
  Notebooks = (await lsNotebooks())["notebooks"]
}

onMounted(() => {
  OpeningFileEl.value = document.getElementsByClassName("b3-list-item b3-list-item--hide-action b3-list-item--focus")[0]
  console.log(OpeningFileEl.value)
  DataPath = OpeningFileEl.value?.getAttribute("data-path") || ""

  fetchNoteBookList()
})

</script>

<template>
  <div>Hello</div>

  <div>{{ response }}</div>

  <li
    title="集成学习 1.8 kB
更新于 6 天以前
创建于 2022-03-31 14:32:32"
    data-node-id="20220331143232-u1jgoba"
    data-name="集成学习.sy"
    draggable="true"
    data-count="0"
    data-type="navigation-file"
    class="b3-list-item b3-list-item--hide-action b3-list-item--focus"
    data-path="/20220331143232-u1jgoba.sy"
  >
    <span
      style="padding-left: 16px"
      class="b3-list-item__toggle b3-list-item__toggle--hl fn__hidden"
    >
      <svg class="b3-list-item__arrow">
        <use xlink:href="#iconRight" />
      </svg>
    </span>
    <span class="b3-list-item__icon b3-tooltips b3-tooltips__n" aria-label="修改图标">
      <svg>
        <use xlink:href="#iconFile" />
      </svg>
    </span>
    <span class="b3-list-item__text">集成学习</span>
    <span
      data-type="more-file"
      class="b3-list-item__action b3-tooltips b3-tooltips__nw"
      aria-label="更多"
    >
      <svg>
        <use xlink:href="#iconMore" />
      </svg>
    </span>
    <span
      data-type="new"
      class="b3-list-item__action b3-tooltips b3-tooltips__nw"
      aria-label="新建文档"
    >
      <svg>
        <use xlink:href="#iconFile" />
      </svg>
    </span>
  </li>
</template>

<style>
</style>
