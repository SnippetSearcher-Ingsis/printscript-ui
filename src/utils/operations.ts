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
import { GetTokenSilentlyOptions, User } from "@auth0/auth0-react";
import SnippetDTO from "../models/SnippetDTO";
import CreateSnippetDTO from "../models/CreateSnippetDTO";
import { GetTokenSilentlyVerboseResponse } from "@auth0/auth0-spa-js/dist/typings/global";

const fakeSnippet = {} as Snippet;

type getAccessTokenSilently = {
  (
    options: GetTokenSilentlyOptions & {
      detailedResponse: true;
    }
  ): Promise<GetTokenSilentlyVerboseResponse>;
  (options?: GetTokenSilentlyOptions): Promise<string>;
  (options: GetTokenSilentlyOptions): Promise<
    GetTokenSilentlyVerboseResponse | string
  >;
};

const options = {
  authorizationParams: {
    audience: "https://snippet",
  },
};

class Operations implements SnippetOperations {
  private operations: SnippetOperations = new FakeSnippetOperations();

  constructor(
    private readonly getAccessTokenSilently: getAccessTokenSilently,
    private readonly user: User
  ) {}

  async listSnippetDescriptors(): Promise<PaginatedSnippets> {
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.get(`${config.apiUrl}/snippet/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const snippets: Snippet[] = response.data.map((dto: SnippetDTO) =>
      SnippetDTO.toSnippet(dto, this.user.nickname ?? "Unknown User")
    );
    return {
      snippets,
      page: 1,
      page_size: snippets.length,
      count: snippets.length,
    };
  }
  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const token = await this.getAccessTokenSilently(options);
    await axios.post(
      `${config.apiUrl}/snippet/`,
      JSON.stringify({
        ...CreateSnippetDTO.fromCreateSnippet(createSnippet),
        user_name: this.user.nickname,
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return fakeSnippet;
  }
  async getSnippetById(id: string): Promise<Snippet | undefined> {
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.get(`${config.apiUrl}/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return SnippetDTO.toSnippet(
      response.data,
      this.user.nickname ?? "Unknown User"
    );
  }
  async updateSnippetById(
    id: string,
    updateSnippet: UpdateSnippet
  ): Promise<Snippet> {
    const token = await this.getAccessTokenSilently(options);
    await axios.patch(
      `${config.apiUrl}/snippet/${id}`,
      {
        content: updateSnippet.content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return fakeSnippet;
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
  async deleteSnippet(id: string): Promise<string> {
    const token = await this.getAccessTokenSilently(options);
    await axios.delete(`${config.apiUrl}/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return "deleted";
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
