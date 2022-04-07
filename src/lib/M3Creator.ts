import { parseXMindMarkToXMindFile } from 'xmindmark'
import save from 'save-file'

const xmindMarkFileContent = `
Central Topic
- Main Topic 1
- Main Topic 2
`

export const save_xmind = async () => {
  const xmindArrayBuffer = await parseXMindMarkToXMindFile(xmindMarkFileContent)
  await save(xmindArrayBuffer, 'result.xmind')
}
