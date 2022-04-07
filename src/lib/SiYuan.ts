import { Token } from "@/config"

interface ResponseBody {
  code: number
  data: any
  msg: string
}

async function Request(url: string, data: any): Promise<ResponseBody> {
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
