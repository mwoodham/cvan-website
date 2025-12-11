import Link from 'next/link';
import { Suspense } from 'react';
import { PageHero } from '@/components/PageHero';
import { getPublishedOpportunities } from '@/lib/directus';
import { OpportunitiesFilterableList } from '@/components/OpportunitiesFilterableList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jobs & Opportunities',
  description: 'Funding, residencies, open calls, and professional development',
};

export default async function OpportunitiesPage() {
  const opportunities = await getPublishedOpportunities();

  return (
    <>
      <PageHero
        title="Jobs & Opportunities"
        description="Funding, residencies, open calls, and professional development"
        bgColor="orange"
        textColor="beige"
        graphicColor="beige"
        graphicArrangement="top-right"
        action={
          <Link
            href="/opportunities/submit"
            className="inline-block bg-cvan-beige px-6 py-3 text-sm font-semibold text-black hover:bg-cvan-beige/90 transition-colors"
          >
            Submit an Opportunity
          </Link>
        }
      />

      <Suspense fallback={<div className="py-16 text-center">Loading opportunities...</div>}>
        <OpportunitiesFilterableList opportunities={opportunities} />
      </Suspense>
    </>
  );
}
