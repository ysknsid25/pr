#!/usr/bin/env ts-node

import * as fs from "fs/promises";
import * as path from "path";

// PR関連の型定義
interface PRItem {
    organizationAvatar: string | null;
    owner: string;
    repository: string;
    title: string;
    state: "open" | "closed";
    merged: boolean;
    draft: boolean;
    createdAt: string;
    mergedAt: string | null;
    number: number;
    url: string;
}

interface PRData {
    lastUpdated: string;
    totalCount: number;
    pullRequests: PRItem[];
}

// GitHub API のレスポンス型（Search API用）
interface GitHubUser {
    login: string;
    avatar_url: string;
}

interface GitHubPullRequest {
    number: number;
    title: string;
    state: "open" | "closed";
    created_at: string;
    html_url: string;
    repository_url: string;
    user: GitHubUser | null;
    draft?: boolean;
    pull_request?: {
        merged_at: string | null;
    };
}

interface GitHubSearchResponse {
    total_count: number;
    items: GitHubPullRequest[];
}

// GitHub API の個別PR詳細レスポンス型
interface GitHubPullRequestDetail {
    number: number;
    title: string;
    state: "open" | "closed";
    merged: boolean;
    draft: boolean;
    created_at: string;
    merged_at: string | null;
    html_url: string;
    user: GitHubUser | null;
}

// リポジトリデータ取得用の型
interface GitHubRepository {
    owner: {
        avatar_url: string;
    };
}

// アバターURLのキャッシュ
const avatarCache: Map<string, string> = new Map();

/**
 * リポジトリデータを取得し、アバターURLをキャッシュする
 */
async function fetchRepositoryData(
    repoUrl: string,
    githubToken: string
): Promise<string | null> {
    const repoPath = new URL(repoUrl).pathname.replace("/repos/", "");

    // キャッシュがあればそれを返す
    if (avatarCache.has(repoPath)) {
        return avatarCache.get(repoPath)!;
    }

    // キャッシュがなければAPIから取得
    try {
        const response = await fetch(repoUrl, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "PR-Tracker-Batch/1.0",
            },
        });

        if (!response.ok) {
            console.warn(
                `Failed to fetch repository data for ${repoUrl}: ${response.status} ${response.statusText}`
            );
            return null;
        }

        const data: GitHubRepository = await response.json();
        const avatarUrl = data.owner.avatar_url;

        // キャッシュに保存
        avatarCache.set(repoPath, avatarUrl);

        return avatarUrl;
    } catch (error) {
        console.warn(`Error fetching repository data for ${repoUrl}:`, error);
        return null;
    }
}

/**
 * 個別のPRの詳細情報を取得
 */
async function fetchPRDetails(
    owner: string,
    repo: string,
    prNumber: number,
    githubToken: string
): Promise<GitHubPullRequestDetail> {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "PR-Tracker-Batch/1.0",
        },
    });

    if (!response.ok) {
        throw new Error(
            `GitHub API error for PR ${owner}/${repo}#${prNumber}: ${response.status} ${response.statusText}`
        );
    }

    return await response.json();
}

/**
 * 指定されたユーザーのPR情報をGitHub APIから全件取得する
 */
