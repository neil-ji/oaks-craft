type Connection = ReturnType<
  typeof import("@packages/oaks-model").getConnection
>;

let connection: Connection;

export function setConnection(connection: Connection) {
  // eslint-disable-next-line no-self-assign, @typescript-eslint/no-unused-vars
  connection = connection;
}

export function getConnection(): Connection {
  return connection;
}
