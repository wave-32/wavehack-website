// TS-level unions that mirror what used to be Prisma enums now stored as
// strings (SQLite doesn't support native enums).

export const ParticipantStatus = {
  REGISTERED: "REGISTERED",
  CONFIRMED: "CONFIRMED",
  WAITLISTED: "WAITLISTED",
  REJECTED: "REJECTED",
} as const;
export type ParticipantStatus =
  (typeof ParticipantStatus)[keyof typeof ParticipantStatus];

export const VolunteerStatus = {
  SUBMITTED: "SUBMITTED",
  REVIEWING: "REVIEWING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;
export type VolunteerStatus =
  (typeof VolunteerStatus)[keyof typeof VolunteerStatus];

export const PartnerStatus = {
  NEW_INQUIRY: "NEW_INQUIRY",
  CONTACTED: "CONTACTED",
  NEGOTIATING: "NEGOTIATING",
  CONFIRMED: "CONFIRMED",
  REJECTED: "REJECTED",
} as const;
export type PartnerStatus = (typeof PartnerStatus)[keyof typeof PartnerStatus];

export const VOLUNTEER_ROLES = [
  {
    value: "intern",
    label: "Intern",
    description:
      "Long-term contributor who helps with planning, operations, marketing, partnerships, and future hackathons.",
  },
  {
    value: "volunteer",
    label: "Volunteer",
    description:
      "Temporary event support role helping with event-day operations and smaller tasks.",
  },
  {
    value: "org_team",
    label: "Organization Team Member",
    description:
      "Core team member who helps plan hackathons, manage partnerships, design events, and make important decisions.",
  },
] as const;

export const PARTNERSHIP_TYPES = [
  { value: "sponsor", label: "Sponsor" },
  { value: "community", label: "Community Partner" },
  { value: "workshop", label: "Workshop Partner" },
  { value: "prize", label: "Prize Sponsor" },
  { value: "other", label: "Other" },
] as const;

export const TEAM_STATUSES = [
  { value: "team", label: "I already have a team" },
  { value: "looking", label: "Looking for teammates" },
  { value: "solo", label: "Participating individually" },
] as const;
