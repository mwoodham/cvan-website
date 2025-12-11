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

// Schema matching Directus opportunities collection fields
export const opportunitySubmissionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  about: z.string()
    .min(10, 'Description is required')
    .refine((text) => countWords(text) <= 150, 'Description must be 150 words or fewer'),
  deadline: z.string().refine((date) => {
    // Allow "ongoing" as a special value
    if (date === 'ongoing') return true;
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, 'Deadline must be today or in the future, or select "Ongoing"'),
  deadline_type: z.enum(['specific', 'ongoing'], {
    required_error: 'Please select deadline type',
  }),
  wage_fee: z.string().min(1, 'Please specify wage/fee information or enter "N/A"'),
  location_address: z.string().min(2, 'Location is required'),
  link: z.string().url('Please enter a valid URL').min(1, 'Website URL is required'),
  contact_email: z.string().email('Please enter a valid email address'),
  submitted_by: z.string().min(2, 'Your name is required'),
  // Tags
  opportunity_type_tags: z.array(z.string()).min(1, 'Please select at least one opportunity type'),
  location_tags: z.array(z.string()).min(1, 'Please select at least one location'),
  // Image file (max 10MB, PNG/JPEG/WEBP only)
  image: imageSchema,
});

export type OpportunitySubmissionFormData = z.infer<typeof opportunitySubmissionSchema>;

// Export word counter for use in form
export { countWords };
