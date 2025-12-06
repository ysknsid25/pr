import { createRoute } from "honox/factory";
import { PrList } from "../islands/pr-list";

export default createRoute((c) => {
    return c.render(
        <div class="py-8">
            <h1 class="text-3xl font-bold mb-8 text-center">
                Kanon's OSS Activity
            </h1>
            <div class="mb-8 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                <span>I'm Maintainer of</span>
                <a
                    aria-label="type-challenges repository"
                    class="overflow-hidden relative rounded-md shadow-sm shrink-0 size-8"
                    href="https://github.com/type-challenges/type-challenges"
                    target="_blank"
                >
                    <img
                        alt="type-challenges"
                        class="size-full"
                        src="https://avatars.githubusercontent.com/u/68700335?v=4"
                        loading="lazy"
                    />
                </a>
            </div>
            <div class="max-w-3xl mx-auto px-4 w-full text-left">
                <PrList />
            </div>
        </div>
    );
});
