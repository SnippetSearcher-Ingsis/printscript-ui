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

class Operations implements SnippetOperations {
  constructor(private readonly token: string) {}

  listSnippetDescriptors(
    page: number,
    pageSize: number,
    sippetName?: string | undefined
  ): Promise<PaginatedSnippets> {
    throw new Error("Method not implemented.");
  }
  createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    return new Promise((resolve, reject) => {
      axios
        .post(`${config.apiUrl}/snippet`, JSON.stringify({
            title: createSnippet.name,
            content: createSnippet.content,
            language: createSnippet.language,
        }), {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  getSnippetById(id: string): Promise<Snippet | undefined> {
    throw new Error("Method not implemented.");
  }
  updateSnippetById(
    id: string,
    updateSnippet: UpdateSnippet
  ): Promise<Snippet> {
    throw new Error("Method not implemented.");
  }
  getUserFriends(
    name?: string | undefined,
    page?: number | undefined,
    pageSize?: number | undefined
  ): Promise<PaginatedUsers> {
    throw new Error("Method not implemented.");
  }
  shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    throw new Error("Method not implemented.");
  }
  getFormatRules(): Promise<Rule[]> {
    throw new Error("Method not implemented.");
  }
  getLintingRules(): Promise<Rule[]> {
    throw new Error("Method not implemented.");
  }
  getTestCases(): Promise<TestCase[]> {
    throw new Error("Method not implemented.");
  }
  formatSnippet(snippet: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
    throw new Error("Method not implemented.");
  }
  removeTestCase(id: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  deleteSnippet(id: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
    throw new Error("Method not implemented.");
  }
  getFileTypes(): Promise<FileType[]> {
    throw new Error("Method not implemented.");
  }
  modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    throw new Error("Method not implemented.");
  }
  modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    throw new Error("Method not implemented.");
  }
}
export default Operations;
