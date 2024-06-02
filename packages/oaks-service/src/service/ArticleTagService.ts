import { Article, Tag } from "@packages/oaks-model";
import { ArticleService } from "./ArticleService";
import { paginate } from "../utils";
import { BaseService } from "./BaseService";

export class ArticleTagService extends BaseService {
  constructor(private articleService = new ArticleService()) {
    super();
  }

  /**
   * 获取指定文章的标签
   */
  public async getArticleTags(articleId: string) {
    return this.connection
      .getRepository(Tag)
      .createQueryBuilder("tag")
      .innerJoinAndSelect(
        "tag.articles",
        "article",
        "article.id = :articleId",
        { articleId },
      )
      .getMany();
  }

  /**
   * 移除指定文章的指定标签
   */
  public async removeArticleTag(articleId: number, tagId: number) {
    // 首先，获取文章
    const article = await this.articleService.getArticleDetail(articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    // 找到要删除的标签
    const tagIndex = article.tags.findIndex((tag) => tag.id === tagId);

    if (tagIndex === -1) {
      throw new Error("Tag not found in article");
    }

    // 从文章的标签数组中删除标签
    article.tags.splice(tagIndex, 1);

    // 保存更新后的文章
    await this.connection.getRepository(Article).save(article);
  }

  /**
   * 移除所有文章的指定标签
   */
  public async removeAllArticleTags(tagId: number) {
    // 首先，获取所有包含指定标签的文章
    const articles = await this.getArticlesByTag(tagId);

    // 批量删除文章中的标签
    for (const article of articles) {
      const tagIndex = article.tags.findIndex((tag) => tag.id === tagId);

      if (tagIndex === -1) {
        throw new Error("Tag not found in article");
      }

      article.tags.splice(tagIndex, 1);
    }

    // 保存更新后的文章
    await this.connection.getRepository(Article).save(articles);
  }

  /**
   * 全量获取指定标签的文章列表
   */
  public async getArticlesByTag(tagId: number) {
    return this.connection
      .getRepository(Article)
      .createQueryBuilder("article")
      .innerJoinAndSelect("article.tags", "tag", "tag.id = :tagId", { tagId })
      .getMany();
  }

  /**
   * 分页获取指定标签的文章列表
   */
  public async getArticlesByTagPaging(
    tagId: number,
    pageSize: number,
    page: number,
  ) {
    const articles = await this.getArticlesByTag(tagId);
    return paginate(articles, pageSize, page);
  }
}
