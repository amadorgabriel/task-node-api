import { Task } from "../types/task.type"

export function extractQueryParams(url: string): Partial<Task> {
  return url.substring(1).split('&').reduce((queryParams: any, param) => {
    const [key, value] = param.split('=')

    queryParams[key] = value

    return queryParams
  }, {})
}
