import { getConnection } from "../utils";

export class BaseService {
  constructor(protected connection = getConnection()) {
    if (!connection) {
      throw new Error("Connection is required");
    }
  }
}
