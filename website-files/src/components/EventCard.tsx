import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { Event } from '@/lib/directus';

interface EventCardProps {
  event: Event;
  basePath?: string; // Allow customizing the filter path
}

export default function EventCard({ event, basePath = '/events' }: EventCardProps) {
  const startDate = new Date(event.event_date);
  const endDate = event.event_end_date ? new Date(event.event_end_date) : null;

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

  return (
    <article className="group relative bg-white border border-black/10 hover:border-cvan-purple transition-all duration-300">
      {/* Image */}
      {event.image_id && (
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            src={`${directusUrl}/assets/${event.image_id}?width=800&height=450&fit=cover`}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Timing Badge */}
        {event.timing && (
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-cvan-yellow text-black">
              {event.timing}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-black mb-2 group-hover:text-cvan-purple transition-colors">
          <Link href={`/events/${event.slug || event.id}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {event.title}
          </Link>
        </h3>

        {/* About - simplified for now */}
        {event.about && (
          <p className="text-sm text-black/70 mb-4 line-clamp-2">
            {typeof event.about === 'string' ? event.about : ''}
          </p>
        )}

        {/* Tags - clickable to filter */}
        {((event.event_type && event.event_type.length > 0) ||
          (event.access_tags && event.access_tags.length > 0) ||
          (event.location_tags && event.location_tags.length > 0)) && (
          <div className="relative z-10 flex flex-wrap gap-2 mb-4">
            {event.event_type?.map((tag: string) => (
              <Link
                key={tag}
                href={`${basePath}?type=${encodeURIComponent(tag)}`}
                className="tag-link inline-flex items-center px-2 py-1 text-xs font-medium bg-cvan-purple text-white capitalize hover:bg-cvan-purple/80 transition-colors"
              >
                {tag.replace(/_/g, ' ')}
              </Link>
            ))}
            {event.access_tags?.map((tag: string) => (
              <Link
                key={tag}
                href={`${basePath}?access=${encodeURIComponent(tag)}`}
                className="tag-link inline-flex items-center px-2 py-1 text-xs font-medium bg-cvan-beige text-black capitalize hover:bg-cvan-beige/80 transition-colors"
              >
                {tag.replace(/_/g, ' ')}
              </Link>
            ))}
            {event.location_tags?.map((tag: string) => (
              <Link
                key={tag}
                href={`${basePath}?location=${encodeURIComponent(tag)}`}
                className="tag-link inline-flex items-center px-2 py-1 text-xs font-medium bg-cvan-blue text-white capitalize hover:bg-cvan-blue/80 transition-colors"
              >
                {tag.replace(/_/g, ' ')}
              </Link>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-col gap-2 text-sm text-black/60">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {format(startDate, 'dd MMM yyyy')}
              {endDate && ` - ${format(endDate, 'dd MMM yyyy')}`}
            </span>
          </div>
          {event.location_address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location_address}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
