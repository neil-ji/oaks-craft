import { Category } from "@packages/oaks-model";
import { paginate } from "../utils";
import { BaseService } from "./BaseService";

export class CategoryService extends BaseService {
  /**
   * 新增分类
   */
  public async createCategory(category: Category) {
    return this.connection.getRepository(Category).save(category);
  }

  /**
   * 更新分类
   */
  public async updateCategory(categoryId: number, category: Partial<Category>) {
    await this.connection
      .getRepository(Category)
      .update({ id: categoryId }, category);
  }

  /**
   * 批量更新分类
   */
  public async updateCategories(categories: Category[]) {
    await this.connection.getRepository(Category).save(categories);
  }

  /**
   * 根据分类名查询分类详情
   */
  public async getCategoryByName(categoryName: string) {
    return this.connection
      .createQueryBuilder(Category, "category")
      .where("category.name = :name", { name: categoryName })
      .getOne();
  }

  /**
   * 根据ID查询分类详情
   */
  public async getCategoryById(categoryId: number) {
    return this.connection
      .createQueryBuilder(Category, "category")
      .where("category.id = :categoryId", { categoryId })
      .getOne();
  }

  /**
   * 删除指定分类，并更新父子分类引用
   */
  public async deleteCategory(categoryId: number) {
    const { id, parent, children } = await this.getCategoryById(categoryId);

    // 更新父分类的子分类引用
    if (parent) {
      parent.children = parent.children
        .filter((child) => child.id !== id)
        .concat(children);
    }

    // 更新子分类的父分类引用
    for (const child of children) {
      child.parent = parent;
    }

    // 删除指定分类，批量更新父分类和子分类
    await this.connection.getRepository(Category).delete({ id });
    await this.updateCategories([parent, ...children]);
  }

  /**
   * 递归删除指定分类及其所有子分类
   */
  public async deleteCategoryRecursive(categoryId: number) {
    // 首先，获取指定分类
    const category = await this.getCategoryById(categoryId);

    // 递归
    const works = category.children.map((child) => {
      return this.deleteCategoryRecursive(child.id);
    });
    await Promise.all(works);

    // 删除指定分类
    await this.deleteCategory(categoryId);
    // 更新指定分类的父分类
    if (category.parent) {
      await this.updateCategory(category.parent.id, {
        children: category.parent.children.filter(
          (child) => child.id !== category.id,
        ),
      });
    }
  }

  /**
   * 安全删除指定分类
   */
  public async deleteCategorySafely(categoryId: number) {
    const category = await this.getCategoryById(categoryId);

    if (!category) {
      throw new Error("Category not found");
    }

    // 如果该分类下没有文章且没有子分类，删除该分类
    if (category.children.length === 0) {
      await this.deleteCategory(categoryId);
    } else {
      throw new Error("Category has children");
    }
  }

  /**
   * 全量获取分类列表
   */
  public async getAllCategories() {
    return this.connection.getRepository(Category).find();
  }

  /**
   * 分页获取分类列表
   */
  public async getCategories(page: number, pageSize: number) {
    const items = await this.getAllCategories();
    return paginate(items, page, pageSize);
  }
}
