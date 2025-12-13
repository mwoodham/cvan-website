import { PageHero } from '@/components/PageHero';
import { getPrivacyPolicyPage } from '@/lib/directus';
import { format } from 'date-fns';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How CVAN East Midlands collects, uses, and protects your personal information',
};

// Revalidate every 5 minutes - legal content changes infrequently
export const revalidate = 300;

// Default privacy policy content if CMS not configured
const defaultContent = `
<h2>Introduction</h2>
<p>CVAN East Midlands ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website and services.</p>

<h2>Information We Collect</h2>
<h3>Event and Opportunity Submissions</h3>
<p>When you submit an event or opportunity to our platform, we collect:</p>
<ul>
  <li>Your name or organisation name</li>
  <li>Contact email address</li>
  <li>Event/opportunity details (title, description, dates, location)</li>
  <li>Optional images you upload</li>
</ul>

<h3>Mentoring Bookings</h3>
<p>When you book a mentoring session through our Calendly integration, Calendly collects your name and email address. Please refer to <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer">Calendly's Privacy Policy</a> for details on how they handle your data.</p>

<h2>How We Use Your Information</h2>
<p>We use the information you provide to:</p>
<ul>
  <li>Review and publish event and opportunity listings on our website</li>
  <li>Contact you regarding your submissions (approval, queries, or publication notifications)</li>
  <li>Send administrative emails related to your submissions</li>
  <li>Improve our services and website functionality</li>
</ul>

<h2>Data Storage and Security</h2>
<p>Your data is stored securely using industry-standard practices:</p>
<ul>
  <li>Our database is hosted on Supabase with PostgreSQL encryption</li>
  <li>Images are stored securely on Supabase Storage</li>
  <li>All data transmission uses HTTPS encryption</li>
  <li>Access to personal data is restricted to authorised administrators</li>
</ul>

<h2>Data Retention</h2>
<p>We retain your submitted content as follows:</p>
<ul>
  <li><strong>Published events:</strong> The event record and any associated uploaded images are automatically and permanently deleted 5 days after the event end date (or event start date if no end date was provided).</li>
  <li><strong>Published opportunities:</strong> The opportunity record and any associated uploaded images are automatically and permanently deleted 5 days after the deadline date. Opportunities marked as "ongoing" are retained until manually removed.</li>
  <li><strong>Pending submissions:</strong> Retained until reviewed by our team and either published or rejected.</li>
  <li><strong>Contact information:</strong> Your name and email address are stored with your submission and deleted when the associated event or opportunity is removed.</li>
</ul>
<p>This automated deletion process runs daily. Once deleted, data cannot be recovered.</p>

<h2>Third-Party Services</h2>
<p>We use the following third-party services:</p>
<ul>
  <li><strong>Calendly:</strong> For mentoring session bookings. See their <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
  <li><strong>Resend:</strong> For sending email notifications about your submissions.</li>
  <li><strong>Supabase:</strong> For secure data and image storage.</li>
</ul>
<p>We do not sell your personal information to third parties.</p>

<h2>Cookies and Tracking</h2>
<p>Our website uses essential cookies required for basic functionality. We do not use advertising or marketing cookies. Third-party embeds (such as Calendly) may set their own cookies according to their privacy policies.</p>

<h2>Your Rights</h2>
<p>Under UK GDPR, you have the right to:</p>
<ul>
  <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
  <li><strong>Rectification:</strong> Request correction of inaccurate personal data</li>
  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
  <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
  <li><strong>Object:</strong> Object to processing of your personal data</li>
</ul>
<p>To exercise any of these rights, please contact us at <a href="mailto:info@cvaneastmidlands.co.uk">info@cvaneastmidlands.co.uk</a>.</p>

<h2>Children's Privacy</h2>
<p>Our services are not directed at children under 16. We do not knowingly collect personal information from children under 16.</p>

<h2>Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>

<h2>Contact Us</h2>
<p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
<ul>
  <li>Email: <a href="mailto:info@cvaneastmidlands.co.uk">info@cvaneastmidlands.co.uk</a></li>
</ul>
`;

export default async function PrivacyPolicyPage() {
  const pageContent = await getPrivacyPolicyPage();

  return (
    <>
      <PageHero
        title={pageContent?.hero_title || 'Privacy Policy'}
        description={pageContent?.hero_description || 'How we collect, use, and protect your information'}
        bgColor="blue"
        textColor="yellow"
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {pageContent?.last_updated && (
            <p className="text-sm text-black/60 mb-8">
              Last updated: {format(new Date(pageContent.last_updated), 'd MMMM yyyy')}
            </p>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-black/80 prose-li:text-black/80 prose-a:text-cvan-blue prose-a:underline hover:prose-a:text-cvan-purple prose-ul:my-4 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: pageContent?.content || defaultContent }}
          />
        </div>
      </section>
    </>
  );
}
