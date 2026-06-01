import { GoogleGenAI } from "@google/genai";
import type { RoastResult } from "../types/roastResult";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export type RoastLevel = "smooth" | "medium" | "brutal" | "toxic";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

const OPENROUTER_MODELS = [
  "qwen/qwen2.5-vl-72b-instruct",
  "meta-llama/llama-3.2-11b-vision-instruct",
];

const levelConfig = {
  smooth: {
    intensity: "MILD - Humor based, mostly observational",
    tone: "friendly tapi tetap sarcastic",
    comments: "5 komentar meme tapi santai",
    roastLength: "2 kalimat ringan",
  },
  medium: {
    intensity: "STANDARD - Balanced roast dengan kepedasan medium",
    tone: "mix of humor dan sarcasm yang pedas",
    comments: "5 komentar meme agak toxic",
    roastLength: "3 kalimat cukup pedas",
  },
  brutal: {
    intensity: "EXTREME - No filter, brutal criticism with humor",
    tone: "super pedas, tidak peduli perasaan",
    comments: "5 komentar super toxic dan lucu",
    roastLength: "4 kalimat sangat pedas dan hard-hitting",
  },
  toxic: {
    intensity: "CHAOS MODE - Maximum destruction, pure toxicity",
    tone: "ultimate toxic, sarkastik level dewa",
    comments: "5 komentar paling toxic dan savage yang pernah ada",
    roastLength: "5 kalimat utterly devastating dan tidak terlupakan",
  },
};

async function tryGemini(model: string, imageBase64: string, prompt: string) {
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      },
      {
        text: prompt,
      },
    ],
  });

  return response.text?.trim();
}

async function tryOpenRouter(
  model: string,
  imageBase64: string,
  prompt: string,
) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`OpenRouter Error ${response.status}`);
  }

  const data = await response.json();

  return data.choices?.[0]?.message?.content?.trim();
}

async function generateWithFallback(imageBase64: string, prompt: string) {
  let lastError: unknown;

  for (const model of GEMINI_MODELS) {
    try {
      console.log(`Trying Gemini ${model}`);

      const result = await tryGemini(model, imageBase64, prompt);

      if (result) {
        console.log(`Success ${model}`);
        return result;
      }
    } catch (error) {
      console.error(`${model} failed`, error);
      lastError = error;
    }
  }

  for (const model of OPENROUTER_MODELS) {
    try {
      console.log(`Trying OpenRouter ${model}`);

      const result = await tryOpenRouter(model, imageBase64, prompt);

      if (result) {
        console.log(`Success ${model}`);
        return result;
      }
    } catch (error) {
      console.error(`${model} failed`, error);
      lastError = error;
    }
  }

  throw lastError ?? new Error("All providers failed");
}

export async function roastSquad(
  imageBase64: string,
  level: RoastLevel = "medium",
  ocrText?: string,
): Promise<RoastResult> {
  const config = levelConfig[level];

  const ocrSection = ocrText?.trim()
    ? `\nDETECTED TEXT (OCR): ${ocrText.trim()}`
    : "";

  const prompt = `
Kamu adalah AI Roaster eFootball Indonesia yang BRUTAL, JUJUR, dan VIRAL.

LEVEL ROAST: ${config.intensity}
TONE: ${config.tone}

TUGAS:
Analisa DETAIL screenshot squad eFootball ini.

PERHATIKAN:
- Formasi yang dipakai
- Pemain premium vs gratisan
- Quality build vs investasi dompet
- Tingkat meta abuse
- IQ taktik
- Key player

${ocrSection}

SCORING:
- roastScore (0-10)
- walletScore (0-10)
- flexScore (0-10)
- metaAbuse (0-10)
- tacticalIQ (0-10)
- spamThroughPass (0-100)

NETIZEN COMMENTS:
${config.comments}

TOXIC ROAST:
${config.roastLength}

TIKTOK MODE:
2-3 baris viral + emoji

RETURN JSON ONLY
`;

  const responseText = await generateWithFallback(imageBase64, prompt);

  try {
    return JSON.parse(responseText) as RoastResult;
  } catch {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid JSON response");
    }

    return JSON.parse(jsonMatch[0]) as RoastResult;
  }
}
