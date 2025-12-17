import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { getActivityBySlug, tagNameToSlug } from '@/lib/directus';

// Revalidate every 60 seconds - content edits appear quickly
export const revalidate = 60;

interface ActivityPageProps {
  params: {
    slug: string;
  };
  searchParams: Promise<{ from?: string }>;
}

export default async function ActivityPage({ params, searchParams }: ActivityPageProps) {
  const { slug } = await params;
  const { from: fromTag } = await searchParams;
  const article = await getActivityBySlug(slug);

  // Build back link - if coming from a tag filter, go back to that filter
  const backLink = fromTag ? `/activity?tag=${encodeURIComponent(fromTag)}` : '/activity';

  if (!article) {
    notFound();
  }

  const publishedDate = article.published_at ? new Date(article.published_at) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-cvan-green">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-6">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-black/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Activity
          </Link>
        </div>
      </div>

      {/* Hero Section with Image Background */}
      {article.featured_image_id && (
        <div className="relative h-[400px] lg:h-[500px] overflow-hidden bg-gray-900">
          <img
            src={`/assets/${article.featured_image_id}?width=1920&height=800&fit=cover&t=${article.updated_at}`}
            alt={article.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-4xl px-6 lg:px-8 pb-12 w-full">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl mb-4 leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <article className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
        {/* Header for articles without image */}
        {!article.featured_image_id && (
          <header className="mb-8">
            <h1 className="text-5xl font-black tracking-tight text-black sm:text-6xl lg:text-7xl mb-6 leading-tight">
              {article.title}
            </h1>
          </header>
        )}

        {/* Meta Info */}
        <header className="mb-8">
          <div className="flex flex-col gap-3 text-base text-black/70">
            {publishedDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                <span>{format(publishedDate, 'EEEE, dd MMMM yyyy')}</span>
              </div>
            )}

            {/* Tags - clickable to filter */}
            {((article.generic_tags && article.generic_tags.length > 0) ||
              (article.project_tags && article.project_tags.length > 0)) && (
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 mt-1" />
                <div className="flex flex-wrap gap-2">
                  {article.generic_tags?.map((tag) => (
                    <Link
                      key={tag}
                      href={`/activity?tag=${encodeURIComponent(tagNameToSlug(tag))}`}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium bg-cvan-blue text-white hover:bg-cvan-blue/80 transition-colors"
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </Link>
                  ))}
                  {article.project_tags?.map((tag) => (
                    <Link
                      key={tag}
                      href={`/activity?tag=${encodeURIComponent(tagNameToSlug(tag))}`}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium bg-cvan-green text-black hover:bg-cvan-green/80 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Excerpt */}
        {article.excerpt && (
          <div className="text-xl text-black/80 leading-relaxed mb-8 font-medium">
            {article.excerpt}
          </div>
        )}

        {/* Content */}
        {article.content && typeof article.content === 'string' && (
          <div
            className="prose prose-lg max-w-none mb-12 prose-headings:font-bold prose-a:text-cvan-blue prose-a:underline hover:prose-a:text-cvan-purple"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}
      </article>
    </div>
  );
}
