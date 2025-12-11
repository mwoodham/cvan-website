import { OpportunitySubmissionForm } from '@/components/forms/OpportunitySubmissionForm';
import { PageHero } from '@/components/PageHero';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit an Opportunity',
  description: 'Submit a job or opportunity to be featured on CVAN East Midlands',
};

export default function SubmitOpportunityPage() {
  return (
    <>
      <PageHero
        title="Submit an Opportunity"
        description="Share jobs, awards, bursaries, and opportunities with the East Midlands visual arts community"
        bgColor="orange"
        textColor="beige"
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-8 rounded-lg bg-cvan-cream p-6">
            <h2 className="text-lg font-bold mb-2">Before You Submit</h2>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li>Opportunities must be relevant to visual arts professionals</li>
              <li>All submissions are reviewed before being published</li>
              <li>You'll receive an email confirmation once your submission is approved</li>
              <li>Please ensure all information is accurate and complete</li>
              <li>Clearly specify the deadline or mark as "ongoing"</li>
            </ul>
          </div>

          <OpportunitySubmissionForm />
        </div>
      </section>
    </>
  );
}
