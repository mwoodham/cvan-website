require('dotenv').config();
const { Client } = require('pg');

async function fixStatusEnum() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER || 'directus',
    password: process.env.DATABASE_PASSWORD || 'secret',
    database: process.env.DATABASE_NAME || 'directus',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check current enum values
    console.log('Checking current enum values...');
    const currentValues = await client.query(`
      SELECT unnest(enum_range(NULL::enum_events_status)) as value;
    `);

    console.log('Current enum values:');
    currentValues.rows.forEach(row => console.log(`  - ${row.value}`));
    console.log('');

    // Add missing values if needed
    const existingValues = currentValues.rows.map(r => r.value);
    const requiredValues = ['pending', 'published', 'rejected', 'draft'];

    for (const value of requiredValues) {
      if (!existingValues.includes(value)) {
        console.log(`Adding missing value: ${value}`);
        await client.query(`
          ALTER TYPE enum_events_status ADD VALUE IF NOT EXISTS '${value}';
        `);
        console.log(`✅ Added ${value}\n`);
      }
    }

    // Check final enum values
    const finalValues = await client.query(`
      SELECT unnest(enum_range(NULL::enum_events_status)) as value;
    `);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Status enum fixed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nFinal enum values:');
    finalValues.rows.forEach(row => console.log(`  - ${row.value}`));
    console.log('');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixStatusEnum();
