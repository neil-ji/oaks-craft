import { Article } from "@packages/oaks-model";
import { paginate } from "../utils";
import { BaseService } from "./BaseService";

export class ArticleService extends BaseService {
  /**
   * 新增文章
   */
  public async createArticle(article: Article) {
    return this.connection.getRepository(Article).save(article);
  }

  /**
   * 更新文章
   */
  public async updateArticle(articleId: number, article: Partial<Article>) {
    await this.connection
      .getRepository(Article)
      .update({ id: articleId }, article);
  }

  /**
   * 删除文章
   */
  public async deleteArticle(articleId: number) {
    await this.connection.getRepository(Article).delete({ id: articleId });
  }

  /**
   * 获取文章详情
   */
  public async getArticleDetail(articleId: number) {
    return this.connection.getRepository(Article).findOne({
      where: { id: articleId },
      relations: ["tags"],
    });
  }

  /**
   * 获取文章统计数据
   */
  public async getArticleStatistics() {
    const total = await this.connection.getRepository(Article).count();
    return {
      total,
    };
  }

  /**
   * 分页获取文章列表
   * 1. 按指定字段排序（默认为创建时间降序）
   * 2. 按指定字段筛选（默认无筛选条件）
   * 3. 按指定时间段筛选（默认无时间段筛选）
   * 4. 按文章名、文章内容搜索（默认无搜索条件）
   */
  public async getArticles(
    page: number = 1,
    pageSize: number = 10,
    orderBy: string = "createdAt",
    order: "ASC" | "DESC" = "DESC",
    filter?: Record<string, Article>,
    startDate: Date = new Date(0),
    endDate: Date = new Date(),
    search?: string,
  ) {
    const totalItems = await this.getAllArticles(
      orderBy,
      order,
      filter,
      startDate,
      endDate,
      search,
    );
    return paginate(totalItems, pageSize, page);
  }

  /**
   * 全量获取文章列表
   * 1. 按指定字段排序（默认为创建时间降序）
   * 2. 按指定字段筛选（默认无筛选条件）
   * 3. 按指定时间段筛选（默认无时间段筛选）
   * 4. 按文章名、文章内容搜索（默认无搜索条件）
   */
  public async getAllArticles(
    orderBy: string = "createdAt",
    order: "ASC" | "DESC" = "DESC",
    filter?: Record<string, Article>,
    startDate: Date = new Date(0),
    endDate: Date = new Date(),
    search?: string,
  ) {
    const query = this.connection
      .getRepository(Article)
      .createQueryBuilder("article");

    // 排序
    query.orderBy(`article.${orderBy}`, order);

    // 筛选
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        query.andWhere(`article.${key} = :${key}`, { [key]: value });
      });
    }

    // 时间段筛选
    if (startDate && endDate) {
      query.andWhere("article.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      });
    }

    // 搜索
    if (search) {
      query.andWhere(
        `article.title LIKE :search OR article.content LIKE :search`,
        { search: `%${search}%` },
      );
    }

    const items = await query.getManyAndCount();

    return items;
  }
}
