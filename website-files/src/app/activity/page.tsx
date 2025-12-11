import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import {
  getCurrentActivity,
  getArchivedActivity,
  getActivityPage,
  getActivityByTag,
  getProjectTagDescriptionBySlug,
  slugToDisplayName,
} from '@/lib/directus';
import ActivityCard from '@/components/ActivityCard';
import { X } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity',
  description: 'Updates, features, and insights from the East Midlands visual arts community',
};

interface ActivityPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function ActivityPage({ searchParams }: ActivityPageProps) {
  const { tag } = await searchParams;

  // If filtering by tag, fetch filtered activity and tag description
  if (tag) {
    // First fetch the tag description to get the correct tag name
    const [tagDescription, activityPageData] = await Promise.all([
      getProjectTagDescriptionBySlug(tag),
      getActivityPage(),
    ]);

    // Use the tag_name from the description if found, otherwise convert slug to display name
    const tagName = tagDescription?.tag_name || slugToDisplayName(tag);
    const displayName = tagName;

    // Now fetch activities with the correct tag name
    const activities = await getActivityByTag(tagName);

    return (
      <>
        <PageHero
          title={displayName}
          description={tagDescription?.description ? undefined : `Showing all activity tagged with "${displayName}"`}
          bgColor="green"
          textColor="blue"
          graphicColor="blue"
          graphicArrangement="stacked-right"
        />

        {/* Filter Bar */}
        <section className="py-6 bg-cvan-cream">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <p className="text-black/70">
                Showing <strong>{activities.length}</strong> {activities.length === 1 ? 'post' : 'posts'} tagged with <strong>"{displayName}"</strong>
              </p>
              <Link
                href="/activity"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear filter
              </Link>
            </div>
          </div>
        </section>

        {/* Tag Description */}
        {tagDescription?.description && (
          <section className="py-12 bg-white border-b border-black/10">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: tagDescription.description }}
              />
            </div>
          </section>
        )}

        {/* Filtered Results */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {activities.length > 0 ? (
                activities.map((article) => <ActivityCard key={article.id} article={article} currentTagFilter={tag} />)
              ) : (
                <p className="text-black/60 col-span-full text-center py-12">
                  No posts found with this tag.
                </p>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }

  // Default view: show current and archived separately
  const [currentActivity, archivedActivity, activityPageData] = await Promise.all([
    getCurrentActivity(),
    getArchivedActivity(),
    getActivityPage(),
  ]);

  return (
    <>
      <PageHero
        title={activityPageData?.hero_title || 'CVAN EM Activity'}
        description={activityPageData?.hero_description || 'Updates, features, and insights from the visual arts community'}
        bgColor="green"
        textColor="blue"
        graphicColor="blue"
        graphicArrangement="stacked-right"
      />

      {/* Current Activity Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-black mb-8">Current</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {currentActivity.length > 0 ? (
              currentActivity.map((article) => <ActivityCard key={article.id} article={article} />)
            ) : (
              <p className="text-black/60 col-span-full text-center py-12">
                No current activity posts published yet. Check back soon!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Archive Section */}
      {archivedActivity.length > 0 && (
        <section className="py-16 lg:py-24 bg-cvan-cream">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-black mb-8">Archive</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {archivedActivity.map((article) => <ActivityCard key={article.id} article={article} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
