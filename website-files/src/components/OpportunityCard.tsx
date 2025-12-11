import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, AlertCircle } from 'lucide-react';
import { Opportunity } from '@/lib/directus';

interface OpportunityCardProps {
  opportunity: Opportunity;
  basePath?: string;
}

export default function OpportunityCard({ opportunity, basePath = '/opportunities' }: OpportunityCardProps) {
  // Handle null deadline for ongoing opportunities
  const deadline = opportunity.deadline ? new Date(opportunity.deadline) : null;
  const isUrgent = deadline ? deadline.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 : false;

  // Determine deadline display text
  const getDeadlineText = () => {
    if (opportunity.deadline_type === 'ongoing' || !deadline) {
      return 'Ongoing';
    }
    if (opportunity.deadline_type === 'flexible') {
      return `${format(deadline, 'dd MMM yyyy')} (flexible)`;
    }
    return format(deadline, 'dd MMM yyyy');
  };

  return (
    <article className="group relative bg-white border border-black/10 hover:border-cvan-orange transition-all duration-300">
      {/* Image - will be implemented later */}
      {opportunity.image_id && (
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <div className="w-full h-full bg-gray-200" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          {opportunity.wage_fee && (
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-cvan-yellow text-black">
              {opportunity.wage_fee}
            </span>
          )}
          {isUrgent && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-cvan-orange text-white">
              <AlertCircle className="h-3 w-3" />
              Urgent
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-black mb-2 group-hover:text-cvan-orange transition-colors">
          <Link href={`/opportunities/${opportunity.slug || opportunity.id}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {opportunity.title}
          </Link>
        </h3>

        {/* About */}
        {opportunity.about && (
          <p className="text-sm text-black/70 mb-4 line-clamp-2">
            {typeof opportunity.about === 'string' ? opportunity.about : ''}
          </p>
        )}

        {/* Tags - clickable to filter */}
        {((opportunity.opportunity_type_tags && opportunity.opportunity_type_tags.length > 0) ||
          (opportunity.location_tags && opportunity.location_tags.length > 0)) && (
          <div className="relative z-10 flex flex-wrap gap-2 mb-4">
            {opportunity.opportunity_type_tags?.map((tag: string) => (
              <Link
                key={tag}
                href={`${basePath}?type=${encodeURIComponent(tag)}`}
                className="tag-link inline-flex items-center px-2 py-1 text-xs font-medium bg-cvan-orange text-white capitalize hover:bg-cvan-orange/80 transition-colors"
              >
                {tag.replace(/_/g, ' ')}
              </Link>
            ))}
            {opportunity.location_tags?.map((tag: string) => (
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

        {/* Deadline Info */}
        <div className="flex items-center gap-2 text-sm text-black/60">
          <Calendar className="h-4 w-4" />
          <span>
            Deadline: {getDeadlineText()}
          </span>
        </div>
      </div>
    </article>
  );
}
