// ["table1": {}, "table2": {}]

import fs from "node:fs/promises";
import { Task } from "./types/task.type";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database: Record<string, {}> = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table: string, search: Pick<Task, "title" | "description"> | null) {
    let data = (this.#database?.[table] ?? []) as Array<any>;

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    if (data.length > 0) {
      data = data.map((row: Task) => {
        return {
          ...row,
          completed_at: row.completed_at && new Date(row.completed_at),
          updated_at: new Date(row.updated_at),
          created_at: new Date(row.created_at),
        };
      });
    }

    return data;
  }

  insert(table: string, data: Task) {
    if (Array.isArray(this.#database[table])) {
      (this.#database[table] as Array<{}>).push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(
    table: string,
    id: string,
    obj: Partial<Pick<Task, "title" | "description">> | null
  ) {
    let data = (this.#database[table] ?? []) as Array<Task>;

    if (data.length > 0) {
      data = data.map((row) =>
        row.id !== id
          ? row
          : {
              ...row,
              title: obj?.title ?? row.title,
              description: obj?.description ?? row.description,
              updated_at: new Date().getTime(),
            }
      );

      this.#database[table] = data;

      this.#persist();
    }
  }

  patch(table: string, id: string) {
    let data = (this.#database[table] ?? []) as Array<Task>;

    if (data.length > 0) {
      data = data.map((row: Task) => {
        if (row.id !== id) return row;

        return {
          ...row,
          completed_at: row.completed_at ? null : new Date().getTime(),
        };
      });

      this.#database[table] = data

      this.#persist()
    }
  }

  delete(table: string, id: string) {
    let data = (this.#database[table] ?? []) as Array<Task>;

    data = data.filter((row) => row.id !== id);

    this.#database[table] = data;

    this.#persist();
  }
}
