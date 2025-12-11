import { createDirectus, rest, readItems, readItem, readSingleton, staticToken } from '@directus/sdk';

// Type definitions for our Directus collections
export type Event = {
  id: number;
  status: string;
  title: string;
  slug?: string;
  about: any;
  timing: string;
  event_date: string;
  event_end_date?: string;
  location_address: string;
  image_id?: string; // UUID pointing to directus_files
  link: string;
  contact_email: string;
  submitted_by: string;
  submitted_at: string;
  admin_notes?: any;
  created_at: string;
  updated_at: string;
  event_type?: string[];
  access_tags?: string[];
  location_tags?: string[];
};

export type Opportunity = {
  id: number;
  status: string;
  title: string;
  slug?: string;
  about: any;
  deadline: string;
  deadline_type: string;
  wage_fee: string;
  location_address: string;
  image_id?: string; // UUID pointing to directus_files
  link: string;
  contact_email: string;
  submitted_by: string;
  submitted_at: string;
  admin_notes?: any;
  created_at: string;
  updated_at: string;
  opportunity_type_tags?: string[];
  location_tags?: string[];
};

export type ActivityArticle = {
  id: number;
  status: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: any;
  featured_image_id?: string; // UUID pointing to directus_files
  author_id?: number;
  is_archive: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  generic_tags?: string[];
  project_tags?: string[];
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio?: any;
  type: string;
  photo_id?: string; // UUID pointing to directus_files
  email?: string;
  order: number;
  created_at: string;
  updated_at: string;
};

export type HomePage = {
  id: number;
  hero_title: string;
  hero_subtitle?: string;
  hero_cta_primary_text?: string;
  hero_cta_primary_link?: string;
  hero_cta_secondary_text?: string;
  hero_cta_secondary_link?: string;
  activity_section_title?: string;
  activity_section_description?: string;
  events_section_title?: string;
  events_section_description?: string;
  opportunities_section_title?: string;
  opportunities_section_description?: string;
};

export type AboutPage = {
  id: number;
  hero_title: string;
  hero_description?: string;
  who_we_are_title?: string;
  who_we_are_content?: any;
  what_we_do_title?: string;
  what_we_do_content?: any;
  how_we_work_title?: string;
  how_we_work_content?: any;
  national_network_title?: string;
  national_network_content?: any;
  accessibility_title?: string;
  accessibility_content?: any;
  steering_group_description?: any;
};

export type MentoringPage = {
  id: number;
  hero_title: string;
  hero_description?: string;
  about_programme_title?: string;
  about_programme_content?: any;
  who_can_apply_title?: string;
  who_can_apply_content?: any;
  what_we_offer_title?: string;
  what_we_offer_content?: any;
  get_involved_title?: string;
  get_involved_content?: any;
  calendly_url?: string;
};

export type EventSubmissionForm = {
  id: number;
  page_title?: string;
  intro_text?: any;
  success_message?: string;
  review_text?: string;
};

export type OpportunitySubmissionForm = {
  id: number;
  page_title?: string;
  intro_text?: any;
  success_message?: string;
  review_text?: string;
};

export type ActivityPage = {
  id: number;
  hero_title: string;
  hero_description?: string;
};

export type ProjectTagDescription = {
  id: number;
  tag_name: string;
  slug: string;
  description?: string;
  sort: number;
  created_at: string;
  updated_at: string;
};

type DirectusCollections = {
  events: Event[];
  opportunities: Opportunity[];
  activity: ActivityArticle[];
  team_members: TeamMember[];
  home_page: HomePage;
  about_page: AboutPage;
  mentoring_page: MentoringPage;
  activity_page: ActivityPage[];
  event_submission_form: EventSubmissionForm;
  opportunity_submission_form: OpportunitySubmissionForm;
  project_tag_descriptions: ProjectTagDescription[];
};

// Create Directus client
const directus = createDirectus<DirectusCollections>(
  process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
)
  .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN || ''))
  .with(rest());

export default directus;

// Helper functions for common queries

export async function getPublishedEvents(limit?: number) {
  const events = await directus.request(
    readItems('events', {
      filter: {
        status: { _eq: 'published' },
      },
      sort: ['event_date'],
    })
  );

  // Filter out past events (use end_date if available, otherwise event_date)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((event) => {
    const endDate = event.event_end_date ? new Date(event.event_end_date) : new Date(event.event_date);
    return endDate >= today;
  });

  // Apply limit if specified
  return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
}

export async function getPublishedOpportunities(limit?: number) {
  const opportunities = await directus.request(
    readItems('opportunities', {
      filter: {
        status: { _eq: 'published' },
      },
      sort: ['deadline'],
    })
  );

  // Filter out past opportunities (unless they're ongoing)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeOpportunities = opportunities.filter((opp) => {
    // Always show ongoing opportunities
    if (opp.deadline_type === 'ongoing') {
      return true;
    }
    // For specific deadlines, only show if deadline hasn't passed
    const deadline = new Date(opp.deadline);
    return deadline >= today;
  });

  // Apply limit if specified
  return limit ? activeOpportunities.slice(0, limit) : activeOpportunities;
}

