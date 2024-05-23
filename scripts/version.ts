import { promises as fs } from "fs";
import path from "path";
import semver from "semver";

async function updateVersion() {
  // 读取 package.json 文件
  const packageJsonPath = path.resolve(__dirname, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

  // 更新 version 字段
  packageJson.version = semver.inc(packageJson.version, "patch");

  // 将更新后的对象写回 package.json 文件
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

updateVersion().catch(console.error);
