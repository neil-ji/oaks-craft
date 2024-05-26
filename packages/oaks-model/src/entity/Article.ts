import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Tag } from "./Tag";
import { Category } from "./Category";

/**
 * Article entity class.
 * @class
 */
@Entity()
export class Article {
  /**
   * Unique identifier for the article.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Title of the article.
   * @type {string}
   */
  @Column()
  title: string;

  /**
   * Tags associated with the article.
   * @type {Tag[]}
   */
  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  /**
   * Categories associated with the article.
   * @type {Category[]}
   */
  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  /**
   * Content of the article.
   * @type {string}
   */
  @Column()
  content: string;

  /**
   * Word count of the article.
   * @type {number}
   */
  @Column()
  words: number;

  /**
   * Creation time of the article.
   * @type {Date}
   */
  @Column()
  createdAt: Date;

  /**
   * Last update time of the article.
   * @type {Date}
   */
  @Column()
  updatedAt: Date;

  /**
   * Whether the article is private or not.
   * @type {boolean}
   */
  @Column()
  private: boolean;

  /**
   * Hash of the article.
   * @type {string}
   */
  @Column()
  hash: string;

  /**
   * Path of the article in the filesystem.
   * @type {string}
   */
  @Column()
  path: string;
}
