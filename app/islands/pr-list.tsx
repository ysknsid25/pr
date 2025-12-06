/** @jsxImportSource hono/jsx */
import { useState } from "hono/jsx";
import { PRItem, prData } from "../data/pr";
import { orgsData, OrgData } from "../data/orgs";

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
            <div class="flex-1 flex justify-between gap-2 lg:gap-4 min-w-0">
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
                        <span> by </span>
                        <a
                            href={`https://github.com/${pr.owner}`}
                            target="_blank"
                            class="hover:underline"
                        >
                            {pr.owner}
                        </a>
                        <span> / </span>
                        <a href={prURL} target="_blank" class="hover:underline">
                            <span class="truncate">{pr.repository}</span>
                        </a>
                    </div>
                </div>
                <div class="flex flex-col justify-between shrink-0 text-right">
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

// PR List Component
function PRListComponent() {
    return (
        <div class="flex flex-col gap-4">
            {prData.pullRequests.map((pr, index) => (
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
                    class="border border-gray-200 dark:border-gray-800 overflow-hidden relative rounded-md shadow-sm shrink-0 size-12"
                    style={{ "--stagger": index }}
                    title={`${org.owner} (${org.count} contributions)`}
                >
                    <img
                        alt={org.owner}
                        class="size-full"
                        src={
                            org.avatarUrl ||
                            `https://github.com/${org.owner}.png`
                        }
                        loading="lazy"
                    />
                </a>
            ))}
        </div>
    );
}

// Main Component with View Toggle
export function PrList() {
    const [viewMode, setViewMode] = useState<"pr" | "orgs">("pr");

    return (
        <div>
            <div class="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0">
                <h2 class="text-xl font-bold">Contributes</h2>
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
                </div>
            </div>

            {viewMode === "pr" ? <PRListComponent /> : <OrgsListComponent />}
        </div>
    );
}
