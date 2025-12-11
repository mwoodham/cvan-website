'use client';

import { useState } from 'react';
import ActivityCard from './ActivityCard';
import { ActivityArticle } from '@/lib/directus';

interface ActivityArchiveProps {
  initialActivities: ActivityArticle[];
  totalCount: number;
  pageSize?: number;
}

export default function ActivityArchive({
  initialActivities,
  totalCount,
  pageSize = 9,
}: ActivityArchiveProps) {
  const [activities, setActivities] = useState<ActivityArticle[]>(initialActivities);
  const [loading, setLoading] = useState(false);

  const hasMore = activities.length < totalCount;

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/activity/archived?limit=${pageSize}&offset=${activities.length}`
      );
      const data = await response.json();
      setActivities((prev) => [...prev, ...data.activities]);
    } catch (error) {
      console.error('Failed to load more activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (activities.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-cvan-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight text-black mb-8">Archive</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((article) => (
            <ActivityCard key={article.id} article={article} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  Load more
                  <span className="text-white/60">
                    ({activities.length} of {totalCount})
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
