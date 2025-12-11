import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { ActivityArticle, tagNameToSlug } from '@/lib/directus';

interface ActivityCardProps {
  article: ActivityArticle;
  currentTagFilter?: string;
}

export default function ActivityCard({ article, currentTagFilter }: ActivityCardProps) {
  const publishedDate = article.published_at ? new Date(article.published_at) : null;
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
  const articleLink = currentTagFilter
    ? `/activity/${article.slug}?from=${encodeURIComponent(currentTagFilter)}`
    : `/activity/${article.slug}`;

  return (
    <article className="group relative bg-white border border-black/10 hover:border-cvan-green transition-all duration-300">
      {/* Featured Image */}
      {article.featured_image_id && (
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            src={`${directusUrl}/assets/${article.featured_image_id}?width=600&height=338&fit=cover`}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-black mb-2 group-hover:text-cvan-green transition-colors">
          <Link href={articleLink}>
            <span className="absolute inset-0" aria-hidden="true" />
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-black/70 mb-4 line-clamp-2">{article.excerpt}</p>
        )}

        {/* Tags - clickable to filter */}
        {((article.generic_tags && article.generic_tags.length > 0) ||
          (article.project_tags && article.project_tags.length > 0)) && (
          <div className="relative z-10 flex flex-wrap gap-2 mb-4">
            {article.generic_tags?.map((tag: string) => (
              <Link
                key={tag}
                href={`/activity?tag=${encodeURIComponent(tagNameToSlug(tag))}`}
                className="tag-link inline-flex items-center px-2 py-1 text-xs font-medium bg-cvan-green text-black capitalize hover:bg-cvan-green/80 transition-colors"
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </Link>
            ))}
            {article.project_tags?.map((tag: string) => (
              <Link
                key={tag}
                href={`/activity?tag=${encodeURIComponent(tagNameToSlug(tag))}`}
                className="tag-link inline-flex items-center px-2 py-1 text-xs font-medium bg-cvan-blue text-white hover:bg-cvan-blue/80 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Meta Info */}
        {publishedDate && (
          <div className="flex items-center gap-2 text-sm text-black/60">
            <Calendar className="h-4 w-4" />
            <span>{format(publishedDate, 'dd MMM yyyy')}</span>
          </div>
        )}
      </div>
    </article>
  );
}
