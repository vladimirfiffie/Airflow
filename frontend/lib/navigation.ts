export type NavLink = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  links?: NavLink[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Flights",
    links: [
      { label: "Search Flights", href: "/search" },
      { label: "Flights Overview", href: "/flights" },
      { label: "Schedule Calendar", href: "/flights/schedule" },
      { label: "Flight Details", href: "/flight-details" },
    ],
  },
  {
    label: "Booking",
    links: [{ label: "Manage Booking", href: "/booking" }],
  },
  {
    label: "Help",
    href: "/help",
  },
];
