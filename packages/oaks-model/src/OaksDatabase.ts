import { Database } from "sqlite3";
import { Order } from "./types/OaksDatabase";

export class OaksDatabase {
  private db: Database;

  /**
   * 构造函数，用于创建 OaksDatabase 实例。
   * @param {string} [filename=":memory:"] - SQLite 数据库的文件名。默认为 ":memory:"，表示内存中的数据库。
   */
  constructor(filename: string = ":memory:") {
    this.db = new Database(filename, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  }

  /**
   * 处理可能出现的错误。
   * @param {Error | null} err - 可能出现的错误。
   * @param {(reason?: any) => void} reject - Promise 的 reject 函数。
   */
  private runSql(sql: string, params: Array<any> = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 创建新表。
   * @param {string} tableName - 表名。
   * @param {Object} columns - 表示表列的对象。
   * @returns {Promise<void>} 当表创建成功时解析，如果出现错误则拒绝。
   */
  public createTable(
    tableName: string,
    columns: { [key: string]: string }
  ): Promise<void> {
    if (!/^\w+$/.test(tableName)) {
      return Promise.reject(new Error("Invalid table name."));
    }

    for (const columnName in columns) {
      if (!/^\w+$/.test(columnName)) {
        return Promise.reject(new Error("Invalid column name."));
      }
    }

    const columnDefinitions = Object.entries(columns)
      .map(([name, type]) => `${name} ${type}`)
      .join(", ");
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`;
    return this.runSql(sql);
  }

  /**
   * 在表中插入一行。
   * @param {string} tableName - 表名。
   * @param {Object} data - 表示要插入的行的对象。
   * @returns {Promise<void>} 当行插入成功时解析，如果出现错误则拒绝。
   */
  public insert(
    tableName: string,
    data: { [key: string]: any }
  ): Promise<void> {
    const keys = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map(() => "?")
      .join(", ");
    const sql = `INSERT INTO ${tableName} (${keys}) VALUES (${values})`;
    return this.runSql(sql, Object.values(data));
  }
  /**
   * 从表中删除行。
   * @param {string} tableName - 表名。
   * @param {string} condition - 删除哪些行的条件。
   * @param {Array<any>} [params=[]] - 绑定到条件的参数。
   * @returns {Promise<void>} 当行删除成功时解析，如果出现错误则拒绝。
   */
  public delete(
    tableName: string,
    condition: string,
    params: Array<any> = []
  ): Promise<void> {
    const sql = `DELETE FROM ${tableName} WHERE ${condition}`;
    return this.runSql(sql, params);
  }

  /**
   * 更新表中的行。
   * @param {string} tableName - 表名。
   * @param {Object} data - 表示行的新值的对象。
   * @param {string} condition - 更新哪些行的条件。
   * @param {Array<any>} [params=[]] - 绑定到条件的参数。
   * @returns {Promise<void>} 当行更新成功时解析，如果出现错误则拒绝。
   */
  public update(
    tableName: string,
    data: { [key: string]: any },
    condition: string,
    params: Array<any> = []
  ): Promise<void> {
    const set = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const sql = `UPDATE ${tableName} SET ${set} WHERE ${condition}`;
    return this.runSql(sql, [...Object.values(data), ...params]);
  }

  /**
   * 从表中选择行。
   * @param {string} tableName - 表名。
   * @param {string} condition - 选择哪些行的条件。
   * @param {Array<any>} [params=[]] - 绑定到条件的参数。
   * @returns {Promise<Array<T>>} 当行选择成功时解析为所选行，如果出现错误则拒绝。
   * @template T
   */
  public select<T = any>(
    tableName: string,
    condition: string,
    params: Array<any> = []
  ): Promise<Array<T>> {
    const sql = `SELECT * FROM ${tableName} WHERE ${condition}`;
    return new Promise((resolve, reject) => {
      this.db.all<T>(sql, params, (err: Error | null, rows: Array<T>) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * 从表中选择行并排序。
   * @param {string} tableName - 表名。
   * @param {string} condition - 选择哪些行的条件。
   * @param {Array<any>} [params=[]] - 绑定到条件的参数。
   * @param {string} orderBy - 按哪个字段排序。
   * @param {Order} [order="ASC"] - 排序方式，升序（"ASC"）或降序（"DESC"）。
   * @returns {Promise<Array<T>>} 当行选择成功时解析为所选行，如果出现错误则拒绝。
   * @template T
   */
  public selectAndOrder<T = any>(
    tableName: string,
    condition: string,
    params: Array<any> = [],
    orderBy: string,
    order: Order = "ASC"
  ): Promise<Array<T>> {
    const sql = `SELECT * FROM ${tableName} WHERE ${condition} ORDER BY ${orderBy} ${order}`;
    return new Promise((resolve, reject) => {
      this.db.all<T>(sql, params, (err: Error | null, rows: Array<T>) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * 关闭数据库连接。
   * @returns {Promise<void>} 当数据库连接关闭成功时解析，如果出现错误则拒绝。
   */
  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
