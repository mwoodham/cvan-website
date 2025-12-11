'use client';

import { useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Opportunity } from '@/lib/directus';
import OpportunityCard from '@/components/OpportunityCard';
import { SearchInput } from '@/components/filters/SearchInput';
import { MultiSelectFilter } from '@/components/filters/MultiSelectFilter';
import { ActiveFilters, type ActiveFilter } from '@/components/filters/ActiveFilters';

interface OpportunitiesFilterableListProps {
  opportunities: Opportunity[];
}

// Helper function to parse deadline type categories
function getDeadlineCategories(opportunities: Opportunity[]): string[] {
  const categories = new Set<string>();
  opportunities.forEach((opp) => {
    if (opp.deadline_type) {
      categories.add(opp.deadline_type);
    }
  });
  return Array.from(categories).sort();
}

// Helper function to extract unique values from arrays
function getUniqueValues(opportunities: Opportunity[], field: keyof Opportunity): string[] {
  const values = new Set<string>();
  opportunities.forEach((opp) => {
    const value = opp[field];
    if (Array.isArray(value)) {
      value.forEach((v) => v && values.add(v));
    }
  });
  return Array.from(values).sort();
}

// Filter opportunities based on search and filters
function filterOpportunities(
  opportunities: Opportunity[],
  search: string,
  deadlineTypes: string[],
  opportunityTypes: string[],
  locations: string[]
): Opportunity[] {
  return opportunities.filter((opportunity) => {
    // Text search
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        opportunity.title.toLowerCase().includes(searchLower) ||
        (opportunity.about && String(opportunity.about).toLowerCase().includes(searchLower)) ||
        opportunity.location_address.toLowerCase().includes(searchLower) ||
        opportunity.wage_fee.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Deadline type filter
    if (deadlineTypes.length > 0) {
      if (!opportunity.deadline_type || !deadlineTypes.includes(opportunity.deadline_type)) {
        return false;
      }
    }

    // Opportunity type filter
    if (opportunityTypes.length > 0) {
      if (!opportunity.opportunity_type_tags || !opportunity.opportunity_type_tags.some((type) => opportunityTypes.includes(type))) {
        return false;
      }
    }

    // Location filter
    if (locations.length > 0) {
      if (!opportunity.location_tags || !opportunity.location_tags.some((loc) => locations.includes(loc))) {
        return false;
      }
    }

    return true;
  });
}

export function OpportunitiesFilterableList({ opportunities }: OpportunitiesFilterableListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const search = searchParams.get('search') || '';
  const deadlineTypes = searchParams.getAll('deadline');
  const opportunityTypes = searchParams.getAll('type');
  const locations = searchParams.getAll('location');

  // Extract unique filter options
  const deadlineTypeOptions = useMemo(
    () => getDeadlineCategories(opportunities),
    [opportunities]
  );
  const opportunityTypeOptions = useMemo(
    () => getUniqueValues(opportunities, 'opportunity_type_tags'),
    [opportunities]
  );
  const locationOptions = useMemo(
    () => getUniqueValues(opportunities, 'location_tags'),
    [opportunities]
  );

  // Filter opportunities
  const filteredOpportunities = useMemo(
    () => filterOpportunities(opportunities, search, deadlineTypes, opportunityTypes, locations),
    [opportunities, search, deadlineTypes, opportunityTypes, locations]
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

    deadlineTypes.forEach((type) => {
      filters.push({
        label: 'Deadline Type',
        value: type,
        onRemove: () => updateFilters('deadline', deadlineTypes.filter((t) => t !== type)),
      });
    });

    opportunityTypes.forEach((type) => {
      filters.push({
        label: 'Type',
        value: type,
        onRemove: () => updateFilters('type', opportunityTypes.filter((t) => t !== type)),
      });
    });

    locations.forEach((loc) => {
      filters.push({
        label: 'Location',
        value: loc,
        onRemove: () => updateFilters('location', locations.filter((l) => l !== loc)),
      });
    });

    return filters;
  }, [search, deadlineTypes, opportunityTypes, locations, updateFilters]);

  const clearAllFilters = useCallback(() => {
    router.push('/opportunities', { scroll: false });
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
                  placeholder="Search opportunities..."
                />
              </div>

              <div className="space-y-4">
                <MultiSelectFilter
                  label="Deadline Type"
                  options={deadlineTypeOptions}
                  selectedValues={deadlineTypes}
                  onChange={(values) => updateFilters('deadline', values)}
                />

                <MultiSelectFilter
                  label="Opportunity Type"
                  options={opportunityTypeOptions}
                  selectedValues={opportunityTypes}
                  onChange={(values) => updateFilters('type', values)}
                />

                <MultiSelectFilter
                  label="Location"
                  options={locationOptions}
                  selectedValues={locations}
                  onChange={(values) => updateFilters('location', values)}
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
                resultCount={filteredOpportunities.length}
              />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)
              ) : (
                <p className="text-black/60 col-span-full text-center py-12">
                  No opportunities match your filters. Try adjusting your search criteria.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
