<script setup lang="ts">
import { ref } from "vue";
import { getSiYuanBlock, sqlRequest, } from "./lib/SiYuan";
import { ListFile, save_xmind } from "./lib/M3Creator";
import { Transformer } from "markmap-lib";
import * as markmap from "markmap-view";


const tip = ref("转换当前文件及其子文件的大纲为XMind");

let markdown: string = ""
let CurrentMarkmap: markmap.Markmap

async function ExportToXmind() {
  let { id, box, path, name } = await getSiYuanBlock()
  console.log(`id: ${id}, box: ${box}, path: ${path}`);
  tip.value = `正在导出...`;
  markdown += `${name}\n`
  markdown += await ListFile(box, path)
  tip.value = `完成！`;
  console.log(markdown);
  setTimeout(() => tip.value = "更新", 3000)

  const transformer = new Transformer();

  // 1. transform markdown
  const { root, features } = transformer.transform("# " + markdown);

  // 2. get assets
  // either get assets required by used features
  const { styles, scripts } = transformer.getUsedAssets(features);
  const { Markmap, loadCSS, loadJS } = markmap;

  // 1. load assets
  if (styles) loadCSS(styles);
  if (scripts) loadJS(scripts, { getMarkmap: () => markmap });

  // 2. create markmap
  // `options` is optional, i.e. `undefined` can be passed here
  if (CurrentMarkmap) {
    CurrentMarkmap.renderData(root)
  } else {
    CurrentMarkmap = Markmap.create("#markmap", undefined, root);
  }
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
    >{{ tip }}</t-button>
    <t-button
      :style="{
        margin: 'auto',
        display: 'block',
      }"
      @click="SaveXmind"
      theme="primary"
    >导出</t-button>
  </div>
  <svg id="markmap" style="width: 100vw; height: 90vh" />
</template>
