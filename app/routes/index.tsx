import { createRoute } from 'honox/factory';
import { PrList } from '../islands/pr-list';
import { prData } from '../data/pr';

export default createRoute((c) => {
  return c.render(
    <div class="py-8 text-center">
      <h1 class="text-3xl font-bold mb-8">Pull Requests</h1>
      <div class="flex flex-col gap-4 max-w-3xl mx-auto">
        {prData.pullRequests.map((pr, index) => (
          <PrList pr={pr} count={index} />
        ))}
      </div>
    </div>
  );
});
