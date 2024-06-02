import { Article, Category } from "@packages/oaks-model";
import { BaseService } from "./BaseService";
import { ArticleService } from "./ArticleService";
import { CategoryService } from "./CategoryService";
import { paginate } from "../utils";

export class ArticleCategoryService extends BaseService {
  constructor(
    private articleService = new ArticleService(),
    private categoryService = new CategoryService(),
  ) {
    super();
  }
  /**
   * 获取指定文章的分类
   */
  public async getArticleCategories(articleId: string) {
    return this.connection
      .getRepository(Category)
      .createQueryBuilder("category")
      .innerJoinAndSelect(
        "category.articles",
        "article",
        "article.id = :articleId",
        { articleId },
      )
      .getMany();
  }

  /**
   * 移除指定文章的指定分类
   */
  public async removeCategoryFromArticle(
    articleId: number,
    categoryId: number,
  ) {
    // 首先，获取文章
    const article = await this.articleService.getArticleDetail(articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    // 找到要删除的分类
    const category = article.categories.find(
      (category) => category.id === categoryId,
    );

    // 从文章的分类数组中删除
    const categoryIndex = article.categories.indexOf(category);
    article.categories.splice(categoryIndex, 1);

    // 保存更新后的文章
    await this.connection.getRepository(Category).save(article);

    // 从分类表中安全删除该分类
    try {
      await this.categoryService.deleteCategorySafely(categoryId);
    } catch {
      console.info(
        "Skip deleting category because it has children or articles",
      );
    }
  }

  /**
   * 移除所有文章的指定分类
   */
  public async removeCategoryFromAllArticles(categoryId: number) {
    // 获取指定分类下的所有文章
    const articles = await this.getArticlesByCategory(categoryId);

    // 逐个删除文章的分类
    for (const article of articles) {
      await this.removeCategoryFromArticle(article.id, categoryId);
    }
  }

  /**
   * 全量获取指定分类的文章列表
   */
  public async getArticlesByCategory(categoryId: number) {
    return this.connection
      .getRepository(Article)
      .createQueryBuilder("article")
      .innerJoinAndSelect(
        "article.categories",
        "category",
        "category.id = :categoryId",
        { categoryId },
      )
      .getMany();
  }

  /**
   * 分页获取指定分类的文章列表
   */
  public async getArticlesByCategoryPaging(
    categoryId: number,
    pageSize: number,
    page: number,
  ) {
    const items = await this.getArticlesByCategory(categoryId);
    return paginate(items, pageSize, page);
  }
}
