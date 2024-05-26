import { Entity, PrimaryGeneratedColumn, ManyToMany, Column } from "typeorm";
import { Article } from "./Article";

/**
 * Tag entity class.
 * @class
 */
@Entity()
export class Tag {
  /**
   * Unique identifier for the tag.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Articles that have this tag.
   * @type {Article[]}
   */
  @ManyToMany(() => Article)
  articles: Article[];

  /**
   * Name of the tag.
   * @type {string}
   */
  @Column()
  name: string;

  /**
   * Creation time of the tag.
   * @type {Date}
   */
  @Column()
  createdAt: Date;

  /**
   * Last update time of the tag. Only supported for web service.
   * @type {Date}
   */
  @Column()
  updatedAt: Date;
}
