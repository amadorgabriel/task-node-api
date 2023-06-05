import http from "node:http";

import { routes } from "./routes.ts";
import { json } from "./middlewares/json.ts";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res)

  const route = routes.find((route) => {
    //? url.toString(): ''
    return route.method === method && route.path.test(url!);
  });

  if (route) {
    return route.handler(req, res);
  }

  res.writeHead(404).end();
});

server.listen(3333);
