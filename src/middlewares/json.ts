import { IncomingMessage } from "http"
import { RequestType, ResponseType } from "../types/api.type"

export async function json(req: RequestType, res: ResponseType) {
  const buffers: Buffer[] = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  res.setHeader('Content-type', 'application/json')
}
