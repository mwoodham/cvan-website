import { NextRequest, NextResponse } from 'next/server';
import { createDirectus, rest, createItem, uploadFiles, staticToken } from '@directus/sdk';
import { sendOpportunitySubmissionEmails } from '@/lib/email';

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
    const deadline = formData.get('deadline') as string;
    const deadline_type = formData.get('deadline_type') as string;
    const wage_fee = formData.get('wage_fee') as string;
    const location_address = formData.get('location_address') as string;
    const link = formData.get('link') as string;
    const contact_email = formData.get('contact_email') as string;
    const submitted_by = formData.get('submitted_by') as string;

    // Parse tag arrays from JSON
    const opportunity_type_tags = JSON.parse(formData.get('opportunity_type_tags') as string || '[]');
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

    // Create the opportunity in Directus with pending status
    const opportunityData: any = {
      status: 'pending', // Requires admin approval
      title,
      slug,
      about,
      deadline_type,
      wage_fee,
      location_address,
      link,
      contact_email,
      submitted_by,
      submitted_at: new Date().toISOString(),
      opportunity_type_tags,
      location_tags,
    };

    // Handle deadline based on type
    if (deadline_type === 'specific' && deadline) {
      opportunityData.deadline = deadline;
    }

    // Only add image if uploaded
    if (image_id) {
      opportunityData.image_id = image_id;
    }

    const createdOpportunity = await directus.request(
      createItem('opportunities', opportunityData)
    );

    // Send notification emails (don't await - fire and forget to not slow down response)
    sendOpportunitySubmissionEmails({
      id: createdOpportunity.id,
      title,
      deadline: deadline || null,
      deadline_type,
      location_address,
      wage_fee,
      submitted_by,
      contact_email,
      about,
    }).catch((err) => console.error('Failed to send opportunity emails:', err));

    return NextResponse.json(
      {
        success: true,
        message: 'Opportunity submitted successfully! It will be reviewed before being published.',
        opportunity_id: createdOpportunity.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Opportunity submission error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit opportunity',
      },
      { status: 500 }
    );
  }
}
