/** @jsxImportSource hono/jsx */

import { PRItem } from "../data/pr";

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

    if (years > 0) {
        return `${years} year${years > 1 ? "s" : ""} ago`;
    }
    if (months > 0) {
        return `${months} month${months > 1 ? "s" : ""} ago`;
    }
    if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }
    if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
    return "just now";
};

export function PrList(props: { pr: PRItem; count: number }) {
    const { pr, count } = props;

    const prURL = `https://github.com/${pr.owner}/${pr.repository}`;
    const prUserName = pr.owner;
    const prRepoName = pr.repository;

    let stateClass = "";
    let stateText = "";

    if (pr.draft) {
        stateText = "Draft";
        stateClass = "text-gray-500"; // Or any specific class for draft
    } else if (pr.merged) {
        stateText = "Merged";
        stateClass = "text-purple-500"; // Specific class for merged
    } else if (pr.state === "open") {
        stateText = "Open";
        stateClass = "text-green-500"; // Specific class for open
    } else if (pr.state === "closed") {
        stateText = "Closed";
        stateClass = "text-red-500"; // Specific class for closed
    }

    return (
        <div
            style={{ "--stagger": count }}
            class="flex items-center gap-4 sliding-animation delay-base"
        >
            <a
                aria-label={`${prUserName}'s profile`}
                class="border border-gray-200 dark:border-gray-800 overflow-hidden relative rounded-md shadow-sm shrink-0 size-12"
                href={prURL}
                target="_blank"
            >
                <img
                    alt={pr.owner}
                    class="size-full"
                    src={
                        pr.organizationAvatar ||
                        `https://github.com/${prUserName}.png`
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
                            href={`https://github.com/${prUserName}`}
                            target="_blank"
                            class="hover:underline"
                        >
                            {prUserName}
                        </a>
                        <span> / </span>
                        <a href={prURL} target="_blank" class="hover:underline">
                            <span class="truncate">{prRepoName}</span>
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
                        datatime={pr.createdAt}
                        class="text-sm text-gray-500 dark:text-gray-400"
                    >
                        {formatTimeAgo(pr.createdAt)}
                    </time>
                </div>
            </div>
        </div>
    );
}
