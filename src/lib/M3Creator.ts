import { parseXMindMarkToXMindFile } from 'xmindmark'
import save from 'save-file'
import { listDocsByPath, getDocOutline, DocOutline } from './SiYuan'

const xmindMarkFileContent = `
Central Topic
- Main Topic 1
- Main Topic 2
`

const indent = "    "


export async function CreateM3(center: string, notebook: string, path: string) {
  let result = `${center}\n` // 添加中心节点
  console.log("Create", center, notebook, path);
  result += ListFile(notebook, path)
  console.log(result);
}

function ListFile(notebook: string, path: string, index = 0): string {
  let result = ""
  listDocsByPath(path, notebook).then(
    res => {
      res.files.forEach(file => {
        result += `${indent.repeat(index)}- ${file.name.replaceAll("&nbsp;", " ")}\n`
        getDocOutline(file.id).then(
          res => {
            if (res.length > 0) {
              result += ExtractOutline(res[0].blocks, index + 1)
              // console.log(result);
            }
          })

        // 查找子文件
        if (file.subFileCount > 0) {
          result += ListFile(notebook, file.path, index + 1)
          // console.log(result);

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
    let content = outline.content.replaceAll("&nbsp;", " ")
    result += `${indent.repeat(index)}- ${content}\n`
    result += ExtractOutline(outline.children, index + 1)
  }
  )
  return result
}

export const save_xmind = async () => {
  const xmindArrayBuffer = await parseXMindMarkToXMindFile(xmindMarkFileContent)
  await save(xmindArrayBuffer, 'result.xmind')
}
