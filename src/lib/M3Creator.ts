import {parseXMindMarkToXMindFile} from 'xmindmark'
import save from 'save-file'
import {listDocsByPath, getDocOutline, DocOutline} from './SiYuan'

// m3字符串的格式大概就是这样的
const xmindMarkFileContent = `
Central Topic
- Main Topic 1
- Main Topic 2
`

const indent = "    "


export async function ListFile(notebook: string,
                               path: string, name: string, id: string, // 这三个都是块信息
                               index = 0): Promise<string> {
    let result = ""
//    添加当前文件的信息
    if (index === 0) {
        result += `${name.replaceAll("&nbsp;", " ")}\n`
    } else {
        result += `${indent.repeat(index - 1)}- ${name.replaceAll("&nbsp;", " ")}\n`
    }
    const outline = await getDocOutline(id)
    if (outline.length > 0) {
        result += ExtractOutline(outline, index)
    }

    // 列出当前目录下的全部文件
    const docs = await listDocsByPath(path, notebook)
    console.log(name, index, docs)

    for (const file of docs.files) {
        //  添加当前目录下其他文件的信息
        result += await ListFile(notebook, file.path, file.name, file.id, index + 1)
    }

    // await docs.files.reduce(
    //     // @ts-ignore TODO: reduce 此处TS会报错
    //     async (memo, file) => {
    //         await memo
    //         //  添加当前目录下其他文件的信息
    //         if (file.subFileCount > 0) {
    //             result += await ListFile(notebook, file.path, file.name, file.id, index + 1)
    //         }
    //     }, undefined
    // )
    return result
}

function ExtractOutline(outlines: DocOutline[] | undefined | null, index: number): string {
    if (!outlines) {
        return ""
    }
    let result = ""
    outlines.map((outline => {
        // @ts-ignore
        let title = outline.name ? outline.name : outline.content
        // 替换标题中的空格
        let content = title.replaceAll("&nbsp;", " ")
        result += `${indent.repeat(index)}- ${content}\n`
        // 然后加进来，如果这个标题下面有小标题，那么递归调用也把它加进来
        // @ts-ignore
        let children = outline.blocks ? outline.blocks : outline.children
        result += ExtractOutline(children, index + 1)
    }))
    return result
}

export const save_xmind = async (str: string) => {
    const xmindArrayBuffer = await parseXMindMarkToXMindFile(str)
    await save(xmindArrayBuffer, 'result.xmind')
}
