import axios from "axios";
import { FileType } from "../types/FileType";
import { Rule } from "../types/Rule";
import { TestCase } from "../types/TestCase";
import { TestCaseResult } from "./queries";
import {
  PaginatedSnippets,
  CreateSnippet,
  Snippet,
  UpdateSnippet,
} from "./snippet";
import { SnippetOperations } from "./snippetOperations";
import { PaginatedUsers } from "./users";
import config from "./config";
import { FakeSnippetOperations } from "./mock/fakeSnippetOperations";

class Operations implements SnippetOperations {
  private operations: SnippetOperations = new FakeSnippetOperations();

  constructor(private readonly token: string) {}

  listSnippetDescriptors(
    page: number,
    pageSize: number,
    sippetName?: string | undefined
  ): Promise<PaginatedSnippets> {
    return this.operations.listSnippetDescriptors(page, pageSize, sippetName);
  }
  createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${config.apiUrl}/snippet`,
          JSON.stringify({
            title: createSnippet.name,
            content: createSnippet.content,
            language: createSnippet.language,
          }),
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  getSnippetById(id: string): Promise<Snippet | undefined> {
    return this.operations.getSnippetById(id);
  }
  updateSnippetById(
    id: string,
    updateSnippet: UpdateSnippet
  ): Promise<Snippet> {
    return this.operations.updateSnippetById(id, updateSnippet);
  }
  getUserFriends(
    name?: string | undefined,
    page?: number | undefined,
    pageSize?: number | undefined
  ): Promise<PaginatedUsers> {
    return this.operations.getUserFriends(name, page, pageSize);
  }
  shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    return this.operations.shareSnippet(snippetId, userId);
  }
  getFormatRules(): Promise<Rule[]> {
    return this.operations.getFormatRules();
  }
  getLintingRules(): Promise<Rule[]> {
    return this.operations.getLintingRules();
  }
  getTestCases(): Promise<TestCase[]> {
    return this.operations.getTestCases();
  }
  formatSnippet(snippet: string): Promise<string> {
    return this.operations.formatSnippet(snippet);
  }
  postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
    return this.operations.postTestCase(testCase);
  }
  removeTestCase(id: string): Promise<string> {
    return this.operations.removeTestCase(id);
  }
  deleteSnippet(id: string): Promise<string> {
    return this.operations.deleteSnippet(id);
  }
  testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
    return this.operations.testSnippet(testCase);
  }
  getFileTypes(): Promise<FileType[]> {
    return this.operations.getFileTypes();
  }
  modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    return this.operations.modifyFormatRule(newRules);
  }
  modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    return this.operations.modifyLintingRule(newRules);
  }
}
export default Operations;
