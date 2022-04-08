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
  await ListFile(notebook, path).then(
    res => {
      result += res
    }
  )
  console.log(result);
}

async function ListFile(notebook: string, path: string, index = 0): Promise<string> {
  let result = ""
  // 列出当前目录下的全部文件
  await listDocsByPath(path, notebook).then(
    res => {
      res.files.forEach(async file => {
        // 对于当前目录下的每个文件，先把标题加进来
        result += `${indent.repeat(index)}- ${file.name.replaceAll("&nbsp;", " ")}\n`
        // 然后添加其大纲
        await getDocOutline(file.id).then(
          res => {
            if (res.length > 0) {
              // 如果存在大纲，使用这个函数拼接大纲对应的m3字符串
              result += ExtractOutline(res[0].blocks, index + 1)
              console.log(result);
            }
          })

        // 如果当前文件下面存在子文件
        if (file.subFileCount > 0) {
          // 就递归调用自己，添加下一级的大纲
          await ListFile(notebook, file.path, index + 1).then(
            res => result += res
          )
          console.log(result);
        }
      });
    }
  )
  return result
}

function ExtractOutline(outlines: DocOutline[] | undefined | null, index: number): string {
  if (!outlines) {
    return ""
  }
  let result = ""
  outlines.forEach(outline => {
    // 替换标题中的空格
    let content = outline.content.replaceAll("&nbsp;", " ")
    result += `${indent.repeat(index)}- ${content}\n`
    // 然后加进来，如果这个标题下面有小标题，那么递归调用也把它加进来
    result += ExtractOutline(outline.children, index + 1)
  }
  )
  return result
}

export const save_xmind = async () => {
  const xmindArrayBuffer = await parseXMindMarkToXMindFile(xmindMarkFileContent)
  await save(xmindArrayBuffer, 'result.xmind')
}
