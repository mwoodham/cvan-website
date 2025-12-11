import pg from 'pg';
import { createDirectus, rest, staticToken, updateField } from '@directus/sdk';
import dotenv from 'dotenv';

dotenv.config();

const dbClient = new pg.Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const directus = createDirectus(process.env.PUBLIC_URL || 'http://localhost:8055')
  .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN))
  .with(rest());

async function fixTeamMembersComplete() {
  try {
    console.log('🔧 Fixing team_members collection completely...\n');

    await dbClient.connect();
    console.log('✓ Connected to database\n');

    // Check current enum values
    console.log('📋 Checking existing enum values...');
    try {
      const enumResult = await dbClient.query(`
        SELECT enumlabel
        FROM pg_enum
        WHERE enumtypid = (
          SELECT oid FROM pg_type WHERE typname = 'team_members_type'
        )
        ORDER BY enumsortorder;
      `);

      if (enumResult.rows.length > 0) {
        const existingValues = enumResult.rows.map(row => row.enumlabel);
        console.log(`Found existing enum values: ${existingValues.join(', ')}`);

        // Check if we need to add new values
        const requiredValues = ['team', 'steering_group'];
        const missingValues = requiredValues.filter(v => !existingValues.includes(v));

        if (missingValues.length > 0) {
          console.log(`\n⚠️  Missing enum values: ${missingValues.join(', ')}`);
          console.log('Adding missing values...');

          for (const value of missingValues) {
            await dbClient.query(`
              ALTER TYPE team_members_type ADD VALUE '${value}';
            `);
            console.log(`  ✓ Added '${value}'`);
          }
        }
      }
    } catch (error) {
      console.log('⚠️  Enum type may not exist or checking failed:', error.message);
    }

    await dbClient.end();
    console.log('\n✓ Database updates complete\n');

    // Configure field interfaces
    console.log('⚙️  Configuring field interfaces...\n');

    // Type field with dropdown
    console.log('  - Type field (dropdown)');
    await directus.request(
      updateField('team_members', 'type', {
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Team', value: 'team' },
              { text: 'Steering Group', value: 'steering_group' }
            ]
          },
          width: 'half',
          sort: 2
        }
      })
    );

    // Photo ID field
    console.log('  - Photo ID field (image upload)');
    await directus.request(
      updateField('team_members', 'photo_id', {
        meta: {
          interface: 'file-image',
          special: ['file'],
          width: 'half',
          sort: 3
        }
      })
    );

    // Name field
    console.log('  - Name field');
    await directus.request(
      updateField('team_members', 'name', {
        meta: {
          interface: 'input',
          required: true,
          width: 'half',
          sort: 1
        }
      })
    );

    // Role field
    console.log('  - Role field');
    await directus.request(
      updateField('team_members', 'role', {
        meta: {
          interface: 'input',
          width: 'half',
          sort: 4
        }
      })
    );

    // Email field
    console.log('  - Email field');
    await directus.request(
      updateField('team_members', 'email', {
        meta: {
          interface: 'input',
          width: 'half',
          sort: 5
        }
      })
    );

    // Bio field
    console.log('  - Bio field');
    await directus.request(
      updateField('team_members', 'bio', {
        meta: {
          interface: 'input-rich-text-html',
          width: 'full',
          sort: 6
        }
      })
    );

    // Order field
    console.log('  - Order field');
    await directus.request(
      updateField('team_members', 'order', {
        meta: {
          interface: 'input',
          width: 'half',
          sort: 7
        }
      })
    );

    // Hide and configure created_at
    console.log('  - Created At field (auto-generated)');
    await directus.request(
      updateField('team_members', 'created_at', {
        meta: {
          interface: 'datetime',
          readonly: true,
          hidden: true,
          special: ['date-created']
        }
      })
    );

    // Hide and configure updated_at
    console.log('  - Updated At field (auto-generated)');
    await directus.request(
      updateField('team_members', 'updated_at', {
        meta: {
          interface: 'datetime',
          readonly: true,
          hidden: true,
          special: ['date-updated']
        }
      })
    );

    // Hide ID field
    console.log('  - ID field (hidden)');
    await directus.request(
      updateField('team_members', 'id', {
        meta: {
          interface: 'input',
          readonly: true,
          hidden: true
        }
      })
    );

    console.log('\n✅ Team members collection fully configured!');
    console.log('\nYou can now:');
    console.log('- Add team members via Directus admin');
    console.log('- Timestamps will auto-generate');
    console.log('- Type dropdown has "Team" and "Steering Group" options');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
    process.exit(1);
  }
}

fixTeamMembersComplete();
