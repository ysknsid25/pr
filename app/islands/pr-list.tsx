/** @jsxImportSource hono/jsx */
import { useState } from "hono/jsx";
import { PRItem, prData } from "../data/pr";
import { orgsData, OrgData } from "../data/orgs";

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

    let stateClass = "";
    let stateText = "";

    if (pr.draft) {
        stateText = "Draft";
        stateClass = "text-gray-500";
    } else if (pr.merged) {
        stateText = "Merged";
        stateClass = "text-purple-500";
    } else if (pr.state === "open") {
        stateText = "Open";
        stateClass = "text-green-500";
    } else if (pr.state === "closed") {
        stateText = "Closed";
        stateClass = "text-red-500";
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
                    <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <span class={stateClass}>{stateText}</span>
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
