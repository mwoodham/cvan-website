import { createDirectus, rest, staticToken } from '@directus/sdk';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const directus = createDirectus(process.env.PUBLIC_URL || 'http://localhost:8055')
  .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN))
  .with(rest());

// Steering group members data extracted from old site
const steeringGroupMembers = [
  {
    name: 'Saad Eddine Said',
    role: 'Chair',
    imageUrl: 'https://cvaneastmidlands.co.uk/wp-content/uploads/2022/06/Saad-Eddine-Said-275x300.jpeg',
    bio: `<p>Known for his City Take-Overs, <strong>Saad Eddine Said</strong> is a curator who initiates and builds bridges and creative partnerships between local communities, artists, activists, social entrepreneurs, innovators, cultural organisations and governmental institutions. His work focuses on co-creating impactful and artistic takeovers that are aimed at re-thinking, re-imagining and re-shaping the structure and future of institutions and communities in towns and cities nationally and internationally. He presented his work and vision around theories of change in Europe, North America, Asia and Africa. Saad Eddine Said is the Co-Founder and previous Co-Artistic Director of the charity Terre Sans Frontiere (Morocco) and worked as the Director of HOME Slough (UK). Saad has recently taken the position as Artistic Director and CEO of <a href="https://www.nae.org.uk/" target="_blank" rel="noopener">New Art Exchange</a>.</p>`,
    order: 1
  },
  {
    name: 'Emer Grant',
    role: 'Steering Group Member',
    imageUrl: 'https://cvaneastmidlands.co.uk/wp-content/uploads/2024/11/Picture-1-300x259.jpg',
    bio: `<p><strong>Emer</strong> is Artistic Director and CEO of <a href="https://nncontemporaryart.org/" target="_blank" rel="noopener">NN Contemporary Art</a>, Northampton. She is a Curator, Producer, and Researcher who completed her Masters in Curatorial Studies at CCS Bard College (USA) and History of Art at the University of York (UK), and her BFA in Critical Fine Art Practice at the University of Brighton. Over the course of more than ten years working across the museum and gallery sector, she has contributed to many exhibition projects in curatorial, production and editorial roles. Emer was a Fellow for The Recalibrated Institution (Miami) and Curator at Art Center South Florida (now Oolite Arts). Prior to this Emer was an Associate Curator of the 2014 Sonorities Festival (Belfast), she has curated shows and programming for various institutions including the Hessel Museum (NY), P! Gallery (NY), ISCP (NY), Stroom den Haag (NL) Void Gallery (NI), Pollinaria (IT), Yeah Maybe (MN), PHL (DE) and The Grand Parade Gallery (UK). She was Visiting Tutor at the RCA, Visiting Curator at Bard College MFA, Visiting Curator at the University of Minnesota Studio Arts BFA and Visiting Critic for Florida International University's Architecture BFA programme. Emer was the Editor of Accessions.org between 2016-2018 and has written for various publications including, Nero, Electronic Beats, The Editorial, The Miami Rail and Rhizome. She was a fellow selected for the ICI (Independent Curators International) 2013 and has consulted for various organisations on Digital Arts and interdisciplinary strategies for public space. She is also an Associate Curator for Left Gallery (Berlin).</p>`,
    order: 2
  },
  {
    name: 'Harriet Plewis',
    role: 'Steering Group Member',
    imageUrl: 'https://cvaneastmidlands.co.uk/wp-content/uploads/2022/07/Screenshot-2022-07-08-at-10.02.38-300x300.png',
    bio: `<p><strong>Harriet Plewis</strong> is an artist and educator based in Lincoln. Her activity is rooted in performance, critical pedagogies and the moving image. Her work looks at expanded reading, the mechanics of solidarity, and the conditions for co-creation. Her <em>Dance School</em> series has been exhibited in Istanbul, Newcastle upon Tyne, and New York. In collaboration with others, she makes Reading Rooms, which are homages to texts in the form of temporary venues. She makes collaborative film works as Bower Fleming Plewis with the artists Deborah Bower and Mat Fleming.</p>`,
    order: 3
  },
  {
    name: 'Harry Freestone',
    role: 'Steering Group Member',
    imageUrl: 'https://cvaneastmidlands.co.uk/wp-content/uploads/2022/07/Screenshot-2022-07-08-at-10.02.15-300x300.png',
    bio: `<p><strong>Harry</strong> is an artist and technician based in Nottingham, as well as Co-Director of <a href="https://www.instagram.com/gasleakmountain/?hl=en" target="_blank" rel="noopener">Gasleak Mountain</a> – an artist-led project space and community interest company located in the city. Through Harry's artistic practice he explores architectural facades and design tropes that surround our everyday lives with a critical focus on social constructs, through the mediums of sculpture and moving image. Harry works full time as a freelance art technician in art galleries across the Midlands, including Nottingham Contemporary, Nottingham Castle Trust, New Art Exchange and others across the UK.</p>
<p>Since graduating from Nottingham Trent University in 2019, he has worked on international sculptural fabrications, being an artist's assistant as well as a technician, and co-founding Gasleak Mountain. Through his curatorial projects as part of Gasleak Mountain, Harry has focused on representing and supporting early career artists with an LGBTQ+ focus, as well as bringing alternative arts events to the city alongside exhibitions.</p>`,
    order: 4
  },
  {
    name: 'Ismail Khokon',
    role: 'Steering Group Member',
    imageUrl: 'https://cvaneastmidlands.co.uk/wp-content/uploads/2022/07/Ismail-Khokon-scaled-e1657270073975-300x300.jpg',
    bio: `<p><strong>Ismail Khokon</strong> is currently the Neighbourhoods Producer at New Art Exchange, the UK's largest gallery dedicated to contemporary visual arts from the Global Ethnic Majority. In this role, he leads co-creative initiatives that empower local residents to shape and deliver artistic projects. By commissioning artists and organisations to co-curate work, Ismail ensures that the neighbourhood remains at the heart of everything NAE do. He previously participated in New Art Exchange's Reshaping Governance and CURATE programmes pioneering residency initiatives designed to empower Global Ethnic Majority creatives with the knowledge and confidence to explore pathways into trustee and curatorial roles.</p>
<p>Ismail is a Steering Group Member for CVAN East Midlands Art Of Belonging project in Nottingham and serves as a Trustee for both First Art and BACKLIT Gallery. His past roles include Co-Production Creative Leader at the National Justice Museum, Associate Artist at Mansfield Museum and participants of New Midlands Group.</p>
<p>He is also a visual artist based in Nottingham, working across documentary photography and painting. His work focuses on elevating the voices and experiences of historically marginalized communities. He is a studio member at Primary gallery in Nottingham. He is a certified as a climate-aware photographer through the Carbon Literacy Project.</p>`,
    order: 5
  },
  {
    name: 'Jenny Gleadell',
    role: 'Steering Group Member',
    imageUrl: 'https://cvaneastmidlands.co.uk/wp-content/uploads/2023/07/Screenshot-2023-07-24-at-17.01.05-200x300.png',
    bio: `<p><strong>Jenny</strong> is a freelance curator and art historian based in Lincoln. She has over a decade of experience working in curatorial roles in galleries and museums around the country, with a strong focus on contemporary visual arts programming. She has previously worked for Lincoln Museum and Usher Gallery as Exhibitions and Interpretation Officer, The Wilson in Cheltenham, Liverpool Biennial and Threshold Studios. Jenny is passionate about supporting talent development in the region, building the strength of the creative sector in Lincolnshire, and maintaining equity, diversity and inclusion throughout visual arts programming and organisations.</p>
<p>Alongside her freelance work, Jenny is also an M4C PhD candidate at the University of Birmingham researching institutional approaches to collecting and exhibiting internet-based art, and Associate Lecturer at the University of Lincoln, where she has taught on both undergraduate and postgraduate courses.</p>`,
    order: 6
  },
  {
    name: 'Lucie De Lacy',
    role: 'Steering Group Member',
    imageUrl: null,
    bio: `<p><strong>Lucie De Lacy</strong> is Engagement and Projects Coordinator at the <a href="https://levelcentre.com/" target="_blank" rel="noopener">LEVEL Centre</a> in Rowsley, Derbyshire. LEVEL is an award-winning contemporary art centre and charity that hosts a year-round programme of visual art exhibitions and digital installations, alongside artist residencies and creative workshops for disabled adults and young people. Lucie looks after workshops, projects, and outreach facilitation for LEVEL with a rounded programme of activity that supports disabled participants to explore the breadth and depth of their creativity.</p>
<p>Formerly Lucie was creative director at a content marketing agency, and outreach lead at an international opera festival. In her personal time, she's part of the management team of Radio Free Matlock, an independent station based in Matlock, Derbyshire.</p>`,
    order: 7
  },
  {
    name: 'Lucy Lumb',
    role: 'Steering Group Member',
    imageUrl: 'https://cvaneastmidlands.co.uk/wp-content/uploads/2022/07/Lucy-Portrait-scaled-e1657270262918-300x300.jpg',
    bio: `<p><strong>Lucy</strong> is a visual arts producer with over twenty years' experience in the creative sector. She builds strong working relationships with artists, communities and partners to deliver projects including permanent and temporary commissions, wellbeing initiatives, festivals and artist residencies. Lucy is interested in creating projects that are owned and celebrated by their communities in public spaces, rural locations, community centres, heritage sites and healthcare settings. She is passionate about equity of access to creativity and culture for all people, of all abilities, ages and backgrounds. Inspired by collaborating with artists in unusual locations and with new communities, her benchmark of success is when those that think art is 'not for them' turn this around to become advocates for creativity at all levels. Alongside her freelance practice, Lucy is the Visual Arts Development Co-ordinator at the <a href="https://hub-sleaford.org.uk/" target="_blank" rel="noopener">Hub</a> in Sleaford, Lincolnshire.</p>`,
    order: 8
  },
  {
    name: 'Mandeep Dhadialla',
    role: 'Steering Group Member',
    imageUrl: 'https://cvaneastmidlands.co.uk/wp-content/uploads/2023/11/mandeep-observing-fern-print-e1700830382495-225x300.jpg',
    bio: `<p><strong>Mandeep</strong> is a fine art printmaker specialising in plant forms and landscape using combined print processes, drawing and bookmaking to explore concepts of place and home. Her visual and thinking practice is influenced by spending her formative years in Kenya and migrating to England in her teens. Her current long term artist practice examines care of place of the natural world by telling the story of how people and landscape are in an interconnected cyclical exchange, through the idea of nurturing – with focus on the natural environment, human wellbeing and sense of community.</p>
<p>Alongside teaching printmaking and bookmaking workshops, Mandeep delivers socially engaged projects with ArtReach and completed an NPO funded artist commission by Leicester Museum and Galleries in response to Abbey Pumping Station and the Environment – the large scale linocut reproductions were exhibited at Highcross Leicester and featured in No Jobs in the Arts zine. Her practice has also featured in Art Etcetera magazine, A Seasonal Way, Stylist Magazine, and was in conversation with Ruth Singer's the Making Meaning Podcast.</p>
<p>She regularly exhibits her original prints nationally and internationally for a number of years. Key exhibitions & awards include Sock Gallery 2023, 2022 & 2019 (Prize Winner, Highly Commended & Runner Up), Society of Women Artists Exhibition 2021, Teeside Print Prize 2020 (Commended) and Circle Foundation for the Arts Kenya 2020 (Honourable Mention).</p>
<p>Mandeep is a member of ArtCan and Leicester Print Workshop, where she teaches and of Leicester Society of Artists.</p>`,
    order: 9
  },
  {
    name: 'Niamh Treacy',
    role: 'Steering Group Member',
    imageUrl: 'https://cvaneastmidlands.co.uk/wp-content/uploads/2022/07/Screenshot-2022-07-08-at-09.32.50-e1657270520120-300x300.png',
    bio: `<p><strong>Niamh</strong> is the Coordinator of <a href="https://formatfestival.com/" target="_blank" rel="noopener">FORMAT International Photography Festival</a>.</p>
<p>She is a mixed media artist whose practice explores the impact that ever-changing environments, increased social pressures and overexposure to visual information can have on our state of mind.</p>`,
    order: 10
  },
  {
    name: 'Saziso Phiri',
    role: 'Steering Group Member',
    imageUrl: null,
    bio: `<p><a href="https://saziso.com/" target="_blank" rel="noopener"><strong>Saziso Phiri</strong></a> is a UK-based curator, producer, creative consultant, and writer working across the UK and internationally. Her practice encompasses curating and producing art exhibitions, developing cultural programming, supporting artist development, and advising arts organisations on strategic approaches. In 2016, she founded The Anti Gallery (2016–2022), a platform that challenged traditional gallery norms by hosting around 30 activations, from exhibitions, film screenings, residencies, performances, workshops and talks, with the aim of facilitating contemporary arts engagement in unconventional spaces. This initiative sought to democratise access to art and question the limitations of formal gallery settings. Her commitment to the arts extends beyond institutional frameworks, driving collaborations that enrich the cultural landscape. As a passionate advocate for wider arts engagement, she explores innovative curatorial methods that foster meaningful dialogues between artists and audiences. She believes in the transformative power of art to connect communities, challenge perspectives, and inspire change. Alongside her curatorial practice, Saziso actively supports artists at all stages of their careers through mentorship initiatives, and she regularly participates in open-call panels for exhibitions and residency opportunities.</p>`,
    order: 11
  }
];

