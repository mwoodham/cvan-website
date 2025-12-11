import { z } from 'zod';

// Helper function to count words
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

// Image validation schema
const imageSchema = z.any()
  .refine((file) => {
    if (!file) return true; // Optional
    return file instanceof File;
  }, 'Please upload a valid image file')
  .refine((file) => {
    if (!file) return true;
    return file.size <= MAX_FILE_SIZE;
  }, 'Image must be less than 5MB')
  .refine((file) => {
    if (!file) return true;
    return ALLOWED_IMAGE_TYPES.includes(file.type);
  }, 'Only PNG, JPEG, and WEBP images are allowed')
  .optional();

// Schema matching Directus events collection fields
export const eventSubmissionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  about: z.string()
    .min(10, 'Description is required')
    .refine((text) => countWords(text) <= 80, 'Description must be 80 words or fewer'),
  timing: z.string().min(2, 'Timing is required'),
  event_date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, 'Event date must be today or in the future'),
  event_end_date: z.string().optional().nullable(),
  location_address: z.string().min(5, 'Location is required'),
  link: z.string().url('Please enter a valid URL').min(1, 'Event website URL is required'),
  contact_email: z.string().email('Please enter a valid email address'),
  submitted_by: z.string().min(2, 'Your name is required'),
  // Tag fields - arrays of string values
  event_type: z.array(z.string()).min(1, 'Please select at least one event type'),
  access_tags: z.array(z.string()).optional(),
  location_tags: z.array(z.string()).min(1, 'Please select at least one location'),
  // Image file (max 10MB, PNG/JPEG/WEBP only)
  image: imageSchema,
}).refine((data) => {
  if (data.event_end_date) {
    const start = new Date(data.event_date);
    const end = new Date(data.event_end_date);
    return end >= start;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['event_end_date'],
});

export type EventSubmissionFormData = z.infer<typeof eventSubmissionSchema>;

// Export word counter for use in form
export { countWords };
