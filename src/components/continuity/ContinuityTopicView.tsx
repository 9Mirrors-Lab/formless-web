import { ContinuityBigPicture } from '@/components/continuity/ContinuityBigPicture';
import { ContinuityDisclosure } from '@/components/continuity/ContinuityDisclosure';
import { ContinuityFilesCatalog } from '@/components/continuity/ContinuityFilesCatalog';
import { BriefingGrid, ExternalLink, Field, importanceLabel } from '@/components/continuity/ContinuityUi';
import {
  CONTINUITY_COSTS,
  CONTINUITY_CREDENTIALS,
  CONTINUITY_DOMAIN,
  CONTINUITY_FORMLESS,
  CONTINUITY_PEOPLE,
  CONTINUITY_RUNNING,
  CONTINUITY_SOCIAL,
  CONTINUITY_START_HERE,
  CONTINUITY_SUPABASE,
  CONTINUITY_VERCEL,
  CONTINUITY_WEBSITE,
  CONTINUITY_WHAT_NOT_TO_DO,
  type ContinuityDeskId,
  type ContinuityPersonCategory,
} from '@/data/continuityHome';

const PEOPLE_CATEGORIES: ContinuityPersonCategory[] = [
  'Partner / Owner',
  'Technical',
  'Publishing',
  'Legal / Business',
];

export function ContinuityTopicView({
  topicId,
  fileQuery,
}: {
  topicId: ContinuityDeskId;
  fileQuery?: string;
}) {
  switch (topicId) {
    case 'start-here':
      return <StartHereBriefing />;
    case 'picture':
      return <ContinuityBigPicture />;
    case 'website':
      return <WebsiteBriefing />;
    case 'domain':
      return <DomainBriefing />;
    case 'infrastructure':
      return <InfrastructureBriefing />;
    case 'formless':
      return <FormlessBriefing />;
    case 'distribution':
      return <DistributionBriefing />;
    case 'files':
      return <ContinuityFilesCatalog query={fileQuery} />;
    case 'accounts':
      return <AccountsBriefing />;
    case 'email':
      return <EmailBriefing />;
    case 'payments':
      return <PaymentsBriefing />;
    case 'social':
      return <SocialBriefing />;
    case 'people':
      return <PeopleBriefing />;
    case 'what-to-do':
      return <WhatNotToDoBriefing />;
    default: {
      const _exhaustive: never = topicId;
      return _exhaustive;
    }
  }
}

