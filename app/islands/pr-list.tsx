/** @jsxImportSource hono/jsx */
import { useState } from "hono/jsx";
import { PRItem, prData } from "../data/pr";
import { orgsData, OrgData } from "../data/orgs";
import { worksData, WorkItem } from "../data/works";

// SVG Icon Components (Font Awesome paths)
const IconGitPullRequest = ({ class: className }: { class: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="48"
        height="48"
        fill="none"
        stroke="#00c951"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="opacity:1;"
        class={className}
    >
        <circle cx="5" cy="6" r="3" />
        <path d="M5 9v12" />
        <circle cx="19" cy="18" r="3" />
        <path d="m15 9l-3-3l3-3" />
        <path d="M12 6h5a2 2 0 0 1 2 2v7" />
    </svg>
);

const IconGitMerge = ({ class: className }: { class: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="48"
        height="48"
        fill="none"
        stroke="#ad46ff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="opacity:1;"
        class={className}
    >
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M6 21V9a9 9 0 0 0 9 9" />
    </svg>
);

const IconGitPullRequestClosed = ({ class: className }: { class: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="48"
        height="48"
        fill="none"
        stroke="#fb2c36"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="opacity:1;"
        class={className}
    >
        <circle cx="6" cy="6" r="3" />
        <path d="M6 9v12M21 3l-6 6m6 0l-6-6m3 8.5V15" />
        <circle cx="18" cy="18" r="3" />
    </svg>
);
const IconFileLines = ({ class: className }: { class: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="48"
        height="48"
        fill="none"
        stroke="#6a7282"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="opacity:1;"
        class={className}
    >
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M18 6V5m0 6v-1M6 9v12" />
    </svg>
);

const IconStar = ({ class: className }: { class: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class={className}>
        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
    </svg>
);

const IconRepoForked = ({ class: className }: { class: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class={className}>
        <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    </svg>
);

const IconGlobe = ({ class: className }: { class: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

const IconMenuPullRequest = ({ class: className }: { class: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={className}>
        <circle cx="18" cy="18" r="3"></circle>
        <circle cx="6" cy="6" r="3"></circle>
        <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
        <line x1="6" y1="9" x2="6" y2="21"></line>
    </svg>
);

const IconMenuBuilding = ({ class: className }: { class: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={className}>
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <line x1="9" y1="22" x2="9" y2="22.01"></line>
        <line x1="15" y1="22" x2="15" y2="22.01"></line>
        <line x1="12" y1="22" x2="12" y2="22.01"></line>
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <line x1="4" y1="10" x2="20" y2="10"></line>
        <line x1="4" y1="16" x2="20" y2="16"></line>
    </svg>
);

const IconMenuCode = ({ class: className }: { class: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={className}>
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

const IconMenuChart = ({ class: className }: { class: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={className}>
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
);


// Custom formatTimeAgo function
const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
};

const languageColors: { [key: string]: string } = {
    TypeScript: "bg-blue-500",
    JavaScript: "bg-yellow-500",
    Kotlin: "bg-purple-600",
    Java: "bg-red-500",
    Python: "bg-green-600",
    Go: "bg-cyan-400",
    HTML: "bg-orange-500",
    CSS: "bg-blue-400",
    Vue: "bg-green-500",
    Svelte: "bg-orange-400",
    Rust: "bg-black",
    Dart: "bg-blue-600",
    PHP: "bg-indigo-400",
    Shell: "bg-gray-700",
    Dockerfile: "bg-blue-700",
    Swift: "bg-orange-300",
    C: "bg-blue-800",
    "C++": "bg-blue-700",
    "C#": "bg-purple-800",
    Ruby: "bg-red-700",
    Perl: "bg-green-700",
    Scala: "bg-red-600",
    Haskell: "bg-purple-500",
    Erlang: "bg-red-400",
    Elixir: "bg-purple-400",
    Clojure: "bg-green-500",
    FSharp: "bg-blue-800",
    R: "bg-blue-300",
    Julia: "bg-purple-700",
    Lua: "bg-blue-900",
    Groovy: "bg-green-400",
    Makefile: "bg-gray-600",
    Assembly: "bg-gray-500",
    ShaderLab: "bg-green-300",
    SCSS: "bg-pink-500",
    Less: "bg-blue-200",
    Sass: "bg-pink-400",
     stylus: "bg-green-200",
    JSON: "bg-gray-400",
    YAML: "bg-pink-300",
    XML: "bg-yellow-300",
    Markdown: "bg-gray-300",
    CoffeeScript: "bg-yellow-600",
    ObjectiveC: "bg-blue-600",
    Crystal: "bg-cyan-500",
    OCaml: "bg-orange-600",
    Racket: "bg-red-800",
    V: "bg-green-800",
};

// PR Item Component
function PRItemComponent(props: { pr: PRItem; count: number }) {
    const { pr, count } = props;
    const prURL = `https://github.com/${pr.owner}/${pr.repository}`;

    let stateIcon = null;
    let stateClass = "";
    let ariaLabel = "";

    if (pr.draft) {
        stateIcon = <IconFileLines class="size-4" />;
        stateClass = "text-gray-500";
        ariaLabel = "Draft pull request";
    } else if (pr.merged) {
        stateIcon = <IconGitMerge class="size-4" />;
        stateClass = "text-purple-500";
        ariaLabel = "Merged pull request";
    } else if (pr.state === "open") {
        stateIcon = <IconGitPullRequest class="size-4" />;
        stateClass = "text-green-500";
        ariaLabel = "Open pull request";
    } else if (pr.state === "closed") {
        stateIcon = <IconGitPullRequestClosed class="size-4" />;
        stateClass = "text-red-500";
        ariaLabel = "Closed pull request";
    }

    return (
        <div
            style={{ "--stagger": count }}
            class="flex items-center gap-4 sliding-animation delay-base"
        >
            <a
                aria-label={`${pr.owner}'s profile`}
                class="border border-gray-200 dark:border-gray-800 overflow-hidden relative rounded-md shadow-sm shrink-0 size-12"
                href={`https://github.com/${pr.owner}`}
                target="_blank"
            >
                <img
                    alt={pr.owner}
                    class="size-full"
                    src={
                        pr.organizationAvatar ||
                        `https://github.com/${pr.owner}.png`
                    }
                    loading="lazy"
                />
            </a>
            <div class="flex-1 flex flex-col sm:flex-row sm:justify-between sm:gap-2 lg:gap-4 min-w-0">
                <div class="flex flex-col gap-1 min-w-0">
                    <a
                        class="flex items-center gap-1 text-gray-900 dark:text-white"
                        href={pr.url}
                        target="_blank"
                    >
                        <span class="truncate">{pr.title}</span>
                    </a>
                    <div
                        class={`flex items-center gap-1 text-sm ${stateClass}`}
                        aria-label={ariaLabel}
                    >
                        {stateIcon}
                        <div class="flex flex-wrap items-center gap-1 text-gray-500 dark:text-gray-400">
                            <span> by </span>
                            <a
                                href={`https://github.com/${pr.owner}`}
                                target="_blank"
                                class="hover:underline"
                            >
                                {pr.owner}
                            </a>
                            <span> / </span>
                            <a
                                href={prURL}
                                target="_blank"
                                class="hover:underline"
                            >
                                <span class="truncate">{pr.repository}</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end items-baseline gap-2 sm:flex-col sm:items-end shrink-0 sm:justify-between mt-1 sm:mt-0">
                    <a
                        href={pr.url}
                        target="_blank"
                        class="text-sm text-gray-500 dark:text-gray-400 hover:underline"
                    >
                        #{pr.number}
                    </a>
                    <time
                        datetime={pr.createdAt}
                        class="text-sm text-gray-500 dark:text-gray-400"
                    >
                        {formatTimeAgo(pr.createdAt)}
                    </time>
                </div>
            </div>
        </div>
    );
}

function WorkItemComponent({ work, count }: { work: WorkItem; count: number }) {
    return (
        <div
            style={{ "--stagger": count }}
            class="flex flex-col gap-2 p-4 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm sliding-animation delay-base bg-white dark:bg-gray-900"
        >
            <div class="flex justify-between items-start">
                <a href={work.html_url} target="_blank" class="text-lg font-bold text-sky-600 hover:underline break-all">
                    {work.repo}
                </a>
                {work.publishedAt && (
                    <span class="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded shrink-0 ml-2">
                        {work.publishedAt}
                    </span>
                )}
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 min-h-[2.5em]">
                {work.description || "No description provided."}
            </p>

            <div class="flex items-center gap-4 mt-auto text-sm text-gray-500 dark:text-gray-400">
                {work.language && (
                    <div class="flex items-center gap-1">
                        <span class={`${languageColors[work.language] || "bg-gray-400"} size-3 rounded-full block`}></span>
                        <span>{work.language}</span>
                    </div>
                )}
                
                <div class="flex items-center gap-1">
                    <IconStar class="size-4 text-yellow-500" />
                    <span>{work.stargazersCount}</span>
                </div>
                
                <div class="flex items-center gap-1">
                    <IconRepoForked class="size-4" />
                    <span>{work.forksCount}</span>
                </div>
                {work.homepage && (
                    <div class="ml-auto">
                        <a href={work.homepage} target="_blank" class="flex items-center gap-2 text-xs text-gray-500 hover:text-sky-600" aria-label="Website">
                            <IconGlobe class="size-4" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

// PR List Component
function PRListComponent({ prs }: { prs: PRItem[] }) {
    return (
        <div class="flex flex-col gap-4">
            {prs.map((pr, index) => (
                <PRItemComponent pr={pr} count={index} />
            ))}
        </div>
    );
}

// Orgs List Component
function OrgsListComponent() {
    return (
        <div class="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-4">
            {orgsData.map((org: OrgData, index: number) => (
                <a
                    href={`https://github.com/${org.owner}`}
                    target="_blank"
                    class="flex flex-col items-center gap-2"
                    style={{ "--stagger": index }}
                    title={`${org.owner} (${org.count} contributions)`}
                >
                    <div class="border border-gray-200 dark:border-gray-800 overflow-hidden relative rounded-md shadow-sm shrink-0 size-12">
                        <img
                            alt={org.owner}
                            class="size-full"
                            src={
                                org.avatarUrl ||
                                `https://github.com/${org.owner}.png`
                            }
                            loading="lazy"
                        />
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        {org.count}
                    </span>
                </a>
            ))}
        </div>
    );
}

function WorksListComponent() {
    return (
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {worksData.repositories.map((work, index) => (
                <WorkItemComponent work={work} count={index} />
            ))}
        </div>
    );
}

function StatisticsComponent() {
    const years = new Set<string>();
    prData.pullRequests.forEach((pr) => {
        const year = new Date(pr.createdAt).getFullYear().toString();
        years.add(year);
    });
    worksData.repositories.forEach((work) => {
        if (work.publishedAt) years.add(work.publishedAt);
    });

    const sortedYears = Array.from(years).sort().reverse();

    return (
        <div class="flex flex-col gap-8">
            {sortedYears.map((year, index) => {
                const prsInYear = prData.pullRequests.filter(
                    (pr) => new Date(pr.createdAt).getFullYear().toString() === year
                );
                const worksInYear = worksData.repositories.filter(
                    (work) => work.publishedAt === year
                );

                const orgsMap = new Map<
                    string,
                    { count: number; avatar: string | null }
                >();
                prsInYear.forEach((pr) => {
                    const org = pr.owner;
                    const current = orgsMap.get(org) || {
                        count: 0,
                        avatar: pr.organizationAvatar,
                    };
                    orgsMap.set(org, {
                        count: current.count + 1,
                        avatar: current.avatar || pr.organizationAvatar,
                    });
                });

                const sortedOrgs = Array.from(orgsMap.entries()).sort(
                    (a, b) => b[1].count - a[1].count
                );

                return (
                    <div
                        key={year}
                        style={{ "--stagger": index }}
                        class="border rounded-lg p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 sliding-animation delay-base"
                    >
                        <h3 class="text-2xl font-bold mb-6 flex items-baseline gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                            {year}
                            <span class="text-sm font-normal text-gray-500">
                                ({prsInYear.length} PRs)
                            </span>
                        </h3>

                        {worksInYear.length > 0 && (
                            <div class="mb-8">
                                <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Published Works
                                </h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {worksInYear.map((work) => (
                                        <a
                                            href={work.html_url}
                                            target="_blank"
                                            class="block p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:border-sky-500 dark:hover:border-sky-500 transition-colors bg-gray-50 dark:bg-gray-800/50"
                                        >
                                            <div class="font-bold text-sky-600 truncate">
                                                {work.repo}
                                            </div>
                                            <div class="text-xs text-gray-500 mt-1 line-clamp-1">
                                                {work.description}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {sortedOrgs.length > 0 && (
                            <div>
                                <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Contributions by Organization
                                </h4>
                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {sortedOrgs.map(([name, data]) => (
                                        <a
                                            href={`https://github.com/${name}`}
                                            target="_blank"
                                            class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div class="size-8 rounded overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 bg-white">
                                                <img
                                                    src={
                                                        data.avatar ||
                                                        `https://github.com/${name}.png`
                                                    }
                                                    alt={name}
                                                    class="size-full"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div class="min-w-0">
                                                <div class="text-sm font-medium truncate text-gray-700 dark:text-gray-300">
                                                    {name}
                                                </div>
                                                <div class="text-xs text-gray-500">
                                                    {data.count} PRs
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Main Component with View Toggle
export function PrList() {
    const [viewMode, setViewMode] = useState<
        "pr" | "orgs" | "works" | "statistics"
    >("statistics");
    const [filter, setFilter] = useState<"all" | "open" | "merged">("all");

    const allPRs = prData.pullRequests;
    const openPRs = allPRs.filter((pr) => pr.state === "open" && !pr.draft);
    const mergedPRs = allPRs.filter((pr) => pr.merged);

    const filteredPRs = (() => {
        switch (filter) {
            case "open":
                return openPRs;
            case "merged":
                return mergedPRs;
            default:
                return allPRs;
        }
    })();

    return (
        <div>
            <div class="flex items-center mb-6">
                <div class="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <button
                        onClick={() => setViewMode("statistics")}
                        class={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                            viewMode === "statistics"
                                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        }`}
                        title="Statistics"
                    >
                        <IconMenuChart class="size-5" />
                        <span class="hidden sm:inline">Statistics</span>
                    </button>
                    <button
                        onClick={() => setViewMode("pr")}
                        class={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                            viewMode === "pr"
                                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        }`}
                        title="PR List"
                    >
                        <IconMenuPullRequest class="size-5" />
                        <span class="hidden sm:inline">PR List</span>
                    </button>
                    <button
                        onClick={() => setViewMode("orgs")}
                        class={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                            viewMode === "orgs"
                                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        }`}
                        title="Organizations"
                    >
                        <IconMenuBuilding class="size-5" />
                        <span class="hidden sm:inline">Orgs</span>
                    </button>
                    <button
                        onClick={() => setViewMode("works")}
                        class={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                            viewMode === "works"
                                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        }`}
                        title="Works"
                    >
                        <IconMenuCode class="size-5" />
                        <span class="hidden sm:inline">Works</span>
                    </button>
                </div>
            </div>

            {viewMode === "pr" && (
                <div class="mb-4">
                    <div class="border-b border-gray-200 dark:border-gray-700">
                        <nav class="-mb-px flex gap-6" aria-label="Tabs">
                            <button
                                onClick={() => setFilter("all")}
                                class={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                                    filter === "all"
                                        ? "border-sky-500 text-sky-600"
                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }`}
                            >
                                All
                                <span class="ml-2 text-xs text-gray-400 font-normal bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
                                    {allPRs.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setFilter("open")}
                                class={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                                    filter === "open"
                                        ? "border-sky-500 text-sky-600"
                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }`}
                            >
                                Open
                                <span class="ml-2 text-xs text-gray-400 font-normal bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
                                    {openPRs.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setFilter("merged")}
                                class={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                                    filter === "merged"
                                        ? "border-sky-500 text-sky-600"
                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }`}
                            >
                                Merged
                                <span class="ml-2 text-xs text-gray-400 font-normal bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
                                    {mergedPRs.length}
                                </span>
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {viewMode === "pr" ? (
                <PRListComponent prs={filteredPRs} />
            ) : viewMode === "orgs" ? (
                <OrgsListComponent />
            ) : viewMode === "works" ? (
                <WorksListComponent />
            ) : (
                <StatisticsComponent />
            )}
        </div>
    );
}