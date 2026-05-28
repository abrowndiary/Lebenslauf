"use client";

import { Brain, Download, Languages, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { CVData, sampleCV } from "@/lib/cv";
import { Locale, copy } from "@/lib/i18n";

type AIResponse = {
  provider: string;
  suggestions?: string[];
  rewrittenBullets?: string[];
  score?: number;
  raw?: string;
  fallback?: AIResponse;
};

export default function Home() {
  const [locale, setLocale] = useState<Locale>("de");
  const [cv, setCv] = useState<CVData>(sampleCV);
  const [jobDescription, setJobDescription] = useState("");
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = copy[locale];

  const firstExperience = cv.experience[0];
  const aiItems = useMemo(() => aiResponse?.fallback ?? aiResponse, [aiResponse]);

  async function requestSuggestions() {
    setIsLoading(true);
    setAiResponse(null);

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: "job_match",
        language: locale,
        cvData: cv,
        jobDescription
      })
    });

    setAiResponse(await response.json());
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen">
      <header className="no-print sticky top-0 z-30 border-b border-brand-navy/10 bg-white/88 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <BrandMark />
          <nav className="hidden items-center gap-7 text-sm font-bold text-brand-navy md:flex">
            <a href="#product">{t.navProduct}</a>
            <a href="#ai">{t.navAi}</a>
            <a href="#export">{t.navExport}</a>
          </nav>
          <button
            className="inline-flex items-center gap-2 rounded-md border border-brand-navy/15 bg-white px-3 py-2 text-sm font-bold text-brand-navy"
            onClick={() => setLocale(locale === "de" ? "en" : "de")}
          >
            <Languages size={16} />
            {locale.toUpperCase()}
          </button>
        </div>
      </header>

      <section id="product" className="no-print mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
        <div className="flex flex-col justify-center">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-md bg-brand-mint/18 px-3 py-2 text-sm font-bold text-brand-navy">
            <Sparkles size={16} /> German-first AI CV Builder
          </p>
          <h1 className="font-heading text-5xl leading-[1.02] text-brand-navy md:text-7xl">{t.heroTitle}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-brand-ink/72">{t.heroSubtitle}</p>
          <a
            href="#editor"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-brand-navy px-5 py-3 font-bold text-white shadow-panel"
          >
            <Brain size={18} />
            {t.heroCta}
          </a>
        </div>

        <div className="rounded-md border border-brand-navy/10 bg-white p-4 shadow-panel">
          <CVPreview cv={cv} t={t} />
        </div>
      </section>

      <section id="editor" className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 lg:grid-cols-[420px_1fr]">
        <div className="no-print space-y-6">
          <div className="rounded-md border border-brand-navy/10 bg-white p-5 shadow-panel">
            <h2 className="font-heading text-3xl text-brand-navy">{t.editorTitle}</h2>
            <div className="mt-5 grid gap-4">
              <Field label={t.name} value={cv.name} onChange={(name) => setCv({ ...cv, name })} />
              <Field label={t.title} value={cv.title} onChange={(title) => setCv({ ...cv, title })} />
              <TextArea label={t.summary} value={cv.summary} onChange={(summary) => setCv({ ...cv, summary })} />
              <TextArea
                label={t.skills}
                value={cv.skills.join(", ")}
                onChange={(value) => setCv({ ...cv, skills: value.split(",").map((item) => item.trim()).filter(Boolean) })}
              />
              <TextArea
                label={t.experience}
                value={firstExperience.bullets.join("\n")}
                onChange={(value) =>
                  setCv({
                    ...cv,
                    experience: [
                      {
                        ...firstExperience,
                        bullets: value.split("\n").map((item) => item.trim()).filter(Boolean)
                      }
                    ]
                  })
                }
              />
            </div>
          </div>

          <div id="ai" className="rounded-md border border-brand-navy/10 bg-white p-5 shadow-panel">
            <h2 className="font-heading text-3xl text-brand-navy">{t.aiTitle}</h2>
            <p className="mt-2 text-sm text-brand-ink/60">{t.aiMockNotice}</p>
            <TextArea label={t.aiPrompt} value={jobDescription} onChange={setJobDescription} rows={8} />
            <button
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-green px-4 py-3 font-bold text-white disabled:opacity-60"
              onClick={requestSuggestions}
              disabled={isLoading}
            >
              <Sparkles size={18} />
              {isLoading ? "..." : t.aiButton}
            </button>

            {aiItems ? (
              <div className="mt-5 rounded-md bg-brand-paper p-4 text-sm text-brand-ink">
                {"score" in aiItems && <p className="font-bold text-brand-navy">Match Score: {aiItems.score}%</p>}
                {aiItems.suggestions?.map((item) => (
                  <p key={item} className="mt-3">{item}</p>
                ))}
                {aiItems.rewrittenBullets?.map((item) => (
                  <button
                    key={item}
                    className="mt-3 block w-full rounded-md border border-brand-green/35 bg-white p-3 text-left"
                    onClick={() =>
                      setCv({
                        ...cv,
                        experience: [{ ...firstExperience, bullets: [item, ...firstExperience.bullets.slice(1)] }]
                      })
                    }
                  >
                    {item}
                  </button>
                ))}
                {aiItems.raw && <pre className="mt-3 whitespace-pre-wrap text-xs">{aiItems.raw}</pre>}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <div className="no-print mb-4 flex items-center justify-between">
            <h2 className="font-heading text-3xl text-brand-navy">{t.previewTitle}</h2>
            <button
              id="export"
              className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-4 py-2 font-bold text-white"
              onClick={() => window.print()}
            >
              <Download size={17} />
              {t.print}
            </button>
          </div>
          <CVPreview cv={cv} t={t} large />
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-brand-navy">
      {label}
      <input
        className="rounded-md border border-brand-navy/12 bg-brand-paper px-3 py-3 font-medium text-brand-ink outline-none focus:border-brand-green"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="mt-4 grid gap-2 text-sm font-bold text-brand-navy">
      {label}
      <textarea
        className="resize-y rounded-md border border-brand-navy/12 bg-brand-paper px-3 py-3 font-medium leading-6 text-brand-ink outline-none focus:border-brand-green"
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function CVPreview({ cv, t, large = false }: { cv: CVData; t: Record<string, string>; large?: boolean }) {
  const experience = cv.experience[0];

  return (
    <article
      className={`print-page mx-auto bg-white text-brand-ink shadow-panel ${large ? "min-h-[297mm] w-full max-w-[210mm] p-10" : "min-h-[520px] p-7"}`}
    >
      <div className="border-b-4 border-brand-mint pb-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-green">{cv.title}</p>
        <h2 className="mt-2 font-heading text-5xl leading-none text-brand-navy">{cv.name}</h2>
        <p className="mt-4 text-sm text-brand-ink/68">
          {cv.location} | {cv.email} | {cv.phone}
        </p>
      </div>

      <section className="mt-7">
        <h3 className="font-heading text-2xl text-brand-navy">{t.summary}</h3>
        <p className="mt-3 text-sm leading-7 text-brand-ink/78">{cv.summary}</p>
      </section>

      <section className="mt-7 grid gap-7 md:grid-cols-[1.5fr_0.9fr]">
        <div>
          <h3 className="font-heading text-2xl text-brand-navy">{t.experience}</h3>
          <div className="mt-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-brand-ink">{experience.role}</p>
                <p className="text-sm text-brand-ink/68">{experience.company}, {experience.location}</p>
              </div>
              <p className="text-right text-xs font-bold text-brand-green">{experience.period}</p>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-brand-ink/78">
              {experience.bullets.map((bullet) => (
                <li key={bullet} className="pl-4 before:-ml-4 before:mr-2 before:text-brand-green before:content-['•']">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-7">
          <div>
            <h3 className="font-heading text-2xl text-brand-navy">{t.skills}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {cv.skills.map((skill) => (
                <span key={skill} className="rounded-md bg-brand-mint/14 px-2.5 py-1.5 text-xs font-bold text-brand-navy">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-heading text-2xl text-brand-navy">{t.languages}</h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-ink/78">
              {cv.languages.map((language) => <li key={language}>{language}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-2xl text-brand-navy">{t.education}</h3>
            {cv.education.map((item) => (
              <p key={item.id} className="mt-3 text-sm leading-6 text-brand-ink/78">
                <strong className="text-brand-ink">{item.degree}</strong>
                <br />
                {item.institution}
                <br />
                {item.period}
              </p>
            ))}
          </div>
        </aside>
      </section>
    </article>
  );
}
