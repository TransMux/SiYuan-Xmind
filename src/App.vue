<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { listDocsByPath, FilesUnderPath, lsNotebooks, NoteBookData } from "./lib/SiYuan"
import { save_xmind } from "./lib/M3Creator"


const OpeningFileEl = ref<Element | null>(null)
let DataPath: string = ""
let Notebooks: NoteBookData[]
let m3 = ""

const fetchNoteBookList = async () => {
  // @ts-ignore
  Notebooks = (await lsNotebooks())["notebooks"]
}

onMounted(() => {
  OpeningFileEl.value = document.getElementsByClassName("b3-list-item b3-list-item--hide-action b3-list-item--focus")[0]
  console.log(OpeningFileEl.value)
  DataPath = OpeningFileEl.value?.getAttribute("data-path") || ""
  // 定义 m3 初始值
  m3 = OpeningFileEl.value?.getAttribute("data-name") || ""

  fetchNoteBookList()
})

const RightNoteBookId = ref("")

function FindRightNotebook() {
  Notebooks.forEach(notebook => {
    listDocsByPath(DataPath, notebook.id).then(
      res => {
        try {
          if (res.files.length !== 0) {
            RightNoteBookId.value = res.box
          }
        } catch (e) {
          console.log("Closed Notebook");
        }
      }
    )
  });
}


</script>

<template>
  <div>
    <!-- TODO:加入自毁 -->
    <button @click="FindRightNotebook">寻找当前页面及以下</button>
    <span>Right NoteBook id: {{ RightNoteBookId }}</span>
  </div>
  <button @click="save_xmind">Export</button>
  <li
    title="统计学习实验 379 B
包含 2 个子文档
更新于 1 个月以前
创建于 2022-02-22 20:31:42"
    data-node-id="20220222203142-xxhm9ov"
    data-name="统计学习实验.sy"
    draggable="true"
    data-count="2"
    data-type="navigation-file"
    class="b3-list-item b3-list-item--hide-action b3-list-item--focus"
    data-path="/20220222203142-xxhm9ov.sy"
  >
    <span style="padding-left: 16px" class="b3-list-item__toggle b3-list-item__toggle--hl">
      <svg class="b3-list-item__arrow">
        <use xlink:href="#iconRight" />
      </svg>
    </span>
    <span class="b3-list-item__icon b3-tooltips b3-tooltips__n" aria-label="修改图标">
      <svg class="custom-icon">
        <use xlink:href="#icon-1f9ea" />
      </svg>
    </span>
    <span class="b3-list-item__text">统计学习实验</span>
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
