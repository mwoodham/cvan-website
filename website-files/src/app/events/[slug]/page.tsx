import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin, ExternalLink, ArrowLeft, Tag } from 'lucide-react';
import { getEventBySlug } from '@/lib/directus';
import directus from '@/lib/directus';
import { readItem } from '@directus/sdk';

interface EventPageProps {
  params: {
    slug: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;

  // Try to fetch by slug first, fallback to ID for backwards compatibility
  let event;

  // Check if slug is a number (legacy ID-based URL)
  if (!isNaN(Number(slug))) {
    try {
      event = await directus.request(
        readItem('events', parseInt(slug), {
          fields: ['*'],
        })
      );
    } catch (error) {
      notFound();
    }
  } else {
    // Fetch by slug
    event = await getEventBySlug(slug);
  }

  if (!event) {
    notFound();
  }

  const startDate = new Date(event.event_date);
  const endDate = event.event_end_date ? new Date(event.event_end_date) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-cvan-purple">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Hero Section with Image Background */}
      {event.image_id && (
        <div className="relative h-[400px] lg:h-[500px] overflow-hidden bg-gray-900">
          <img
            src={`/assets/${event.image_id}?width=1920&height=800&fit=cover`}
            alt={event.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-4xl px-6 lg:px-8 pb-12 w-full">
              {event.timing && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-4 py-2 text-sm font-bold bg-cvan-yellow text-black">
                    {event.timing}
                  </span>
                </div>
              )}
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl mb-4 leading-tight">
                {event.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <article className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
        {/* Header for events without image */}
        {!event.image_id && (
          <header className="mb-8">
            {event.timing && (
              <div className="mb-4">
                <span className="inline-flex items-center px-4 py-2 text-sm font-bold bg-cvan-yellow text-black">
                  {event.timing}
                </span>
              </div>
            )}
            <h1 className="text-5xl font-black tracking-tight text-black sm:text-6xl lg:text-7xl mb-6 leading-tight">
              {event.title}
            </h1>
          </header>
        )}

        {/* Meta Info */}
        <header className="mb-8">
          <div className="flex flex-col gap-3 text-base text-black/70">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              <span>
                {format(startDate, 'EEEE, dd MMMM yyyy')}
                {endDate && ` - ${format(endDate, 'EEEE, dd MMMM yyyy')}`}
              </span>
            </div>
            {event.location_address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <span>{event.location_address}</span>
              </div>
            )}

            {/* Tags */}
            {((event.event_type && event.event_type.length > 0) ||
              (event.access_tags && event.access_tags.length > 0) ||
              (event.location_tags && event.location_tags.length > 0)) && (
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 mt-1" />
                <div className="flex flex-col gap-2">
                  {event.event_type && event.event_type.length > 0 && (
                    <div>
                      <span className="text-sm font-semibold text-black/80 mr-2">What's On:</span>
                      <div className="inline-flex flex-wrap gap-2">
                        {event.event_type.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium bg-cvan-blue text-white capitalize"
                          >
                            {tag.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {event.access_tags && event.access_tags.length > 0 && (
                    <div>
                      <span className="text-sm font-semibold text-black/80 mr-2">Accessibility:</span>
                      <div className="inline-flex flex-wrap gap-2">
                        {event.access_tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium bg-cvan-green text-white capitalize"
                          >
                            {tag.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {event.location_tags && event.location_tags.length > 0 && (
                    <div>
                      <span className="text-sm font-semibold text-black/80 mr-2">Location:</span>
                      <div className="inline-flex flex-wrap gap-2">
                        {event.location_tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium bg-cvan-purple text-white capitalize"
                          >
                            {tag.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        {event.about && (
          <div
            className="prose prose-lg max-w-none mb-12 prose-headings:font-bold prose-headings:text-black prose-p:text-black/80 prose-a:text-cvan-blue prose-a:font-semibold hover:prose-a:underline prose-strong:text-black prose-ul:text-black/80 prose-ol:text-black/80 prose-blockquote:text-black/70 prose-blockquote:border-cvan-blue"
            dangerouslySetInnerHTML={{
              __html: typeof event.about === 'string' ? event.about : ''
            }}
          />
        )}

        {/* External Link */}
        {event.link && (
          <div className="border-t border-black/10 pt-8">
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-cvan-blue px-6 py-3 text-sm font-semibold text-white hover:bg-cvan-blue/90 transition-colors"
            >
              Visit Event Website
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-black/10 text-sm text-black/60">
          {event.submitted_by && (
            <p>
              Submitted by {event.submitted_by}
              {event.contact_email && (
                <>
                  {' • '}
                  <a
                    href={`mailto:${event.contact_email}`}
                    className="text-cvan-blue hover:text-cvan-blue/80"
                  >
                    {event.contact_email}
                  </a>
                </>
              )}
            </p>
          )}
        </footer>
      </article>
    </div>
  );
}
