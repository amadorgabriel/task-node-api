import { randomUUID } from "crypto";
import { Database } from "./database";
import { buildRegexRoutePath } from "./utils/build-regex-route-path";
import { RequestType, ResponseType } from "./types/api.type";

interface RouteType {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: RegExp;
  handler: (req: RequestType, res: ResponseType) => void;
}

const database = new Database();

export const routes: RouteType[] = [
  {
    method: "GET",
    path: buildRegexRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRegexRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: String(new Date()),
        updated_at: String(new Date()),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRegexRoutePath("/tasks/:id"),
    handler: (req, res) => {},
  },
  {
    method: "DELETE",
    path: buildRegexRoutePath("/tasks/:id"),
    handler: (req, res) => {},
  },
  {
    method: "PATCH",
    path: buildRegexRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {},
  },
];
