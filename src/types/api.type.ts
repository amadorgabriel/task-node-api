import { IncomingMessage, ServerResponse } from "node:http"

export interface RequestType extends IncomingMessage {
  body?: any | null
}

export interface ResponseType extends ServerResponse {
  body?: any | null
}
        
