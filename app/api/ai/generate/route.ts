import { NextResponse } from "next/server";
import { aiRequestSchema, generateWithMock, generateWithOllama } from "@/lib/ai";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = aiRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid AI request", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const provider = process.env.AI_PROVIDER ?? "mock";
    const result = provider === "ollama" ? await generateWithOllama(parsed.data) : await generateWithMock(parsed.data);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "AI generation failed",
        fallback: await generateWithMock(parsed.data)
      },
      { status: 502 }
    );
  }
}
