'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { opportunitySubmissionSchema, type OpportunitySubmissionFormData, countWords } from '@/lib/validations/opportunity-submission';
import { ImageUpload } from './ImageUpload';

export function OpportunitySubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [deadlineType, setDeadlineType] = useState<'specific' | 'ongoing'>('specific');
  const [aboutWordCount, setAboutWordCount] = useState(0);
  const [selectedOpportunityTypes, setSelectedOpportunityTypes] = useState<string[]>([]);
  const [selectedLocationTags, setSelectedLocationTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<OpportunitySubmissionFormData>({
    resolver: zodResolver(opportunitySubmissionSchema),
    defaultValues: {
      deadline_type: 'specific',
    },
  });

  const aboutField = watch('about');

  useEffect(() => {
    if (aboutField) {
      setAboutWordCount(countWords(aboutField));
    } else {
      setAboutWordCount(0);
    }
  }, [aboutField]);

  const handleImageChange = (file: File | null) => {
    setValue('image', file || undefined);
  };

  const onSubmit = async (data: OpportunitySubmissionFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData();
      
      formData.append('title', data.title);
      formData.append('about', data.about);
      formData.append('deadline_type', data.deadline_type);
      formData.append('deadline', data.deadline);
      formData.append('wage_fee', data.wage_fee);
      formData.append('location_address', data.location_address);
      formData.append('link', data.link);
      formData.append('contact_email', data.contact_email);
      formData.append('submitted_by', data.submitted_by);

      // Add tags as JSON arrays
      formData.append('opportunity_type_tags', JSON.stringify(data.opportunity_type_tags));
      formData.append('location_tags', JSON.stringify(data.location_tags));

      if (data.image) {
        // Handle both File object and FileList
        const imageFile = data.image instanceof File ? data.image : data.image[0];
        if (imageFile) {
          formData.append('image', imageFile);
        }
      }

      const response = await fetch('/api/submit-opportunity', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setAboutWordCount(0);
        setDeadlineType('specific');
        setSelectedOpportunityTypes([]);
        setSelectedLocationTags([]);
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
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Opportunity Details</h2>

        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Opportunity Title <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-orange focus:border-transparent"
            placeholder="e.g., Artist Residency Programme"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="about" className="block text-sm font-semibold mb-2">
            Description <span className="text-cvan-orange">*</span>
            <span className="ml-2 text-sm font-normal text-gray-600">
              ({aboutWordCount}/150 words)
            </span>
          </label>
          <textarea
            id="about"
            rows={6}
            {...register('about')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-orange focus:border-transparent"
            placeholder="Provide a detailed description of the opportunity..."
          />
          {errors.about && (
            <p className="mt-1 text-sm text-red-600">{errors.about.message}</p>
          )}
        </div>

        <div className="overflow-hidden">
          <label className="block text-sm font-semibold mb-2">
            Deadline Type <span className="text-cvan-orange">*</span>
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="specific"
                {...register('deadline_type')}
                onChange={(e) => {
                  setDeadlineType(e.target.value as 'specific');
                  setValue('deadline', ''); // Clear deadline when switching to specific
                }}
                className="mr-2"
              />
              <span>Specific Date</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="ongoing"
                {...register('deadline_type')}
                onChange={(e) => {
                  setDeadlineType(e.target.value as 'ongoing');
                  setValue('deadline', 'ongoing'); // Set deadline to 'ongoing'
                }}
                className="mr-2"
              />
              <span>Ongoing</span>
            </label>
          </div>

          {deadlineType === 'specific' && (
            <div className="min-w-0">
              <input
                id="deadline"
                type="date"
                {...register('deadline')}
                className="w-full max-w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-orange focus:border-transparent"
              />
            </div>
          )}

          {errors.deadline && (
            <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="wage_fee" className="block text-sm font-semibold mb-2">
            Wage/Fee <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="wage_fee"
            type="text"
            {...register('wage_fee')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-orange focus:border-transparent"
            placeholder="e.g., £2000, Membership fee, N/A"
          />
          <p className="mt-1 text-sm text-gray-600">
            Enter wage/fee amount or non-monetary terms (e.g., "Membership", "N/A")
          </p>
          {errors.wage_fee && (
            <p className="mt-1 text-sm text-red-600">{errors.wage_fee.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location_address" className="block text-sm font-semibold mb-2">
            Location <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="location_address"
            type="text"
            {...register('location_address')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-orange focus:border-transparent"
            placeholder="e.g., Nottingham, UK or Remote"
          />
          {errors.location_address && (
            <p className="mt-1 text-sm text-red-600">{errors.location_address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">
            Opportunity Type <span className="text-cvan-orange">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'award', label: 'Award' },
              { value: 'bursary', label: 'Bursary' },
              { value: 'job', label: 'Job' },
              { value: 'development', label: 'Development' },
              { value: 'membership', label: 'Membership' },
              { value: 'voluntary_role', label: 'Voluntary Role' },
              { value: 'trustee', label: 'Trustee' },
              { value: 'commission', label: 'Commission' },
              { value: 'residency', label: 'Residency' },
              { value: 'evaluator', label: 'Evaluator' },
              { value: 'facilitator', label: 'Facilitator' },
              { value: 'training', label: 'Training' },
              { value: 'grant', label: 'Grant' },
              { value: 'studio', label: 'Studio' },
              { value: 'mentoring', label: 'Mentoring' },
              { value: 'internship', label: 'Internship' },
            ].map((type) => (
              <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={type.value}
                  checked={selectedOpportunityTypes.includes(type.value)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...selectedOpportunityTypes, type.value]
                      : selectedOpportunityTypes.filter((t) => t !== type.value);
                    setSelectedOpportunityTypes(newTypes);
                    setValue('opportunity_type_tags', newTypes);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-cvan-orange focus:ring-cvan-orange"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
          {errors.opportunity_type_tags && (
            <p className="mt-2 text-sm text-red-600">{errors.opportunity_type_tags.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">
            Location Tags <span className="text-cvan-orange">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'derbyshire', label: 'Derbyshire' },
              { value: 'leicestershire', label: 'Leicestershire' },
              { value: 'lincolnshire', label: 'Lincolnshire' },
              { value: 'northamptonshire', label: 'Northamptonshire' },
              { value: 'nottinghamshire', label: 'Nottinghamshire' },
              { value: 'rutland', label: 'Rutland' },
              { value: 'remote', label: 'Remote' },
            ].map((location) => (
              <label key={location.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={location.value}
                  checked={selectedLocationTags.includes(location.value)}
                  onChange={(e) => {
                    const newLocations = e.target.checked
                      ? [...selectedLocationTags, location.value]
                      : selectedLocationTags.filter((l) => l !== location.value);
                    setSelectedLocationTags(newLocations);
                    setValue('location_tags', newLocations);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-cvan-orange focus:ring-cvan-orange"
                />
                <span className="text-sm">{location.label}</span>
              </label>
            ))}
          </div>
          {errors.location_tags && (
            <p className="mt-2 text-sm text-red-600">{errors.location_tags.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-semibold mb-2">
            Website URL <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="link"
            type="url"
            {...register('link')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-orange focus:border-transparent"
            placeholder="https://example.com"
          />
          <p className="mt-1 text-sm text-gray-600">
            This will be displayed as "Find out more" on the opportunity listing
          </p>
          {errors.link && (
            <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
          )}
        </div>

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

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Contact Information</h2>

        <div>
          <label htmlFor="contact_email" className="block text-sm font-semibold mb-2">
            Contact Email <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="contact_email"
            type="email"
            {...register('contact_email')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-orange focus:border-transparent"
            placeholder="contact@example.com"
          />
          {errors.contact_email && (
            <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="submitted_by" className="block text-sm font-semibold mb-2">
            Your Name <span className="text-cvan-orange">*</span>
          </label>
          <input
            id="submitted_by"
            type="text"
            {...register('submitted_by')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvan-orange focus:border-transparent"
            placeholder="Your full name"
          />
          {errors.submitted_by && (
            <p className="mt-1 text-sm text-red-600">{errors.submitted_by.message}</p>
          )}
        </div>
      </section>

      {submitStatus === 'success' && (
        <div className="rounded-lg bg-green-50 p-6 border border-green-200">
          <h3 className="text-lg font-bold text-green-900 mb-2">Submission Successful!</h3>
          <p className="text-green-800">
            Thank you for submitting your opportunity. It will be reviewed by our team before being published.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="rounded-lg bg-red-50 p-6 border border-red-200">
          <h3 className="text-lg font-bold text-red-900 mb-2">Submission Failed</h3>
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cvan-orange text-white px-6 py-3 font-semibold rounded-lg hover:bg-cvan-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Opportunity'}
        </button>
      </div>

      <p className="text-sm text-center text-gray-600">
        All submissions are reviewed within 2-3 business days.
      </p>
    </form>
  );
}
