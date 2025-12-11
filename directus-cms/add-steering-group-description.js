import { createDirectus, rest, staticToken, createField, updateItem, readSingleton } from '@directus/sdk';
import dotenv from 'dotenv';

dotenv.config();

const directus = createDirectus(process.env.PUBLIC_URL || 'http://localhost:8055')
  .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN))
  .with(rest());

const steeringGroupDescription = `<p>CVAN EM's Regional Director is supported by a <strong>Steering Group</strong>, made up of representatives from regional organisations and artists / artist workers from across the East Midlands. Steering Group members act as advisors and advocates who use their knowledges, experience, and skills to inform and champion CVAN EM's work. Our Steering Group is dynamic and diverse, passionate about the arts and active within the creative sector in the region. Key responsibilities are to:</p>
<ul>
<li>Support the Regional Director to set and achieve measurable aims and objectives.</li>
<li>Contribute to network wide conversation and activity.</li>
<li>Identify opportunities for partnerships and funding.</li>
<li>Represent and champion CVAN EM within the sector and region</li>
<li>Demonstrate an interest in and enthusiasm for developing the role of CVAN EM.</li>
<li>Support positive relationships with key stakeholders.</li>
<li>Attend x4 Steering Group meetings per financial year.</li>
<li>Support recruitment for future new Steering Group members.</li>
<li>Contribute to an annual review of responsibilities.</li>
<li>Support the development of 'subgroups', with different focus areas.</li>
</ul>
<p>Please refer to our <a href="https://cvaneastmidlands.co.uk/wp-content/uploads/2025/07/Terms-of-Reference_2025-26_ACE.pdf" target="_blank" rel="noopener">Terms of Reference</a> for a full overview.</p>`;

async function addSteeringGroupDescription() {
  try {
    console.log('🔧 Adding steering group description field...\n');

    // Add the field using fetch API
    console.log('➕ Creating steering_group_description field...');
    const createFieldResponse = await fetch(`${process.env.PUBLIC_URL || 'http://localhost:8055'}/fields/about_page/steering_group_description`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        field: 'steering_group_description',
        type: 'text',
        meta: {
          interface: 'input-rich-text-html',
          width: 'full',
          note: 'Description text for the Steering Group section'
        }
      }),
    });

    if (createFieldResponse.ok) {
      console.log('✓ Field created successfully\n');
    } else {
      const errorText = await createFieldResponse.text();
      console.log(`⚠️  Field creation response: ${errorText}\n`);
    }

    // Update the about_page singleton with the steering group description
    console.log('📝 Updating about_page with steering group description...');
    const updateResponse = await fetch(`${process.env.PUBLIC_URL || 'http://localhost:8055'}/items/about_page/1`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        steering_group_description: steeringGroupDescription
      }),
    });

    if (updateResponse.ok) {
      console.log('✓ About page updated successfully\n');
    } else {
      const errorText = await updateResponse.text();
      console.log(`❌ Failed to update: ${errorText}\n`);
    }

    console.log('✅ Steering group description added!');
    console.log('\nNext steps:');
    console.log('- Update the about page TypeScript type to include steering_group_description');
    console.log('- Update the about page frontend to display the description');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
    process.exit(1);
  }
}

addSteeringGroupDescription();
