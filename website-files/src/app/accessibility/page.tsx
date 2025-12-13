import { PageHero } from '@/components/PageHero';
import { getAccessibilityPage } from '@/lib/directus';
import { format } from 'date-fns';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'Our commitment to making the CVAN East Midlands website accessible to everyone',
};

// Revalidate every 5 minutes - legal content changes infrequently
export const revalidate = 300;

// Default accessibility content if CMS not configured
const defaultContent = `
<h2>Our Commitment</h2>
<p>CVAN East Midlands is committed to making our website accessible to everyone, including people with disabilities. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.</p>

<h2>Accessibility Features</h2>
<p>We have implemented the following features to improve accessibility:</p>

<h3>Navigation and Structure</h3>
<ul>
  <li>Semantic HTML structure with proper heading hierarchy</li>
  <li>Clear, consistent navigation throughout the site</li>
  <li>Descriptive link text that makes sense out of context</li>
  <li>Logical tab order for keyboard navigation</li>
</ul>

<h3>Visual Design</h3>
<ul>
  <li>High contrast colour combinations for text readability</li>
  <li>Text can be resized up to 200% without loss of content or functionality</li>
  <li>Focus indicators visible on interactive elements</li>
  <li>No content that flashes more than three times per second</li>
</ul>

<h3>Images and Media</h3>
<ul>
  <li>Alternative text provided for informative images</li>
  <li>Decorative images are marked as such for screen readers</li>
</ul>

<h3>Forms</h3>
<ul>
  <li>Form fields have associated labels</li>
  <li>Required fields are clearly indicated</li>
  <li>Error messages are descriptive and helpful</li>
  <li>Form validation provides clear feedback</li>
</ul>

<h3>Assistive Technology Support</h3>
<ul>
  <li>ARIA labels used where appropriate</li>
  <li>Screen reader compatible content structure</li>
  <li>Keyboard-accessible interactive elements</li>
</ul>

<h2>Known Limitations</h2>
<p>We are aware of some accessibility limitations on our website:</p>
<ul>
  <li><strong>Calendly Widget:</strong> The embedded Calendly booking widget on our Mentoring page is a third-party component. While Calendly maintains their own accessibility standards, we cannot guarantee full accessibility compliance for this embedded content.</li>
  <li><strong>User-Submitted Content:</strong> Events and opportunities submitted by users may not always meet accessibility standards. We encourage submitters to provide accessible content where possible.</li>
  <li><strong>PDF Documents:</strong> Some linked documents may not be fully accessible. Please contact us if you need information in an alternative format.</li>
</ul>

<h2>Browser and Device Compatibility</h2>
<p>This website is designed to work with:</p>
<ul>
  <li>Modern web browsers (Chrome, Firefox, Safari, Edge)</li>
  <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
  <li>Mobile devices and tablets</li>
  <li>Keyboard-only navigation</li>
</ul>

<h2>Feedback and Contact</h2>
<p>We welcome your feedback on the accessibility of our website. If you encounter any barriers or have suggestions for improvement, please contact us:</p>
<ul>
  <li>Email: <a href="mailto:info@cvaneastmidlands.co.uk">info@cvaneastmidlands.co.uk</a></li>
</ul>
<p>When contacting us about accessibility issues, please include:</p>
<ul>
  <li>The web address (URL) of the page</li>
  <li>A description of the problem you encountered</li>
  <li>The assistive technology you were using (if applicable)</li>
</ul>
<p>We aim to respond to accessibility feedback within 5 working days.</p>

<h2>Enforcement Procedure</h2>
<p>If you are not satisfied with our response to your accessibility concern, you can contact the Equality Advisory Support Service (EASS) at <a href="https://www.equalityadvisoryservice.com/" target="_blank" rel="noopener noreferrer">equalityadvisoryservice.com</a>.</p>

<h2>Technical Information</h2>
<p>This website is built using:</p>
<ul>
  <li>Next.js (React framework)</li>
  <li>Semantic HTML5</li>
  <li>CSS with Tailwind CSS framework</li>
  <li>Progressive enhancement principles</li>
</ul>

<h2>Assessment and Testing</h2>
<p>We regularly review our website for accessibility issues using:</p>
<ul>
  <li>Manual keyboard navigation testing</li>
  <li>Screen reader testing</li>
  <li>Automated accessibility scanning tools</li>
  <li>User feedback and testing</li>
</ul>

<h2>Continuous Improvement</h2>
<p>We are committed to continually improving the accessibility of our website. This statement will be reviewed and updated regularly as we make improvements.</p>
`;

export default async function AccessibilityPage() {
  const pageContent = await getAccessibilityPage();

  return (
    <>
      <PageHero
        title={pageContent?.hero_title || 'Accessibility Statement'}
        description={pageContent?.hero_description || 'Our commitment to making this website accessible to everyone'}
        bgColor="green"
        textColor="blue"
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
