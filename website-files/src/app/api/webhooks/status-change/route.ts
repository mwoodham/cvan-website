import { NextRequest, NextResponse } from 'next/server';
import { createDirectus, rest, readItem, staticToken } from '@directus/sdk';
import { sendTemplatedEmail } from '@/lib/email';

// Secret to verify webhook requests from Directus
const WEBHOOK_SECRET = process.env.DIRECTUS_WEBHOOK_SECRET || 'cvan-webhook-secret-2024';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
  .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN || ''))
  .with(rest());

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const { collection, keys, payload: itemData } = payload;

    // Only process if status changed to published
    if (itemData?.status !== 'published') {
      return NextResponse.json({ message: 'Not a publish event, skipping' });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const itemId = keys[0];

    if (collection === 'events') {
      // Fetch full event data from Directus
      const event = await directus.request(
        readItem('events', itemId)
      ) as { title: string; slug: string; submitted_by: string; contact_email: string };

      if (!event.contact_email) {
        console.log('No contact email for event, skipping notification');
        return NextResponse.json({ message: 'No contact email, skipping' });
      }

      const variables = {
        event_title: event.title || 'Your event',
        submitted_by: event.submitted_by || 'there',
        event_url: `${siteUrl}/events/${event.slug || itemId}`,
      };

      const result = await sendTemplatedEmail(
        'event_published',
        event.contact_email,
        variables
      );

      if (!result.success) {
        console.error('Failed to send event published email:', result.error);
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Event published email sent' });
    }

    if (collection === 'opportunities') {
      // Fetch full opportunity data from Directus
      const opportunity = await directus.request(
        readItem('opportunities', itemId)
      ) as { title: string; slug: string; submitted_by: string; contact_email: string };

      if (!opportunity.contact_email) {
        console.log('No contact email for opportunity, skipping notification');
        return NextResponse.json({ message: 'No contact email, skipping' });
      }

      const variables = {
        opportunity_title: opportunity.title || 'Your opportunity',
        submitted_by: opportunity.submitted_by || 'there',
        opportunity_url: `${siteUrl}/opportunities/${opportunity.slug || itemId}`,
      };

      const result = await sendTemplatedEmail(
        'opportunity_published',
        opportunity.contact_email,
        variables
      );

      if (!result.success) {
        console.error('Failed to send opportunity published email:', result.error);
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Opportunity published email sent' });
    }

    return NextResponse.json({ message: 'Collection not handled' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
