// ["table1": {}, "table2": {}]

import fs from "node:fs/promises";
import { Task } from "./types/task.type";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database: Record<string, {}> = {};

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table: string) {
    const data = this.#database[table] ?? [];

    return data;
  }

  insert(table: string, data: Task) {
    if(Array.isArray(this.#database[table])){
      (this.#database[table] as Array<{}>).push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist();

    return data
  }

  update() {}

  delete() {}
}
