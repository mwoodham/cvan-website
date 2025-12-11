import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function fixTeamMembers() {
  try {
    console.log('🔧 Fixing team_members stack overflow issue...\n');

    await client.connect();
    console.log('✓ Connected to database\n');

    // Show current field count before deletion
    const countBefore = await client.query(`
      SELECT COUNT(*) as count
      FROM directus_fields
      WHERE collection = 'team_members'
    `);
    console.log(`Found ${countBefore.rows[0].count} field metadata entries for team_members\n`);

    // Delete ALL field metadata for team_members
    console.log('🗑️  Deleting all team_members field metadata...');
    await client.query(`
      DELETE FROM directus_fields
      WHERE collection = 'team_members'
    `);
    console.log('✓ All team_members field metadata deleted\n');

    await client.end();

    console.log('✅ Database cleanup complete!\n');
    console.log('Next steps:');
    console.log('1. Restart Directus (will happen automatically)');
    console.log('2. Directus will regenerate basic field metadata from the database schema');
    console.log('3. You can then configure field interfaces via Directus admin UI\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixTeamMembers();
