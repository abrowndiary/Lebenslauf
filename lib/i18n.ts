export type Locale = "de" | "en";

export const copy = {
  de: {
    navProduct: "Produkt",
    navAi: "KI Optimierung",
    navExport: "Export",
    heroTitle: "Lebenslauf",
    heroSubtitle: "German-first CV builder fuer Bewerbungen in Deutschland, Oesterreich und der Schweiz.",
    heroCta: "Lebenslauf bearbeiten",
    aiTitle: "KI Assistent",
    aiPrompt: "Jobanzeige einfuegen",
    aiButton: "Vorschlaege generieren",
    aiMockNotice: "Mock-Modus aktiv. Ollama kann spaeter ueber .env aktiviert werden.",
    editorTitle: "Editor",
    previewTitle: "A4 Vorschau",
    print: "PDF speichern",
    name: "Name",
    title: "Titel",
    summary: "Kurzprofil",
    skills: "Kenntnisse",
    experience: "Berufserfahrung",
    education: "Ausbildung",
    languages: "Sprachen"
  },
  en: {
    navProduct: "Product",
    navAi: "AI Optimization",
    navExport: "Export",
    heroTitle: "Lebenslauf",
    heroSubtitle: "German-first CV builder for applications in Germany, Austria, and Switzerland.",
    heroCta: "Edit CV",
    aiTitle: "AI Assistant",
    aiPrompt: "Paste job ad",
    aiButton: "Generate suggestions",
    aiMockNotice: "Mock mode active. Ollama can be enabled later through .env.",
    editorTitle: "Editor",
    previewTitle: "A4 Preview",
    print: "Save PDF",
    name: "Name",
    title: "Title",
    summary: "Profile",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    languages: "Languages"
  }
} satisfies Record<Locale, Record<string, string>>;
