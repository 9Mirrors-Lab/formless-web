# Website content architecture guide

How the Formless marketing site is organized: brand foundation, messaging, services, and content pillars drawn from the book.

## Website foundation: Eyes Closed

The overarching brand for services is **Eyes Closed** — a space for people to enter once they resonate with the message of Formless.

## Core messaging and mission

**Mission:** Provide a space for individuals to see beyond the mind, navigate awareness in daily life, and identify unconscious patterns.

**Insight hook:** Start with the core realization from the book:

> You are not the voice in your head. You are not your thoughts.

**Key themes to highlight:**

- **From seeking to seeing** — Moving from a sense of lack to the recognition of untouched wholeness already within.
- **The formless essence** — At a subatomic level we are mostly space; we are the awareness in which the world of form appears.

## Service offerings (the doorways)

**Name options (pick or combine):**

| Name | Notes |
| --- | --- |
| Inner alignment guidance | Service framing |
| Guide for self discovery | Service framing |
| Inner Clarity Consulting | Consulting offer |
| Return to inner guidance with Soni C. | Positioning line for sessions and consulting |

| Format | Purpose |
| --- | --- |
| 1:1 · consulting | Personalized inner guidance under the names above |
| Large group sessions | Author/speaker; scale beyond 1:1 |
| Video · speaking | Free and paid content; use video framework below |
| Free resources | Entry points when ready (PDFs, prompts) |

### Video framework

Use for YouTube and teaching clips, especially relationship-themed content:

1. **Hook** — human experience; get attention
2. **Awareness** — if you are experiencing that…
3. **Acceptance** — can you accept how things are in this moment; how you feel; that you are unhappy
4. **Investigation** — why do you need this person to be different; what belief are you holding onto
5. **Letting go** — release that belief
6. **Reflection**
7. **Stillness** — end here

### Content angle

Build from the **relationship view** on the site. Example entry question: *How long have you been in a relationship?*

## Content organization by pillar

Organize the deep philosophy of the book into navigable sections:

### I. The personal prison (the why)

Address the pain points the audience feels:

- **The illusion of lack** — The feeling that fulfillment is always one change away (a new house, job, or relationship).
- **Unseen patterns** — How we live from memory rather than presence, repeating inherited programs from family and culture.
- **The cost of resistance** — How arguing with "what is" creates tension, exhaustion, and unnecessary suffering.

### II. The shift to awareness (the how)

Explain the transition from the mind to the self:

- **The power of noticing** — Recognizing that if you can watch your thoughts, you are not the one thinking them.
- **Dissolving the ego** — Identifying the ego not as a flaw, but as a structure of identification with thought and psychological time.
- **The role of stillness** — Using nature and animals as mirrors to return to our default state of peace.

### III. Awareness in daily life (the practical application)

Show how this philosophy transforms real-world situations:

- **Conscious relationships** — Shifting from need and attachment to presence; seeing children as their own beings rather than extensions of our fears.
- **Work and purpose** — Redefining success as a state of consciousness rather than a title; moving from striving from lack to creating from presence.

## Website plan

Live draft: [formless-web.vercel.app](https://formless-web.vercel.app/). Copy keys match Supabase `page.section.field`.

**Pillar mapping:** Why (personal prison) · How (shift to awareness) · Apply (daily life)

| Route | Page | Role |
| --- | --- | --- |
| `/` | Home | Insight hook · threshold into the work |
| `/work` | The Practice | Practice categories · relational copy |
| `/book` | Formless | Book page under Eyes Closed org |
| `/science` | Science | Spirituality and science bridge |
| `/about` | About | Soni's story · mission |
| later | Offerings | Consulting · groups · resources when ready |

### Copy slots by page

**Home**

- `home · hero · headline` — Primary hook. Pastel: keep or Soni's spiritual headline.
- `home · hero · subhead` — Quiet invitation to go within.
- `home · hero · cta` — A moment to go within vs reflect (open).
- `home · curtain · panels` — THE VOICE vs Mind / Thoughts / Beliefs split (open).

**The Practice · /work**

- `work · header · eyebrow` — The Work → The Practice (Pastel).
- `work · categories · copy` — Longer relational copy per category.
- `work · reframe · body` — Full teaching paragraph from Soni.

**Formless · /book**

- `book · intro · body` — Formless stays the book title here, not the site brand.
- `book · teaching · body` — Core teaching from the manuscript.

**Science · /science**

- `science · nav · label` — The Science of Spirituality vs Spirituality & Science (open).
- `science · intro · body` — Bridge chapter themes to accessible site copy.

**About · /about**

- `about · story · lead` — Soni's awakening story (bathroom, Dr. Joe Dispenza).
- `about · mission · body` — Mission and what Eyes Closed is.

**Global · nav & footer**

- `site · nav · brand` — Formless → Eyes Closed (org). Formless on /book only.
- `site · footer · explore` — Mirror nav labels; The Practice link.

**Later pages (when offerings launch):** Inner guidance / consulting · Large group sessions · Resources / PDFs · Contact / booking

## Next steps for development

- **Soni: Story section** — Use Soni's personal awakening story (standing in the bathroom listening to Dr. Joe Dispenza) as the relatable entry point for the About page.
- **Visual strategy** — Leverage imagery of nature (trees, vast skies, stillness) from Chapter 7 to create a calming, grounded interface.
