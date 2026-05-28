import { z } from "zod";

export const experienceSchema = z.object({
  id: z.string(),
  role: z.string(),
  company: z.string(),
  location: z.string(),
  period: z.string(),
  bullets: z.array(z.string())
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  period: z.string()
});

export const cvSchema = z.object({
  language: z.enum(["de", "en"]),
  name: z.string(),
  title: z.string(),
  location: z.string(),
  email: z.string(),
  phone: z.string(),
  summary: z.string(),
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema)
});

export type CVData = z.infer<typeof cvSchema>;

export const sampleCV: CVData = {
  language: "de",
  name: "Aylin Demir",
  title: "Junior Marketing Managerin",
  location: "Mannheim, Deutschland",
  email: "aylin.demir@example.com",
  phone: "+49 160 1234567",
  summary:
    "Marketingprofil mit Erfahrung in Kampagnenplanung, Content-Erstellung und datenbasierter Optimierung fuer deutschsprachige B2B-Zielgruppen.",
  skills: ["Kampagnenplanung", "SEO", "Google Analytics", "Content Marketing", "HubSpot"],
  languages: ["Deutsch C1", "Englisch B2", "Tuerkisch Muttersprache"],
  experience: [
    {
      id: "exp-1",
      role: "Marketing Werkstudentin",
      company: "Muster GmbH",
      location: "Heidelberg",
      period: "04/2024 - heute",
      bullets: [
        "Unterstuetzung bei Performance-Kampagnen fuer LinkedIn und Google Ads.",
        "Erstellung von Landingpage-Texten und Newsletter-Inhalten.",
        "Auswertung monatlicher Kampagnen-KPIs und Ableitung konkreter Optimierungen."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "M.Sc. Management",
      institution: "Mannheim Business School",
      period: "2023 - 2025"
    }
  ]
};
