import { z } from "zod";

const baseEmail = z.string().email("Please enter a valid email").max(200);
const baseString = (max = 200, label = "this field") =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} too long`);

// Honeypot: optional string, no max constraint.
// We deliberately DO NOT cap length here because if a bot fills it,
// the route handler should pass through zod and silently return success
// (so bots think they succeeded). The handlers check for non-empty values
// AFTER safeParse and return ok:true without writing to DB.
const honeypot = z.string().optional();

// All schemas use a generic honeypot -> mapped to "website" expectation
// in the route handlers (the field name on the form is "website").
function withHoney<T extends z.ZodObject<z.ZodRawShape>>(schema: T) {
  return schema.extend({
    website: honeypot,
  });
}

export const ParticipantSchema = withHoney(
  z.object({
    fullName: baseString(120, "Full name"),
    email: baseEmail,
    age: z.coerce.number().int().min(10, "Min age 10").max(99, "Max age 99"),
    school: baseString(200, "School"),
    grade: baseString(80, "Grade"),
    location: baseString(200, "Location"),
    codingExperience: baseString(60, "Coding experience"),
    skills: baseString(500, "Skills"),
    teamStatus: z.enum(["team", "looking", "solo"], {
      errorMap: () => ({ message: "Pick a team status" }),
    }),
    github: z.string().url().optional().or(z.literal("").transform(() => undefined)),
    portfolio: z.string().url().optional().or(z.literal("").transform(() => undefined)),
    prevExperience: baseString(500, "Previous experience").optional(),
    motivation: baseString(800, "Motivation").optional(),
    accessibility: baseString(500, "Accessibility").optional(),
  }),
);
export type ParticipantInput = z.infer<typeof ParticipantSchema>;

export const VolunteerSchema = withHoney(
  z.object({
    fullName: baseString(120),
    email: baseEmail,
    age: z.coerce.number().int().min(13, "Min age 13").max(99, "Max age 99"),
    school: baseString(200, "School"),
    location: baseString(200, "Location"),
    role: z.enum(["intern", "volunteer", "org_team"]),
    motivation: baseString(1000, "Motivation"),
    skills: baseString(500, "Skills"),
    experience: baseString(1000).optional(),
    availability: baseString(500).optional(),
    resumeUrl: z.string().url().optional().or(z.literal("").transform(() => undefined)),
  }),
);
export type VolunteerInput = z.infer<typeof VolunteerSchema>;

export const SponsorInquirySchema = z.object({
  companyName: baseString(200, "Company"),
  contactName: baseString(120, "Contact name"),
  email: baseEmail,
  phone: baseString(40, "Phone").optional(),
  website: z.string().url().optional().or(z.literal("").transform(() => undefined)),
  partnershipType: z.enum(["sponsor", "community", "workshop", "prize", "other"]),
  orgDescription: baseString(2000, "Org description"),
  partnershipInterest: baseString(2000, "Partnership interest"),
  supportOffered: baseString(2000, "Support offered"),
  goals: baseString(2000, "Goals"),
  // sponsors use a different honeypot field name
  website_check: honeypot,
});
export type SponsorInput = z.infer<typeof SponsorInquirySchema>;

export const ContactSchema = withHoney(
  z.object({
    name: baseString(120),
    email: baseEmail,
    subject: baseString(200),
    message: baseString(5000, "Message"),
  }),
);
export type ContactInput = z.infer<typeof ContactSchema>;

export const NewsletterSchema = withHoney(
  z.object({
    name: baseString(120).optional(),
    email: baseEmail,
  }),
);
export type NewsletterInput = z.infer<typeof NewsletterSchema>;
