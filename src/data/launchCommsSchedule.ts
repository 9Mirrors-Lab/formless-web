/** Communication runway for the Formless Kindle / Audible launch. */

export const SCHEDULE_DESK_PATH = "/brand/schedule";

export type ScheduleOwnerId = "soni" | "ops" | "copy";

export type ScheduleWindowId = "now" | "day" | "after";

export type SchedulePhaseId =
  | "lock"
  | "quiet"
  | "approach"
  | "day"
  | "settle"
  | "teach";

export type ScheduleStatus = "blocked" | "next" | "later";

export type ScheduleChannelId = "email" | "linkedin" | "instagram";

export type ScheduleListId = "waitlist" | "stay-close" | "advance";

export type ScheduleOwner = {
  id: ScheduleOwnerId;
  name: string;
  role: string;
};

export type SchedulePhase = {
  id: SchedulePhaseId;
  when: string;
  title: string;
  job: string;
  window: ScheduleWindowId;
  start: string;
  end: string;
};

export type ScheduleWork = {
  id: string;
  title: string;
  when: string;
  phase: SchedulePhaseId;
  window: ScheduleWindowId;
  work: string;
  channel: ScheduleChannelId | null;
  alsoChannels?: readonly ScheduleChannelId[];
  lists?: readonly ScheduleListId[];
  surface?: string;
  purpose: string;
  owner: ScheduleOwnerId;
  status: ScheduleStatus;
};

export type ScheduleChannel = {
  id: ScheduleChannelId;
  title: string;
  job: string;
  before: string;
  day: string;
  after: string;
};

export type ScheduleList = {
  id: ScheduleListId;
  title: string;
  job: string;
  before: string;
  day: string;
  after: string;
};

export type ScheduleView = "people" | "channels" | "lists";

export type ScheduleFilters = {
  view: ScheduleView;
  who: ScheduleOwnerId | "all";
  window: ScheduleWindowId | "all";
  phase: SchedulePhaseId | "all";
  item: string | null;
};

export type ScheduleWindow = {
  id: ScheduleWindowId;
  label: string;
  dates: string;
};

export const SCHEDULE_WINDOWS: readonly ScheduleWindow[] = [
  { id: "now", label: "Before", dates: "Aug 21–31" },
  { id: "day", label: "Launch day", dates: "Sep 1" },
  { id: "after", label: "After", dates: "Sep 2–Nov" },
];

export const SCHEDULE_OWNERS: readonly ScheduleOwner[] = [
  { id: "soni", name: "Soni", role: "Voice and relationships" },
  { id: "ops", name: "Ops", role: "Lists, links, send path" },
  { id: "copy", name: "Copy", role: "Letters, listing, pages" },
] as const;

export const SCHEDULE_PHASES: readonly SchedulePhase[] = [
  {
    id: "lock",
    when: "Aug 21–23",
    title: "Lock the words",
    job: "Voice, lists, links, kit",
    window: "now",
    start: "2026-08-21",
    end: "2026-08-23",
  },
  {
    id: "quiet",
    when: "Aug 24–27",
    title: "Quiet open",
    job: "One story",
    window: "now",
    start: "2026-08-24",
    end: "2026-08-27",
  },
  {
    id: "approach",
    when: "Aug 28–31",
    title: "Approach",
    job: "Site ready, kit to helpers",
    window: "now",
    start: "2026-08-28",
    end: "2026-08-31",
  },
  {
    id: "day",
    when: "Sep 1",
    title: "Launch day",
    job: "One note, one post, flip",
    window: "day",
    start: "2026-09-01",
    end: "2026-09-01",
  },
  {
    id: "settle",
    when: "Sep 2–7",
    title: "Settle",
    job: "Thanks, optional review",
    window: "after",
    start: "2026-09-02",
    end: "2026-09-07",
  },
  {
    id: "teach",
    when: "Sep–Nov",
    title: "Teach",
    job: "Excerpts",
    window: "after",
    start: "2026-09-08",
    end: "2026-11-30",
  },
] as const;

