import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin, ExternalLink, ArrowLeft, Tag, Banknote } from 'lucide-react';
import { getOpportunityBySlug } from '@/lib/directus';
import directus from '@/lib/directus';
import { readItem } from '@directus/sdk';

interface OpportunityPageProps {
  params: {
    slug: string;
  };
}

export default async function OpportunityPage({ params }: OpportunityPageProps) {
  const { slug } = await params;

  // Try to fetch by slug first, fallback to ID for backwards compatibility
  let opportunity;

  // Check if slug is a number (legacy ID-based URL)
  if (!isNaN(Number(slug))) {
    try {
      opportunity = await directus.request(
        readItem('opportunities', parseInt(slug), {
          fields: ['*'],
        })
      );
    } catch (error) {
      notFound();
    }
  } else {
    // Fetch by slug
    opportunity = await getOpportunityBySlug(slug);
  }

  if (!opportunity) {
    notFound();
  }

  // Handle null deadline for ongoing opportunities
  const deadline = opportunity.deadline ? new Date(opportunity.deadline) : null;
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

  // Determine deadline display text
  const getDeadlineText = () => {
    if (opportunity.deadline_type === 'ongoing' || !deadline) {
      return 'Ongoing';
    }
    if (opportunity.deadline_type === 'flexible') {
      return `${format(deadline, 'EEEE, dd MMMM yyyy')} (flexible)`;
    }
    return format(deadline, 'EEEE, dd MMMM yyyy');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-cvan-orange">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-6">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Opportunities
          </Link>
        </div>
      </div>

      {/* Hero Section with Image Background */}
      {opportunity.image_id && (
        <div className="relative h-[400px] lg:h-[500px] overflow-hidden bg-gray-900">
          <img
            src={`${directusUrl}/assets/${opportunity.image_id}?width=1920&height=800&fit=cover`}
            alt={opportunity.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-4xl px-6 lg:px-8 pb-12 w-full">
              {opportunity.wage_fee && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-4 py-2 text-sm font-bold bg-cvan-purple text-white">
                    {opportunity.wage_fee}
                  </span>
                </div>
              )}
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl mb-4 leading-tight">
                {opportunity.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <article className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
        {/* Header for opportunities without image */}
        {!opportunity.image_id && (
          <header className="mb-8">
            {opportunity.wage_fee && (
              <div className="mb-4">
                <span className="inline-flex items-center px-4 py-2 text-sm font-bold bg-cvan-purple text-white">
                  {opportunity.wage_fee}
                </span>
              </div>
            )}
            <h1 className="text-5xl font-black tracking-tight text-black sm:text-6xl lg:text-7xl mb-6 leading-tight">
              {opportunity.title}
            </h1>
          </header>
        )}

        {/* Meta Info */}
        <header className="mb-8">
          <div className="flex flex-col gap-3 text-base text-black/70">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              <span>
                Deadline: {getDeadlineText()}
              </span>
            </div>
            {opportunity.location_address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <span>{opportunity.location_address}</span>
              </div>
            )}

            {/* Tags */}
            {((opportunity.opportunity_type_tags && opportunity.opportunity_type_tags.length > 0) ||
              (opportunity.location_tags && opportunity.location_tags.length > 0)) && (
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 mt-1" />
                <div className="flex flex-wrap gap-2">
                  {opportunity.opportunity_type_tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium bg-cvan-purple text-white capitalize"
                    >
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {opportunity.location_tags?.map((tag: string) => (
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
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {opportunity.about && (
            <div className="whitespace-pre-wrap text-black/80 leading-relaxed">
              {typeof opportunity.about === 'string' ? opportunity.about : ''}
            </div>
          )}
        </div>

        {/* External Link */}
        {opportunity.link && (
          <div className="border-t border-black/10 pt-8">
            <a
              href={opportunity.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-cvan-purple px-6 py-3 text-sm font-semibold text-white hover:bg-cvan-purple/90 transition-colors"
            >
              Visit Opportunity Website
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-black/10 text-sm text-black/60">
          {opportunity.submitted_by && (
            <p>
              Submitted by {opportunity.submitted_by}
              {opportunity.contact_email && (
                <>
                  {' • '}
                  <a
                    href={`mailto:${opportunity.contact_email}`}
                    className="text-cvan-purple hover:text-cvan-purple/80"
                  >
                    {opportunity.contact_email}
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
