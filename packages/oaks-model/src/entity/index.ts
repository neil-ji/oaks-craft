import { Article } from "./Article";
import { Category } from "./Category";
import { Tag } from "./Tag";
import { BaseDataSourceOptions } from "typeorm/data-source/BaseDataSourceOptions";

export { Article, Category, Tag };
export default [Article, Category, Tag] as BaseDataSourceOptions["entities"];
