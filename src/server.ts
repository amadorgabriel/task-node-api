import http from "node:http";

import { routes } from "./routes.ts";
import { json } from "./middlewares/json.ts";
import { RequestType, ResponseType } from "./types/api.type.ts";
import { extractQueryParams } from "./utils/extract-query-params.ts";

const server = http.createServer(async (req: RequestType, res: ResponseType) => {
  const { method, url } = req;

  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url!);
  });

  if (route) {
    const routeParams = url?.match(route.path)
    
    const { query, ...params } = routeParams?.groups as {[key: string]: any};

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res);
  }

  res.writeHead(404).end();
});

server.listen(3333);
