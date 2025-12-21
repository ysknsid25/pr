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

// Orgs関連の型定義
interface OrgData {
    owner: string;
    avatarUrl: string | null;
    count: number;
}

// Works関連の型定義
interface WorkItem {
    owner: string;
    repo: string;
    description: string | null;
    homepage: string | null;
    language: string | null;
    stargazersCount: number;
    forksCount: number;
    html_url: string;
}

interface WorksData {
    lastUpdated: string;
    totalCount: number;
    repositories: WorkItem[];
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

// オーナーのアバターURLキャッシュ
const ownerAvatarCache: Map<string, string | null> = new Map();

/**
 * リポジトリのオーナーのアバターURLを取得する
 */
async function fetchOwnerAvatar(
    owner: string,
    repoUrl: string,
    githubToken: string
): Promise<string | null> {
    if (ownerAvatarCache.has(owner)) {
        return ownerAvatarCache.get(owner)!;
    }

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
            ownerAvatarCache.set(owner, null);
            return null;
        }

        const data: GitHubRepository = await response.json();
        const avatarUrl = data.owner.avatar_url;

        ownerAvatarCache.set(owner, avatarUrl);
        return avatarUrl;
    } catch (error) {
        console.warn(`Error fetching repository data for ${repoUrl}:`, error);
        ownerAvatarCache.set(owner, null);
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
 * Works（特定トピックのリポジトリ）を取得する
 */
async function fetchWorks(githubToken: string): Promise<WorksData> {
    console.log("Fetching works repositories...");
    const searchUrl = new URL("https://api.github.com/search/repositories");
    searchUrl.searchParams.set("q", "user:ysknsid25 topic:works");
    searchUrl.searchParams.set("sort", "updated");

    const response = await fetch(searchUrl.toString(), {
        headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "PR-Tracker-Batch/1.0",
        },
    });

    if (!response.ok) {
        throw new Error(
            `GitHub API error fetching works: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json() as any;
    const items: WorkItem[] = data.items.map((repo: any) => ({
        owner: repo.owner.login,
        repo: repo.name,
        description: repo.description,
        homepage: repo.homepage,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        html_url: repo.html_url,
    }));

    // Sort by stargazersCount (desc) then forksCount (desc)
    items.sort((a, b) => {
        if (b.stargazersCount !== a.stargazersCount) {
            return b.stargazersCount - a.stargazersCount;
        }
        return b.forksCount - a.forksCount;
    });

    console.log(`Fetched ${items.length} works repositories`);

    return {
        lastUpdated: new Date().toISOString(),
        totalCount: data.total_count,
        repositories: items,
    };
}

/**
 * 指定されたユーザーのPR情報をGitHub APIから全件取得する
 */
async function fetchAllPRs(
    githubToken: string
): Promise<{ prData: PRData; orgsData: Map<string, { count: number; repoUrl: string }> }> {
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
    const orgsData: Map<string, { count: number; repoUrl: string }> = new Map();

    for (let i = 0; i < allPRs.length; i++) {
        const pr = allPRs[i];

        // リポジトリ情報の解析
        const repoUrlParts = pr.repository_url.split("/");
        const owner = repoUrlParts[repoUrlParts.length - 2];
        const repository = repoUrlParts[repoUrlParts.length - 1];

        // Orgsデータを集計
        if (orgsData.has(owner)) {
            orgsData.get(owner)!.count++;
        } else {
            orgsData.set(owner, { count: 1, repoUrl: pr.repository_url });
        }

        try {
            // 個別PR詳細を取得
            const details = await fetchPRDetails(
                owner,
                repository,
                pr.number,
                githubToken
            );
            const organizationAvatar = await fetchOwnerAvatar(
                owner,
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
            const organizationAvatar = await fetchOwnerAvatar(
                owner,
                pr.repository_url,
                githubToken
            );

            // 詳細取得に失敗した場合は、基本情報のみで作成
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

    const prData = {
        lastUpdated: new Date().toISOString(),
        totalCount: totalCount,
        pullRequests: detailedPRs,
    };

    return { prData, orgsData };
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
 * OrgsデータをTypeScriptファイルとして保存
 */
async function saveOrgsDataToFile(
    orgsDataMap: Map<string, { count: number; repoUrl: string }>,
    githubToken: string
): Promise<void> {
    const outputPath = path.join(process.cwd(), "app", "data", "orgs.ts");
    const orgsList: OrgData[] = [];

    for (const [owner, data] of orgsDataMap.entries()) {
        // アバターURLをここで非同期に取得
        const avatarUrl = await fetchOwnerAvatar(owner, data.repoUrl, githubToken);
        orgsList.push({
            owner,
            avatarUrl,
            count: data.count,
        });
        // APIレート制限のための短い待機
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // 貢献度順にソート
    orgsList.sort((a, b) => b.count - a.count);

    const content = `// Auto-generated Orgs data
// Last updated: ${new Date().toISOString()}

export interface OrgData {
  owner: string
  avatarUrl: string | null
  count: number
}

export const orgsData: OrgData[] = ${JSON.stringify(orgsList, null, 2)} as const
`;

    await fs.writeFile(outputPath, content, "utf8");
    console.log(`Orgs data saved to: ${outputPath}`);
    console.log(`Data contains ${orgsList.length} orgs`);
}

/**
 * WorksデータをTypeScriptファイルとして保存
 */
async function saveWorksDataToFile(worksData: WorksData): Promise<void> {
    const outputPath = path.join(process.cwd(), "app", "data", "works.ts");

    const content = `// Auto-generated Works data
// Last updated: ${worksData.lastUpdated}

export interface WorkItem {
  owner: string
  repo: string
  description: string | null
  homepage: string | null
  language: string | null
  stargazersCount: number
  forksCount: number
  html_url: string
}

export interface WorksData {
  lastUpdated: string
  totalCount: number
  repositories: WorkItem[]
}

export const worksData: WorksData = ${JSON.stringify(worksData, null, 2)} as const
`;

    await fs.writeFile(outputPath, content, "utf8");
    console.log(`Works data saved to: ${outputPath}`);
    console.log(`Data contains ${worksData.repositories.length} works`);
}

/**
 * メイン処理
 */
async function main() {
    try {
        // 環境変数からGitHubトークンを取得
        const githubToken = process.env.GITHUB_TOKEN;

        if (!githubToken) {
            throw new Error("GITHUB_TOKEN environment variable is required");
        }

        // PR情報とOrgs情報を全件取得
        const { prData, orgsData } = await fetchAllPRs(githubToken);

        // Works情報を取得
        const worksData = await fetchWorks(githubToken);

        // ファイルとして保存
        await savePRDataToFile(prData);
        await saveOrgsDataToFile(orgsData, githubToken);
        await saveWorksDataToFile(worksData);

        console.log("Batch process completed successfully!");
    } catch (error) {
        console.error("Batch process failed:", error);
        process.exit(1);
    }
}

main();

export { fetchAllPRs, savePRDataToFile };