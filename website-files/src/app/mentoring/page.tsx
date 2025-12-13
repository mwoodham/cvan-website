import { PageHero } from '@/components/PageHero';
import { getMentoringPage } from '@/lib/directus';
import CalendlyEmbed from '@/components/CalendlyEmbed';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentoring',
  description: 'Professional development and mentoring for visual arts practitioners',
};

// Revalidate every 5 minutes - singleton content changes infrequently
export const revalidate = 300;

export default async function MentoringPage() {
  const mentoringContent = await getMentoringPage();
  return (
    <>
      <PageHero
        title={mentoringContent?.hero_title || 'Mentoring'}
        description={mentoringContent?.hero_description || 'Professional development and support for visual arts practitioners'}
        bgColor="blue"
        textColor="yellow"
        graphicColor="yellow"
        graphicArrangement="support"
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {mentoringContent?.about_programme_title && (
              <>
                <h2 className="text-3xl font-bold mb-4">{mentoringContent.about_programme_title}</h2>
                {mentoringContent.about_programme_content && (
                  <div
                    className="text-lg text-black/80 mb-8"
                    dangerouslySetInnerHTML={{ __html: mentoringContent.about_programme_content }}
                  />
                )}
              </>
            )}

            {mentoringContent?.who_can_apply_title && (
              <>
                <h2 className="text-3xl font-bold mb-4">{mentoringContent.who_can_apply_title}</h2>
                {mentoringContent.who_can_apply_content && (
                  <div
                    className="text-lg text-black/80 mb-8"
                    dangerouslySetInnerHTML={{ __html: mentoringContent.who_can_apply_content }}
                  />
                )}
              </>
            )}

            {mentoringContent?.what_we_offer_title && (
              <>
                <h2 className="text-3xl font-bold mb-4">{mentoringContent.what_we_offer_title}</h2>
                {mentoringContent.what_we_offer_content && (
                  <div
                    className="text-lg text-black/80 mb-8"
                    dangerouslySetInnerHTML={{ __html: mentoringContent.what_we_offer_content }}
                  />
                )}
              </>
            )}

            {mentoringContent?.get_involved_title && (
              <>
                <h2 className="text-3xl font-bold mb-4">{mentoringContent.get_involved_title}</h2>
                {mentoringContent.get_involved_content && (
                  <div
                    className="text-lg text-black/80"
                    dangerouslySetInnerHTML={{ __html: mentoringContent.get_involved_content }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Calendly Booking Section */}
      {mentoringContent?.calendly_url && (
        <section className="py-16 lg:py-24 bg-cvan-cream">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Book a Session</h2>
            <CalendlyEmbed url={mentoringContent.calendly_url} />
          </div>
        </section>
      )}
    </>
  );
}
