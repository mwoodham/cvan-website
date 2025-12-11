/**
 * Set up public read permissions for collections
 * Run this after Directus is set up to allow public access to published content
 */

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_TOKEN = 'ZPCMtnXx0CqXBJOKInjl3v8yrAgE4aVp';

async function setupPublicPermissions() {
  console.log('Setting up public permissions for Directus collections...\n');

  // Collections that should be publicly readable
  const collections = ['events', 'opportunities', 'news', 'team_members'];

  try {
    // Get the public policy ID
    const policiesResponse = await fetch(`${DIRECTUS_URL}/policies`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
      },
    });
    const policiesData = await policiesResponse.json();
    const publicPolicy = policiesData.data.find(p => p.name === '$t:public_label');

    if (!publicPolicy) {
      console.error('❌ Public policy not found!');
      return;
    }

    console.log(`✓ Found Public policy: ${publicPolicy.id}\n`);

    // Create read permissions for each collection
    for (const collection of collections) {
      console.log(`Setting up permissions for ${collection}...`);

      // Create read permission for public policy
      const permissionData = {
        policy: publicPolicy.id,
        collection: collection,
        action: 'read',
        permissions: {},
        fields: ['*'],
      };

      const response = await fetch(`${DIRECTUS_URL}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permissionData),
      });

      if (response.ok) {
        console.log(`  ✓ Read permission created for ${collection}`);
      } else {
        const error = await response.json();
        // Check if permission already exists
        if (error.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
          console.log(`  ✓ Read permission already exists for ${collection}`);
        } else {
          console.error(`  ❌ Failed to create permission for ${collection}:`, error);
        }
      }
    }

    console.log('\n✅ Public permissions setup complete!');
    console.log('The Next.js frontend can now read published content from Directus.\n');

  } catch (error) {
    console.error('❌ Error setting up permissions:', error.message);
    process.exit(1);
  }
}

setupPublicPermissions();
