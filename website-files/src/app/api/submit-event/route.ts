import { NextRequest, NextResponse } from 'next/server';
import { createDirectus, rest, createItem, uploadFiles, staticToken } from '@directus/sdk';
import { sendEventSubmissionEmails } from '@/lib/email';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
  .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN || ''))
  .with(rest());

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 100); // Limit length
}

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get('title') as string;
    const about = formData.get('about') as string;
    const timing = formData.get('timing') as string;
    const event_date = formData.get('event_date') as string;
    const event_end_date = formData.get('event_end_date') as string | null;
    const location_address = formData.get('location_address') as string;
    const link = formData.get('link') as string;
    const contact_email = formData.get('contact_email') as string;
    const submitted_by = formData.get('submitted_by') as string;

    // Parse tag arrays (they were JSON stringified in the form)
    const event_type = JSON.parse(formData.get('event_type') as string || '[]');
    const access_tags = JSON.parse(formData.get('access_tags') as string || '[]');
    const location_tags = JSON.parse(formData.get('location_tags') as string || '[]');

    // Handle image upload
    const imageFile = formData.get('image') as File | null;
    let image_id: string | undefined;

    if (imageFile && imageFile.size > 0) {
      try {
        // Create FormData for Directus file upload
        const fileData = new FormData();
        fileData.append('file', imageFile);

        // Upload to Directus
        const uploadedFile = await directus.request(
          uploadFiles(fileData)
        );

        // Get the file ID
        if (uploadedFile && uploadedFile.id) {
          image_id = uploadedFile.id;
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue without image if upload fails
      }
    }

    // Generate slug from title
    const slug = generateSlug(title);

    // Create the event in Directus with pending status
    const eventData: any = {
      status: 'pending', // Requires admin approval
      title,
      slug,
      about,
      timing,
      event_date,
      location_address,
      link,
      contact_email,
      submitted_by,
      submitted_at: new Date().toISOString(),
      event_type: event_type.length > 0 ? event_type : null,
      access_tags: access_tags.length > 0 ? access_tags : null,
      location_tags: location_tags.length > 0 ? location_tags : null,
    };

    // Only add optional fields if they have values
    if (event_end_date) {
      eventData.event_end_date = event_end_date;
    }
    if (image_id) {
      eventData.image_id = image_id;
    }

    const createdEvent = await directus.request(
      createItem('events', eventData)
    );

    // Send notification emails (don't await - fire and forget to not slow down response)
    sendEventSubmissionEmails({
      id: createdEvent.id,
      title,
      event_date,
      location_address,
      submitted_by,
      contact_email,
      about,
    }).catch((err) => console.error('Failed to send event emails:', err));

    return NextResponse.json(
      {
        success: true,
        message: 'Event submitted successfully! It will be reviewed before being published.',
        event_id: createdEvent.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Event submission error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit event',
      },
      { status: 500 }
    );
  }
}
