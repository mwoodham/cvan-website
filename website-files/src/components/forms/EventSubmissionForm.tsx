'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSubmissionSchema, type EventSubmissionFormData, countWords } from '@/lib/validations/event-submission';
import { ImageUpload } from './ImageUpload';

// Tag options matching Directus field choices
const EVENT_TYPE_OPTIONS = [
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'event', label: 'Event' },
  { value: 'talk', label: 'Talk' },
  { value: 'performance', label: 'Performance' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'online', label: 'Online' },
];

const ACCESS_OPTIONS = [
  { value: 'bsl_interpreted', label: 'BSL Interpreted' },
  { value: 'level_access', label: 'Level Access' },
  { value: 'recorded', label: 'Recorded' },
  { value: 'transcribed', label: 'Transcribed' },
  { value: 'captioned', label: 'Captioned' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'free', label: 'Free' },
  { value: 'booking_required', label: 'Booking Required' },
];

const LOCATION_OPTIONS = [
  { value: 'derbyshire', label: 'Derbyshire' },
  { value: 'leicestershire', label: 'Leicestershire' },
  { value: 'lincolnshire', label: 'Lincolnshire' },
  { value: 'northamptonshire', label: 'Northamptonshire' },
  { value: 'nottinghamshire', label: 'Nottinghamshire' },
  { value: 'rutland', label: 'Rutland' },
  { value: 'online', label: 'Online' },
];

export function EventSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EventSubmissionFormData>({
    resolver: zodResolver(eventSubmissionSchema),
    defaultValues: {
      event_type: [],
      access_tags: [],
      location_tags: [],
    },
  });

  // Watch the about field to update word count
  const aboutText = watch('about') || '';

  // Update word count when text changes
  useState(() => {
    setWordCount(countWords(aboutText));
  });

  const handleImageChange = (file: File | null) => {
    setValue('image', file || undefined);
  };

  const onSubmit = async (data: EventSubmissionFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Add all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await fetch('/api/submit-event', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setWordCount(0);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'An error occurred');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Event Details Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Event Details</h2>

        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Event Title <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-purple focus:border-transparent"
            placeholder="e.g., Contemporary Sculpture Exhibition"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="about" className="block text-sm font-semibold mb-2">
            About <span className="text-cvan-orange">*</span>
            <span className="ml-2 text-xs font-normal text-gray-600">
              ({wordCount}/80 words)
            </span>
          </label>
          <textarea
            id="about"
            {...register('about', {
              onChange: (e) => setWordCount(countWords(e.target.value)),
            })}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-purple focus:border-transparent"
            placeholder="Describe your event (maximum 80 words)"
          />
          {errors.about && (
            <p className="mt-1 text-sm text-red-600">{errors.about.message}</p>
          )}
          {wordCount > 80 && (
            <p className="mt-1 text-sm text-cvan-orange">
              Please reduce your description to 80 words or fewer
            </p>
          )}
        </div>

        <div>
          <label htmlFor="timing" className="block text-sm font-semibold mb-2">
            Timing <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="timing"
            type="text"
            {...register('timing')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-purple focus:border-transparent"
            placeholder="e.g., 10am - 5pm, Daily or opening times"
          />
          <p className="mt-1 text-xs text-gray-600">
            Event times or gallery opening times
          </p>
          {errors.timing && (
            <p className="mt-1 text-sm text-red-600">{errors.timing.message}</p>
          )}
        </div>
      </section>

      {/* Dates Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Dates</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="event_date" className="block text-sm font-semibold mb-2">
              Start Date <span className="text-cvan-orange">*</span>
            </label>
            <input
              id="event_date"
              type="date"
              {...register('event_date')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-purple focus:border-transparent"
            />
            {errors.event_date && (
              <p className="mt-1 text-sm text-red-600">{errors.event_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="event_end_date" className="block text-sm font-semibold mb-2">
              End Date <span className="text-gray-500">(optional)</span>
            </label>
            <input
              id="event_end_date"
              type="date"
              {...register('event_end_date')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-purple focus:border-transparent"
            />
            {errors.event_end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.event_end_date.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Location</h2>

        <div>
          <label htmlFor="location_address" className="block text-sm font-semibold mb-2">
            Venue & Address <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="location_address"
            type="text"
            {...register('location_address')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-purple focus:border-transparent"
            placeholder="Venue Name, Street address, City, Postcode"
          />
          {errors.location_address && (
            <p className="mt-1 text-sm text-red-600">{errors.location_address.message}</p>
          )}
        </div>
      </section>

      {/* Tags Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Event Categories</h2>

        {/* Event Type Tags */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            Event Type <span className="text-cvan-orange">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {EVENT_TYPE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  {...register('event_type')}
                  className="w-4 h-4 text-cvan-blue rounded focus:ring-cvan-blue"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.event_type && (
            <p className="mt-2 text-sm text-red-600">{errors.event_type.message}</p>
          )}
        </div>

        {/* Access Tags */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            Accessibility <span className="text-gray-500">(optional)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACCESS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  {...register('access_tags')}
                  className="w-4 h-4 text-cvan-green rounded focus:ring-cvan-green"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.access_tags && (
            <p className="mt-2 text-sm text-red-600">{errors.access_tags.message}</p>
          )}
        </div>

        {/* Location Tags */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            Location <span className="text-cvan-orange">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LOCATION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  {...register('location_tags')}
                  className="w-4 h-4 text-cvan-purple rounded focus:ring-cvan-purple"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.location_tags && (
            <p className="mt-2 text-sm text-red-600">{errors.location_tags.message}</p>
          )}
        </div>
      </section>

      {/* Image Upload Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Event Image</h2>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Upload Image <span className="text-gray-500">(optional but recommended)</span>
          </label>
          <ImageUpload
            onImageChange={handleImageChange}
            error={errors.image?.message as string}
            maxSizeMB={5}
          />
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Additional Information</h2>

        <div>
          <label htmlFor="link" className="block text-sm font-semibold mb-2">
            Event Website <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="link"
            type="url"
            {...register('link')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-purple focus:border-transparent"
            placeholder="https://example.com"
          />
          <p className="mt-1 text-xs text-gray-600">
            This will appear as "Find out more" button on the event page
          </p>
          {errors.link && (
            <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact_email" className="block text-sm font-semibold mb-2">
            Contact Email <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="contact_email"
            type="email"
            {...register('contact_email')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-purple focus:border-transparent"
            placeholder="contact@example.com"
          />
          {errors.contact_email && (
            <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
          )}
        </div>
      </section>

      {/* Submitter Information Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Your Information</h2>

        <div>
          <label htmlFor="submitted_by" className="block text-sm font-semibold mb-2">
            Your Name <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="submitted_by"
            type="text"
            {...register('submitted_by')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-purple focus:border-transparent"
            placeholder="Your name or organization"
          />
          {errors.submitted_by && (
            <p className="mt-1 text-sm text-red-600">{errors.submitted_by.message}</p>
          )}
        </div>

        <p className="text-sm text-gray-600">
          We'll review your submission and contact you at the provided email address.
        </p>
      </section>

      {/* Submit Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-cvan-green/20 border-2 border-cvan-green rounded-lg">
          <p className="font-semibold text-black">
            Event submitted successfully! We'll review it and be in touch soon.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <p className="font-semibold text-red-600">
            Error submitting event: {errorMessage}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cvan-purple text-white px-6 py-3 font-semibold rounded-lg hover:bg-cvan-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Event'}
        </button>
      </div>

      <p className="text-sm text-center text-gray-600">
        All submissions are reviewed within 2-3 business days.
      </p>
    </form>
  );
}