export const SCHEDULE_WORK: readonly ScheduleWork[] = [
  {
    id: "intake",
    title: "Author intake",
    when: "Aug 21–22",
    phase: "lock",
    window: "now",
    work: "Fill author intake: why the book, who it is for, one honest sentence to the people closest to Soni",
    channel: null,
    surface: "Prep",
    purpose:
      "Every public sentence comes from this. The desk templates are blank until this exists.",
    owner: "soni",
    status: "blocked",
  },
  {
    id: "voice",
    title: "Rewrite launch copy",
    when: "Aug 21–22",
    phase: "lock",
    window: "now",
    work: "Rewrite the existing launch emails and LinkedIn posts into Formless voice. Drop Amazon-visibility language, fake urgency, and launch-team hype.",
    channel: "email",
    alsoChannels: ["linkedin"],
    purpose:
      "The current desk is a generic book-launch kit. Shipping it as-is would contradict the teaching.",
    owner: "copy",
    status: "next",
  },
  {
    id: "lists",
    title: "Split the three lists",
    when: "Aug 21–23",
    phase: "lock",
    window: "now",
    work: "Split three owned lists and decide who hears from which: book waitlist, Stay Close, advance listen.",
    channel: "email",
    lists: ["waitlist", "stay-close", "advance"],
    purpose:
      "Waitlist people get one clear letter. Stay Close stays a relationship. Mixing the lists makes both feel like marketing.",
    owner: "ops",
    status: "next",
  },
  {
    id: "listing",
    title: "Kindle / Audible listing",
    when: "Aug 21–24",
    phase: "lock",
    window: "now",
    work: "Write Kindle and Audible listing copy from the same positioning: who it is for, the core insight, what it is not. Title, subtitle, description, categories, keywords.",
    channel: null,
    surface: "Amazon / Audible",
    purpose:
      "Most strangers will meet the book here, not on the site. This is storefront language, still sanctuary-toned.",
    owner: "copy",
    status: "next",
  },
  {
    id: "book-page",
    title: "Lock /book copy",
    when: "Aug 22–26",
    phase: "lock",
    window: "now",
    work: "Lock /book copy for two states: waitlist (now) and available (launch morning). Same voice. Buy Kindle / listen Audible as the only asks.",
    channel: null,
    surface: "Website",
    purpose:
      "The site is the stable home. It should not shout launch week. It should make the doorway obvious.",
    owner: "copy",
    status: "next",
  },
  {
    id: "kit",
    title: "Sharing kit",
    when: "Aug 23–26",
    phase: "lock",
    window: "now",
    work: "Build a small sharing kit: cover image, 1-paragraph description, 3 captions (personal / quiet / professional), buy + listen links, optional review note.",
    channel: null,
    surface: "Kit",
    purpose:
      "People who want to help should not have to invent the words. Keep the kit short so it does not feel like a campaign pack.",
    owner: "ops",
    status: "next",
  },
  {
    id: "sender",
    title: "Confirm send path",
    when: "Aug 22–24",
    phase: "lock",
    window: "now",
    work: "Decide who sends, from which address, and with which tool. Confirm waitlist and Stay Close can actually receive a letter on Sep 1.",
    channel: "email",
    lists: ["waitlist", "stay-close"],
    purpose:
      "Copy without a send path is not communication. This is the only ops gate that can silently kill launch day.",
    owner: "ops",
    status: "blocked",
  },
  {
    id: "linkedin-story",
    title: "Why-I-wrote post",
    when: "Aug 25–27",
    phase: "quiet",
    window: "now",
    work: "One LinkedIn post: why the book exists, who it is for. No purchase link in the body. Story first.",
    channel: "linkedin",
    purpose:
      "Plant recognition before the announcement. Announcement without story reads as promotion.",
    owner: "soni",
    status: "next",
  },
  {
    id: "waitlist-almost",
    title: "Almost-here letter",
    when: "Aug 28",
    phase: "approach",
    window: "now",
    work: "One waitlist letter: the book is nearly here, what it is, no countdown, no scarcity.",
    channel: "email",
    lists: ["waitlist"],
    purpose:
      "People who wanted to hear deserve a letter. Once is enough before the day.",
    owner: "copy",
    status: "later",
  },
  {
    id: "stay-close-almost",
    title: "Stay Close almost-here",
    when: "Aug 28",
    phase: "approach",
    window: "now",
    work: "Quieter Stay Close letter: the book is nearly here. Same facts, less announcement.",
    channel: "email",
    lists: ["stay-close"],
    purpose:
      "Stay Close is a relationship. They should hear it as a continuation, not a campaign.",
    owner: "copy",
    status: "later",
  },
  {
    id: "helpers",
    title: "Send kit to helpers",
    when: "Aug 29–31",
    phase: "approach",
    window: "now",
    work: "Send the sharing kit only to people who already offered to help. Invite, do not assign.",
    channel: null,
    surface: "Kit",
    purpose:
      "A launch team with homework would fight the teaching. Willing helpers with ready words is enough.",
    owner: "soni",
    status: "later",
  },
  {
    id: "site-flip",
    title: "Flip /book live",
    when: "Sep 1 morning",
    phase: "day",
    window: "day",
    work: "Flip /book from waitlist to live buy/listen links. Check the homepage doorway still feels like a sanctuary, not a storefront.",
    channel: null,
    surface: "Website",
    purpose: "Launch day is a state change on the site, not a campaign blast.",
    owner: "ops",
    status: "later",
  },
  {
    id: "launch-email",
    title: "Available letter",
    when: "Sep 1 morning",
    phase: "day",
    window: "day",
    work: "One waitlist letter: the book is available, who it is for, Kindle + Audible links, no review ask yet.",
    channel: "email",
    lists: ["waitlist"],
    purpose:
      "One letter. The ask is to meet the book, not to manufacture Amazon rank.",
    owner: "copy",
    status: "later",
  },
  {
    id: "stay-close-available",
    title: "Stay Close available letter",
    when: "Sep 1 morning",
    phase: "day",
    window: "day",
    work: "Stay Close letter: the book is available. Same links. Spoken as a relationship, not a launch.",
    channel: "email",
    lists: ["stay-close"],
    purpose:
      "Same door. Different weight. Stay Close should not feel like a second waitlist blast.",
    owner: "copy",
    status: "later",
  },
  {
    id: "launch-li",
    title: "It-is-here post",
    when: "Sep 1",
    phase: "day",
    window: "day",
    work: "One LinkedIn post: it is here. Same story as the email, shorter. Link in the first comment, not the post body.",
    channel: "linkedin",
    purpose: "Public announcement for people who are not on the lists.",
    owner: "soni",
    status: "later",
  },
  {
    id: "advance-listen",
    title: "Audio is public",
    when: "Sep 1",
    phase: "day",
    window: "day",
    work: "Note to advance-listen people: the audiobook is public now. Same links. No extra sequence.",
    channel: "email",
    lists: ["advance"],
    purpose:
      "They already crossed a threshold. Treat them as early companions, not a second list to squeeze.",
    owner: "ops",
    status: "later",
  },
  {
    id: "thanks",
    title: "Thank-you note",
    when: "Sep 2–4",
    phase: "settle",
    window: "after",
    work: "Thank-you note to waitlist and helpers. No metrics theater. One sentence of what the day meant.",
    channel: "email",
    alsoChannels: ["linkedin"],
    lists: ["waitlist"],
    purpose:
      "Close the launch gesture. Gratitude is the brand; scoreboard language is not.",
    owner: "soni",
    status: "later",
  },
  {
    id: "stay-close-thanks",
    title: "Stay Close thank-you",
    when: "Sep 2–4",
    phase: "settle",
    window: "after",
    work: "Thank-you note to Stay Close. No metrics. The relationship continues into teaching.",
    channel: "email",
    lists: ["stay-close"],
    purpose:
      "Close the launch gesture without turning Stay Close into a campaign list.",
    owner: "soni",
    status: "later",
  },
  {
    id: "reviews",
    title: "Honest-review invite",
    when: "Sep 4–7",
    phase: "settle",
    window: "after",
    work: "Optional honest-review invitation to people who have actually read or listened. Two or three sentences is enough. Never pay or perk for a review.",
    channel: "email",
    purpose:
      "Reviews help a stranger decide. They are not a launch tactic. Ask only people who met the work.",
    owner: "copy",
    status: "later",
  },
  {
    id: "excerpt-1",
    title: "First teaching excerpt",
    when: "Sep 8–14",
    phase: "teach",
    window: "after",
    work: "First public teaching excerpt. Use the site pillars: the voice vs the awareness, or a relationship scene. Not a recap of launch week.",
    channel: null,
    surface: "Website",
    purpose:
      "The campaign becomes the teaching. This is where Formless actually lives.",
    owner: "soni",
    status: "later",
  },
];

