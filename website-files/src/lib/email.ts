import { Resend } from 'resend';
import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';

const resend = new Resend(process.env.RESEND_API_KEY);

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
  .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN || ''))
  .with(rest());

// Admin email for notifications
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'info@cvaneastmidlands.org';

interface EmailTemplate {
  id: number;
  template_key: string;
  name: string;
  subject: string;
  body: string;
  from_name: string;
  from_email: string;
}

/**
 * Fetch an email template from Directus by its key
 */
async function getEmailTemplate(templateKey: string): Promise<EmailTemplate | null> {
  try {
    const templates = await directus.request(
      readItems('email_templates', {
        filter: { template_key: { _eq: templateKey } },
        limit: 1,
      })
    );
    return templates[0] as EmailTemplate || null;
  } catch (error) {
    console.error(`Failed to fetch email template: ${templateKey}`, error);
    return null;
  }
}

/**
 * Replace placeholders in template with actual values
 * Placeholders use {{variable_name}} format
 */
function replacePlaceholders(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, value || '');
  }
  return result;
}

/**
 * Send an email using a template from Directus
 */
export async function sendTemplatedEmail(
  templateKey: string,
  to: string,
  variables: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    const template = await getEmailTemplate(templateKey);

    if (!template) {
      console.error(`Email template not found: ${templateKey}`);
      return { success: false, error: `Template not found: ${templateKey}` };
    }

    const subject = replacePlaceholders(template.subject, variables);
    const htmlBody = replacePlaceholders(template.body, variables);

    const { error } = await resend.emails.send({
      from: `${template.from_name} <${template.from_email}>`,
      to: [to],
      subject: subject,
      html: htmlBody,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send event submission notification emails
 */
export async function sendEventSubmissionEmails(eventData: {
  id: number;
  title: string;
  event_date: string;
  location_address: string;
  submitted_by: string;
  contact_email: string;
  about: string;
}): Promise<void> {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

  const variables = {
    event_title: eventData.title,
    event_date: new Date(eventData.event_date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    location_address: eventData.location_address,
    submitted_by: eventData.submitted_by,
    contact_email: eventData.contact_email,
    about: eventData.about,
    admin_url: `${directusUrl}/admin/content/events/${eventData.id}`,
  };

  // Send admin notification
  const adminResult = await sendTemplatedEmail(
    'event_submission_admin',
    ADMIN_EMAIL,
    variables
  );
  if (!adminResult.success) {
    console.error('Failed to send admin notification:', adminResult.error);
  }

  // Send confirmation to submitter
  const confirmResult = await sendTemplatedEmail(
    'event_submission_confirmation',
    eventData.contact_email,
    variables
  );
  if (!confirmResult.success) {
    console.error('Failed to send confirmation email:', confirmResult.error);
  }
}

/**
 * Send opportunity submission notification emails
 */
export async function sendOpportunitySubmissionEmails(opportunityData: {
  id: number;
  title: string;
  deadline: string | null;
  deadline_type: string;
  location_address: string;
  wage_fee: string;
  submitted_by: string;
  contact_email: string;
  about: string;
}): Promise<void> {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

  const deadlineDisplay = opportunityData.deadline_type === 'ongoing'
    ? 'Ongoing'
    : opportunityData.deadline
      ? new Date(opportunityData.deadline).toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Not specified';

  const variables = {
    opportunity_title: opportunityData.title,
    deadline: deadlineDisplay,
    location_address: opportunityData.location_address,
    wage_fee: opportunityData.wage_fee,
    submitted_by: opportunityData.submitted_by,
    contact_email: opportunityData.contact_email,
    about: opportunityData.about,
    admin_url: `${directusUrl}/admin/content/opportunities/${opportunityData.id}`,
  };

  // Send admin notification
  const adminResult = await sendTemplatedEmail(
    'opportunity_submission_admin',
    ADMIN_EMAIL,
    variables
  );
  if (!adminResult.success) {
    console.error('Failed to send admin notification:', adminResult.error);
  }

  // Send confirmation to submitter
  const confirmResult = await sendTemplatedEmail(
    'opportunity_submission_confirmation',
    opportunityData.contact_email,
    variables
  );
  if (!confirmResult.success) {
    console.error('Failed to send confirmation email:', confirmResult.error);
  }
}
