import { PageHero } from '@/components/PageHero';
import { getTeamMembers, getAboutPage } from '@/lib/directus';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about CVAN East Midlands and our team',
};

export default async function AboutPage() {
  const [teamMembers, steeringGroup, aboutContent] = await Promise.all([
    getTeamMembers('team'),
    getTeamMembers('steering_group'),
    getAboutPage(),
  ]);

  return (
    <>
      <PageHero
        title={aboutContent?.hero_title || 'About CVAN East Midlands'}
        description={aboutContent?.hero_description || 'Who we are, what we do, and how we support the visual arts sector'}
        bgColor="blue"
        textColor="yellow"
        graphicColor="yellow"
        graphicArrangement="corners"
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {aboutContent?.who_we_are_title && (
              <>
                <h2 className="text-3xl font-bold mb-4">{aboutContent.who_we_are_title}</h2>
                {aboutContent.who_we_are_content && (
                  <div
                    className="text-lg text-black/80 mb-8"
                    dangerouslySetInnerHTML={{ __html: aboutContent.who_we_are_content }}
                  />
                )}
              </>
            )}

            {aboutContent?.what_we_do_title && (
              <>
                <h2 className="text-3xl font-bold mb-4">{aboutContent.what_we_do_title}</h2>
                {aboutContent.what_we_do_content && (
                  <div
                    className="text-lg text-black/80 mb-8"
                    dangerouslySetInnerHTML={{ __html: aboutContent.what_we_do_content }}
                  />
                )}
              </>
            )}

            {aboutContent?.how_we_work_title && (
              <>
                <h2 className="text-3xl font-bold mb-4">{aboutContent.how_we_work_title}</h2>
                {aboutContent.how_we_work_content && (
                  <div
                    className="text-lg text-black/80 mb-8"
                    dangerouslySetInnerHTML={{ __html: aboutContent.how_we_work_content }}
                  />
                )}
              </>
            )}

            {aboutContent?.national_network_title && (
              <>
                <h2 className="text-3xl font-bold mb-4">{aboutContent.national_network_title}</h2>
                {aboutContent.national_network_content && (
                  <div
                    className="text-lg text-black/80 mb-8"
                    dangerouslySetInnerHTML={{ __html: aboutContent.national_network_content }}
                  />
                )}
              </>
            )}

            {aboutContent?.accessibility_title && (
              <>
                <h2 className="text-3xl font-bold mb-4">{aboutContent.accessibility_title}</h2>
                {aboutContent.accessibility_content && (
                  <div
                    className="text-lg text-black/80"
                    dangerouslySetInnerHTML={{ __html: aboutContent.accessibility_content }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-cvan-cream">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Team</h2>
          <div className="flex flex-col gap-8">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member.id} className="rounded-lg bg-white p-8">
                  {member.photo_id && (
                    <div className="mb-6 flex justify-center">
                      <img
                        src={`/assets/${member.photo_id}?width=300&height=300&fit=cover`}
                        alt={member.name}
                        className="w-48 h-48 object-cover rounded-full"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-1 text-center">{member.name}</h3>
                  <p className="text-sm text-black/60 mb-4 text-center">{member.role}</p>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-cvan-blue hover:underline block mb-4 text-center"
                    >
                      {member.email}
                    </a>
                  )}
                  {member.bio && (
                    <div
                      className="text-sm text-black/70 leading-relaxed prose prose-sm max-w-none [&_a]:text-cvan-blue [&_a]:underline [&_a]:hover:text-cvan-purple"
                      dangerouslySetInnerHTML={{ __html: typeof member.bio === 'string' ? member.bio : '' }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-black/60">
                Team information coming soon
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Steering Group Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Steering Group
          </h2>

          {aboutContent?.steering_group_description && (
            <div className="mx-auto max-w-4xl mb-12">
              <div
                className="prose prose-lg max-w-none text-black/80 [&_a]:text-cvan-blue [&_a]:underline [&_a]:hover:text-cvan-purple [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-2 [&_li]:text-black/80"
                dangerouslySetInnerHTML={{ __html: aboutContent.steering_group_description }}
              />
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            {steeringGroup.length > 0 ? (
              steeringGroup.map((member) => (
                <div key={member.id} className="rounded-lg border border-black/10 p-6">
                  {member.photo_id && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={`/assets/${member.photo_id}?width=200&height=200&fit=cover`}
                        alt={member.name}
                        className="w-32 h-32 object-cover rounded-full"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-black/60 mb-3">{member.role}</p>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-cvan-blue hover:underline block mb-3"
                    >
                      {member.email}
                    </a>
                  )}
                  {member.bio && (
                    <div
                      className="text-sm text-black/70 leading-relaxed prose prose-sm max-w-none [&_a]:text-cvan-blue [&_a]:underline [&_a]:hover:text-cvan-purple"
                      dangerouslySetInnerHTML={{ __html: typeof member.bio === 'string' ? member.bio : '' }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-black/60">
                Steering group information coming soon
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
