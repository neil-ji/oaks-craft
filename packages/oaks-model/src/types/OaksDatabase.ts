export type Order = "ASC" | "DESC";

export type ColumnType = "NULL" | "INTEGER" | "REAL" | "TEXT" | "BLOB";

export interface Column {
  name: string;
  type: ColumnType;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  notNull?: boolean;
  unique?: boolean;
}
