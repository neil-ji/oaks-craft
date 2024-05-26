import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

const defaultOptions: DataSourceOptions = {
  type: "sqlite",
  database: "oaks.db",
  synchronize: true,
  logging: false,
  entities: ["src/entities/*.ts"],
  migrations: [],
  subscribers: [],
};

/**
 * Get a connection to the database.
 * @param customOptions Custom options to override the default options.
 * @returns The connection to the database.
 */
export const getConnection = (() => {
  let connection: DataSource;
  return (customOptions: DataSourceOptions = defaultOptions) =>
    connection ? connection : (connection = new DataSource(customOptions));
})();
