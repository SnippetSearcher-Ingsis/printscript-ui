import { CreateSnippet } from "../utils/snippet";

class CreateSnippetDTO {
  constructor(
    readonly title: string,
    readonly content: string,
    readonly language: string
  ) {}

  static fromCreateSnippet(snippet: CreateSnippet): CreateSnippetDTO {
    return new CreateSnippetDTO(
      snippet.name,
      snippet.content,
      snippet.language
    );
  }
}

export default CreateSnippetDTO;
