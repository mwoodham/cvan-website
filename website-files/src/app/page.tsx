import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  getPublishedEvents,
  getPublishedOpportunities,
  getPublishedActivity,
  getHomePage,
} from '@/lib/directus';
import EventCard from '@/components/EventCard';
import OpportunityCard from '@/components/OpportunityCard';
import ActivityCard from '@/components/ActivityCard';

// Revalidate every 60 seconds - home shows latest events/opportunities
export const revalidate = 60;

export default async function HomePage() {
  // Fetch data from Directus
  const [events, opportunities, activity, homeContent] = await Promise.all([
    getPublishedEvents(3),
    getPublishedOpportunities(3),
    getPublishedActivity(3),
    getHomePage(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section home-hero relative bg-cvan-yellow py-24 lg:py-32 overflow-hidden">
        {/* L-Shape Graphics - Blue - Diagonal Meeting Arrangement */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none translate-x-[15%]">
          {/* Shape 1 (bottom-left) - no rotation, inner corner points toward center */}
          <svg
            viewBox="0 0 100 100"
            className="cvan-shape cvan-shape-left absolute w-28 h-28 lg:w-40 lg:h-40 transition-transform duration-700 ease-in-out"
            style={{ transform: 'translate(-100px, 100px) rotate(180deg)' }}
            aria-hidden="true"
          >
            <path d="M0 0 L25 0 L25 75 L100 75 L100 100 L0 100 Z" fill="#4038FF" />
          </svg>
          {/* Shape 2 (top-right) - 180deg rotation, inner corner points toward center */}
          <svg
            viewBox="0 0 100 100"
            className="cvan-shape cvan-shape-right absolute w-28 h-28 lg:w-40 lg:h-40 transition-transform duration-700 ease-in-out"
            style={{ transform: 'translate(100px, -100px)' }}
            aria-hidden="true"
          >
            <path d="M0 0 L25 0 L25 75 L100 75 L100 100 L0 100 Z" fill="#4038FF" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight text-black sm:text-6xl lg:text-7xl">
              {homeContent?.hero_title || 'Contemporary Visual Arts Network'}
            </h1>
            {homeContent?.hero_subtitle && (
              <p className="mt-6 text-lg leading-8 text-black/80">
                {homeContent.hero_subtitle}
              </p>
            )}
            <div className="mt-10 flex items-center gap-x-6">
              {homeContent?.hero_cta_primary_text && homeContent?.hero_cta_primary_link && (
                <Link
                  href={homeContent.hero_cta_primary_link}
                  className="bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/90 transition-colors"
                >
                  {homeContent.hero_cta_primary_text}
                </Link>
              )}
              {homeContent?.hero_cta_secondary_text && homeContent?.hero_cta_secondary_link && (
                <Link
                  href={homeContent.hero_cta_secondary_link}
                  className="text-sm font-semibold text-black hover:text-black/70 transition-colors"
                >
                  {homeContent.hero_cta_secondary_text} <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Activity/News Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                {homeContent?.activity_section_title || 'Latest Activity'}
              </h2>
              {homeContent?.activity_section_description && (
                <p className="mt-2 text-lg text-black/70">
                  {homeContent.activity_section_description}
                </p>
              )}
            </div>
            <Link
              href="/activity"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-cvan-green hover:text-cvan-green/80 transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {activity.length > 0 ? (
              activity.map((article) => <ActivityCard key={article.id} article={article} />)
            ) : (
              <p className="text-black/60 col-span-full text-center py-12">
                No activity posts published yet. Stay tuned!
              </p>
            )}
          </div>

          <Link
            href="/activity"
            className="sm:hidden flex items-center justify-center gap-2 text-sm font-semibold text-cvan-green hover:text-cvan-green/80 transition-colors mt-8"
          >
            View All Activity <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 lg:py-24 bg-cvan-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                {homeContent?.events_section_title || 'Events & Exhibitions'}
              </h2>
              {homeContent?.events_section_description && (
                <p className="mt-2 text-lg text-black/70">
                  {homeContent.events_section_description}
                </p>
              )}
            </div>
            <Link
              href="/events"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-cvan-purple hover:text-cvan-purple/80 transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p className="text-black/60 col-span-full text-center py-12">
                No upcoming events at the moment. Check back soon!
              </p>
            )}
          </div>

          <Link
            href="/events"
            className="sm:hidden flex items-center justify-center gap-2 text-sm font-semibold text-cvan-purple hover:text-cvan-purple/80 transition-colors mt-8"
          >
            View All Events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                {homeContent?.opportunities_section_title || 'Jobs & Opportunities'}
              </h2>
              {homeContent?.opportunities_section_description && (
                <p className="mt-2 text-lg text-black/70">
                  {homeContent.opportunities_section_description}
                </p>
              )}
            </div>
            <Link
              href="/opportunities"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-cvan-orange hover:text-cvan-orange/80 transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.length > 0 ? (
              opportunities.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)
            ) : (
              <p className="text-black/60 col-span-full text-center py-12">
                No opportunities available at the moment. Check back soon!
              </p>
            )}
          </div>

          <Link
            href="/opportunities"
            className="sm:hidden flex items-center justify-center gap-2 text-sm font-semibold text-cvan-orange hover:text-cvan-orange/80 transition-colors mt-8"
          >
            View All Opportunities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section - Mailing List */}
      <section className="py-16 lg:py-24 bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stay Connected
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Join our mailing list to receive the latest updates on exhibitions, opportunities, and
              events across the East Midlands visual arts community.
            </p>
            <div className="mt-8">
              <Link
                href="/mailing-list"
                className="inline-block bg-cvan-yellow px-8 py-3 text-sm font-semibold text-black hover:bg-cvan-yellow/90 transition-colors"
              >
                Join Mailing List
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
