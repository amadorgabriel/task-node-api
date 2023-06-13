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
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRegexRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const timestamp = new Date().getTime();

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: timestamp,
        updated_at: timestamp,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRegexRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const obj = {
        id: id,
        title,
        description,
      };

      database.update("tasks", id, obj);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRegexRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id)

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRegexRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      database.patch("tasks", id)

      return res.writeHead(204).end();
    },
  },
];
