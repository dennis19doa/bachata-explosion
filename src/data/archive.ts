export type ArchiveEvent = {
  slug: string;
  title: string;
  year: 2022 | 2023 | 2024 | 2025 | 2026;
  category: "Festival" | "Role Rotation" | "Special Edition";
  cover: string;
  legacyUrl: string;
  summary?: string;
  photographer?: string;
  albumGroups?: string[];
  /** Original WordPress album-card image filename, keyed by recovered album slug. */
  albumCoverHints?: Record<string, string>;
};

export const archiveEvents: ArchiveEvent[] = [
  {
    slug: "role-rotation-2026",
    title: "Role Rotation",
    year: 2026,
    category: "Role Rotation",
    cover: "/media/archive/role-rotation-2026.jpg",
    legacyUrl: "https://bachataexplosion.com/role-rotation-2026/",
    summary: "A weekend built around curiosity, empathy and the freedom to understand bachata from both sides of the connection.",
    photographer: "Bachata Explosion media team",
    albumGroups: ["All moments", "Friday workshop", "Friday party", "Saturday workshop", "Saturday party", "Sunday social"],
  },
  {
    slug: "elite-dance-3",
    title: "Elite Dance #3",
    year: 2026,
    category: "Special Edition",
    cover: "/media/archive/elite-dance-3.jpg",
    legacyUrl: "https://bachataexplosion.com/elite-dance-3/",
  },
  {
    slug: "elite-dance-2-2025",
    title: "Elite Dance #2",
    year: 2025,
    category: "Special Edition",
    cover: "/media/archive/elite-dance-2-2025.jpg",
    legacyUrl: "https://bachataexplosion.com/november-photos/",
  },
  {
    slug: "berlin-bachata-festival-2025",
    title: "Berlin Bachata Festival",
    year: 2025,
    category: "Festival",
    cover: "/media/archive/bbf-2025.jpg",
    legacyUrl: "https://bachataexplosion.com/berlin-bachata-festival/",
    albumCoverHints: {
      "friday-workshops": "Freitag-Workshops-296-1-1600.webp",
      "friday-party": "Freitag-Party-241-1600.webp",
      "saturday-workshops": "Samstag-Workshops-326-1600.webp",
      "saturday-party": "Samstag-Party-60-1600.webp",
      "sunday-workshops": "Sonntag-Workshops-56-1600.webp",
      "sunday-party": "Sonntag-Workshops-278-1600.webp",
    },
  },
  {
    slug: "elite-dance-1-2025",
    title: "Elite Dance #1",
    year: 2025,
    category: "Special Edition",
    cover: "/media/archive/elite-dance-1-2025.jpg",
    legacyUrl: "https://bachataexplosion.com/september-event-photos/",
  },
  {
    slug: "summer-edition-2025",
    title: "Summer Edition",
    year: 2025,
    category: "Special Edition",
    cover: "/media/archive/summer-2025.jpg",
    legacyUrl: "https://bachataexplosion.com/explosion-summer-edition-2025/",
    albumCoverHints: {
      friday: "Freitag-Party-70-web-1600.webp",
      "saturday-workshops": "64a3e4163005-web-1600.webp",
      "saturday-party": "Saturday-Party-Web-2-1600.webp",
      "sunday-workshops": "Freitag-Party-720-1600.webp",
      "sunday-social": "Sonntag-Social-88-1600.webp",
    },
  },
  {
    slug: "role-rotation-2025",
    title: "Role Rotation",
    year: 2025,
    category: "Role Rotation",
    cover: "/media/archive/role-rotation-2025.jpg",
    legacyUrl: "https://bachataexplosion.com/role-rotation-2025/",
    albumCoverHints: {
      friday: "admin-ajax-6-600.webp",
      saturday: "admin-ajax-7-600.webp",
      sunday: "admin-ajax-8-600.webp",
    },
  },
  {
    slug: "berlin-bachata-festival-2024",
    title: "Berlin Bachata Festival",
    year: 2024,
    category: "Festival",
    cover: "/media/archive/bbf-2024.jpg",
    legacyUrl: "https://bachataexplosion.com/berlin-bachata-festival-2024/",
    albumCoverHints: {
      "friday-party": "admin-ajax-600.webp",
      "friday-workshops": "admin-ajax-1-600.webp",
      "saturday-workshops": "admin-ajax-2-600.webp",
      "saturday-party": "admin-ajax-3-600.webp",
      "sunday-workshops": "admin-ajax-4-600.webp",
      "sunday-party": "admin-ajax-5-600.webp",
    },
  },
  {
    slug: "summer-edition-2024",
    title: "Summer Edition",
    year: 2024,
    category: "Special Edition",
    cover: "/media/archive/summer-2024.jpg",
    legacyUrl: "https://bachataexplosion.com/summer-edition-2024/",
    albumCoverHints: {
      friday: "Freitag-Party-5-1600.webp",
      "saturday-workshops": "Samstag-Workshops-50-1600.webp",
      "saturday-party": "Samstag-Party-113-1600.webp",
      "sunday-workshops": "Sonntag-Workshops-74-1600.webp",
      "sunday-party": "2024.07.28-18-10-IMG_-Rating_1-3-1600.webp",
    },
  },
  {
    slug: "role-rotation-2024",
    title: "Role Rotation",
    year: 2024,
    category: "Role Rotation",
    cover: "/media/archive/role-rotation-2024.jpg",
    legacyUrl: "https://bachataexplosion.com/role-rotation-2024/",
    albumCoverHints: {
      friday: "DSC_0972-Verbessert-RR-1-1600.webp",
      "saturday-workshops": "DSC_1735-1600.webp",
      "saturday-party": "DSC_2785-1600.webp",
      "sunday-workshops": "DSC_3202-1600.webp",
    },
  },
  {
    slug: "berlin-bachata-festival-2023",
    title: "Berlin Bachata Festival",
    year: 2023,
    category: "Festival",
    cover: "/media/archive/bbf-2023.jpg",
    legacyUrl: "https://bachataexplosion.com/berlin-bachata-festival-2023/",
    albumCoverHints: {
      "friday-party": "Party-Friday-119-1-1600.webp",
      "friday-workshops": "Workshops-Friday-166-1-1600.webp",
      "saturday-party": "2023.10.29-00-29-IMG_3829-Rating_1-1600.webp",
      "saturday-workshops": "Workshops-Saturday-266-1600.webp",
      "sunday-party": "Party-Sunday-24-1-1600.webp",
      "sunday-workshops": "Workshops-Sunday-153-1600.webp",
    },
  },
  {
    slug: "summer-edition-2023",
    title: "Summer Edition",
    year: 2023,
    category: "Special Edition",
    cover: "/media/archive/summer-2023.jpg",
    legacyUrl: "https://bachataexplosion.com/summer-edition-2023/",
    albumCoverHints: {
      friday: "2023.07.21-23-59-IMG_3035-Rating_1-scaled-2-1600.webp",
      saturday: "Party-123-1600.webp",
      workshops: "Workshops-205-1600.webp",
    },
  },
  {
    slug: "hamburg-explosion-2023",
    title: "Hamburg Explosion",
    year: 2023,
    category: "Special Edition",
    cover: "/media/archive/hamburg-2023.jpg",
    legacyUrl: "https://bachataexplosion.com/hamburg-edition/",
  },
  {
    slug: "gold-edition-2022",
    title: "Gold Edition",
    year: 2022,
    category: "Special Edition",
    cover: "/media/archive/gold-2022.jpg",
    legacyUrl: "https://bachataexplosion.com/golden-edition-2022/",
  },
  {
    slug: "dominican-edition-2022",
    title: "Dominican Edition",
    year: 2022,
    category: "Special Edition",
    cover: "/media/archive/dominican-2022.jpg",
    legacyUrl: "https://bachataexplosion.com/dominican-edition/",
  },
  {
    slug: "sensual-weekend-2022",
    title: "Sensual Weekend",
    year: 2022,
    category: "Special Edition",
    cover: "/media/archive/sensual-weekend-2022.jpg",
    legacyUrl: "https://bachataexplosion.com/sensual-weekend-22/",
  },
];
