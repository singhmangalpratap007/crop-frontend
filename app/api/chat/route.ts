import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

const FARMING_SYSTEM_PROMPT = `You are Kisan Assistant, an expert AI agricultural advisor specializing in Indian farming. You provide practical, accurate guidance to farmers.

Your expertise covers:
- CROP GUIDANCE: Best crops for specific regions/seasons, soil suitability analysis, crop rotation, intercropping strategies
- FERTILIZERS: NPK recommendations, organic alternatives (compost, vermicompost, green manure), micronutrient deficiencies, fertilizer schedules, biofertilizers
- IRRIGATION: Water requirements per crop, drip/sprinkler/flood irrigation, drought management, rainwater harvesting, soil moisture management
- DISEASE & PEST MANAGEMENT: Disease identification, integrated pest management (IPM), organic and chemical treatment options, preventive measures
- WEATHER GUIDANCE: Season-based farming decisions, rainfall impact, frost protection, heat stress management
- GOVERNMENT SCHEMES: PM-KISAN, PM Fasal Bima Yojana (PMFBY), Kisan Credit Card, eNAM marketplace, soil health card scheme, PKVY organic farming, state-level subsidies
- POST-HARVEST: Storage, grading, marketing, minimum support price (MSP)

Communication style:
- Be warm, practical, and farmer-friendly
- Use simple language; avoid excessive jargon
- When the user writes in Hindi, always respond in Hindi (Devanagari script)
- When the user writes in English, respond in English
- Give specific, actionable advice
- Include quantities, timings, and local context when relevant
- Mention both organic and conventional options where applicable
- Always prioritize safety and sustainability`

interface ChatMessage {
  role: "user" | "model"
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { message, history }: { message: string; history: ChatMessage[] } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: FARMING_SYSTEM_PROMPT,
    })

    // Convert history to Gemini format
    const geminiHistory = (history || []).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }))

    const chat = model.startChat({ history: geminiHistory })
    const result = await chat.sendMessage(message)
    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
