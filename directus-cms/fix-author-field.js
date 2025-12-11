import { createDirectus, rest, staticToken, deleteField, createField, updateItem, readItems } from '@directus/sdk';

const directus = createDirectus(process.env.DIRECTUS_URL || 'http://localhost:8055')
  .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN))
  .with(rest());

async function fixAuthorField() {
  try {
    console.log('🔧 Starting author field migration...\n');

    // Step 1: Use the hardcoded admin user ID from Colette Griffin
    // UUID: dc9049e0-184d-4438-b182-8feeee282e0d
    const adminUserId = 'dc9049e0-184d-4438-b182-8feeee282e0d';
    console.log(`✓ Using admin user: Colette Griffin (${adminUserId})\n`);

    // Step 2: Delete the old author_id field
    console.log('🗑️  Deleting old author_id field...');
    try {
      await directus.request(deleteField('activity', 'author_id'));
      console.log('✓ Old author_id field deleted\n');
    } catch (error) {
      console.log('⚠️  Field may not exist or already deleted\n');
    }

    // Step 3: Create new author field with proper M2O relationship
    console.log('➕ Creating new author field with M2O relationship...');
    await directus.request(
      createField('activity', {
        field: 'author',
        type: 'uuid',
        schema: {
          foreign_key_table: 'directus_users',
          foreign_key_column: 'id'
        },
        meta: {
          interface: 'select-dropdown-m2o',
          special: ['m2o'],
          options: {
            template: '{{first_name}} {{last_name}}'
          },
          display: 'related-values',
          display_options: {
            template: '{{first_name}} {{last_name}}'
          },
          note: 'Article author (related to Directus user)',
          width: 'half',
          sort: 3
        }
      })
    );
    console.log('✓ New author field created with M2O relationship\n');

    // Step 4: Update all existing activity items to have the admin as author
    console.log('📝 Updating existing activity items...');
    const activities = await directus.request(
      readItems('activity', {
        fields: ['id', 'title'],
        limit: -1
      })
    );

    console.log(`Found ${activities.length} activity item(s) to update`);

    for (const activity of activities) {
      await directus.request(
        updateItem('activity', activity.id, {
          author: adminUserId
        })
      );
      console.log(`  ✓ Updated: ${activity.title}`);
    }

    console.log('\n✅ Author field migration completed successfully!');
    console.log(`\nAll activity items now reference: Colette Griffin`);

  } catch (error) {
    console.error('\n❌ Error during migration:', error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
    process.exit(1);
  }
}

fixAuthorField();
