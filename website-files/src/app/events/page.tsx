import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { getPublishedEvents } from '@/lib/directus';
import { EventsFilterableList } from '@/components/EventsFilterableList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events & Exhibitions',
  description: 'Discover exhibitions, workshops, and artist talks across the East Midlands',
};

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <>
      <PageHero
        title="Events & Exhibitions"
        description="Discover exhibitions, workshops, and artist talks across the region"
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

      <EventsFilterableList events={events} />
    </>
  );
}
