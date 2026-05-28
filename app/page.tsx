"use client";

import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Gauge,
  Languages,
  LayoutDashboard,
  ListPlus,
  Palette,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRoundCog,
  Wand2
} from "lucide-react";
import { useMemo, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import {
  Application,
  CVData,
  Experience,
  TemplateSettings,
  defaultTemplateSettings,
  sampleApplications,
  sampleCV,
  uid
} from "@/lib/cv";
import { Locale } from "@/lib/i18n";

type View = "dashboard" | "editor" | "jobs" | "cover" | "admin";
type AIResponse = {
  provider: string;
  suggestions?: string[];
  rewrittenBullets?: string[];
  skills?: string[];
  checks?: Array<{ label: string; status: string }>;
  coverLetter?: string;
  score?: number;
  raw?: string;
  fallback?: AIResponse;
};

const labels = {
  de: {
    productLine: "German-first CV Builder",
    subtitle: "Lebenslauf, Anschreiben und Job-Fit Optimierung fuer den deutschsprachigen Arbeitsmarkt.",
    dashboard: "Dashboard",
    editor: "CV Builder",
    jobs: "Job Tracker",
    cover: "Anschreiben",
    admin: "Admin",
    export: "PDF speichern",
    ai: "KI optimieren",
    addJob: "Station hinzufuegen",
    addBullet: "Bullet hinzufuegen",
    addApplication: "Job hinzufuegen",
    profile: "Profil",
    experience: "Berufserfahrung",
    education: "Ausbildung",
    skills: "Kenntnisse",
    languages: "Sprachen",
    projects: "Projekte",
    settings: "Design",
    ats: "ATS Check",
    suggestions: "Vorschlaege",
    sectionLibrary: "Abschnittsbibliothek",
    coverDraft: "Anschreiben Entwurf",
    adminTitle: "Admin Uebersicht",
    jobAd: "Jobanzeige",
    optimizeForJob: "Auf Job optimieren"
  },
  en: {
    productLine: "German-first CV Builder",
    subtitle: "CV, cover letter, and job-fit optimization for the German-speaking job market.",
    dashboard: "Dashboard",
    editor: "CV Builder",
    jobs: "Job Tracker",
    cover: "Cover Letter",
    admin: "Admin",
    export: "Save PDF",
    ai: "Optimize with AI",
    addJob: "Add role",
    addBullet: "Add bullet",
    addApplication: "Add job",
    profile: "Profile",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    projects: "Projects",
    settings: "Design",
    ats: "ATS Check",
    suggestions: "Suggestions",
    sectionLibrary: "Section library",
    coverDraft: "Cover letter draft",
    adminTitle: "Admin overview",
    jobAd: "Job ad",
    optimizeForJob: "Optimize for job"
  }
} satisfies Record<Locale, Record<string, string>>;

const navItems: Array<{ view: View; icon: React.ElementType }> = [
  { view: "dashboard", icon: LayoutDashboard },
  { view: "editor", icon: FileText },
  { view: "jobs", icon: BriefcaseBusiness },
  { view: "cover", icon: Wand2 },
  { view: "admin", icon: UserRoundCog }
];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("de");
  const [view, setView] = useState<View>("dashboard");
  const [cv, setCv] = useState<CVData>(sampleCV);
  const [applications, setApplications] = useState<Application[]>(sampleApplications);
  const [selectedApplicationId, setSelectedApplicationId] = useState(sampleApplications[0].id);
  const [settings, setSettings] = useState<TemplateSettings>(defaultTemplateSettings);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = labels[locale];
  const selectedApplication = applications.find((item) => item.id === selectedApplicationId) ?? applications[0];
  const aiItems = useMemo(() => aiResponse?.fallback ?? aiResponse, [aiResponse]);
  const completion = Math.min(100, 62 + cv.experience.length * 7 + cv.projects.length * 4 + cv.certifications.length * 3);

  async function runAI(task: "job_match" | "cover_letter" | "ats_check" | "bullet_rewrite") {
    setIsLoading(true);
    setAiResponse(null);
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task,
        language: locale,
        cvData: cv,
        jobDescription: selectedApplication.jobDescription
      })
    });
    const data = (await response.json()) as AIResponse;
    setAiResponse(data);
    if ((data.fallback ?? data).coverLetter && task === "cover_letter") {
      setView("cover");
    }
    setIsLoading(false);
  }

  function updateExperience(id: string, patch: Partial<Experience>) {
    setCv({
      ...cv,
      experience: cv.experience.map((item) => (item.id === id ? { ...item, ...patch } : item))
    });
  }

  function addExperience() {
    setCv({
      ...cv,
      experience: [
        ...cv.experience,
        {
          id: uid("exp"),
          role: locale === "de" ? "Neue Position" : "New role",
          company: "",
          location: "",
          start: "",
          end: "",
          bullets: [{ id: uid("bullet"), text: "", impact: "" }]
        }
      ]
    });
  }

  function addBullet(experienceId: string) {
    setCv({
      ...cv,
      experience: cv.experience.map((item) =>
        item.id === experienceId ? { ...item, bullets: [...item.bullets, { id: uid("bullet"), text: "", impact: "" }] } : item
      )
    });
  }

  function updateBullet(experienceId: string, bulletId: string, text: string) {
    setCv({
      ...cv,
      experience: cv.experience.map((item) =>
        item.id === experienceId
          ? { ...item, bullets: item.bullets.map((bullet) => (bullet.id === bulletId ? { ...bullet, text } : bullet)) }
          : item
      )
    });
  }

  function deleteBullet(experienceId: string, bulletId: string) {
    setCv({
      ...cv,
      experience: cv.experience.map((item) =>
        item.id === experienceId ? { ...item, bullets: item.bullets.filter((bullet) => bullet.id !== bulletId) } : item
      )
    });
  }

  function addApplication() {
    const application: Application = {
      id: uid("job"),
      company: locale === "de" ? "Neues Unternehmen" : "New company",
      role: locale === "de" ? "Neue Zielrolle" : "New target role",
      location: "",
      status: "draft",
      matchScore: 0,
      jobDescription: "",
      notes: ""
    };
    setApplications([application, ...applications]);
    setSelectedApplicationId(application.id);
  }

  function updateApplication(id: string, patch: Partial<Application>) {
    setApplications(applications.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <main className="min-h-screen text-brand-ink">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-24 h-48 w-48 rounded-full bg-brand-mint/18 blur-3xl" />
        <div className="absolute right-[6%] top-72 h-56 w-56 rounded-full bg-brand-navy/10 blur-3xl" />
      </div>

      <header className="no-print sticky top-0 z-40 border-b border-brand-navy/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3">
          <BrandMark />
          <div className="flex items-center gap-2">
            <button className="icon-button" onClick={() => setLocale(locale === "de" ? "en" : "de")} title="Language">
              <Languages size={18} />
              <span>{locale.toUpperCase()}</span>
            </button>
            <button className="primary-action" onClick={() => window.print()}>
              <Download size={18} />
              {t.export}
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-[1500px] gap-5 px-5 py-5 lg:grid-cols-[240px_minmax(0,1fr)_430px]">
        <aside className="no-print sticky top-20 h-fit rounded-md border border-brand-navy/10 bg-white/92 p-3 shadow-panel">
          <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-green">{t.productLine}</p>
          <nav className="space-y-1">
            {navItems.map(({ view: itemView, icon: Icon }) => (
              <button
                key={itemView}
                onClick={() => setView(itemView)}
                className={`nav-button ${view === itemView ? "nav-button-active" : ""}`}
              >
                <Icon size={18} />
                {t[itemView]}
              </button>
            ))}
          </nav>
          <div className="mt-4 rounded-md bg-brand-paper p-3">
            <p className="text-xs font-bold text-brand-navy">CV Score</p>
            <div className="mt-3 h-2 rounded-full bg-white">
              <div className="h-2 rounded-full bg-brand-green transition-all duration-700" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-2 text-2xl font-bold text-brand-navy">{completion}%</p>
          </div>
        </aside>

        <section className="min-w-0">
          <Hero locale={locale} />
          {view === "dashboard" && (
            <Dashboard
              cv={cv}
              applications={applications}
              completion={completion}
              setView={setView}
              runAI={runAI}
              isLoading={isLoading}
              t={t}
            />
          )}
          {view === "editor" && (
            <Editor
              cv={cv}
              setCv={setCv}
              settings={settings}
              setSettings={setSettings}
              updateExperience={updateExperience}
              addExperience={addExperience}
              addBullet={addBullet}
              updateBullet={updateBullet}
              deleteBullet={deleteBullet}
              runAI={runAI}
              isLoading={isLoading}
              aiItems={aiItems}
              t={t}
            />
          )}
          {view === "jobs" && (
            <Jobs
              applications={applications}
              selectedApplication={selectedApplication}
              selectedApplicationId={selectedApplicationId}
              setSelectedApplicationId={setSelectedApplicationId}
              updateApplication={updateApplication}
              addApplication={addApplication}
              runAI={runAI}
              isLoading={isLoading}
              t={t}
            />
          )}
          {view === "cover" && <CoverLetter aiItems={aiItems} selectedApplication={selectedApplication} runAI={runAI} isLoading={isLoading} t={t} />}
          {view === "admin" && <Admin applications={applications} completion={completion} t={t} />}
        </section>

        <aside className="sticky top-20 h-fit">
          <div className="no-print mb-3 flex items-center justify-between">
            <h2 className="font-heading text-xl font-extrabold text-brand-navy">Live A4</h2>
            <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-brand-green">{settings.template}</span>
          </div>
          <CVPreview cv={cv} settings={settings} />
        </aside>
      </div>
    </main>
  );
}

