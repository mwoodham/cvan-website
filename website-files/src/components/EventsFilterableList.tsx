'use client';

import { useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Event } from '@/lib/directus';
import EventCard from '@/components/EventCard';
import { SearchInput } from '@/components/filters/SearchInput';
import { MultiSelectFilter } from '@/components/filters/MultiSelectFilter';
import { ActiveFilters, type ActiveFilter } from '@/components/filters/ActiveFilters';

interface EventsFilterableListProps {
  events: Event[];
}

// Helper function to extract unique values from arrays
function getUniqueValues(events: Event[], field: keyof Event): string[] {
  const values = new Set<string>();
  events.forEach((event) => {
    const value = event[field];
    if (Array.isArray(value)) {
      value.forEach((v) => v && values.add(v));
    }
  });
  return Array.from(values).sort();
}

// Filter events based on search and filters
function filterEvents(
  events: Event[],
  search: string,
  eventTypes: string[],
  locations: string[],
  accessTags: string[]
): Event[] {
  return events.filter((event) => {
    // Text search
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        event.title.toLowerCase().includes(searchLower) ||
        (event.about && String(event.about).toLowerCase().includes(searchLower)) ||
        event.location_address.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Event type filter
    if (eventTypes.length > 0) {
      if (!event.event_type || !event.event_type.some((type) => eventTypes.includes(type))) {
        return false;
      }
    }

    // Location filter
    if (locations.length > 0) {
      if (!event.location_tags || !event.location_tags.some((loc) => locations.includes(loc))) {
        return false;
      }
    }

    // Accessibility filter
    if (accessTags.length > 0) {
      if (!event.access_tags || !event.access_tags.some((tag) => accessTags.includes(tag))) {
        return false;
      }
    }

    return true;
  });
}

export function EventsFilterableList({ events }: EventsFilterableListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const search = searchParams.get('search') || '';
  const eventTypes = searchParams.getAll('type');
  const locations = searchParams.getAll('location');
  const accessTags = searchParams.getAll('access');

  // Extract unique filter options from all events
  const eventTypeOptions = useMemo(() => getUniqueValues(events, 'event_type'), [events]);
  const locationOptions = useMemo(() => getUniqueValues(events, 'location_tags'), [events]);
  const accessOptions = useMemo(() => getUniqueValues(events, 'access_tags'), [events]);

  // Filter events
  const filteredEvents = useMemo(
    () => filterEvents(events, search, eventTypes, locations, accessTags),
    [events, search, eventTypes, locations, accessTags]
  );

  // Update URL with new filter values
  const updateFilters = useCallback(
    (key: string, values: string | string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      // Remove all existing values for this key
      params.delete(key);

      // Add new values
      if (Array.isArray(values)) {
        values.forEach((value) => value && params.append(key, value));
      } else if (values) {
        params.set(key, values);
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Build active filters list
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filters: ActiveFilter[] = [];

    if (search) {
      filters.push({
        label: 'Search',
        value: search,
        onRemove: () => updateFilters('search', ''),
      });
    }

    eventTypes.forEach((type) => {
      filters.push({
        label: 'Type',
        value: type,
        onRemove: () => updateFilters('type', eventTypes.filter((t) => t !== type)),
      });
    });

    locations.forEach((loc) => {
      filters.push({
        label: 'Location',
        value: loc,
        onRemove: () => updateFilters('location', locations.filter((l) => l !== loc)),
      });
    });

    accessTags.forEach((tag) => {
      filters.push({
        label: 'Accessibility',
        value: tag,
        onRemove: () => updateFilters('access', accessTags.filter((a) => a !== tag)),
      });
    });

    return filters;
  }, [search, eventTypes, locations, accessTags, updateFilters]);

  const clearAllFilters = useCallback(() => {
    router.push('/events', { scroll: false });
  }, [router]);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-4">Search & Filter</h2>
                <SearchInput
                  value={search}
                  onChange={(value) => updateFilters('search', value)}
                  placeholder="Search events..."
                />
              </div>

              <div className="space-y-4">
                <MultiSelectFilter
                  label="Event Type"
                  options={eventTypeOptions}
                  selectedValues={eventTypes}
                  onChange={(values) => updateFilters('type', values)}
                />

                <MultiSelectFilter
                  label="Location"
                  options={locationOptions}
                  selectedValues={locations}
                  onChange={(values) => updateFilters('location', values)}
                />

                <MultiSelectFilter
                  label="Accessibility"
                  options={accessOptions}
                  selectedValues={accessTags}
                  onChange={(values) => updateFilters('access', values)}
                />
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <ActiveFilters
                filters={activeFilters}
                onClearAll={clearAllFilters}
                resultCount={filteredEvents.length}
              />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <p className="text-black/60 col-span-full text-center py-12">
                  No events match your filters. Try adjusting your search criteria.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
