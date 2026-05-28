import { z } from "zod";

export const bulletSchema = z.object({
  id: z.string(),
  text: z.string(),
  impact: z.string().optional()
});

export const experienceSchema = z.object({
  id: z.string(),
  role: z.string(),
  company: z.string(),
  location: z.string(),
  start: z.string(),
  end: z.string(),
  bullets: z.array(bulletSchema)
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  location: z.string(),
  start: z.string(),
  end: z.string()
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  link: z.string().optional()
});

export const cvSchema = z.object({
  id: z.string(),
  language: z.enum(["de", "en"]),
  name: z.string(),
  title: z.string(),
  location: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),
  summary: z.string(),
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
  certifications: z.array(z.string()),
  interests: z.array(z.string())
});

export const applicationSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string(),
  status: z.enum(["draft", "applied", "interview", "offer", "rejected"]),
  matchScore: z.number(),
  jobDescription: z.string(),
  notes: z.string()
});

export const templateSettingsSchema = z.object({
  template: z.enum(["ats", "modern", "compact"]),
  accent: z.string(),
  density: z.enum(["comfortable", "compact"]),
  layout: z.enum(["single", "two-column"]),
  showPhoto: z.boolean(),
  pageSize: z.enum(["a4", "letter"])
});

export type Bullet = z.infer<typeof bulletSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type CVData = z.infer<typeof cvSchema>;
export type Application = z.infer<typeof applicationSchema>;
export type TemplateSettings = z.infer<typeof templateSettingsSchema>;

export const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export const sampleCV: CVData = {
  id: "cv-master",
  language: "de",
  name: "Aylin Demir",
  title: "Junior Marketing Managerin",
  location: "Mannheim, Deutschland",
  email: "aylin.demir@example.com",
  phone: "+49 160 1234567",
  website: "linkedin.com/in/aylin-demir",
  summary:
    "Marketingprofil mit Erfahrung in Kampagnenplanung, Content-Erstellung und datenbasierter Optimierung fuer deutschsprachige B2B-Zielgruppen.",
  skills: ["Kampagnenplanung", "SEO", "Google Analytics", "Content Marketing", "HubSpot", "LinkedIn Ads"],
  languages: ["Deutsch C1", "Englisch B2", "Tuerkisch Muttersprache"],
  experience: [
    {
      id: "exp-1",
      role: "Marketing Werkstudentin",
      company: "Muster GmbH",
      location: "Heidelberg",
      start: "04/2024",
      end: "heute",
      bullets: [
        {
          id: "bullet-1",
          text: "Unterstuetzung bei Performance-Kampagnen fuer LinkedIn und Google Ads.",
          impact: "Kanalsteuerung"
        },
        {
          id: "bullet-2",
          text: "Erstellung von Landingpage-Texten und Newsletter-Inhalten.",
          impact: "Content"
        },
        {
          id: "bullet-3",
          text: "Auswertung monatlicher Kampagnen-KPIs und Ableitung konkreter Optimierungen.",
          impact: "Analyse"
        }
      ]
    },
    {
      id: "exp-2",
      role: "Marketing Praktikantin",
      company: "Rhein Digital",
      location: "Mannheim",
      start: "08/2023",
      end: "03/2024",
      bullets: [
        {
          id: "bullet-4",
          text: "Recherche von Zielgruppen, Wettbewerbern und Keyword-Clustern fuer regionale Kampagnen.",
          impact: "Research"
        }
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "M.Sc. Management",
      institution: "Mannheim Business School",
      location: "Mannheim",
      start: "2023",
      end: "2025"
    }
  ],
  projects: [
    {
      id: "project-1",
      name: "B2B Newsletter Relaunch",
      description: "Neuaufbau einer Newsletter-Struktur mit klareren Segmenten und messbaren Kampagnenzielen."
    }
  ],
  certifications: ["Google Analytics Grundlagen", "HubSpot Content Marketing"],
  interests: ["Arbeitsmarkttrends", "Deutschsprachige B2B-Kommunikation"]
};

export const sampleApplications: Application[] = [
  {
    id: "job-1",
    company: "SAP",
    role: "Junior Marketing Specialist DACH",
    location: "Walldorf",
    status: "draft",
    matchScore: 78,
    jobDescription:
      "Gesucht wird ein Junior Marketing Specialist fuer DACH mit Erfahrung in Kampagnenplanung, CRM, SEO, Analytics und deutschsprachiger B2B-Kommunikation.",
    notes: "Starker Fit fuer DACH, CRM-Beispiele noch schaerfen."
  },
  {
    id: "job-2",
    company: "Bosch",
    role: "Werkstudentin Content Marketing",
    location: "Stuttgart",
    status: "applied",
    matchScore: 84,
    jobDescription:
      "Unterstuetzung im Content Marketing, Erstellung von Landingpages, Newsletter, SEO-Briefings und Reporting.",
    notes: "Anschreiben mit Fokus auf technische Themen."
  }
];

export const defaultTemplateSettings: TemplateSettings = {
  template: "modern",
  accent: "#19BA75",
  density: "comfortable",
  layout: "two-column",
  showPhoto: false,
  pageSize: "a4"
};
