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
import FriendDTO from "../models/FriendDTO";

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

  async listSnippetDescriptors(page:number, pageSize:number): Promise<PaginatedSnippets> {
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.get(`${config.apiUrl}/snippet/${page+1}/${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const pagination: PaginatedSnippets = response.data;
    const snippets: Snippet[] = pagination.snippets;
    return {
      snippets,
      page: pagination.page,
      page_size: pagination.page_size,
      count: pagination.count,
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
    return SnippetDTO.toSnippet(response.data);
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
  async getUserFriends(
    name?: string | undefined,
    page?: number | undefined,
    pageSize?: number | undefined
  ): Promise<PaginatedUsers> {
    name;
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.get(`${config.apiUrl}/snippet/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const friends = response.data.map((friend: FriendDTO) =>
      FriendDTO.toUser(friend)
    );
    return {
      users: friends,
      page: page ?? 1,
      page_size: pageSize ?? friends.length,
      count: friends.length,
    };
  }
  async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    const token = await this.getAccessTokenSilently(options);
    await axios.post(
      `${config.apiUrl}/snippet/${snippetId}/share`,
      {
        friend_id: userId,
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
export { options };