// Function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filepath);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function migrateSteeringGroup() {
  try {
    console.log('🚀 Starting Steering Group migration...\n');

    const imagesDir = path.join(__dirname, '../Images/steering-group');

    // Create images directory if it doesn't exist
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log(`✓ Created directory: ${imagesDir}\n`);
    }

    for (const member of steeringGroupMembers) {
      console.log(`\n📥 Processing: ${member.name}`);

      let photoUrl = null;

      // Download and import image if it exists
      if (member.imageUrl) {
        try {
          const fileName = path.basename(new URL(member.imageUrl).pathname);
          const localPath = path.join(imagesDir, fileName);

          // Download image
          console.log(`  ⬇️  Downloading image...`);
          await downloadImage(member.imageUrl, localPath);
          console.log(`  ✓ Downloaded to: ${localPath}`);

          // Import to Directus
          console.log(`  ⬆️  Importing to Directus...`);
          const importResponse = await fetch(`${process.env.PUBLIC_URL || 'http://localhost:8055'}/files/import`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: member.imageUrl,
              data: {
                title: `${member.name} Photo`
              }
            }),
          });

          if (importResponse.ok) {
            const importData = await importResponse.json();
            photoUrl = importData.data.id;
            console.log(`  ✓ Photo imported with ID: ${photoUrl}`);
          } else {
            console.log(`  ⚠️  Failed to import image: ${await importResponse.text()}`);
          }
        } catch (error) {
          console.log(`  ⚠️  Error with image: ${error.message}`);
        }
      } else {
        console.log(`  ℹ️  No image URL provided`);
      }

      // Create team member entry
      console.log(`  📝 Creating team member entry...`);
      const createResponse = await fetch(`${process.env.PUBLIC_URL || 'http://localhost:8055'}/items/team_members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: member.name,
          role: member.role,
          bio: member.bio,
          type: 'steering_group',
          photo_id: photoUrl,
          order: member.order
        }),
      });

      if (createResponse.ok) {
        const data = await createResponse.json();
        console.log(`  ✅ Created: ${member.name} (ID: ${data.data.id})`);
      } else {
        const errorText = await createResponse.text();
        console.log(`  ❌ Failed to create: ${errorText}`);
      }
    }

    console.log('\n\n✨ Migration complete!');
    console.log(`\nMigrated ${steeringGroupMembers.length} steering group members.`);
    console.log('\nNext steps:');
    console.log('- Check the team members in Directus admin');
    console.log('- Add steering group description to the about page');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateSteeringGroup();
