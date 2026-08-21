export type BrandNavId =
  | "brand"
  | "signups"
  | "endorsements"
  | "book-launch"
  | "speaker-sheet"
  | "audible"
  | "audible-process"
  | "record-sessions"
  | "script-compare"
  | "audible-studio"
  | "zoom-backgrounds"
  | "brand-kit"
  | "client-review"
  | "design-system";

export type BrandNavSection = BrandNavId;

export type BrandNavItem = {
  id: BrandNavId;
  title: string;
  href: string;
  description: string;
};

export type BrandNavRoomId = "audience" | "audible" | "materials";

export type BrandNavRoom = {
  id: BrandNavRoomId;
  title: string;
  items: BrandNavItem[];
};

export const NAV_ROOMS: BrandNavRoom[] = [
  {
    id: "audience",
    title: "Audience",
    items: [
      {
        id: "signups",
        title: "Signups",
        href: "/brand/signups",
        description: "Book waitlist, Stay Close, and advance listen",
      },
      {
        id: "endorsements",
        title: "Endorsements",
        href: "/brand/endorsements",
        description: "Reader quotes",
      },
      {
        id: "book-launch",
        title: "Book launch campaign",
        href: "/brand/book-launch-campaign",
        description: "Warm, professional, and LinkedIn sequences",
      },
    ],
  },
  {
    id: "audible",
    title: "Audible",
    items: [
      {
        id: "record-sessions",
        title: "Record Sessions",
        href: "/audio/record-sessions",
        description: "Scripts for re-records",
      },
      {
        id: "script-compare",
        title: "Book vs audio",
        href: "/audio/script-compare",
        description: "Printed book text vs timed audio script",
      },
      {
        id: "audible",
        title: "Listen",
        href: "/audio/editorial",
        description: "Compare masters",
      },
      {
        id: "audible-process",
        title: "Process",
        href: "/audio/process",
        description: "What ACX needs to submit",
      },
      {
        id: "audible-studio",
        title: "Studio ladder",
        href: "/audio/editorial2",
        description: "Master phases toward Audible",
      },
    ],
  },
  {
    id: "materials",
    title: "Materials",
    items: [
      {
        id: "brand-kit",
        title: "Logos",
        href: "/brand-kit-export",
        description: "Download kit",
      },
      {
        id: "zoom-backgrounds",
        title: "Zoom backgrounds",
        href: "/zoom-backgrounds",
        description: "Virtual session plates",
      },
      {
        id: "speaker-sheet",
        title: "Speaker sheets",
        href: "/speaker-sheet",
        description: "Venue one-sheets",
      },
    ],
  },
];

export function navIdFromPath(pathname: string): BrandNavId {
  if (pathname === "/speaker-sheet") return "speaker-sheet";
  if (pathname === "/audio/companion" || pathname.startsWith("/audio/companion")) {
    return "audible";
  }
  if (pathname === "/advance-listen" || pathname.startsWith("/advance-listen")) {
    return "audible";
  }
  if (pathname === "/audio/process" || pathname.startsWith("/audio/process")) {
    return "audible-process";
  }
  if (
    pathname === "/audio/record-sessions" ||
    pathname.startsWith("/audio/record-sessions")
  ) {
    return "record-sessions";
  }
  if (
    pathname === "/audio/script-compare" ||
    pathname.startsWith("/audio/script-compare")
  ) {
    return "script-compare";
  }
  if (pathname === "/audio/editorial2" || pathname.startsWith("/audio/editorial2")) {
    return "audible-studio";
  }
  if (pathname === "/audio/editorial-v2" || pathname.startsWith("/audio/editorial-v2")) {
    return "audible";
  }
  if (pathname === "/audio/editorial" || pathname.startsWith("/audio/editorial")) {
    return "audible";
  }
  if (pathname === "/zoom-backgrounds") return "zoom-backgrounds";
  if (pathname === "/brand-kit-export") return "brand-kit";
  if (pathname === "/design-system") return "design-system";
  if (pathname === "/client/review" || pathname.startsWith("/client/review/")) {
    return "client-review";
  }
  if (pathname === "/brand/signups" || pathname.startsWith("/brand/signups")) {
    return "signups";
  }
  if (
    pathname === "/brand/endorsements" ||
    pathname.startsWith("/brand/endorsements")
  ) {
    return "endorsements";
  }
  if (
    pathname === "/brand/book-launch-campaign" ||
    pathname.startsWith("/brand/book-launch-campaign")
  ) {
    return "book-launch";
  }
  if (pathname === "/brand") return "brand";
  return "brand";
}

export function brandNavPlace(activeId: BrandNavId): {
  title: string;
  room: string;
} {
  for (const room of NAV_ROOMS) {
    const item = room.items.find((entry) => entry.id === activeId);
    if (item) return { title: item.title, room: room.title };
  }

  switch (activeId) {
    case "brand":
      return { title: "Eyes Closed", room: "Toolkit" };
    case "design-system":
      return { title: "Design system", room: "Toolkit" };
    case "client-review":
      return { title: "Client review", room: "Toolkit" };
    case "signups":
    case "endorsements":
    case "book-launch":
    case "speaker-sheet":
    case "audible":
    case "audible-process":
    case "record-sessions":
    case "script-compare":
    case "audible-studio":
    case "zoom-backgrounds":
    case "brand-kit":
      return { title: "Eyes Closed", room: "Toolkit" };
    default: {
      const _never: never = activeId;
      return _never;
    }
  }
}
