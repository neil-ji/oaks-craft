import grayMatter from "gray-matter";
import { excerptByLine, excerptByTag } from "./tools";

export interface ExcerptOptions {
  lines?: number;
  tag?: string;
}

export class FrontMatterParser {
  constructor(
    private excerptOptions: ExcerptOptions = { lines: 5, tag: "<!--more-->" },
  ) {}

  public async parse(markdown: string) {
    const excerptImpl = (input: string) => {
      return this.excerptOptions.lines
        ? excerptByLine(input, this.excerptOptions.lines)
        : excerptByTag(input, this.excerptOptions.tag);
    };

    const {
      data: frontMatter,
      content,
      excerpt,
    } = grayMatter(markdown, { excerpt: excerptImpl });

    return {
      frontMatter,
      content,
      excerpt,
    };
  }
}
