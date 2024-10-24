import { Snippet } from "../utils/snippet";

class SnippetDTO {
  constructor(
    readonly id: number,
    readonly title: string,
    readonly content: string,
    readonly language: string,
    readonly compliance: string
  ) {}

  toSnippet(nickname: string): Snippet {
    return {
      id: this.id.toString(),
      name: this.title,
      content: this.content,
      language: this.language,
      extension: this.language,
      compliance: "pending",
      author: nickname,
    } as Snippet;
  }
}

export default SnippetDTO;