function StartHereBriefing() {
  return (
    <ol>
      {CONTINUITY_START_HERE.steps.map((step, index) => (
        <li
          key={step.title}
          className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-t border-cream/12 py-7 first:border-t-0 first:pt-0"
        >
          <p className="pt-1 font-sans text-sm tabular-nums text-cream/45">{index + 1}</p>
          <div>
            <p className="font-sans text-xl leading-snug text-cream md:text-2xl">{step.title}</p>
            <p className="mt-3 max-w-[58ch] font-sans text-base leading-relaxed text-cream/68">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function WebsiteBriefing() {
  return (
    <div>
      <BriefingGrid>
        <Field label="Website name">{CONTINUITY_WEBSITE.name}</Field>
        <Field label="Primary domain">{CONTINUITY_WEBSITE.primaryDomain}</Field>
        <Field label="Live URL">
          <ExternalLink href={CONTINUITY_WEBSITE.productionUrl}>
            {CONTINUITY_WEBSITE.productionUrl}
          </ExternalLink>
        </Field>
        <Field label="Master copy">
          <ExternalLink href={CONTINUITY_WEBSITE.github.url}>
            {CONTINUITY_WEBSITE.github.organization}/{CONTINUITY_WEBSITE.github.repository}
          </ExternalLink>
        </Field>
      </BriefingGrid>
      <p className="mt-8 max-w-[58ch] text-sm leading-relaxed text-cream/65">
        {CONTINUITY_WEBSITE.githubExplainer} {CONTINUITY_WEBSITE.vercelExplainer}
      </p>
    </div>
  );
}

function DomainBriefing() {
  return (
    <div>
      <p className="mb-8 inline-flex min-h-11 items-center border border-cream/35 px-3 font-sans text-sm text-cream">
        Critical asset
      </p>
      <BriefingGrid>
        <Field label="Domain name">{CONTINUITY_DOMAIN.name}</Field>
        <Field label="Registrar">{CONTINUITY_DOMAIN.registrar}</Field>
        <Field label="Registrar account">{CONTINUITY_DOMAIN.registrarAccount}</Field>
        <Field label="Expiration">{CONTINUITY_DOMAIN.expirationDate}</Field>
        <Field label="Automatic renewal">{CONTINUITY_DOMAIN.automaticRenewal}</Field>
        <Field label="Renewal payment">{CONTINUITY_DOMAIN.renewalPayment}</Field>
        <Field label="DNS provider">{CONTINUITY_DOMAIN.dnsProvider}</Field>
        <Field label="Nameservers">{CONTINUITY_DOMAIN.nameservers}</Field>
      </BriefingGrid>
    </div>
  );
}

function InfrastructureBriefing() {
  return (
    <div className="flex flex-col gap-14">
      <div>
        <h3 className="font-sans text-lg text-cream">GitHub</h3>
        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-cream/65">
          GitHub stores the code used to build Eyes Closed and keeps a history of every change.
        </p>
        <BriefingGrid>
          <Field label="Organization">{CONTINUITY_WEBSITE.github.organization}</Field>
          <Field label="Primary repository">
            <ExternalLink href={CONTINUITY_WEBSITE.github.url}>
              {CONTINUITY_WEBSITE.github.repository}
            </ExternalLink>
          </Field>
          <Field label="Default branch">{CONTINUITY_WEBSITE.github.defaultBranch}</Field>
          <Field label="Visibility">{CONTINUITY_WEBSITE.github.visibility}</Field>
        </BriefingGrid>
        <p className="mt-6 max-w-[58ch] text-sm leading-relaxed text-cream/65">
          {CONTINUITY_WEBSITE.github.related}
        </p>
        <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-cream">
          If someone needs to update the website: {CONTINUITY_WEBSITE.github.ifSomeoneNeedsToUpdate}
        </p>
      </div>

      <div>
        <h3 className="font-sans text-lg text-cream">Vercel</h3>
        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-cream/65">
          Vercel is the service currently responsible for putting the website online.
        </p>
        <div className="mt-6">
          <BriefingGrid>
            <Field label="Account / team">{CONTINUITY_VERCEL.accountOwner}</Field>
            <Field label="Project">{CONTINUITY_VERCEL.projectName}</Field>
            <Field label="Connected repository">{CONTINUITY_VERCEL.githubRepository}</Field>
            <Field label="Production branch">{CONTINUITY_VERCEL.deploymentBranch}</Field>
            <Field label="Production URL">
              <ExternalLink href={CONTINUITY_VERCEL.productionUrl}>
                {CONTINUITY_VERCEL.productionUrl}
              </ExternalLink>
            </Field>
            <Field label="Dashboard">
              <ExternalLink href={CONTINUITY_VERCEL.dashboardUrl}>Open Vercel project</ExternalLink>
            </Field>
            <Field label="Last deployment">{CONTINUITY_VERCEL.lastDeployment}</Field>
            <Field label="Current status">{CONTINUITY_VERCEL.currentStatus}</Field>
          </BriefingGrid>
        </div>
        <p className="mt-6 max-w-[58ch] text-sm leading-relaxed text-cream/65">
          {CONTINUITY_VERCEL.envValuePolicy}
        </p>
        <ContinuityDisclosure title="Environment variable names">
          <ul className="flex flex-col gap-4">
            {CONTINUITY_VERCEL.environmentVariableNames.map((item) => (
              <li key={item.name}>
                <p className="font-mono text-[13px] text-cream">{item.name}</p>
                <p className="mt-1 text-sm text-cream/60">{item.containedIn}</p>
              </li>
            ))}
          </ul>
        </ContinuityDisclosure>
      </div>

      <div id="supabase-home">
        <h3 className="font-sans text-lg text-cream">Supabase</h3>
        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-cream/65">
          {CONTINUITY_SUPABASE.explainer}
        </p>
        <div className="mt-6">
          <BriefingGrid>
            <Field label="Organization">{CONTINUITY_SUPABASE.organization}</Field>
            <Field label="Project">{CONTINUITY_SUPABASE.projectName}</Field>
            <Field label="Project URL">
              <ExternalLink href={CONTINUITY_SUPABASE.dashboardUrl}>
                Open Supabase dashboard
              </ExternalLink>
            </Field>
            <Field label="Region">{CONTINUITY_SUPABASE.region}</Field>
            <Field label="Authentication">{CONTINUITY_SUPABASE.authentication}</Field>
            <Field label="Backup status">{CONTINUITY_SUPABASE.backupStatus}</Field>
          </BriefingGrid>
        </div>
        <div className="mt-8">
          <p className="font-sans text-xs tracking-[0.08em] text-cream/45 uppercase">What is stored there</p>
          <ul className="mt-3 max-w-[58ch] font-sans text-base leading-relaxed text-cream">
            {CONTINUITY_SUPABASE.storedInformation.map((item) => (
              <li key={item} className="border-t border-cream/10 py-2 first:border-t-0">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <ContinuityDisclosure title="Technical details">
          <p className="mb-4">
            These are the main tables. A developer can read the migrations in the repository for
            the full schema. You do not need this list to keep the site online.
          </p>
          <ul className="flex flex-col gap-3">
            {CONTINUITY_SUPABASE.importantTables.map((table) => (
              <li key={table.name}>
                <span className="font-mono text-[13px] text-cream">{table.name}</span>
                <span className="text-cream/60"> {table.purpose}</span>
              </li>
            ))}
          </ul>
        </ContinuityDisclosure>
      </div>
    </div>
  );
}

function FormlessBriefing() {
  return (
    <div>
      <BriefingGrid>
        <Field label="Book title">{CONTINUITY_FORMLESS.title}</Field>
        <Field label="Author">{CONTINUITY_FORMLESS.author}</Field>
        <Field label="Kindle / Amazon">
          <ExternalLink href={CONTINUITY_FORMLESS.kindleUrl}>
            ASIN {CONTINUITY_FORMLESS.kindleAsin}
          </ExternalLink>
        </Field>
        <Field label="KDP account">{CONTINUITY_FORMLESS.kdpAccount}</Field>
        <Field label="Audible">
          <ExternalLink href={CONTINUITY_FORMLESS.audibleUrl}>
            ASIN {CONTINUITY_FORMLESS.audibleAsin}
          </ExternalLink>
        </Field>
        <Field label="ACX">{CONTINUITY_FORMLESS.acx}</Field>
        <Field label="Print ISBN">{CONTINUITY_FORMLESS.printIsbn}</Field>
        <Field label="Print">{CONTINUITY_FORMLESS.printStatus}</Field>
        <Field label="Website pages">{CONTINUITY_FORMLESS.websitePages.join(', ')}</Field>
        <Field label="Royalty destination">{CONTINUITY_FORMLESS.royaltyDestination}</Field>
        <Field label="Publishing rights">{CONTINUITY_FORMLESS.publishingRights}</Field>
      </BriefingGrid>
      <div className="mt-8">
        <p className="font-sans text-xs tracking-[0.08em] text-cream/45 uppercase">Support contacts</p>
        <ul className="mt-3 max-w-[58ch] text-base leading-relaxed text-cream">
          {CONTINUITY_FORMLESS.supportContacts.map((item) => (
            <li key={item} className="border-t border-cream/10 py-2 first:border-t-0">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DistributionBriefing() {
  return (
    <p className="max-w-[58ch] text-base leading-relaxed text-cream/75">
      Kindle is available for purchase. Audible is live. Print is forthcoming under ISBN{' '}
      {CONTINUITY_FORMLESS.printIsbn}. Keep the KDP and ACX logins in 1Password. Store support is
      listed under Formless.
    </p>
  );
}

function AccountsBriefing() {
  return (
    <div className="flex flex-col">
      {CONTINUITY_CREDENTIALS.map((row) => (
        <article key={row.service} className="border-t border-cream/12 py-7 first:border-t-0 first:pt-0">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-sans text-lg text-cream">{row.service}</h3>
            <p className="font-sans text-sm text-cream/55">{importanceLabel(row.importance)}</p>
          </div>
          <div className="mt-5">
            <BriefingGrid>
              <Field label="Account email">{row.accountEmail}</Field>
              <Field label="Credential location">{row.credentialLocation}</Field>
              <Field label="2FA">{row.twoFactor}</Field>
              <Field label="Recovery method">{row.recoveryMethod}</Field>
            </BriefingGrid>
          </div>
        </article>
      ))}
    </div>
  );
}

function EmailBriefing() {
  return (
    <p className="max-w-[58ch] text-base leading-relaxed text-cream/75">
      Public mail is hello@eyesclosed.love. Newsletter sends use Zoho Campaigns. Signups also land
      in Supabase, so the list is not only inside Zoho. If mail stops arriving, check the mailbox
      host first, then the domain. Do not recreate the address somewhere else until you know the
      domain still points correctly.
    </p>
  );
}

function PaymentsBriefing() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {CONTINUITY_RUNNING.map((row) => (
          <article key={row.service} className="min-w-0 border-t border-cream/12 pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-sans text-lg text-cream">{row.service}</h3>
              <p className="text-sm text-cream/55">{importanceLabel(row.importance)}</p>
            </div>
            <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-cream/70">{row.purpose}</p>
            <p className="mt-4 text-sm text-cream/55">
              {row.billing}. {row.renewal}.
            </p>
          </article>
        ))}
      </div>
      <div className="mt-12">
        <BriefingGrid>
          <Field label="Approximate monthly operating cost">{CONTINUITY_COSTS.monthly}</Field>
          <Field label="Approximate annual operating cost">{CONTINUITY_COSTS.annual}</Field>
        </BriefingGrid>
      </div>
    </div>
  );
}

function SocialBriefing() {
  return (
    <div className="flex flex-col">
      {CONTINUITY_SOCIAL.map((channel) => (
        <article key={channel.name} className="border-t border-cream/12 py-7 first:border-t-0 first:pt-0">
          <h3 className="font-sans text-lg text-cream">{channel.name}</h3>
          <div className="mt-5">
            <BriefingGrid>
              <Field label="Username">
                {channel.url ? (
                  <ExternalLink href={channel.url}>{channel.username}</ExternalLink>
                ) : (
                  channel.username
                )}
              </Field>
              <Field label="Owner">{channel.owner}</Field>
              <Field label="Email used">{channel.emailUsed}</Field>
              <Field label="Credential location">{channel.credentialLocation}</Field>
              <Field label="2FA">{channel.twoFactor}</Field>
              <Field label="Purpose">{channel.purpose}</Field>
            </BriefingGrid>
          </div>
        </article>
      ))}
    </div>
  );
}

function PeopleBriefing() {
  return (
    <>
      {PEOPLE_CATEGORIES.map((category) => {
        const people = CONTINUITY_PEOPLE.filter((person) => person.category === category);
        if (people.length === 0) {
          if (category === 'Legal / Business') {
            return (
              <div key={category} className="mt-10 first:mt-0">
                <h3 className="font-sans text-lg text-cream">{category}</h3>
                <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-cream/65">
                  No legal contact is recorded here yet. Add counsel in 1Password when there is a
                  named person.
                </p>
              </div>
            );
          }
          return null;
        }
        return (
          <div key={category} className="mt-12 first:mt-0">
            <h3 className="font-sans text-lg text-cream">{category}</h3>
            <div className="mt-6 flex flex-col gap-10">
              {people.map((person) => (
                <article key={`${person.category}-${person.name}`}>
                  <h4 className="font-serif text-2xl font-light italic leading-[1.15] text-cream">
                    {person.name}
                  </h4>
                  <p className="mt-2 text-sm text-cream/55">{person.role}</p>
                  <div className="mt-5">
                    <BriefingGrid>
                      <Field label="Email">{person.email}</Field>
                      <Field label="Phone">{person.phone}</Field>
                      <Field label="What they know">{person.knows}</Field>
                      <Field label="When to contact">{person.whenToContact}</Field>
                    </BriefingGrid>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function WhatNotToDoBriefing() {
  return (
    <ul className="max-w-[58ch]">
      {CONTINUITY_WHAT_NOT_TO_DO.map((item) => (
        <li
          key={item}
          className="border-t border-cream/12 py-4 text-base leading-relaxed text-cream/80 first:border-t-0 first:pt-0"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
