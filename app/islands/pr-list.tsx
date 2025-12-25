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

// Main Component with View Toggle
export function PrList() {
    const [viewMode, setViewMode] = useState<"pr" | "orgs" | "works">("pr");
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
            <div class="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0">
                <h2 class="text-xl font-bold">Activities</h2>
                <span class="mx-2 text-gray-300 dark:text-gray-700 hidden sm:inline">
                    |
                </span>
                <div class="flex gap-2">
                    <button
                        onClick={() => setViewMode("pr")}
                        class={`px-3 py-1 text-sm rounded-md ${
                            viewMode === "pr"
                                ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        PR List
                    </button>
                    <button
                        onClick={() => setViewMode("orgs")}
                        class={`px-3 py-1 text-sm rounded-md ${
                            viewMode === "orgs"
                                ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        Orgs
                    </button>
                    <button
                        onClick={() => setViewMode("works")}
                        class={`px-3 py-1 text-sm rounded-md ${
                            viewMode === "works"
                                ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        Works
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
            ) : (
                <WorksListComponent />
            )}
        </div>
    );
}