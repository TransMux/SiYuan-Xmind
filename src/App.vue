<script setup lang="ts">
import { ComponentInternalInstance, getCurrentInstance, onMounted, ref } from "vue";
import { listDocsByPath, lsNotebooks, NoteBookData } from "./lib/SiYuan";
import { CreateM3, save_xmind } from "./lib/M3Creator";
import { Transformer } from "markmap-lib";
import * as markmap from "markmap-view";
const OpeningFileEl = ref<Element | null>(null);
const DataPath = ref("");
let Notebooks: NoteBookData[];
const center = ref("");

const fetchNoteBookList = async () => {
  // @ts-ignore
  Notebooks = (await lsNotebooks())["notebooks"];
};

onMounted(() => {
  Setup();
});

function Setup() {
  fetchNoteBookList();
  OpeningFileEl.value = window.parent.document.getElementsByClassName(
    "b3-list-item b3-list-item--hide-action b3-list-item--focus"
  )[0];
  console.log(OpeningFileEl.value);
  DataPath.value = OpeningFileEl.value?.getAttribute("data-path") || "";
  // 定义 m3 初始值
  center.value = OpeningFileEl.value?.getAttribute("data-name") || "";
}

const RightNoteBookId = ref("");

async function FindRightNotebook() {
  console.log("Finding Corelated notebook for:", DataPath.value);

  await Promise.all(
    Notebooks.map(async (notebook) => {
      const res = await listDocsByPath(DataPath.value, notebook.id);
      try {
        if (res.files.length !== 0) {
          RightNoteBookId.value = res.box;
        }
      } catch (e) {
        console.log("Closed Notebook");
      }
    })
  );
  console.log("Done");
}

const tip = ref("转换当前文件及其子文件的大纲为XMind");
let markdown =""
async function ExportToXmind() {
  tip.value = "锁定当前笔记本中...";
  await FindRightNotebook();
  if (!RightNoteBookId.value) {
    tip.value = `锁定当前笔记本失败，若能稳定复现麻烦提个Issue帮助解决此问题~`;
    return;
  }
  tip.value = `正在导出...(${RightNoteBookId.value})`;
  markdown =await CreateM3(center.value, RightNoteBookId.value, DataPath.value);
  tip.value = `完成！`;

  const transformer = new Transformer();

  // 1. transform markdown
  const { root, features } = transformer.transform("# "+markdown);

  // 2. get assets
  // either get assets required by used features
  const { styles, scripts } = transformer.getUsedAssets(features);
  const { Markmap, loadCSS, loadJS } = markmap;

  // 1. load assets
  if (styles) loadCSS(styles);
  if (scripts) loadJS(scripts, { getMarkmap: () => markmap });

  // 2. create markmap
  // `options` is optional, i.e. `undefined` can be passed here
  Markmap.create("#markmap", undefined,root);
  console.log("aaa")
}
async function SaveXmind() {
  save_xmind(markdown)
}
</script>

<template>
  <div style="display:flex;max-height:50px">
    <t-button
      :style="{
        margin: 'auto',
        display: 'block',
      }"
      @click="ExportToXmind"
      theme="primary"
      >{{ tip }}</t-button
    >
    <t-button
      :style="{
        margin: 'auto',
        display: 'block',
      }"
      @click="SaveXmind"
      theme="primary"
      >导出</t-button
    >

  </div>
        <svg id="markmap" style="width: 100vw; height: 90vh"></svg>

</template>
