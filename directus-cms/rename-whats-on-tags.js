require('dotenv').config();
const { Client } = require('pg');

async function renameField() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'directus',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_DATABASE || 'directus',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Step 1: Rename the column in the events table
    console.log('Renaming column from whats_on_tags to event_type...');
    await client.query(`
      ALTER TABLE events
      RENAME COLUMN whats_on_tags TO event_type;
    `);
    console.log('✅ Column renamed in events table\n');

    // Step 2: Update Directus field metadata
    console.log('Updating Directus field metadata...');
    await client.query(`
      UPDATE directus_fields
      SET field = 'event_type',
          note = 'Event type tags (can select multiple)'
      WHERE collection = 'events'
      AND field = 'whats_on_tags';
    `);
    console.log('✅ Directus field metadata updated\n');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Field successfully renamed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nNext steps:');
    console.log('1. Restart Directus');
    console.log('2. Update code references from whats_on_tags to event_type\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

renameField();
