const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

async function apiRequest(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${DIRECTUS_URL}${path}`, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error (${response.status}): ${error}`);
  }

  return response.json();
}

async function createSingletonCollections() {
  try {
    console.log('Creating singleton collections...\n');

    // 1. Home Page
    console.log('Creating home_page collection...');
    await apiRequest('/collections', 'POST', {
      collection: 'home_page',
      meta: {
        singleton: true,
        icon: 'home',
        note: 'Home page hero and content sections',
      },
      schema: {},
    });

    // Create fields for home_page
    const homePageFields = [
      { field: 'id', type: 'integer', meta: { hidden: true, interface: 'input', readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      { field: 'hero_title', type: 'string', meta: { interface: 'input', required: true, note: 'Main hero title' }, schema: {} },
      { field: 'hero_subtitle', type: 'text', meta: { interface: 'input-multiline', note: 'Hero subtitle/description' }, schema: {} },
      { field: 'hero_cta_primary_text', type: 'string', meta: { interface: 'input', note: 'Primary button text (e.g., "Explore Events")' }, schema: {} },
      { field: 'hero_cta_primary_link', type: 'string', meta: { interface: 'input', note: 'Primary button link' }, schema: {} },
      { field: 'hero_cta_secondary_text', type: 'string', meta: { interface: 'input', note: 'Secondary link text (e.g., "Learn More")' }, schema: {} },
      { field: 'hero_cta_secondary_link', type: 'string', meta: { interface: 'input', note: 'Secondary link URL' }, schema: {} },
      { field: 'activity_section_title', type: 'string', meta: { interface: 'input', note: 'Activity section heading' }, schema: {} },
      { field: 'activity_section_description', type: 'string', meta: { interface: 'input', note: 'Activity section description' }, schema: {} },
      { field: 'events_section_title', type: 'string', meta: { interface: 'input', note: 'Events section heading' }, schema: {} },
      { field: 'events_section_description', type: 'string', meta: { interface: 'input', note: 'Events section description' }, schema: {} },
      { field: 'opportunities_section_title', type: 'string', meta: { interface: 'input', note: 'Opportunities section heading' }, schema: {} },
      { field: 'opportunities_section_description', type: 'string', meta: { interface: 'input', note: 'Opportunities section description' }, schema: {} },
    ];

    for (const fieldDef of homePageFields) {
      await directus.request({
        method: 'POST',
        path: `/fields/home_page`,
        body: JSON.stringify(fieldDef),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('✓ home_page collection created\n');

    // 2. About Page
    console.log('Creating about_page collection...');
    await directus.request({
      method: 'POST',
      path: '/collections',
      body: JSON.stringify({
        collection: 'about_page',
        meta: {
          singleton: true,
          icon: 'info',
          note: 'About page content',
        },
        schema: {},
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const aboutPageFields = [
      { field: 'id', type: 'integer', meta: { hidden: true, interface: 'input', readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      { field: 'hero_title', type: 'string', meta: { interface: 'input', required: true }, schema: {} },
      { field: 'hero_description', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'who_we_are_title', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'who_we_are_content', type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} },
      { field: 'what_we_do_title', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'what_we_do_content', type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} },
      { field: 'how_we_work_title', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'how_we_work_content', type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} },
      { field: 'national_network_title', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'national_network_content', type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} },
      { field: 'accessibility_title', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'accessibility_content', type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} },
    ];

    for (const fieldDef of aboutPageFields) {
      await directus.request({
        method: 'POST',
        path: `/fields/about_page`,
        body: JSON.stringify(fieldDef),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('✓ about_page collection created\n');

    // 3. Mentoring Page
    console.log('Creating mentoring_page collection...');
    await directus.request({
      method: 'POST',
      path: '/collections',
      body: JSON.stringify({
        collection: 'mentoring_page',
        meta: {
          singleton: true,
          icon: 'school',
          note: 'Mentoring page content',
        },
        schema: {},
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const mentoringPageFields = [
      { field: 'id', type: 'integer', meta: { hidden: true, interface: 'input', readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      { field: 'hero_title', type: 'string', meta: { interface: 'input', required: true }, schema: {} },
      { field: 'hero_description', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'about_programme_title', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'about_programme_content', type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} },
      { field: 'who_can_apply_title', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'who_can_apply_content', type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} },
      { field: 'what_we_offer_title', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'what_we_offer_content', type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} },
      { field: 'get_involved_title', type: 'string', meta: { interface: 'input' }, schema: {} },
      { field: 'get_involved_content', type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} },
    ];

    for (const fieldDef of mentoringPageFields) {
      await directus.request({
        method: 'POST',
        path: `/fields/mentoring_page`,
        body: JSON.stringify(fieldDef),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('✓ mentoring_page collection created\n');

    // 4. Event Submission Form
    console.log('Creating event_submission_form collection...');
    await directus.request({
      method: 'POST',
      path: '/collections',
      body: JSON.stringify({
        collection: 'event_submission_form',
        meta: {
          singleton: true,
          icon: 'event',
          note: 'Event submission form content and messages',
        },
        schema: {},
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const eventFormFields = [
      { field: 'id', type: 'integer', meta: { hidden: true, interface: 'input', readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      { field: 'page_title', type: 'string', meta: { interface: 'input', note: 'Page heading' }, schema: {} },
      { field: 'intro_text', type: 'text', meta: { interface: 'input-rich-text-html', note: 'Introductory text above the form' }, schema: {} },
      { field: 'success_message', type: 'text', meta: { interface: 'input-multiline', note: 'Message shown after successful submission' }, schema: {} },
      { field: 'review_text', type: 'string', meta: { interface: 'input', note: 'Text shown below submit button (e.g., "All submissions are reviewed within 2-3 business days")' }, schema: {} },
    ];

    for (const fieldDef of eventFormFields) {
      await directus.request({
        method: 'POST',
        path: `/fields/event_submission_form`,
        body: JSON.stringify(fieldDef),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('✓ event_submission_form collection created\n');

    // 5. Opportunity Submission Form
    console.log('Creating opportunity_submission_form collection...');
    await directus.request({
      method: 'POST',
      path: '/collections',
      body: JSON.stringify({
        collection: 'opportunity_submission_form',
        meta: {
          singleton: true,
          icon: 'work',
          note: 'Opportunity submission form content and messages',
        },
        schema: {},
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const opportunityFormFields = [
      { field: 'id', type: 'integer', meta: { hidden: true, interface: 'input', readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      { field: 'page_title', type: 'string', meta: { interface: 'input', note: 'Page heading' }, schema: {} },
      { field: 'intro_text', type: 'text', meta: { interface: 'input-rich-text-html', note: 'Introductory text above the form' }, schema: {} },
      { field: 'success_message', type: 'text', meta: { interface: 'input-multiline', note: 'Message shown after successful submission' }, schema: {} },
      { field: 'review_text', type: 'string', meta: { interface: 'input', note: 'Text shown below submit button (e.g., "All submissions are reviewed within 2-3 business days")' }, schema: {} },
    ];

    for (const fieldDef of opportunityFormFields) {
      await directus.request({
        method: 'POST',
        path: `/fields/opportunity_submission_form`,
        body: JSON.stringify(fieldDef),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('✓ opportunity_submission_form collection created\n');

    console.log('All singleton collections created successfully!');
    console.log('\nNext steps:');
    console.log('1. Populate the collections with initial content in Directus');
    console.log('2. Update the Next.js pages to fetch content from these collections');

  } catch (error) {
    console.error('Error creating collections:', error);
    if (error.errors) {
      console.error('Detailed errors:', JSON.stringify(error.errors, null, 2));
    }
  }
}

createSingletonCollections();
