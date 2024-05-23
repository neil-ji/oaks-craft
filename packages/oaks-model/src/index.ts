import { OaksDatabase } from './OaksDatabase';  // 假设 OaksDatabase 类在 oaksDatabase.ts 文件中

async function demo() {
  // 创建 OaksDatabase 实例
  const db = new OaksDatabase('myDatabase.db');

  // 创建表
  await db.createTable('users', {
    id: 'INTEGER PRIMARY KEY',
    name: 'TEXT',
    email: 'TEXT'
  });

  // 插入数据
  await db.insert('users', {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com'
  });

  // 更新数据
  await db.update('users', { name: 'Bob' }, 'id = ?', [1]);

  // 查询数据
  const users = await db.select('users', 'id = ?', [1]);
  console.log(users);  // 输出：[{ id: 1, name: 'Bob', email: 'alice@example.com' }]

  // 删除数据
  await db.delete('users', 'id = ?', [1]);

  // 关闭数据库
  await db.close();
}

demo().catch(console.error);