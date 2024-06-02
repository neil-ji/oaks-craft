import { Tag } from "@packages/oaks-model";
import { paginate } from "../utils";
import { BaseService } from "./BaseService";

export class TagService extends BaseService {
  /**
   * 新增标签
   */
  public async createTag(tag: Tag) {
    return this.connection.getRepository(Tag).save(tag);
  }

  /**
   * 更新标签
   */
  public async updateTag(tagId: number, tag: Partial<Tag>) {
    await this.connection.getRepository(Tag).update({ id: tagId }, tag);
  }

  /**
   * 删除指定标签
   */
  public async deleteTag(tagId: number) {
    await this.connection.getRepository(Tag).delete({ id: tagId });
  }

  /**
   * 全量获取标签列表
   */
  public async getAllTags() {
    return this.connection.getRepository(Tag).find();
  }

  /**
   * 分页获取标签列表
   */
  public async getTags(page: number, pageSize: number) {
    const items = await this.getAllTags();
    return paginate(items, page, pageSize);
  }
}
