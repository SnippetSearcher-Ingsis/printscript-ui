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
import { User } from "@auth0/auth0-react";
import SnippetDTO from "../models/SnippetDTO";
import CreateSnippetDTO from "../models/CreateSnippetDTO";

const fakeSnippet = {} as Snippet;

class Operations implements SnippetOperations {
  private operations: SnippetOperations = new FakeSnippetOperations();

  constructor(private readonly token: string, private readonly user: User) {}

  listSnippetDescriptors(
    page: number,
    pageSize: number,
    sippetName?: string | undefined
  ): Promise<PaginatedSnippets> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${config.apiUrl}/snippet`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            page,
            page_size: pageSize,
            name: sippetName,
          },
        })
        .then((response) => {
          const snippets: Snippet[] = response.data.map((dto: SnippetDTO) =>
            SnippetDTO.toSnippet(dto, this.user.nickname ?? "Unknown User")
          );
          resolve({
            snippets,
            page: 1,
            page_size: snippets.length,
            count: snippets.length,
          });
        })
        .catch((error) => reject(error));
    });
  }
  createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${config.apiUrl}/snippet`,
          JSON.stringify(CreateSnippetDTO.fromCreateSnippet(createSnippet)),
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => resolve(fakeSnippet))
        .catch((error) => reject(error));
    });
  }
  getSnippetById(id: string): Promise<Snippet | undefined> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${config.apiUrl}/snippet/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) =>
          resolve(
            SnippetDTO.toSnippet(
              response.data,
              this.user.nickname ?? "Unknown User"
            )
          )
        )
        .catch((error) => reject(error));
    });
  }
  updateSnippetById(
    id: string,
    updateSnippet: UpdateSnippet
  ): Promise<Snippet> {
    return new Promise((resolve, reject) => {
      axios
        .patch(
          `${config.apiUrl}/snippet/${id}`,
          JSON.stringify({
            content: updateSnippet.content,
          }),
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => resolve(fakeSnippet))
        .catch((error) => reject(error));
    });
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
    return new Promise((resolve, reject) => {
      axios
        .delete(`${config.apiUrl}/snippet/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
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
