import { z } from "zod";

export const aiRequestSchema = z.object({
  task: z.enum(["bullet_rewrite", "job_match", "cover_letter", "summary", "translation", "ats_check", "skills"]),
  language: z.enum(["de", "en"]),
  cvData: z.unknown(),
  jobDescription: z.string().optional(),
  userInstruction: z.string().optional()
});

export type AIRequest = z.infer<typeof aiRequestSchema>;

export async function generateWithMock(request: AIRequest) {
  const isGerman = request.language === "de";
  const coverLetter = isGerman
    ? "Sehr geehrte Damen und Herren,\n\nmit grossem Interesse bewerbe ich mich auf die ausgeschriebene Position. Meine Erfahrung in Kampagnenplanung, Content-Erstellung und datenbasierter Optimierung passt besonders gut zu den Anforderungen Ihrer Stelle. In bisherigen Projekten habe ich Inhalte strukturiert, Kennzahlen ausgewertet und daraus konkrete Verbesserungen fuer Zielgruppenansprache und Performance abgeleitet.\n\nGerne ueberzeuge ich Sie in einem persoenlichen Gespraech davon, wie ich Ihr Team unterstuetzen kann.\n\nMit freundlichen Gruessen\nAylin Demir"
    : "Dear hiring team,\n\nI am applying for this role because my experience in campaign planning, content creation, and data-led optimization fits the requirements of the position. In previous work, I structured content, reviewed performance metrics, and translated findings into practical improvements for audience targeting and campaign results.\n\nI would welcome the opportunity to discuss how I can support your team.\n\nKind regards,\nAylin Demir";

  return {
    provider: "mock",
    score: 82,
    checks: [
      { label: isGerman ? "ATS lesbare Abschnittstitel" : "ATS-readable section titles", status: "pass" },
      { label: isGerman ? "Messbare Bullet Points" : "Measurable bullet points", status: "warning" },
      { label: isGerman ? "Job-Keywords enthalten" : "Job keywords included", status: "warning" },
      { label: isGerman ? "Einheitliche Datumsformate" : "Consistent date formats", status: "pass" }
    ],
    suggestions: isGerman
      ? [
          "Fuege 2-3 konkrete Kennzahlen hinzu, etwa Reichweite, Conversion-Rate, Budget oder Zeitersparnis.",
          "Passe die Kurzprofil-Zeile auf die Zielrolle an und nenne DACH, CRM oder SEO nur bei echter Erfahrung.",
          "Nutze pro Bullet Point eine klare Struktur: Handlung, Methode, Ergebnis."
        ]
      : [
          "Add 2-3 concrete metrics such as reach, conversion rate, budget, or time saved.",
          "Adapt the profile line to the target role and mention DACH, CRM, or SEO only when accurate.",
          "Use one clear structure per bullet: action, method, result."
        ],
    rewrittenBullets: isGerman
      ? [
          "Optimierte LinkedIn- und Google-Ads-Kampagnen anhand monatlicher KPI-Auswertungen und leitete konkrete Verbesserungen fuer Zielgruppen, Budgeteinsatz und Landingpages ab.",
          "Erstellte deutschsprachige Newsletter- und Landingpage-Inhalte fuer B2B-Zielgruppen mit Fokus auf klare Nutzenargumentation und Conversion.",
          "Analysierte Keyword-Cluster und Wettbewerberdaten, um SEO-Briefings fuer regionale Kampagnen strukturiert vorzubereiten."
        ]
      : [
          "Optimized LinkedIn and Google Ads campaigns using monthly KPI reviews and translated findings into audience, budget, and landing page improvements.",
          "Created B2B newsletter and landing page content with clear value messaging and conversion focus.",
          "Analyzed keyword clusters and competitor data to prepare structured SEO briefings for regional campaigns."
        ],
    skills: isGerman
      ? ["CRM", "DACH Marketing", "SEO-Briefing", "KPI Reporting", "B2B Kommunikation"]
      : ["CRM", "DACH marketing", "SEO briefing", "KPI reporting", "B2B communication"],
    coverLetter
  };
}

export async function generateWithOllama(request: AIRequest) {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL ?? "qwen3:8b";
  const prompt = [
    "You are Lebenslauf, a German-first CV optimization assistant for Germany, Austria, and Switzerland.",
    "Return strict JSON with score, checks, suggestions, rewrittenBullets, skills, and coverLetter where relevant.",
    "Do not invent experience. Keep German language factual, precise, and recruiter-friendly.",
    `Language: ${request.language}`,
    `Task: ${request.task}`,
    `User instruction: ${request.userInstruction ?? "none"}`,
    `Job ad: ${request.jobDescription ?? "none"}`,
    `CV data: ${JSON.stringify(request.cvData)}`
  ].join("\n\n");

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: "json"
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with ${response.status}`);
  }

  const data = (await response.json()) as { response?: string };
  return {
    provider: "ollama",
    raw: data.response ?? "",
    model
  };
}
