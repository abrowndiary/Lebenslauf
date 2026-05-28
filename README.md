# Lebenslauf

Lebenslauf is a German-first AI CV builder for applications in Germany, Austria, and Switzerland.

This project is a clean implementation and does not derive from `resume-lm`, because that project is AGPL-3.0 licensed and this product should avoid AGPL inheritance.

## MVP Scope

- German and English interface
- Branded CV editor using Qualy for headings and MazzardL for body text
- A4 live preview
- Browser print/PDF export
- AI provider abstraction with mock mode by default
- Ollama-compatible route for local open-source models
- German job-ad matching and bullet suggestion mechanism

## Free AI Strategy

The default provider is `mock`, so the app works without a paid API key.

For local free/open-source AI:

```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:8b
```

Recommended local models to test first:

- `qwen3:8b`
- `qwen2.5:7b`
- `mistral`

## Development

```bash
pnpm install
pnpm dev
```

## Brand

- Primary mint: `#23E28B`
- Primary green: `#19BA75`
- Primary navy: `#00204F`
- Heading font: Qualy Bold
- Body font: MazzardL

## Legal Direction

The product should be inspired by the AI CV builder category, not copied from any proprietary website, paid template, paid UI, wording, or layout.
