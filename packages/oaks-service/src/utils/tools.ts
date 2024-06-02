/**
 * 按行截取摘要
 */
export function excerptByLine(input: string, limit: number): string {
  const lines = input.split("\n");
  let output = "";
  let codeBlock = false;
  let codeBlockLineCount = 0;

  for (let i = 0; i < lines.length && limit > 0; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      codeBlock = !codeBlock;
      output += line + "\n";
      if (codeBlock) {
        codeBlockLineCount = 0;
      }
    } else if (codeBlock) {
      output += line + "\n";
      codeBlockLineCount++;
    } else if (line.trim() === "") {
      // Add empty lines to output
      output += "\n";
    } else {
      output += line + "\n";
      limit--;
    }
  }

  if (codeBlock && codeBlockLineCount > 0) {
    // If the last line was part of a code block, we close the block
    output += "```\n";
  }

  return output.trim();
}

/**
 * 按标签截取摘要
 */
export function excerptByTag(content: string, tag: string) {
  return content.slice(0, content.indexOf(tag));
}

/**
 * 分页
 */
export interface Pagination<T> {
  current: number;
  items: T[];
  totalPages: number;
  totalItems: number;
}

export function paginate<T>(
  allItems: T[],
  pageSize: number,
  current: number,
): Pagination<T> {
  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  const items = allItems.slice(start, end);

  return {
    current,
    items,
    totalPages,
    totalItems,
  };
}
