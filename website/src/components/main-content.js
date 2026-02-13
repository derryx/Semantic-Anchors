export function renderMain() {
  return `
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-[var(--color-text)] mb-2">
            Explore Semantic Anchors
          </h2>
          <p class="text-[var(--color-text-secondary)]">
            A curated catalog of well-defined terms, methodologies, and frameworks
            for effective LLM communication.
          </p>
        </section>

        <section id="filters" class="mb-6 flex flex-wrap gap-3">
          <input
            id="search-input"
            type="search"
            placeholder="Search anchors..."
            class="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <select
            id="role-filter"
            class="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">All Roles</option>
          </select>
        </section>

        <section
          id="treemap-container"
          class="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
          style="min-height: 500px; height: calc(100vh - 350px);"
        ></section>
      </div>
    </main>
  `
}
