import { z } from "zod";

export const aiRequestSchema = z.object({
  task: z.enum(["bullet_rewrite", "job_match", "cover_letter", "summary", "translation"]),
  language: z.enum(["de", "en"]),
  cvData: z.unknown(),
  jobDescription: z.string().optional(),
  userInstruction: z.string().optional()
});

export type AIRequest = z.infer<typeof aiRequestSchema>;

export async function generateWithMock(request: AIRequest) {
  const isGerman = request.language === "de";

  return {
    provider: "mock",
    suggestions: isGerman
      ? [
          "Nutze messbare Ergebnisse, z. B. Budget, Reichweite, Conversion-Rate oder Zeitersparnis.",
          "Formuliere Bullet Points mit Aktion, Methode und Ergebnis.",
          "Ergaenze relevante Begriffe aus der Jobanzeige, aber nur wenn sie ehrlich zu deiner Erfahrung passen."
        ]
      : [
          "Use measurable outcomes such as budget, reach, conversion rate, or time saved.",
          "Write bullets with action, method, and result.",
          "Add job-ad keywords only when they honestly match your experience."
        ],
    rewrittenBullets: isGerman
      ? [
          "Optimierte LinkedIn- und Google-Ads-Kampagnen anhand monatlicher KPI-Auswertungen und leitete konkrete Verbesserungen fuer Zielgruppen, Budgeteinsatz und Landingpages ab.",
          "Erstellte deutschsprachige Newsletter- und Landingpage-Inhalte fuer B2B-Zielgruppen mit Fokus auf klare Nutzenargumentation und Conversion."
        ]
      : [
          "Optimized LinkedIn and Google Ads campaigns using monthly KPI reviews and translated findings into audience, budget, and landing page improvements.",
          "Created B2B newsletter and landing page content with clear value messaging and conversion focus."
        ],
    score: 74
  };
}

export async function generateWithOllama(request: AIRequest) {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL ?? "qwen3:8b";
  const prompt = [
    "You are Lebenslauf, a German-first CV optimization assistant.",
    "Return concise JSON with suggestions, rewrittenBullets, and score.",
    `Language: ${request.language}`,
    `Task: ${request.task}`,
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
