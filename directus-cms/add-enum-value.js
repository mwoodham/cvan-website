import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbClient = new pg.Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function addEnumValue() {
  try {
    console.log('🔧 Adding steering_group to team_members_type enum...\n');

    await dbClient.connect();
    console.log('✓ Connected to database\n');

    // Check current enum values
    console.log('📋 Checking existing enum values...');
    const enumResult = await dbClient.query(`
      SELECT enumlabel
      FROM pg_enum
      WHERE enumtypid = 'enum_team_members_type'::regtype
      ORDER BY enumsortorder;
    `);

    const existingValues = enumResult.rows.map(row => row.enumlabel);
    console.log(`Current values: ${existingValues.join(', ')}\n`);

    // Add steering_group if it doesn't exist
    if (!existingValues.includes('steering_group')) {
      console.log('➕ Adding steering_group...');
      await dbClient.query(`
        ALTER TYPE enum_team_members_type ADD VALUE 'steering_group';
      `);
      console.log('✓ steering_group added\n');
    } else {
      console.log('✓ steering_group already exists\n');
    }

    // Add team if it doesn't exist
    if (!existingValues.includes('team')) {
      console.log('➕ Adding team...');
      await dbClient.query(`
        ALTER TYPE enum_team_members_type ADD VALUE 'team';
      `);
      console.log('✓ team added\n');
    } else {
      console.log('✓ team already exists\n');
    }

    // Show final enum values
    const finalResult = await dbClient.query(`
      SELECT enumlabel
      FROM pg_enum
      WHERE enumtypid = 'enum_team_members_type'::regtype
      ORDER BY enumsortorder;
    `);

    const finalValues = finalResult.rows.map(row => row.enumlabel);
    console.log(`Final enum values: ${finalValues.join(', ')}\n`);

    await dbClient.end();

    console.log('✅ Enum values updated successfully!');
    console.log('\nYou can now create team members with type "team" or "steering_group"');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

addEnumValue();
