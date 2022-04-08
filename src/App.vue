<script setup lang="ts">
import { onMounted, ref } from "vue";
import { listDocsByPath, lsNotebooks, NoteBookData } from "./lib/SiYuan"
import { CreateM3 } from "./lib/M3Creator"


const OpeningFileEl = ref<Element | null>(null)
const DataPath = ref("")
let Notebooks: NoteBookData[]
const center = ref("")

const fetchNoteBookList = async () => {
  // @ts-ignore
  Notebooks = (await lsNotebooks())["notebooks"]
}

onMounted(() => {
  Setup()
})

function Setup() {
  fetchNoteBookList()
  OpeningFileEl.value = window.parent.document.getElementsByClassName("b3-list-item b3-list-item--hide-action b3-list-item--focus")[0]
  console.log(OpeningFileEl.value)
  DataPath.value = OpeningFileEl.value?.getAttribute("data-path") || ""
  // 定义 m3 初始值
  center.value = OpeningFileEl.value?.getAttribute("data-name") || ""
}

const RightNoteBookId = ref("")


async function FindRightNotebook() {
  console.log("Finding Corelated notebook for:", DataPath.value);

  await Promise.all(
    Notebooks.map(async (notebook) => {
      const res = await listDocsByPath(DataPath.value, notebook.id)
      try {
        if (res.files.length !== 0) {
          RightNoteBookId.value = res.box
        }
      } catch (e) {
        console.log("Closed Notebook");
      }
    })
  )
  console.log("Done");
}

const tip = ref("导出当前文件及其子文件的大纲为XMind")

async function ExportToXmind() {
  tip.value = '锁定当前笔记本中...';
  await FindRightNotebook()
  if (!RightNoteBookId.value) {
    tip.value = `锁定当前笔记本失败，若能稳定复现麻烦提个Issue帮助解决此问题~`;
    return
  }
  tip.value = `正在导出...(${RightNoteBookId.value})`;
  await CreateM3(center.value, RightNoteBookId.value, DataPath.value)
  tip.value = `完成！`;
}

</script>

<template>
  <div>
    <t-button
      :style="{
        'margin': 'auto',
        'display': 'block'
      }"
      @click="ExportToXmind"
      theme="primary"
    >{{ tip }}</t-button>
  </div>
</template>
