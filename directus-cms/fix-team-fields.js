import { createDirectus, rest, staticToken, updateField } from '@directus/sdk';
import dotenv from 'dotenv';

dotenv.config();

const directus = createDirectus(process.env.PUBLIC_URL || 'http://localhost:8055')
  .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN))
  .with(rest());

async function fixTeamMemberFields() {
  try {
    console.log('🔧 Fixing team_members field interfaces...\n');

    // Team member types matching /about page sections
    const teamTypes = ['team', 'steering_group'];
    console.log(`Using team types: ${teamTypes.join(', ')}\n`);

    // Configure the type field as a dropdown
    console.log('⚙️  Configuring type field as dropdown...');
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
    console.log('✓ Type field configured as dropdown\n');

    // Configure photo_id as file-image field
    console.log('⚙️  Configuring photo_id field as image upload...');
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
    console.log('✓ Photo ID field configured as image upload\n');

    // Configure other important fields
    console.log('⚙️  Configuring other fields...');

    // Name field
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
    await directus.request(
      updateField('team_members', 'order', {
        meta: {
          interface: 'input',
          width: 'half',
          sort: 7
        }
      })
    );

    console.log('✓ All fields configured\n');

    console.log('✅ Team members field configuration complete!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
    process.exit(1);
  }
}

fixTeamMemberFields();