export const SCHEDULE_CHANNELS: readonly ScheduleChannel[] = [
  {
    id: "email",
    title: "Email",
    job: "Letters to the lists",
    before: "Split lists, confirm send, almost-here letters",
    day: "Waitlist, Stay Close, and advance letters",
    after: "Thanks, then reviews",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    job: "Public story",
    before: "One why-I-wrote post",
    day: "One it-is-here post",
    after: "Lessons, not recaps",
  },
  {
    id: "instagram",
    title: "Instagram",
    job: "Public visual",
    before: "None scheduled",
    day: "None scheduled",
    after: "None scheduled",
  },
];

export const SCHEDULE_LISTS: readonly ScheduleList[] = [
  {
    id: "waitlist",
    title: "Book waitlist",
    job: "People who wanted to hear",
    before: "One almost-here letter",
    day: "One available letter",
    after: "Thanks, then teaching",
  },
  {
    id: "stay-close",
    title: "Stay Close",
    job: "Ongoing relationship",
    before: "Same letter or quieter",
    day: "Same available letter",
    after: "Thanks, then teaching",
  },
  {
    id: "advance",
    title: "Advance listen",
    job: "Early companions",
    before: "No extra sequence",
    day: "Audio is public now",
    after: "Invite into teaching",
  },
];

