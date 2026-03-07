'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActivityArticle, ProjectTagDescription } from '@/lib/directus';
import { tagNameToSlug } from '@/lib/directus';
import ActivityCard from '@/components/ActivityCard';
import { SearchInput } from '@/components/filters/SearchInput';

interface ActivityFilterableListProps {
  activities: ActivityArticle[];
  allActivities: ActivityArticle[];
  tagDescriptions: ProjectTagDescription[];
  currentTag?: string;
  tagDescriptionHtml?: string;
}

function getAllTags(activities: ActivityArticle[]): { label: string; slug: string }[] {
  const tagMap = new Map<string, string>();

  activities.forEach((article) => {
    article.project_tags?.forEach((tag) => {
      const slug = tagNameToSlug(tag);
      if (!tagMap.has(slug)) tagMap.set(slug, tag);
    });
    article.generic_tags?.forEach((tag) => {
      const slug = tagNameToSlug(tag);
      if (!tagMap.has(slug)) {
        tagMap.set(slug, tag.charAt(0).toUpperCase() + tag.slice(1));
      }
    });
  });

  return Array.from(tagMap.entries())
    .map(([slug, label]) => ({ slug, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

const ARCHIVE_PAGE_SIZE = 9;

export function ActivityFilterableList({
  activities,
  allActivities,
  tagDescriptions,
  currentTag,
  tagDescriptionHtml,
}: ActivityFilterableListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [archiveVisible, setArchiveVisible] = useState(ARCHIVE_PAGE_SIZE);

  // Collect all tags from the FULL activity set so dropdown always shows everything
  const allTags = useMemo(() => getAllTags(allActivities), [allActivities]);

  // Text search filter (client-side only)
  const searchedActivities = useMemo(() => {
    if (!search) return activities;
    const s = search.toLowerCase();
    return activities.filter(
      (article) =>
        article.title.toLowerCase().includes(s) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(s))
    );
  }, [activities, search]);

  const hasSearch = search.length > 0;

  // Split for default view (no tag, no search)
  const currentActivities = useMemo(
    () => searchedActivities.filter((a) => !a.is_archive),
    [searchedActivities]
  );
  const archivedActivities = useMemo(
    () => searchedActivities.filter((a) => a.is_archive),
    [searchedActivities]
  );

  // Tag dropdown navigates server-side (full page transition)
  const handleTagChange = (slug: string) => {
    if (slug) {
      router.push(`/activity?tag=${encodeURIComponent(slug)}`);
    } else {
      router.push('/activity');
    }
  };

  return (
    <>
      {/* Search & Filter Bar */}
      <section className="py-6 bg-cvan-cream border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search activity..."
              />
            </div>
            <div className="sm:w-64">
              <select
                value={currentTag || ''}
                onChange={(e) => handleTagChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-black/20 bg-cvan-cream text-black rounded-none focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '40px',
                }}
              >
                <option value="">All tags</option>
                {allTags.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasSearch && (
            <div className="mt-4 flex items-center gap-3 text-sm text-black/60">
              <span>
                {searchedActivities.length} {searchedActivities.length === 1 ? 'result' : 'results'}
                {currentTag && ' within this tag'}
              </span>
              <button
                onClick={() => setSearch('')}
                className="text-black/60 hover:text-black underline transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tag Description */}
      {tagDescriptionHtml && (
        <section className="py-12 bg-white border-b border-black/10">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: tagDescriptionHtml }}
            />
          </div>
        </section>
      )}

      {/* When tag is active OR searching, show flat results */}
      {currentTag || hasSearch ? (
        <section className="py-16 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {searchedActivities.length > 0 ? (
                searchedActivities.map((article) => (
                  <ActivityCard
                    key={article.id}
                    article={article}
                    currentTagFilter={currentTag}
                  />
                ))
              ) : (
                <p className="text-black/60 col-span-full text-center py-12">
                  No activity matches your search. Try adjusting your criteria.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Current Activity */}
          <section className="py-16 lg:py-24 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="text-3xl font-black tracking-tight text-black mb-8">
                Current
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {currentActivities.length > 0 ? (
                  currentActivities.map((article) => (
                    <ActivityCard key={article.id} article={article} />
                  ))
                ) : (
                  <p className="text-black/60 col-span-full text-center py-12">
                    No current activity posts published yet. Check back soon!
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Archive */}
          {archivedActivities.length > 0 && (
            <section className="py-16 lg:py-24 bg-cvan-cream">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-3xl font-black tracking-tight text-black mb-8">
                  Archive
                </h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {archivedActivities.slice(0, archiveVisible).map((article) => (
                    <ActivityCard key={article.id} article={article} />
                  ))}
                </div>

                {archiveVisible < archivedActivities.length && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() =>
                        setArchiveVisible((prev) =>
                          Math.min(prev + ARCHIVE_PAGE_SIZE, archivedActivities.length)
                        )
                      }
                      className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold bg-black text-white hover:bg-black/80 transition-colors"
                    >
                      Load more
                      <span className="text-white/60">
                        ({Math.min(archiveVisible, archivedActivities.length)} of{' '}
                        {archivedActivities.length})
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