async function fetchAllPRs(githubToken: string): Promise<PRData> {
    let allPRs: GitHubPullRequest[] = [];
    let page = 1;
    let totalCount = 0;

    // まずSearch APIで全PRを取得
    while (true) {
        console.log(`Fetching page ${page}...`);

        const searchUrl = new URL("https://api.github.com/search/issues");
        searchUrl.searchParams.set("q", `author:ysknsid25 type:pr`);
        searchUrl.searchParams.set("sort", "created");
        searchUrl.searchParams.set("order", "desc");
        searchUrl.searchParams.set("page", page.toString());
        searchUrl.searchParams.set("per_page", "100"); // 最大値で取得

        const response = await fetch(searchUrl.toString(), {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "PR-Tracker-Batch/1.0",
            },
        });

        if (!response.ok) {
            throw new Error(
                `GitHub API error: ${response.status} ${response.statusText}`
            );
        }

        const data: GitHubSearchResponse = await response.json();

        // 初回のみtotalCountを記録
        if (page === 1) {
            totalCount = data.total_count;
            console.log(`Total PRs found: ${totalCount}`);
        }

        // 取得したPRを配列に追加
        allPRs.push(...data.items);

        // 最後のページに到達したら終了
        if (data.items.length < 100) {
            break;
        }

        page++;

        // レート制限対策で1秒待機
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`Fetched ${allPRs.length} PRs from search API`);

    // 各PRの詳細情報を取得（draft、merged状態など）
    console.log("Fetching detailed information for each PR...");
    const detailedPRs: PRItem[] = [];

    for (let i = 0; i < allPRs.length; i++) {
        const pr = allPRs[i];

        // リポジトリ情報の解析
        const repoUrlParts = pr.repository_url.split("/");
        const owner = repoUrlParts[repoUrlParts.length - 2];
        const repository = repoUrlParts[repoUrlParts.length - 1];

        try {
            // 個別PR詳細を取得
            const details = await fetchPRDetails(
                owner,
                repository,
                pr.number,
                githubToken
            );

            const organizationAvatar = await fetchRepositoryData(
                pr.repository_url,
                githubToken
            );

            const prItem: PRItem = {
                organizationAvatar,
                owner: owner,
                repository: repository,
                title: pr.title,
                state: pr.state,
                merged: details.merged,
                draft: details.draft,
                createdAt: pr.created_at,
                mergedAt: details.merged_at,
                number: pr.number,
                url: pr.html_url,
            };

            detailedPRs.push(prItem);

            if ((i + 1) % 10 === 0) {
                console.log(`Processed ${i + 1}/${allPRs.length} PRs`);
            }

            // レート制限対策で少し待機
            await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
            console.warn(
                `Failed to fetch details for PR ${owner}/${repository}#${pr.number}:`,
                error
            );

            // 詳細取得に失敗した場合は、基本情報のみで作成
            const organizationAvatar = await fetchRepositoryData(
                pr.repository_url,
                githubToken
            );

            const prItem: PRItem = {
                organizationAvatar,
                owner: owner,
                repository: repository,
                title: pr.title,
                state: pr.state,
                merged: false, // デフォルト値
                draft: pr.draft || false, // Search APIから取得できる場合もある
                createdAt: pr.created_at,
                mergedAt: pr.pull_request?.merged_at || null,
                number: pr.number,
                url: pr.html_url,
            };

            detailedPRs.push(prItem);
        }
    }

    console.log(
        `Processed ${detailedPRs.length} PRs with detailed information`
    );

    return {
        lastUpdated: new Date().toISOString(),
        totalCount: totalCount,
        pullRequests: detailedPRs,
    };
}

/**
 * PRデータをTypeScriptファイルとして保存
 */
async function savePRDataToFile(prData: PRData): Promise<void> {
    const outputPath = path.join(process.cwd(), "app", "data", "pr.ts");

    const content = `// Auto-generated PR data
// Last updated: ${prData.lastUpdated}
// Total PRs: ${prData.totalCount}

export interface PRItem {
  organizationAvatar: string | null
  owner: string
  repository: string
  title: string
  state: 'open' | 'closed'
  merged: boolean
  draft: boolean
  createdAt: string
  mergedAt: string | null
  number: number
  url: string
}

export interface PRData {
  username: string
  lastUpdated: string
  totalCount: number
  pullRequests: PRItem[]
}

export const prData: PRData = ${JSON.stringify(prData, null, 2)} as const
`;

    await fs.writeFile(outputPath, content, "utf8");
    console.log(`PR data saved to: ${outputPath}`);
    console.log(`Data contains ${prData.pullRequests.length} PRs`);
}

/**
 * メイン処理
 */
async function main() {
    try {
        // 環境変数からGitHubトークンとユーザー名を取得
        const githubToken = process.env.GITHUB_TOKEN;

        if (!githubToken) {
            throw new Error("GITHUB_TOKEN environment variable is required");
        }

        // PR情報を全件取得
        const prData = await fetchAllPRs(githubToken);

        // TypeScriptファイルとして保存
        await savePRDataToFile(prData);

        console.log("Batch process completed successfully!");
    } catch (error) {
        console.error("Batch process failed:", error);
        process.exit(1);
    }
}

main();

export { fetchAllPRs, savePRDataToFile };
