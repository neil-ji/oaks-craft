import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Article } from "./Article";

/**
 * Category entity class.
 * @class
 */
@Entity()
export class Category {
  /**
   * Unique identifier for the category.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Name of the category.
   * @type {string}
   */
  @Column()
  name: string;

  /**
   * Articles that belong to this category.
   * @type {Article[]}
   */
  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];

  /**
   * Parent category of this category.
   * @type {Category}
   */
  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn()
  parent: Category;

  /**
   * Children categories of this category.
   * @type {Category[]}
   */
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  /**
   * Creation time of the category.
   * @type {Date}
   */
  @Column()
  createdAt: Date;

  /**
   * Last update time of the category.
   * @type {Date}
   */
  @Column()
  updatedAt: Date;
}
