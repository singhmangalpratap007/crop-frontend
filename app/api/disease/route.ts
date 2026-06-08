import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get("image") as File | null
    const cropType = formData.get("cropType") as string | null

    if (!imageFile) return NextResponse.json({ error: "Image is required" }, { status: 400 })
    if (!cropType) return NextResponse.json({ error: "Crop type is required" }, { status: 400 })

    if (imageFile.size > 10 * 1024 * 1024)
      return NextResponse.json({ error: "Image must be under 10 MB" }, { status: 400 })

    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(imageFile.type))
      return NextResponse.json({ error: "Only JPG, PNG, WebP images are allowed" }, { status: 400 })

    // ── Try the ML backend first ───────────────────────────────────────────
    try {
      const backendForm = new FormData()
      backendForm.append("file", imageFile)

      const backendRes = await fetch(`${BACKEND_URL}/predict-disease`, {
        method: "POST",
        body: backendForm,
        signal: AbortSignal.timeout(30_000),
      })

      if (backendRes.ok) {
        const data = await backendRes.json()
        return NextResponse.json(data)
      }

      // 503 = model not loaded yet → fall through to Gemini
      if (backendRes.status !== 503) {
        const err = await backendRes.json().catch(() => ({}))
        throw new Error(err.detail ?? "Backend error")
      }

      console.warn("Disease model not loaded on backend — falling back to Gemini")
    } catch (backendErr: unknown) {
      const msg = backendErr instanceof Error ? backendErr.message : String(backendErr)
      // Network errors (backend not running) → fall through to Gemini
      if (!msg.includes("fetch failed") && !msg.includes("ECONNREFUSED") && !msg.includes("network")) {
        throw backendErr
      }
      console.warn(`Backend unreachable (${msg}) — falling back to Gemini`)
    }

    // ── Gemini Vision fallback ────────────────────────────────────────────
    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("GEMINI_API_KEY not configured and backend is unavailable")

    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

    const prompt = `You are an expert plant pathologist. Analyze this ${cropType} leaf image.
Return ONLY a JSON object (no other text):
{
  "disease": "disease name or 'Healthy'",
  "isHealthy": false,
  "confidence": 85,
  "description": "brief description",
  "causes": ["cause 1", "cause 2"],
  "treatment": ["step 1", "step 2"],
  "prevention": ["tip 1", "tip 2"],
  "severity": "none|low|medium|high"
}`

    const result = await model.generateContent([
      { inlineData: { data: base64, mimeType: imageFile.type } },
      prompt,
    ])

    const raw = result.response.text().trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Invalid AI response")

    const parsed = JSON.parse(jsonMatch[0])
    parsed.confidence = Math.min(100, Math.max(0, Math.round(parsed.confidence)))
    return NextResponse.json(parsed)

  } catch (error) {
    console.error("Disease detection error:", error)
    const message = error instanceof Error ? error.message : "Failed to analyze image"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