export const LAUNCH_DAY_SCRIPT = {
  morning: [
    "Flip /book to live links.",
    "Waitlist: available letter.",
    "Stay Close: available letter.",
    "Advance listen: the audiobook is public now.",
  ],
  day: [
    "LinkedIn post from Soni. Link in the first comment.",
    "Reply to anyone who writes back the same day.",
  ],
  skip: [
    "No second email. No countdown. No “last chance.”",
    "No review ask. No launch-week scoreboard.",
    "No ads or consulting pitch.",
  ],
} as const;

const OWNER_IDS = ["soni", "ops", "copy"] as const satisfies readonly ScheduleOwnerId[];
const WINDOW_IDS = ["now", "day", "after"] as const satisfies readonly ScheduleWindowId[];
const VIEW_IDS = ["people", "channels", "lists"] as const satisfies readonly ScheduleView[];
const PHASE_IDS = SCHEDULE_PHASES.map((phase) => phase.id);

function isOwnerId(value: string): value is ScheduleOwnerId {
  return (OWNER_IDS as readonly string[]).includes(value);
}

function isWindowId(value: string): value is ScheduleWindowId {
  return (WINDOW_IDS as readonly string[]).includes(value);
}

function isViewId(value: string): value is ScheduleView {
  return (VIEW_IDS as readonly string[]).includes(value);
}

function isPhaseId(value: string): value is SchedulePhaseId {
  return (PHASE_IDS as readonly string[]).includes(value);
}

export function ownerById(id: ScheduleOwnerId): ScheduleOwner {
  const owner = SCHEDULE_OWNERS.find((entry) => entry.id === id);
  if (!owner) {
    throw new Error(`Unknown schedule owner: ${id}`);
  }
  return owner;
}

export function phaseById(id: SchedulePhaseId): SchedulePhase {
  const phase = SCHEDULE_PHASES.find((entry) => entry.id === id);
  if (!phase) {
    throw new Error(`Unknown schedule phase: ${id}`);
  }
  return phase;
}

export function channelById(id: ScheduleChannelId): ScheduleChannel {
  const channel = SCHEDULE_CHANNELS.find((entry) => entry.id === id);
  if (!channel) {
    throw new Error(`Unknown schedule channel: ${id}`);
  }
  return channel;
}

export function listById(id: ScheduleListId): ScheduleList {
  const list = SCHEDULE_LISTS.find((entry) => entry.id === id);
  if (!list) {
    throw new Error(`Unknown schedule list: ${id}`);
  }
  return list;
}

export function findScheduleWork(id: string | null | undefined): ScheduleWork | null {
  if (!id) return null;
  return SCHEDULE_WORK.find((item) => item.id === id) ?? null;
}

export function channelsFor(item: ScheduleWork): ScheduleChannelId[] {
  const ids: ScheduleChannelId[] = [];
  if (item.channel) ids.push(item.channel);
  for (const extra of item.alsoChannels ?? []) {
    if (!ids.includes(extra)) ids.push(extra);
  }
  return ids;
}

export function listsFor(item: ScheduleWork): ScheduleListId[] {
  return [...(item.lists ?? [])];
}

export function workTouchesChannel(
  item: ScheduleWork,
  channel: ScheduleChannelId,
): boolean {
  return channelsFor(item).includes(channel);
}

export function workTouchesList(
  item: ScheduleWork,
  list: ScheduleListId,
): boolean {
  return listsFor(item).includes(list);
}

export function workLaneLabel(item: ScheduleWork): string {
  if (item.channel) return channelById(item.channel).title;
  if (item.surface) return item.surface;
  return "";
}

export function workListTitles(item: ScheduleWork): string[] {
  return listsFor(item).map((id) => listById(id).title);
}

