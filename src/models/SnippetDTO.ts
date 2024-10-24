import { Snippet } from "../utils/snippet";

class SnippetDTO {
  constructor(
    readonly id: number,
    readonly title: string,
    readonly content: string,
    readonly language: string,
    readonly compliance: string
  ) {}

  static toSnippet(dto: SnippetDTO, nickname: string): Snippet {
    return {
      id: dto.id.toString(),
      name: dto.title,
      content: dto.content,
      language: dto.language,
      extension: dto.language,
      compliance: "pending",
      author: nickname,
    } as Snippet;
  }
}

export default SnippetDTO;
