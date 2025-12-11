import dotenv from 'dotenv';
dotenv.config();

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

console.log('📝 Updating about_page singleton with steering group description...\n');

fetch(`${process.env.PUBLIC_URL || 'http://localhost:8055'}/items/about_page/1`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    steering_group_description: steeringGroupDescription
  }),
})
.then(async res => {
  if (res.ok) {
    const data = await res.json();
    console.log('✅ Successfully updated about_page!');
    console.log('\nSteering group description has been added.');
    console.log('\nNext step: Update the TypeScript types and frontend to display the description.');
  } else {
    const errorText = await res.text();
    console.error('❌ Failed to update:', errorText);
  }
})
.catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
