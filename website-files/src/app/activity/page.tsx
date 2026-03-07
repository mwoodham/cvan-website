import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import {
  getPublishedActivity,
  getActivityPage,
  getActivityByTag,
  getProjectTagDescriptions,
  getProjectTagDescriptionBySlug,
  slugToDisplayName,
} from '@/lib/directus';
import { ActivityFilterableList } from '@/components/ActivityFilterableList';
import { X } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity',
  description: 'Updates, features, and insights from the East Midlands visual arts community',
};

// Revalidate every 60 seconds - content updates appear quickly
export const revalidate = 60;

interface ActivityPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function ActivityPage({ searchParams }: ActivityPageProps) {
  const { tag } = await searchParams;

  const [allActivities, activityPageData, tagDescriptions] = await Promise.all([
    getPublishedActivity(),
    getActivityPage(),
    getProjectTagDescriptions(),
  ]);

  // Tag-filtered view
  if (tag) {
    const tagDescription = await getProjectTagDescriptionBySlug(tag);
    const tagName = tagDescription?.tag_name || slugToDisplayName(tag);
    const filteredActivities = await getActivityByTag(tagName);

    return (
      <>
        <PageHero
          title={tagName}
          description={`Showing all activity tagged with "${tagName}"`}
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
                Showing <strong>{filteredActivities.length}</strong> {filteredActivities.length === 1 ? 'post' : 'posts'} tagged with <strong>&ldquo;{tagName}&rdquo;</strong>
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

        {/* Filtered Results with search - pass all activities for tag dropdown */}
        <ActivityFilterableList
          activities={filteredActivities}
          allActivities={allActivities}
          tagDescriptions={tagDescriptions}
          currentTag={tag}
          tagDescriptionHtml={tagDescription?.description}
        />
      </>
    );
  }

  // Default view
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

      <ActivityFilterableList
        activities={allActivities}
        allActivities={allActivities}
        tagDescriptions={tagDescriptions}
      />
    </>
  );
}
