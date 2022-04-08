import { parseXMindMarkToXMindFile } from 'xmindmark'
import save from 'save-file'
import { listDocsByPath, getDocOutline, DocOutline } from './SiYuan'
import { resolve } from 'path'

// m3字符串的格式大概就是这样的
const xmindMarkFileContent = `
Central Topic
- Main Topic 1
- Main Topic 2
`

const indent = "    "


export async function CreateM3(center: string, notebook: string, path: string) {
  // 入口函数，开始构建大纲列表
  let result = `${center}\n` // 添加中心节点
  console.log("Create", center, notebook, path);
  // 递归入口
  result += await ListFile(notebook, path)
  console.log(result);
}

async function ListFile(notebook: string, path: string, index = 0): Promise<string> {
  let result = ""
  // 列出当前目录下的全部文件
  const docs = await listDocsByPath(path, notebook)
  await Promise.all(
    docs.files.map(
      async (file) => {
        result += `${indent.repeat(index)}- ${file.name.replaceAll("&nbsp;", " ")}\n`
        console.log(file.name);
        const outline = await getDocOutline(file.id)
        console.log(outline);

        if (outline.length > 0) {
          result += ExtractOutline(outline[0].blocks, index + 1)
        }

        if (file.subFileCount > 0) {
          result += await ListFile(notebook, file.path, index + 1)
        }
      }
    )
  )
  console.log("Done");
  return result
}

function ExtractOutline(outlines: DocOutline[] | undefined | null, index: number): string {
  if (!outlines) {
    return ""
  }
  let result = ""
  outlines.map((outline => {
    // 替换标题中的空格
    let content = outline.content.replaceAll("&nbsp;", " ")
    result += `${indent.repeat(index)}- ${content}\n`
    // 然后加进来，如果这个标题下面有小标题，那么递归调用也把它加进来
    result += ExtractOutline(outline.children, index + 1)
  }))
  return result
}

export const save_xmind = async () => {
  const xmindArrayBuffer = await parseXMindMarkToXMindFile(xmindMarkFileContent)
  await save(xmindArrayBuffer, 'result.xmind')
}
