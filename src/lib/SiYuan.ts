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



export async function listDocsByPath(path: string, notebook: string) {
  let data = {
    path,
    notebook,
  }
  let url = '/api/filetree/listDocsByPath'
  return Apply(Request(url, data))
}