export async function getPublishedActivity(limit?: number) {
  return await directus.request(
    readItems('activity', {
      filter: {
        status: { _eq: 'published' },
      },
      sort: ['-published_at'],
      limit: limit ?? -1,
    })
  );
}

export async function getCurrentActivity(limit?: number) {
  return await directus.request(
    readItems('activity', {
      filter: {
        status: { _eq: 'published' },
        is_archive: { _eq: false },
      },
      sort: ['-published_at'],
      limit: limit ?? -1,
    })
  );
}

export async function getArchivedActivity(limit?: number, offset?: number) {
  return await directus.request(
    readItems('activity', {
      filter: {
        status: { _eq: 'published' },
        is_archive: { _eq: true },
      },
      sort: ['-published_at'],
      limit: limit ?? -1,
      offset: offset ?? 0,
    })
  );
}

export async function getArchivedActivityCount() {
  const result = await directus.request(
    readItems('activity', {
      filter: {
        status: { _eq: 'published' },
        is_archive: { _eq: true },
      },
      aggregate: { count: ['*'] },
    })
  );
  return (result as unknown as Array<{ count: number }>)[0]?.count ?? 0;
}

export async function getEventBySlug(slug: string) {
  const results = await directus.request(
    readItems('events', {
      filter: {
        slug: { _eq: slug },
      },
      limit: 1,
    })
  );
  return results[0] || null;
}

export async function getActivityBySlug(slug: string) {
  const results = await directus.request(
    readItems('activity', {
      filter: {
        slug: { _eq: slug },
      },
      limit: 1,
    })
  );
  return results[0] || null;
}

export async function getOpportunityBySlug(slug: string) {
  const results = await directus.request(
    readItems('opportunities', {
      filter: {
        slug: { _eq: slug },
      },
      limit: 1,
    })
  );
  return results[0] || null;
}

export async function getTeamMembers(type?: 'team' | 'steering_group') {
  return await directus.request(
    readItems('team_members', {
      filter: type ? { type: { _eq: type } } : {},
      sort: ['order'],
    })
  );
}

// Singleton helper functions
export async function getHomePage() {
  return await directus.request(
    readSingleton('home_page')
  );
}

export async function getAboutPage() {
  return await directus.request(
    readSingleton('about_page')
  );
}

export async function getMentoringPage() {
  return await directus.request(
    readSingleton('mentoring_page')
  );
}

export async function getEventSubmissionForm() {
  return await directus.request(
    readSingleton('event_submission_form')
  );
}

export async function getOpportunitySubmissionForm() {
  return await directus.request(
    readSingleton('opportunity_submission_form')
  );
}

export async function getActivityPage() {
  try {
    // activity_page is a regular collection with one entry, not a Directus singleton
    const results = await directus.request(
      readItems('activity_page', { limit: 1 })
    );
    if (results && results.length > 0) {
      return results[0];
    }
    throw new Error('No activity page data found');
  } catch (error) {
    // Return default values if collection doesn't exist or isn't configured
    console.warn('activity_page collection not configured in Directus, using defaults');
    return {
      id: 1,
      hero_title: 'CVAN EM Activity',
      hero_description: 'A resource documenting recent and ongoing projects delivered by CVAN EM, often in collaboration with partners but always celebrating and supporting arts and culture in the region, championing artists and supporting in safeguarding the long-term future of the sector.'
    };
  }
}

// Project tag description functions
export async function getProjectTagDescriptions(): Promise<ProjectTagDescription[]> {
  try {
    const results = await directus.request(
      readItems('project_tag_descriptions', {
        sort: ['sort'],
      })
    );
    return results || [];
  } catch (error) {
    console.warn('project_tag_descriptions collection not configured in Directus');
    return [];
  }
}

export async function getProjectTagDescriptionBySlug(slug: string): Promise<ProjectTagDescription | null> {
  try {
    const results = await directus.request(
      readItems('project_tag_descriptions', {
        filter: {
          slug: { _eq: slug },
        },
        limit: 1,
      })
    );
    return results[0] || null;
  } catch (error) {
    console.warn('project_tag_descriptions collection not configured in Directus');
    return null;
  }
}

// Get all published activity filtered by tag (searches both generic_tags and project_tags)
export async function getActivityByTag(tagName: string): Promise<ActivityArticle[]> {
  try {
    // Fetch all published activity and filter client-side since Directus JSON filtering can be tricky
    const results = await directus.request(
      readItems('activity', {
        filter: {
          status: { _eq: 'published' },
        },
        sort: ['-published_at'],
        limit: -1,
      })
    );

    // Filter by tag (check both generic_tags and project_tags) - case insensitive
    const searchTagLower = tagName.toLowerCase();
    return results.filter((article) => {
      const genericTags = article.generic_tags || [];
      const projectTags = article.project_tags || [];
      return (
        genericTags.some((t) => t.toLowerCase() === searchTagLower) ||
        projectTags.some((t) => t.toLowerCase() === searchTagLower)
      );
    });
  } catch (error) {
    console.error('Error fetching activity by tag:', error);
    return [];
  }
}

// Helper to convert tag name to slug
export function tagNameToSlug(tagName: string): string {
  return tagName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Helper to convert slug to display name (capitalize words)
export function slugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
