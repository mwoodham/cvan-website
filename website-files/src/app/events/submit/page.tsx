import { EventSubmissionForm } from '@/components/forms/EventSubmissionForm';
import { PageHero } from '@/components/PageHero';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit an Event',
  description: 'Submit your exhibition or event to be featured on CVAN East Midlands',
};

export default function SubmitEventPage() {
  return (
    <>
      <PageHero
        title="Submit an Event"
        description="Share your exhibition or event with the East Midlands visual arts community"
        bgColor="purple"
        textColor="green"
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-8 rounded-lg bg-cvan-cream p-6">
            <h2 className="text-lg font-bold mb-2">Before You Submit</h2>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li>Events must be relevant to the visual arts sector in the East Midlands</li>
              <li>All submissions are reviewed before being published</li>
              <li>You'll receive an email confirmation once your submission is approved</li>
              <li>Please ensure all information is accurate and complete</li>
            </ul>
          </div>

          <EventSubmissionForm />
        </div>
      </section>
    </>
  );
}