function Hero({ locale }: { locale: Locale }) {
  const t = labels[locale];
  return (
    <section className="no-print mb-5 overflow-hidden rounded-md border border-brand-navy/10 bg-white p-6 shadow-panel">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-brand-mint/16 px-3 py-2 text-sm font-bold text-brand-navy">
            <Sparkles size={16} />
            {t.productLine}
          </p>
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-brand-navy md:text-5xl">Lebenslauf</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-brand-ink/70">{t.subtitle}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {["CV", "ATS", "AI"].map((item, index) => (
            <div key={item} className="motion-tile rounded-md bg-brand-paper px-4 py-3" style={{ animationDelay: `${index * 90}ms` }}>
              <p className="font-heading text-xl font-extrabold text-brand-navy">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dashboard({
  cv,
  applications,
  completion,
  setView,
  runAI,
  isLoading,
  t
}: {
  cv: CVData;
  applications: Application[];
  completion: number;
  setView: (view: View) => void;
  runAI: (task: "job_match" | "cover_letter" | "ats_check" | "bullet_rewrite") => void;
  isLoading: boolean;
  t: Record<string, string>;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric icon={FileText} label="Resumes" value="1" />
        <Metric icon={BriefcaseBusiness} label="Jobs" value={String(applications.length)} />
        <Metric icon={Gauge} label="CV Score" value={`${completion}%`} />
        <Metric icon={ShieldCheck} label="ATS" value="Ready" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Resume command center" icon={LayoutDashboard}>
          <div className="grid gap-3">
            <WorkflowButton icon={FileText} title={cv.name} detail={cv.title} onClick={() => setView("editor")} />
            <WorkflowButton icon={BriefcaseBusiness} title={t.jobs} detail={`${applications.length} tracked applications`} onClick={() => setView("jobs")} />
            <WorkflowButton icon={Wand2} title={t.cover} detail="Generate a tailored letter" onClick={() => setView("cover")} />
          </div>
        </Panel>
        <Panel title="AI actions" icon={Bot}>
          <div className="grid gap-3">
            <button className="primary-action justify-center" onClick={() => runAI("job_match")} disabled={isLoading}>
              <Sparkles size={18} />
              {t.optimizeForJob}
            </button>
            <button className="secondary-action justify-center" onClick={() => runAI("ats_check")} disabled={isLoading}>
              <CheckCircle2 size={18} />
              {t.ats}
            </button>
            <button className="secondary-action justify-center" onClick={() => runAI("cover_letter")} disabled={isLoading}>
              <FileText size={18} />
              {t.coverDraft}
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Editor(props: {
  cv: CVData;
  setCv: (cv: CVData) => void;
  settings: TemplateSettings;
  setSettings: (settings: TemplateSettings) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  addExperience: () => void;
  addBullet: (experienceId: string) => void;
  updateBullet: (experienceId: string, bulletId: string, text: string) => void;
  deleteBullet: (experienceId: string, bulletId: string) => void;
  runAI: (task: "job_match" | "cover_letter" | "ats_check" | "bullet_rewrite") => void;
  isLoading: boolean;
  aiItems: AIResponse | null;
  t: Record<string, string>;
}) {
  const { cv, setCv, settings, setSettings, updateExperience, addExperience, addBullet, updateBullet, deleteBullet, runAI, isLoading, aiItems, t } = props;
  return (
    <div className="grid gap-5">
      <Panel title={t.profile} icon={FileText}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Name" value={cv.name} onChange={(name) => setCv({ ...cv, name })} />
          <Field label="Title" value={cv.title} onChange={(title) => setCv({ ...cv, title })} />
          <Field label="Email" value={cv.email} onChange={(email) => setCv({ ...cv, email })} />
          <Field label="Phone" value={cv.phone} onChange={(phone) => setCv({ ...cv, phone })} />
          <Field label="Location" value={cv.location} onChange={(location) => setCv({ ...cv, location })} />
          <Field label="Website" value={cv.website} onChange={(website) => setCv({ ...cv, website })} />
        </div>
        <TextArea label="Summary" value={cv.summary} onChange={(summary) => setCv({ ...cv, summary })} />
      </Panel>

      <Panel title={t.experience} icon={BriefcaseBusiness} action={<SmallButton icon={Plus} label={t.addJob} onClick={addExperience} />}>
        <div className="grid gap-4">
          {cv.experience.map((experience) => (
            <div key={experience.id} className="rounded-md border border-brand-navy/10 bg-brand-paper p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Role" value={experience.role} onChange={(role) => updateExperience(experience.id, { role })} />
                <Field label="Company" value={experience.company} onChange={(company) => updateExperience(experience.id, { company })} />
                <Field label="Location" value={experience.location} onChange={(location) => updateExperience(experience.id, { location })} />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Start" value={experience.start} onChange={(start) => updateExperience(experience.id, { start })} />
                  <Field label="End" value={experience.end} onChange={(end) => updateExperience(experience.id, { end })} />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {experience.bullets.map((bullet) => (
                  <div key={bullet.id} className="flex gap-2">
                    <textarea
                      className="min-h-16 flex-1 resize-y rounded-md border border-brand-navy/10 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-brand-green"
                      value={bullet.text}
                      onChange={(event) => updateBullet(experience.id, bullet.id, event.target.value)}
                    />
                    <button className="icon-only" onClick={() => deleteBullet(experience.id, bullet.id)} title="Delete bullet">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2">
                  <SmallButton icon={ListPlus} label={t.addBullet} onClick={() => addBullet(experience.id)} />
                  <SmallButton icon={Sparkles} label="AI bullet" onClick={() => runAI("bullet_rewrite")} disabled={isLoading} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title={t.sectionLibrary} icon={Copy}>
          <TextArea label={t.skills} value={cv.skills.join(", ")} onChange={(value) => setCv({ ...cv, skills: splitList(value) })} />
          <TextArea label={t.languages} value={cv.languages.join(", ")} onChange={(value) => setCv({ ...cv, languages: splitList(value) })} />
          <TextArea label="Certifications" value={cv.certifications.join(", ")} onChange={(value) => setCv({ ...cv, certifications: splitList(value) })} />
          <TextArea label="Interests" value={cv.interests.join(", ")} onChange={(value) => setCv({ ...cv, interests: splitList(value) })} />
        </Panel>
        <Panel title={t.settings} icon={Palette}>
          <Segmented
            label="Template"
            value={settings.template}
            options={["modern", "ats", "compact"]}
            onChange={(template) => setSettings({ ...settings, template: template as TemplateSettings["template"] })}
          />
          <Segmented
            label="Layout"
            value={settings.layout}
            options={["two-column", "single"]}
            onChange={(layout) => setSettings({ ...settings, layout: layout as TemplateSettings["layout"] })}
          />
          <Segmented
            label="Density"
            value={settings.density}
            options={["comfortable", "compact"]}
            onChange={(density) => setSettings({ ...settings, density: density as TemplateSettings["density"] })}
          />
          <div className="mt-4 grid gap-2">
            <label className="text-sm font-bold text-brand-navy">Accent</label>
            <div className="flex gap-2">
              {["#19BA75", "#23E28B", "#00204F", "#7A4DF3"].map((color) => (
                <button
                  key={color}
                  className="h-9 w-9 rounded-md border border-brand-navy/10"
                  style={{ background: color }}
                  onClick={() => setSettings({ ...settings, accent: color })}
                  title={color}
                />
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {aiItems ? <AIResults aiItems={aiItems} cv={cv} setCv={setCv} /> : null}
    </div>
  );
}

function Jobs(props: {
  applications: Application[];
  selectedApplication: Application;
  selectedApplicationId: string;
  setSelectedApplicationId: (id: string) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  addApplication: () => void;
  runAI: (task: "job_match" | "cover_letter" | "ats_check" | "bullet_rewrite") => void;
  isLoading: boolean;
  t: Record<string, string>;
}) {
  const { applications, selectedApplication, selectedApplicationId, setSelectedApplicationId, updateApplication, addApplication, runAI, isLoading, t } = props;
  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <Panel title={t.jobs} icon={BriefcaseBusiness} action={<SmallButton icon={Plus} label={t.addApplication} onClick={addApplication} />}>
        <div className="space-y-2">
          {applications.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedApplicationId(job.id)}
              className={`w-full rounded-md border p-3 text-left transition ${selectedApplicationId === job.id ? "border-brand-green bg-brand-mint/12" : "border-brand-navy/10 bg-white hover:border-brand-green/40"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-brand-navy">{job.role}</p>
                <span className="text-sm font-bold text-brand-green">{job.matchScore}%</span>
              </div>
              <p className="mt-1 text-sm text-brand-ink/65">{job.company} - {job.location}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/45">{job.status}</p>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title={selectedApplication.role} icon={Settings}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Company" value={selectedApplication.company} onChange={(company) => updateApplication(selectedApplication.id, { company })} />
          <Field label="Role" value={selectedApplication.role} onChange={(role) => updateApplication(selectedApplication.id, { role })} />
          <Field label="Location" value={selectedApplication.location} onChange={(location) => updateApplication(selectedApplication.id, { location })} />
          <Field
            label="Status"
            value={selectedApplication.status}
            onChange={(status) => updateApplication(selectedApplication.id, { status: status as Application["status"] })}
          />
        </div>
        <TextArea
          label={t.jobAd}
          value={selectedApplication.jobDescription}
          onChange={(jobDescription) => updateApplication(selectedApplication.id, { jobDescription })}
          rows={9}
        />
        <TextArea label="Notes" value={selectedApplication.notes} onChange={(notes) => updateApplication(selectedApplication.id, { notes })} />
        <button className="primary-action mt-4 justify-center" onClick={() => runAI("job_match")} disabled={isLoading}>
          <Sparkles size={18} />
          {t.optimizeForJob}
        </button>
      </Panel>
    </div>
  );
}

function CoverLetter({
  aiItems,
  selectedApplication,
  runAI,
  isLoading,
  t
}: {
  aiItems: AIResponse | null;
  selectedApplication: Application;
  runAI: (task: "job_match" | "cover_letter" | "ats_check" | "bullet_rewrite") => void;
  isLoading: boolean;
  t: Record<string, string>;
}) {
  const draft = aiItems?.coverLetter ?? "";
  return (
    <Panel title={t.coverDraft} icon={FileText}>
      <p className="text-sm text-brand-ink/65">Target: {selectedApplication.role} - {selectedApplication.company}</p>
      <button className="primary-action mt-4" onClick={() => runAI("cover_letter")} disabled={isLoading}>
        <Wand2 size={18} />
        Generate tailored draft
      </button>
      <textarea
        className="mt-4 min-h-[430px] w-full resize-y rounded-md border border-brand-navy/10 bg-brand-paper p-4 leading-7 outline-none focus:border-brand-green"
        value={draft}
        onChange={() => undefined}
        placeholder="Generate a cover letter draft from the selected job."
      />
    </Panel>
  );
}

function Admin({ applications, completion, t }: { applications: Application[]; completion: number; t: Record<string, string> }) {
  return (
    <div className="grid gap-5">
      <Panel title={t.adminTitle} icon={UserRoundCog}>
        <div className="grid gap-4 md:grid-cols-3">
          <Metric icon={BarChart3} label="Activation" value={`${completion}%`} />
          <Metric icon={BriefcaseBusiness} label="Tracked jobs" value={String(applications.length)} />
          <Metric icon={Bot} label="AI provider" value="mock/Ollama" />
        </div>
      </Panel>
      <Panel title="Product controls" icon={Settings}>
        <div className="grid gap-3 md:grid-cols-2">
          <WorkflowButton icon={ShieldCheck} title="Privacy mode" detail="No paid AI API is required for MVP" onClick={() => undefined} />
          <WorkflowButton icon={Gauge} title="Quality checks" detail="ATS, keyword, bullet strength, length" onClick={() => undefined} />
        </div>
      </Panel>
    </div>
  );
}

function AIResults({ aiItems, cv, setCv }: { aiItems: AIResponse; cv: CVData; setCv: (cv: CVData) => void }) {
  const firstExperience = cv.experience[0];
  return (
    <Panel title="AI results" icon={Bot}>
      {"score" in aiItems && <p className="mb-3 text-2xl font-extrabold text-brand-navy">{aiItems.score}% match</p>}
      <div className="grid gap-4 xl:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-green">Suggestions</p>
          {aiItems.suggestions?.map((item) => <p key={item} className="mt-3 rounded-md bg-brand-paper p-3 text-sm leading-6">{item}</p>)}
          {aiItems.checks?.map((item) => (
            <p key={item.label} className="mt-3 flex items-center gap-2 rounded-md bg-brand-paper p-3 text-sm">
              <CheckCircle2 size={16} className={item.status === "pass" ? "text-brand-green" : "text-amber-500"} />
              {item.label}
            </p>
          ))}
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-green">Apply bullets</p>
          {aiItems.rewrittenBullets?.map((item) => (
            <button
              key={item}
              className="mt-3 w-full rounded-md border border-brand-green/30 bg-white p-3 text-left text-sm leading-6 transition hover:-translate-y-0.5 hover:shadow-panel"
              onClick={() =>
                setCv({
                  ...cv,
                  experience: cv.experience.map((experience) =>
                    experience.id === firstExperience.id
                      ? { ...experience, bullets: [{ id: uid("bullet"), text: item, impact: "AI" }, ...experience.bullets] }
                      : experience
                  )
                })
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function CVPreview({ cv, settings }: { cv: CVData; settings: TemplateSettings }) {
  const isCompact = settings.density === "compact";
  const twoColumn = settings.layout === "two-column";
  return (
    <article
      className={`print-page mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white text-brand-ink shadow-panel ${isCompact ? "p-8 text-[12px]" : "p-10 text-[13px]"}`}
      style={{ ["--accent" as string]: settings.accent }}
    >
      <header className="border-b pb-6" style={{ borderColor: settings.accent }}>
        <p className="font-bold uppercase tracking-[0.18em]" style={{ color: settings.accent }}>{cv.title}</p>
        <h2 className="mt-2 font-heading text-4xl font-extrabold leading-tight text-brand-navy">{cv.name}</h2>
        <p className="mt-4 leading-6 text-brand-ink/65">
          {cv.location} | {cv.email} | {cv.phone} | {cv.website}
        </p>
      </header>
      <section className="mt-6">
        <PreviewHeading label="Profil" color={settings.accent} />
        <p className="mt-2 leading-6 text-brand-ink/78">{cv.summary}</p>
      </section>
      <div className={`mt-6 grid gap-7 ${twoColumn ? "md:grid-cols-[1.55fr_0.9fr]" : ""}`}>
        <div className="space-y-6">
          <section>
            <PreviewHeading label="Berufserfahrung" color={settings.accent} />
            <div className="mt-3 space-y-5">
              {cv.experience.map((experience) => (
                <div key={experience.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-brand-navy">{experience.role}</p>
                      <p className="text-brand-ink/65">{experience.company}, {experience.location}</p>
                    </div>
                    <p className="text-right text-xs font-bold" style={{ color: settings.accent }}>
                      {experience.start} - {experience.end}
                    </p>
                  </div>
                  <ul className="mt-2 space-y-1.5 leading-6 text-brand-ink/78">
                    {experience.bullets.filter((bullet) => bullet.text.trim()).map((bullet) => (
                      <li key={bullet.id} className="grid grid-cols-[12px_1fr]">
                        <span style={{ color: settings.accent }}>-</span>
                        <span>{bullet.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <section>
            <PreviewHeading label="Ausbildung" color={settings.accent} />
            {cv.education.map((education) => (
              <p key={education.id} className="mt-2 leading-6">
                <strong>{education.degree}</strong>, {education.institution}, {education.location}
                <br />
                <span className="text-brand-ink/65">{education.start} - {education.end}</span>
              </p>
            ))}
          </section>
        </div>
        <aside className="space-y-6">
          <PreviewList label="Kenntnisse" items={cv.skills} color={settings.accent} chips />
          <PreviewList label="Sprachen" items={cv.languages} color={settings.accent} />
          <PreviewList label="Zertifikate" items={cv.certifications} color={settings.accent} />
          <section>
            <PreviewHeading label="Projekte" color={settings.accent} />
            {cv.projects.map((project) => (
              <p key={project.id} className="mt-2 leading-6">
                <strong>{project.name}</strong>
                <br />
                <span className="text-brand-ink/70">{project.description}</span>
              </p>
            ))}
          </section>
        </aside>
      </div>
    </article>
  );
}

function PreviewHeading({ label, color }: { label: string; color: string }) {
  return <h3 className="font-heading text-xl font-extrabold text-brand-navy" style={{ borderLeft: `4px solid ${color}`, paddingLeft: 10 }}>{label}</h3>;
}

function PreviewList({ label, items, color, chips = false }: { label: string; items: string[]; color: string; chips?: boolean }) {
  return (
    <section>
      <PreviewHeading label={label} color={color} />
      {chips ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => <span key={item} className="rounded-md px-2 py-1 text-xs font-bold" style={{ background: `${color}18`, color }}>{item}</span>)}
        </div>
      ) : (
        <ul className="mt-3 space-y-1.5 leading-6 text-brand-ink/76">
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
    </section>
  );
}

function Panel({ title, icon: Icon, action, children }: { title: string; icon: React.ElementType; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-brand-navy/10 bg-white/94 p-5 shadow-panel">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-heading text-2xl font-extrabold text-brand-navy">
          <Icon size={23} />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="motion-tile rounded-md border border-brand-navy/10 bg-white p-4 shadow-panel">
      <Icon size={20} className="text-brand-green" />
      <p className="mt-4 text-sm font-bold text-brand-ink/55">{label}</p>
      <p className="mt-1 font-heading text-2xl font-extrabold text-brand-navy">{value}</p>
    </div>
  );
}

function WorkflowButton({ icon: Icon, title, detail, onClick }: { icon: React.ElementType; title: string; detail: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-center justify-between rounded-md border border-brand-navy/10 bg-brand-paper p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-green/50">
      <span className="flex items-center gap-3">
        <span className="rounded-md bg-white p-2 text-brand-green"><Icon size={18} /></span>
        <span>
          <span className="block font-bold text-brand-navy">{title}</span>
          <span className="text-sm text-brand-ink/60">{detail}</span>
        </span>
      </span>
      <ChevronRight size={18} className="text-brand-green transition group-hover:translate-x-1" />
    </button>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-brand-navy">
      {label}
      <input className="field-input" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="mt-4 grid gap-2 text-sm font-bold text-brand-navy">
      {label}
      <textarea className="field-input resize-y leading-6" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SmallButton({ icon: Icon, label, onClick, disabled }: { icon: React.ElementType; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button className="secondary-action" onClick={onClick} disabled={disabled}>
      <Icon size={16} />
      {label}
    </button>
  );
}

function Segmented({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="mt-4">
      <p className="text-sm font-bold text-brand-navy">{label}</p>
      <div className="mt-2 grid gap-2 rounded-md bg-brand-paper p-1 md:grid-cols-3">
        {options.map((option) => (
          <button key={option} className={`rounded-md px-3 py-2 text-sm font-bold ${value === option ? "bg-white text-brand-green shadow-sm" : "text-brand-ink/65"}`} onClick={() => onChange(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
