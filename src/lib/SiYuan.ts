import { TOKEN } from "@/config"

interface ResponseBody {
  code: number
  data: any
  msg: string
}

async function Request(url: string, data?: any): Promise<ResponseBody> {
  let resData = null
  await fetch(url, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      Authorization: `Token `,
    }
  }).then(function (response) { resData = response.json() })
  // @ts-ignore
  return resData
}


async function Apply(response: Promise<ResponseBody>) {
  let r: ResponseBody = await response
  if (!r) {
    return null
  }
  return r.code === 0 ? r.data : null
}

export interface FilesUnderPath {
  box: string
  files: File[]
  path: string
}

export interface File {
  alias: string
  bookmark: string
  count: number
  ctime: number // 创建时间
  hCtime: string // 格式化的创建时间
  hMtime: string // 相对修改时间
  hSize: string // 文件大小
  icon: string
  id: string
  memo: string
  mtime: number // 修改时间
  name: string
  name1: string
  path: string // 路径
  size: number
  sort: number // 排序
  subFileCount: number // 子文件数目
}

export async function listDocsByPath(path: string, notebook: string): Promise<FilesUnderPath> {
  let data = {
    path,
    notebook,
  }
  let url = '/api/filetree/listDocsByPath'
  let result = await Apply(Request(url, data))
  return result
}

export interface StandardResponse<T> {
  code: number
  data: T
  msg: string
}

export interface NoteBookData {
  closed: boolean
  icon: string
  id: string
  name: string
  sort: number
}

export async function lsNotebooks(): Promise<Map<"notebooks", NoteBookData[]>> {
  let url = '/api/notebook/lsNotebooks'
  return await Apply(Request(url))
}

export interface DocOutline {
  children: DocOutline[] | null
  count: number // 这一级有多少标题
  alias: string
  depth: number
  content: string // 内容
  id: string
}

export async function getDocOutline(id: string): Promise<Record<"blocks", DocOutline[]>[]> {
  // 因为思源的API有点混乱，所以这里只关注了目前来说有用到的信息
  let data = {
    id,
  }
  let url = '/api/outline/getDocOutline'
  return await Apply(Request(url, data))
}