export function phasesForWindow(
  window: ScheduleWindowId,
): readonly SchedulePhase[] {
  return SCHEDULE_PHASES.filter((phase) => phase.window === window);
}

export function itemsForOwner(owner: ScheduleOwnerId | "all"): readonly ScheduleWork[] {
  if (owner === "all") return SCHEDULE_WORK;
  return SCHEDULE_WORK.filter((item) => item.owner === owner);
}

export function itemsForWindow(
  window: ScheduleWindowId | "all",
): readonly ScheduleWork[] {
  if (window === "all") return SCHEDULE_WORK;
  return SCHEDULE_WORK.filter((item) => item.window === window);
}

export function itemsForPhase(phase: SchedulePhaseId): readonly ScheduleWork[] {
  return SCHEDULE_WORK.filter((item) => item.phase === phase);
}

export function filterScheduleWork(
  filters: Pick<ScheduleFilters, "who" | "window" | "phase">,
): ScheduleWork[] {
  return SCHEDULE_WORK.filter((item) => {
    if (filters.who !== "all" && item.owner !== filters.who) return false;
    if (filters.window !== "all" && item.window !== filters.window) return false;
    if (filters.phase !== "all" && item.phase !== filters.phase) return false;
    return true;
  });
}

export function workInCell(
  items: readonly ScheduleWork[],
  owner: ScheduleOwnerId,
  phase: SchedulePhaseId,
): ScheduleWork[] {
  return items.filter((item) => item.owner === owner && item.phase === phase);
}

export function workInChannelCell(
  items: readonly ScheduleWork[],
  channel: ScheduleChannelId,
  phase: SchedulePhaseId,
): ScheduleWork[] {
  return items.filter(
    (item) => item.phase === phase && workTouchesChannel(item, channel),
  );
}

export function workInListCell(
  items: readonly ScheduleWork[],
  list: ScheduleListId,
  phase: SchedulePhaseId,
): ScheduleWork[] {
  return items.filter(
    (item) => item.phase === phase && workTouchesList(item, list),
  );
}

export function statusLabel(status: ScheduleStatus): string {
  switch (status) {
    case "blocked":
      return "Needs a decision";
    case "next":
      return "This week";
    case "later":
      return "On the calendar";
    default: {
      const _never: never = status;
      return _never;
    }
  }
}

export function summarizeSchedule(items: readonly ScheduleWork[] = SCHEDULE_WORK) {
  return {
    total: items.length,
    blocked: items.filter((item) => item.status === "blocked").length,
    next: items.filter((item) => item.status === "next").length,
    later: items.filter((item) => item.status === "later").length,
    byOwner: {
      soni: items.filter((item) => item.owner === "soni").length,
      ops: items.filter((item) => item.owner === "ops").length,
      copy: items.filter((item) => item.owner === "copy").length,
    },
  };
}

function isoDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function currentPhaseId(now = new Date()): SchedulePhaseId | null {
  const today = isoDay(now);
  const match = SCHEDULE_PHASES.find(
    (phase) => today >= phase.start && today <= phase.end,
  );
  return match?.id ?? null;
}

export function scheduleDeskHref(filters?: Partial<ScheduleFilters>): string {
  const params = new URLSearchParams();
  if (filters?.view && filters.view !== "people") params.set("view", filters.view);
  if (filters?.who && filters.who !== "all") params.set("who", filters.who);
  if (filters?.window && filters.window !== "all") params.set("window", filters.window);
  if (filters?.phase && filters.phase !== "all") params.set("phase", filters.phase);
  if (filters?.item) params.set("item", filters.item);
  const query = params.toString();
  return query ? `${SCHEDULE_DESK_PATH}?${query}` : SCHEDULE_DESK_PATH;
}

export function scheduleFiltersFromSearch(search: string): ScheduleFilters {
  const params = new URLSearchParams(search);
  const viewRaw = params.get("view") ?? "people";
  const whoRaw = params.get("who") ?? "all";
  const windowRaw = params.get("window") ?? "all";
  const phaseRaw = params.get("phase") ?? "all";
  const item = params.get("item");

  return {
    view: isViewId(viewRaw) ? viewRaw : "people",
    who: whoRaw === "all" || isOwnerId(whoRaw) ? whoRaw : "all",
    window: windowRaw === "all" || isWindowId(windowRaw) ? windowRaw : "all",
    phase: phaseRaw === "all" || isPhaseId(phaseRaw) ? phaseRaw : "all",
    item: findScheduleWork(item)?.id ?? null,
  };
}
