import Link from 'next/link';
import { Suspense } from 'react';
import { PageHero } from '@/components/PageHero';
import { getPublishedEvents, getHomePage } from '@/lib/directus';
import { EventsFilterableList } from '@/components/EventsFilterableList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events & Exhibitions',
  description: 'Discover exhibitions, workshops, and artist talks across the East Midlands',
};

// Revalidate every 60 seconds - user submissions appear quickly
export const revalidate = 60;

export default async function EventsPage() {
  const [events, homePage] = await Promise.all([
    getPublishedEvents(),
    getHomePage(),
  ]);

  const description = homePage?.events_section_description || 'Discover exhibitions, workshops, and artist talks across the region';

  return (
    <>
      <PageHero
        title="Events & Exhibitions"
        description={description}
        bgColor="purple"
        textColor="green"
        graphicColor="green"
        graphicArrangement="bottom-left"
        action={
          <Link
            href="/events/submit"
            className="inline-block bg-cvan-green px-6 py-3 text-sm font-semibold text-black hover:bg-cvan-green/90 transition-colors"
          >
            Submit Event or Exhibition
          </Link>
        }
      />

      <Suspense fallback={<div className="py-16 text-center">Loading events...</div>}>
        <EventsFilterableList events={events} />
      </Suspense>
    </>
  );
}
