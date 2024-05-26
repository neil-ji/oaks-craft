import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import entities from "./entity";

let connection: DataSource | undefined;
/**
 * Get a connection to the database.
 * @param customOptions Custom options to override the default options.
 * @returns The connection to the database.
 */
export const getConnection = (customOptions: DataSourceOptions) => {
  try {
    return (
      connection ||
      (connection = new DataSource({
        synchronize: true,
        logging: false,
        entities,
        migrations: [],
        subscribers: [],
        ...customOptions,
      }))
    );
  } catch (error) {
    console.error(
      "oaks-model: Failed to connect to the database. Track more details below:",
    );
    console.error(error);
  }
};
