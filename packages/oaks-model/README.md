# oaks-model

oaks-model 是一个包含多个基于 TypeORM 定义的实体类的库。它位于数据库和服务层之间，实现了数据持久层与业务层的分离。

# 安装

首先，你需要安装 oaks-model。你可以通过以下命令进行安装：

```bash
npm install oaks-model
```

接下来，你需要安装一个数据库驱动。你可以选择任何 TypeORM 支持的数据库驱动，在以下示例中，我们使用轻量级的 sqlite3 数据库做演示:

```bash
npm install sqlite3
```

# 使用

oaks-model 是对 TypeORM 的封装，具体使用请参照 TypeORM 官方文档：

```ts
import { Article, getConnection } from "oaks-model";

const connection = getConnection({
  type: "sqlite",
});

function addArticle(title: string, content: string) {
  connection
    .initialize()
    .then(() => {
      const article = new Article();
      article.title = title;
      article.content = content;

      await AppDataSource.manager.save(article);
    })
    .catch((error) => console.log(error));
}
```

# 实体自定义

## 扩展已有实体

oaks-model 默认导出了 Article、Tag、Category 三个实体类，你可以选择扩展这些已有的实体类。例如，如果你想给 Article 添加一个新的字段，你可以这样做：

```ts
import { Article, Tag, Category, getConnection } from "oaks-model";
import { Entity, Column } from "typeorm";

@Entity()
class ExtendedArticle extends Article {
  @Column()
  newField: string;
}

const connection = getConnection({
  type: "sqlite",
  entities: [ExtendedArticle, Tag, Category],
});
```

## 新增实体

oaks-model 默认导出了 defaultEntities，你可以添加自己的实体类。例如，你可以创建一个新的实体类，并将其添加到 defaultEntities：

```ts
import { defaultEntities, getConnection } from "oaks-model";
import { Entity, Column } from "typeorm";

@Entity()
class NewEntity {
  @Column()
  newField: string;
}

const connection = getConnection({
  type: "sqlite",
  entities: defaultEntities.concat(NewEntity),
});
```

## 修改已有实体

为了遵守“对扩展开放，对修改关闭”的原则，你需要自己编写实体类。这需要一定的数据库知识，以及对 TypeORM 框架的了解。你可以将自己的实体类传入 getConnection 的 options 参数中。例如：

```ts
import { defaultEntities, getConnection } from "oaks-model";
import { Entity, Column } from "typeorm";

@Entity()
class ModifiedArticle {
  // ...
}

@Entity()
class ModifiedTag {
  // ...
}

@Entity()
class ModifiedCategory {
  // ...
}

const connection = getConnection({
  type: "sqlite",
  entities: [ModifiedArticle, ModifiedTag, ModifiedCategory],
});
```

注意，你需要自己分析并定义实体之间的关系。
